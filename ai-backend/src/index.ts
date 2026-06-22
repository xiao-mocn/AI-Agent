import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import jwt from 'jsonwebtoken'
import { cors } from 'hono/cors'
import ChatMessageRoutes from './business/chat'
import user from './business/user'


const app = new Hono()
// 允许跨域请求
app.use(cors())

// 添加中间件,
const ALLOWED_TOKEN = process.env.ALLOWED_TOKEN
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

app.use('/api/*', async (c, next) => {
  // 如果没有配置Token，则放行。（开发环境）
  if (!ALLOWED_TOKEN) return next()
  // 检查请求头是否包含 Authorization 字段
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

// GET / — 健康检查，访问根路径
app.get('/', (c) => {
  return c.json({ message: 'AI 后端运行中 ✓' })
})

// 注册路由
user(app)
ChatMessageRoutes(app)


// 启动服务器，监听 3000 端口
serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (info) => {
  console.log(`服务器已启动：http://localhost:${info.port}`)
})