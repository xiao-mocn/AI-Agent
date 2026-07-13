import Database from 'better-sqlite3'
import { Pool } from 'pg'

// 判断是否使用 PostgreSQL
const DATABASE_URL = process.env.DATABASE_URL
export const isPG = !!DATABASE_URL

// — PG 连接池 —
let pool: Pool | undefined
pool = new Pool({
  connectionString: DATABASE_URL,
  // Render 等托管数据库的外部连接强制要求 SSL，但证书链不在容器信任列表里
  ssl: isPG ? { rejectUnauthorized: false } : undefined,
})

export const db = new Database(process.env.DB_PATH || 'chat.db')
// 开启 WAL 模式
db.pragma('journal_mode = WAL')

// ===== 用户相关 =====

export async function createUser(username: string, password: string) {
  if (isPG) {
    await pool!.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password])
  } else {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password)
  }
}

export async function findUser(username: string): Promise<any> {
  if (isPG) {
    const { rows } = await pool!.query('SELECT * FROM users WHERE username = $1', [username])
    return rows[0] || null
  }
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) || null
}

// ===== 消息相关 =====

export async function insertMsg(sessionId: string | number, userId: number, role: string, content: string) {
  if (isPG) {
    await pool!.query(
      'INSERT INTO messages (session_id, user_id, role, content) VALUES ($1, $2, $3, $4)',
      [sessionId, userId, role, content]
    )
  } else {
    db.prepare('INSERT INTO messages (session_id, user_id, role, content) VALUES (?, ?, ?, ?)')
      .run(sessionId, userId, role, content)
  }
}

// 归属校验直接写进 WHERE 条件：session_id 和 user_id 必须同时匹配
export async function getHistory(sessionId: string | number, userId: number) {
  if (isPG) {
    const { rows } = await pool!.query(
      'SELECT role, content FROM messages WHERE session_id = $1 AND user_id = $2 ORDER BY id ASC',
      [sessionId, userId]
    )
    return rows
  }
  return db.prepare('SELECT role, content FROM messages WHERE session_id = ? AND user_id = ? ORDER BY id ASC')
    .all(sessionId, userId)
}

// countSession 同理加 user_id 条件
export async function countSession(sessionId: string | number, userId: number): Promise<number> {
  if (isPG) {
    const { rows } = await pool!.query(
      'SELECT COUNT(*) AS cnt FROM messages WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    )
    return Number(rows[0].cnt)
  }
  const { cnt } = db.prepare('SELECT COUNT(*) AS cnt FROM messages WHERE session_id = ? AND user_id = ?')
    .get(sessionId, userId) as any
  return cnt
}

// PG 专用：删除 user 消息（出错回滚用）
export async function deleteLastUserMsg(sessionId: string | number) {
  if (isPG) {
    await pool!.query('DELETE FROM messages WHERE session_id = $1 AND role = $2 AND id = (SELECT MAX(id) FROM messages WHERE session_id = $1 AND role = $2)', [sessionId, 'user'])
  } else {
    db.prepare('DELETE FROM messages WHERE session_id = ? AND role = ? ORDER BY id DESC LIMIT 1').run(sessionId, 'user')
  }
}

// 首次发消息时自动建档，标题取消息内容前 20 个字符
export async function createSessionIfNotExists(sessionId: string | number, userId: number, firstMessage: string) {
  const title = firstMessage.slice(0, 20) || '新会话'
  if (isPG) {
    await pool!.query(
      'INSERT INTO sessions (id, user_id, title) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
      [sessionId, userId, title]
    )
  } else {
    db.prepare('INSERT OR IGNORE INTO sessions (id, user_id, title) VALUES (?, ?, ?)')
      .run(sessionId, userId, title)
  }
}

// 归属校验同样写进 WHERE：只能列出自己的会话
export async function listSessions(userId: number) {
  if (isPG) {
    const { rows } = await pool!.query(
      'SELECT id, title, updated_at FROM sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    )
    return rows
  }
  return db.prepare('SELECT id, title, updated_at FROM sessions WHERE user_id = ? ORDER BY updated_at DESC')
    .all(userId)
}

// 改名：WHERE 里同时带 id 和 user_id，查不到就是"不存在或不是你的"
export async function renameSession(sessionId: string, userId: number, title: string): Promise<boolean> {
  if (isPG) {
    const res = await pool!.query(
      'UPDATE sessions SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
      [title, sessionId, userId]
    )
    return (res.rowCount ?? 0) > 0
  }
  const info = db.prepare('UPDATE sessions SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?')
    .run(title, sessionId, userId)
  return info.changes > 0
}

// 删除：只删 sessions，messages 靠 ON DELETE CASCADE 自动清理
export async function deleteSession(sessionId: string, userId: number): Promise<boolean> {
  if (isPG) {
    const res = await pool!.query('DELETE FROM sessions WHERE id = $1 AND user_id = $2', [sessionId, userId])
    return (res.rowCount ?? 0) > 0
  }
  const info = db.prepare('DELETE FROM sessions WHERE id = ? AND user_id = ?').run(sessionId, userId)
  return info.changes > 0
}

// 健康检查：数据库是否可查通
export async function checkDBHealth() {
  if (isPG) {
    await pool!.query('SELECT 1')
  } else {
    db.prepare('SELECT 1').get()
  }
}

// 关闭数据库连接
export async function closeDB() {
  if (isPG && pool) {
    await pool.end()
  }
  // better-sqlite3 是同步文件句柄，可选调用 db.close()
  db.close()
}

export async function initDB() {
  if (isPG) {
    await pool!.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id         TEXT PRIMARY KEY,
        user_id    INTEGER NOT NULL,
        title      TEXT NOT NULL DEFAULT '新会话',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await pool!.query(`
      CREATE TABLE IF NOT EXISTS users (
        id       SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `)
    await pool!.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id         SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        user_id    INTEGER NOT NULL,
        role       TEXT NOT NULL,
        content    TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } else {
    db.pragma('foreign_keys = ON')
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id         TEXT PRIMARY KEY,
        user_id    INTEGER NOT NULL,
        title      TEXT    NOT NULL DEFAULT '新会话',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT    NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        user_id    INTEGER NOT NULL,
        role       TEXT    NOT NULL,
        content    TEXT    NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT    UNIQUE NOT NULL,
        password TEXT    NOT NULL
      )
    `)
  }
}
