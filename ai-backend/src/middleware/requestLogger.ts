import type { MiddlewareHandler } from 'hono'
import { logger } from '../business/logger'

// 记录方法、路径、状态码、耗时
export const requestLogger: MiddlewareHandler = async (c, next) => {
  const start = Date.now()
  await next()
  logger.info({
    requestId: c.var.requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    durationMs: Date.now() - start,
  }, '请求完成')
}
