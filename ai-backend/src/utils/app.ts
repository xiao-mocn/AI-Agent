import { secureHeaders } from 'hono/secure-headers'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from './config'
import { checkDBHealth } from './db'
import { logger } from '../business/logger'
import { requestId } from 'hono/request-id'
import { requestLogger } from '../middleware/requestLogger'
import { requireAuth } from '../middleware/auth'
import { globalRateLimiter, chatRateLimiter } from '../middleware/rateLimiters'
import ChatMessageRoutes from '../business/chat'
import user from '../business/user'
import type { AppEnv } from '../types'
import SessionRoutes from '../business/sessions'


const app = new Hono<AppEnv>()

app.use('*', secureHeaders())
app.use('*', requestId())

// CORS（需覆盖 /login /register 等无前缀路由，所以用 * 而非 /api/*）
app.use('*', cors({
  origin: config.FRONTEND_URL,
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
SessionRoutes(app)

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

export default app