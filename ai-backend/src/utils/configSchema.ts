import { z } from 'zod'

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(32),
  DEEPSEEK_API_KEY: z.string().min(1),
  DATABASE_URL: z.url().optional(),
  DB_PATH: z.string().min(1).default('chat.db'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .optional(),
}).transform((value) => ({
  ...value,
  LOG_LEVEL: value.LOG_LEVEL
    ?? (value.NODE_ENV === 'production' ? 'info' : 'debug'),
}))

export function parseConfig(env: Record<string, string | undefined>) {
  return configSchema.safeParse(env)
}