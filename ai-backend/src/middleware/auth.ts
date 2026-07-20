import jwt from 'jsonwebtoken'
import type { MiddlewareHandler } from 'hono'
import { config } from '../utils/config'
import type { AppEnv } from '../types'

// JWT 鉴权：校验 Authorization: Bearer <token>
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '未授权，请先登录' }, 401)
  }
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: number }
    c.set('userId', payload.userId)
    return next()
  } catch {
    return c.json({ error: 'token 无效或已过期，请重新登录' }, 401)
  }
}
