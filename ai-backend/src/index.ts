import 'dotenv/config'
import { serve } from '@hono/node-server'
import { secureHeaders } from 'hono/secure-headers'
import { Hono } from 'hono'
import jwt from 'jsonwebtoken'
import { cors } from 'hono/cors'
import { rateLimiter } from 'hono-rate-limiter'
import ChatMessageRoutes from './business/chat'
import user from './business/user'
import { initDB } from './db'

const app = new Hono()
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use('*', secureHeaders())

// CORS（需覆盖 /login /register 等无前缀路由，所以用 * 而非 /api/*）
app.use('*', cors({
  origin: FRONTEND_URL,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// 全局限流：每 IP 每分钟 60 次
app.use('/api/*', rateLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'unknown',
  standardHeaders: 'draft-6',
}))

// JWT 鉴权
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '未授权，请先登录' }, 401)
  }
  const token = authHeader.slice(7)
  try {
    jwt.verify(token, JWT_SECRET)
    return next()
  } catch {
    return c.json({ error: 'token 无效或已过期，请重新登录' }, 401)
  }
})

// AI 接口精细限流：按用户 ID，每分钟 10 次
app.use('/api/chat/*', rateLimiter({
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
}))

app.get('/', (c) => {
  return c.json({ message: 'AI 后端运行中 ✓' })
})

user(app)
ChatMessageRoutes(app)

// index.ts — 放在所有路由注册之后
app.onError((err, c) => {
  console.error('[未处理异常]', err)
  return c.json({ error: '服务器内部错误，请稍后重试' }, 500)
})

app.notFound((c) => {
  return c.json({ error: '接口不存在' }, 404)
})

initDB().then(() => {
  serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (info) => {
    console.log(`服务器已启动：http://localhost:${info.port}`)
  })
})
