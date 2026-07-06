import { rateLimiter } from 'hono-rate-limiter'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

// 全局限流：每 IP 每分钟 60 次
export const globalRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'unknown',
  standardHeaders: 'draft-6',
})

// AI 接口精细限流：按用户 ID，每分钟 10 次
export const chatRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (c) => {
    const auth = c.req.header('Authorization')
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number }
        return `user:${payload.userId}`
      } catch { }
    }
    return c.req.header('x-forwarded-for') ?? 'unknown'
  },
  standardHeaders: 'draft-6',
})
