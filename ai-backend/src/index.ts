import 'dotenv/config'
import app from './utils/app'
import { serve } from '@hono/node-server'
import { logger } from './business/logger'
import { config } from './utils/config'
import { initDB, closeDB } from './utils/db'
import { startScheduler, stopScheduler } from './middleware/scheduler'
import { startWorker, waitForWorker } from './middleware/queue'
import { attachWebSocket, closeWebSocket } from './middleware/websocket'


initDB().then(() => {
  const server = serve({ fetch: app.fetch, port: config.PORT }, (info) => {
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
