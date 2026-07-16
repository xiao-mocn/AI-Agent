import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'

// 每个测试文件调用一次，必须在 import app.ts 之前调用
let testDBPath = ''
export function useTestDB() {
  testDBPath = path.join(__dirname, `test-${randomUUID()}.db`)
  process.env.DB_PATH = testDBPath
}

export async function cleanupTestDB() {
  const { closeDB } = await import('../src/db')
  await closeDB()

  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${testDBPath}${suffix}`, { force: true })
  }
}

// 注册 + 登录，返回可以直接拼进 Authorization 头的 token
export async function registerAndLogin(request: any, app: any, username: string) {
  const password = 'Test1234!'
  await request(app).post('/register').send({ username, password })
  const res = await request(app).post('/login').send({ username, password })
  return res.body.token as string
}
