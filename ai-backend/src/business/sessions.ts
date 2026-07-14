import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { listSessions, renameSession, deleteSession, getHistory } from '../db'

export default function SessionRoutes(app: Hono<AppEnv>) {
  app.get('/api/sessions', async (c) => {
    const userId = c.get('userId') as number
    const sessions = await listSessions(userId)
    return c.json({ sessions })
  })

  app.get('/api/sessions/:id/messages', async (c) => {
    const userId = c.get('userId') as number
    const sessionId = c.req.param('id')

    const history = await getHistory(sessionId, userId) as { role: string; content: string }[]
    // system prompt 不展示给用户
    const messages = history.filter(m => m.role !== 'system')
    return c.json({ messages })
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