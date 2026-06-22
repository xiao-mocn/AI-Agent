import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import ChatMessageRoutes from './business/chat'
import user from './business/user'


const app = new Hono()
// 允许跨域请求
app.use(cors())

// 添加中间件,
const ALLOWED_TOKEN = process.env.ALLOWED_TOKEN

app.use('*', async (c, next) => {
  // 如果没有配置Token，则放行。（开发环境）
  if (!ALLOWED_TOKEN) return next()
  // 检查请求头是否包含 Authorization 字段
  const token = c.req.header('Authorization')
  if (`Bearer ${ALLOWED_TOKEN}` !== token) {
    return c.json({ error: '未授权' }, 401)
  }
  // 放行
  return next()
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