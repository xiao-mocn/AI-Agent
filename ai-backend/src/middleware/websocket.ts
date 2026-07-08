import { WebSocketServer, WebSocket } from 'ws'
import type { Server } from 'http'
import type { ServerType } from '@hono/node-server'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { logger } from '../business/logger'

let wss: WebSocketServer | null = null
// sessionId -> 该会话当前活跃的连接
const connections = new Map<string, WebSocket>()

// serve() 返回的 ServerType 兼容 http2，但本项目从未启用 http2，运行时始终是普通 http.Server
export function attachWebSocket(server: ServerType) {
  wss = new WebSocketServer({ server: server as Server })

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url ?? '', 'http://localhost')
    const token = url.searchParams.get('token')
    const sessionId = url.searchParams.get('sessionId')

    if (!token || !sessionId) {
      ws.close(1008, '缺少 token 或 sessionId')
      return
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      ws.close(1008, 'token 无效或已过期')
      return
    }

    connections.set(sessionId, ws)
    logger.info({ sessionId }, 'WebSocket 连接已建立')

    ws.on('close', () => {
      // 只清掉仍然指向这条连接的记录，避免新连接被旧的 close 事件顶掉
      if (connections.get(sessionId) === ws) {
        connections.delete(sessionId)
      }
      logger.info({ sessionId }, 'WebSocket 连接已关闭')
    })
  })
}

// worker 处理完任务后调用，把结果推给对应会话；没有活跃连接就静默跳过
export function pushToSession(sessionId: string, payload: unknown) {
  const ws = connections.get(sessionId)
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload))
  }
}

// 优雅关闭时调用，主动断开所有客户端并停掉 WebSocketServer
export function closeWebSocket() {
  for (const ws of connections.values()) {
    ws.close(1001, '服务器正在重启')
  }
  connections.clear()
  wss?.close()
}