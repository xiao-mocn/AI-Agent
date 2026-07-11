import 'dotenv/config'
import { serve } from '@hono/node-server'
import { secureHeaders } from 'hono/secure-headers'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { logger } from './business/logger'
import { FRONTEND_URL, PORT } from './config'
import { requestLogger } from './middleware/requestLogger'
import { requireAuth } from './middleware/auth'
import { globalRateLimiter, chatRateLimiter } from './middleware/rateLimiters'
import ChatMessageRoutes from './business/chat'
import user from './business/user'
import { initDB, closeDB, checkDBHealth } from './db'
import { startScheduler, stopScheduler } from './middleware/scheduler'
import { startWorker, waitForWorker } from './middleware/queue'
import { attachWebSocket, closeWebSocket } from './middleware/websocket'
import type { AppEnv } from './types'



const app = new Hono<AppEnv>()

app.use('*', secureHeaders())
app.use('*', requestId())

// CORS（需覆盖 /login /register 等无前缀路由，所以用 * 而非 /api/*）
app.use('*', cors({
  origin: FRONTEND_URL,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', requestLogger)

app.use('/api/*', globalRateLimiter)
app.use('/api/*', requireAuth)
app.use('/api/chat/*', chatRateLimiter)

app.get('/', (c) => {
  return c.json({ message: 'AI 后端运行中 ✓' })
})

// liveness：进程能响应就算活着，不查依赖
app.get('/health', (c) => c.json({ status: 'ok' }))

// readiness：探测数据库是否可查通
app.get('/ready', async (c) => {
  try {
    await checkDBHealth()
    return c.json({ status: 'ready' })
  } catch (err) {
    logger.error({ err }, '就绪检查失败')
    return c.json({ status: 'not ready' }, 503)
  }
})

user(app)
ChatMessageRoutes(app)

app.onError((err, c) => {
  logger.error({
    requestId: c.var.requestId,
    err: { message: err.message, stack: err.stack },
    path: c.req.path,
  }, '未处理异常')
  return c.json({ error: '服务器内部错误，请稍后重试' }, 500)
})

app.notFound((c) => {
  return c.json({ error: '接口不存在' }, 404)
})

initDB().then(() => {
  const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
    logger.info(`服务器已启动：http://localhost:${info.port}`)
    startScheduler()
    startWorker()
  })
  attachWebSocket(server)
  // 优雅关闭服务器
  function shutdown(signal: string) {
    logger.info({ signal }, '收到退出信号，开始优雅关闭')

    server.close(async () => {
      await waitForWorker()
      stopScheduler()
      closeWebSocket()
      logger.info('HTTP 服务器已停止接受新连接')
      await closeDB()
      logger.info('数据库连接已关闭')
      process.exit(0)
    })

    // 兜底：如果 10 秒内还没关完（比如有请求卡死），强制退出
    setTimeout(() => {
      logger.error('优雅关闭超时，强制退出')
      process.exit(1)
    }, 10_000).unref()
  }

  // 注册信号处理函数
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
})
