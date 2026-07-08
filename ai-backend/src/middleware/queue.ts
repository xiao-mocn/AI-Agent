import { logger } from '../business/logger'

type Task = {
  id: string
  type: 'ai-reply'
  sessionId: string | number
  content: string
}

const queue: Task[] = []
let running = false
let activePromise: Promise<void> | null = null

async function processTask(task: Task) {
  // 这里调用 AI 并保存结果
  logger.info({ taskId: task.id }, '开始处理任务')
  // await callAIAndSave(task.sessionId, task.content)
}

async function loop() {
  while (running || queue.length > 0) {
    const task = queue.shift()
    if (!task) {
      await new Promise(resolve => setTimeout(resolve, 100))
      continue
    }
    try {
      await processTask(task)
    } catch (err) {
      logger.error(err, JSON.stringify({ taskId: task.id }), '任务处理失败')
    }
  }
}

export function startWorker() {
  running = true
  activePromise = loop()
}

export function stopWorker() {
  running = false
}

export function waitForWorker() {
  return activePromise ?? Promise.resolve()
}

export function enqueue(task: Task) {
  queue.push(task)
}