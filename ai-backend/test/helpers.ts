import { randomUUID } from 'crypto'
import path from 'path'

// 每个测试文件调用一次，必须在 import app.ts 之前调用
export function useTestDB() {
  process.env.DB_PATH = path.join(__dirname, `test-${randomUUID()}.db`)
}

// 注册 + 登录，返回可以直接拼进 Authorization 头的 token
export async function registerAndLogin(request: any, app: any, username: string) {
  const password = 'Test1234!'
  await request(app).post('/register').send({ username, password })
  const res = await request(app).post('/login').send({ username, password })
  return res.body.token as string
}