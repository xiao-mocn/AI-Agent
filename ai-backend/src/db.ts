import Database from 'better-sqlite3'

export const db = new Database(process.env.DB_PATH || 'chat.db')


db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT    NOT NULL,
    role       TEXT    NOT NULL,
    content    TEXT    NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 插入一条消息
export const insertMsg = db.prepare(
  'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)'
)

// 获取一条消息
export const getHistory = db.prepare(
  'SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC'
)

// 统计会话消息数量
export const countSession = db.prepare(
  'SELECT COUNT(*) AS cnt FROM messages WHERE session_id = ?'
)