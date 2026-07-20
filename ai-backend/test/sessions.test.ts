import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { serve } from '@hono/node-server'
import request from 'supertest'
import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import { useTestDB, registerAndLogin, cleanupTestDB } from './helpers'

loadEnv({
  path: path.resolve(__dirname, '../.env.test'),
})

vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: async () => ({
          async *[Symbol.asyncIterator]() {
            yield { choices: [{ delta: { content: '模拟回复' } }] }
          },
        }),
      },
    }
  },
}))

useTestDB()
let server: ReturnType<typeof serve>
let databaseInitialized = false

beforeAll(async () => {
  const { initDB } = await import('../src/utils/db')
  await initDB()
  databaseInitialized = true
  const app = (await import('../src/utils/app')).default
  server = serve({ fetch: app.fetch, port: 0 })
})

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve())
  })
  if (databaseInitialized) {
    await cleanupTestDB()
  }
})

describe('不提供Token', () => {
  it('没有提供 token，应该返回 401', async () => {
    const res = await request(server)
      .get('/api/sessions')
    expect(res.status).toBe(401)
  })
})

describe('无效Token', () => {
  it('提供无效 token，应该返回 401', async () => {

    const res = await request(server)
      .get('/api/sessions')
      .set('Authorization', `Bearer invalid-token`)
    expect(res.status).toBe(401)
  })
})

describe('会话列表', () => {
  it('发一条消息后，会话应该出现在 GET /api/sessions 里', async () => {
    const token = await registerAndLogin(request, server, 'alice')
    const sessionId = crypto.randomUUID()

    await request(server)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: '你好', sessionId })

    const res = await request(server)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.sessions.some((s: any) => s.id === sessionId)).toBe(true)
  })
})

describe('跨用户越权', () => {
  it('用户 B 不能删除用户 A 的会话', async () => {
    const tokenA = await registerAndLogin(request, server, 'sessionOwnerA')
    const tokenB = await registerAndLogin(request, server, 'attackerB')
    const sessionId = crypto.randomUUID()

    await request(server)
      .post('/api/chat')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ message: '这是 A 的会话', sessionId })

    // B 拿着自己的 token，去删 A 的 sessionId
    const delRes = await request(server)
      .delete(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${tokenB}`)

    expect(delRes.status).toBe(404) // 而不是 200

    // 确认 A 的会话真的还在
    const listRes = await request(server)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${tokenA}`)
    expect(listRes.body.sessions.some((s: any) => s.id === sessionId)).toBe(true)
  })
})
