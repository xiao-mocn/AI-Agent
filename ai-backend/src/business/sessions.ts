import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { listSessions, renameSession, deleteSession } from '../db'

export default function SessionRoutes(app: Hono<AppEnv>) {
  app.get('/api/sessions', async (c) => {
    const userId = c.get('userId') as number
    const sessions = await listSessions(userId)
    return c.json({ sessions })
  })

  app.patch('/api/sessions/:id', async (c) => {
    const userId = c.get('userId') as number
    const sessionId = c.req.param('id')
    const { title } = await c.req.json()
    if (!title || typeof title !== 'string') return c.json({ error: 'title 不能为空' }, 400)

    const ok = await renameSession(sessionId, userId, title)
    if (!ok) return c.json({ error: '会话不存在' }, 404)
    return c.json({ ok: true })
  })

  app.delete('/api/sessions/:id', async (c) => {
    const userId = c.get('userId') as number
    const sessionId = c.req.param('id')

    const ok = await deleteSession(sessionId, userId)
    if (!ok) return c.json({ error: '会话不存在' }, 404)
    return c.json({ ok: true })
  })
}