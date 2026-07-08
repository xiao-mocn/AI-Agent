import cron, { type ScheduledTask } from 'node-cron'
import { db, isPG } from '../db'
import { logger } from '../business/logger'

let task: ScheduledTask | null = null

export function startScheduler() {
  // 每天凌晨 3 点执行
  task = cron.schedule('0 3 * * *', async () => {
    try {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 30)
      const iso = cutoff.toISOString()

      if (isPG) {
        // PG 版本待实现
      } else {
        const result = db.prepare('DELETE FROM messages WHERE created_at < ?').run(iso)
        logger.info({ deleted: result.changes }, '定时清理过期消息完成')
      }
    } catch (err) {
      logger.error(err, '定时清理失败')
    }
  }, {
    timezone: 'Asia/Shanghai',
    // node-cron 默认不会重叠执行，但如果任务执行超过 24 小时仍需额外保护
  })
}

export function stopScheduler() {
  if (task) {
    task.stop()
    task = null
  }
}