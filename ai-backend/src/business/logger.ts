import pino from 'pino'
import { config } from '../utils/config'

const isDev = config.NODE_ENV !== 'production'

export const logger = pino({
  level: config.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  // 敏感字段自动脱敏，路径按 pino 的点号语法写
  redact: {
    paths: ['req.headers.authorization', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
  // 开发环境用 pino-pretty 格式化，生产环境保持纯 JSON（方便日志系统采集）
  transport: isDev ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
})