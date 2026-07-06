import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { createUser, findUser } from '../db'
import { RegisterSchema, LoginSchema } from './schemas'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export default function createUserRoutes(app: Hono) {
  // 注册
  app.post('/register', async (c) => {
    const body = await c.req.json()
    const result = RegisterSchema.safeParse(body)
    if (!result.success) return c.json({ error: result.error.issues[0].message }, 400)
    const { username, password } = result.data
    const hash = await bcrypt.hash(password, 10)
    try {
      await createUser(username, hash)
      return c.json({ ok: true })
    } catch {
      return c.json({ error: '用户名已存在' }, 409)
    }
  })

  // 登录
  app.post('/login', async (c) => {
    const body = await c.req.json()
    const result = LoginSchema.safeParse(body)
    if (!result.success) return c.json({ error: result.error.issues[0].message }, 400)
    const { username, password } = result.data
    const user = await findUser(username) as any
    if (!user) return c.json({ error: '用户不存在' }, 401)

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return c.json({ error: '密码错误' }, 401)

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    return c.json({ token })
  })

}
