import Database from 'better-sqlite3'
import { Pool } from 'pg'

// 判断是否使用 PostgreSQL
const DATABASE_URL = process.env.DATABASE_URL
export const isPG = !!DATABASE_URL

// — PG 连接池 —
let pool: Pool | undefined
pool = new Pool({ connectionString: DATABASE_URL })

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

export async function insertMsg(sessionId: string, role: string, content: string) {
  if (isPG) {
    await pool!.query('INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)', [sessionId, role, content])
  } else {
    db.prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)').run(sessionId, role, content)
  }
}

export async function getHistory(sessionId: string) {
  if (isPG) {
    const { rows } = await pool!.query('SELECT role, content FROM messages WHERE session_id = $1 ORDER BY id ASC', [sessionId])
    return rows
  }
  return db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC').all(sessionId)
}

export async function countSession(sessionId: string): Promise<number> {
  if (isPG) {
    const { rows } = await pool!.query('SELECT COUNT(*) AS cnt FROM messages WHERE session_id = $1', [sessionId])
    return Number(rows[0].cnt)
  }
  const { cnt } = db.prepare('SELECT COUNT(*) AS cnt FROM messages WHERE session_id = ?').get(sessionId) as any
  return cnt
}

// PG 专用：删除 user 消息（出错回滚用）
export async function deleteLastUserMsg(sessionId: string) {
  if (isPG) {
    await pool!.query('DELETE FROM messages WHERE session_id = $1 AND role = $2 AND id = (SELECT MAX(id) FROM messages WHERE session_id = $1 AND role = $2)', [sessionId, 'user'])
  } else {
    db.prepare('DELETE FROM messages WHERE session_id = ? AND role = ? ORDER BY id DESC LIMIT 1').run(sessionId, 'user')
  }
}

export async function initDB() {
  if (isPG) {
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
        session_id TEXT NOT NULL,
        role       TEXT NOT NULL,
        content    TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } else {
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT    NOT NULL,
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
