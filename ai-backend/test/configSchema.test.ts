import { describe, expect, it } from 'vitest'
import { parseConfig } from '../src/utils/configSchema'

const validEnv = {
  NODE_ENV: 'production',
  PORT: '3000',
  FRONTEND_URL: 'http://localhost:5173',
  JWT_SECRET: 'a'.repeat(32),
  DEEPSEEK_API_KEY: 'test-key',
}

describe('parseConfig', () => {
  it('缺少 JWT_SECRET 时拒绝配置', () => {
    const { JWT_SECRET, ...env } = validEnv
    const result = parseConfig(env)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('JWT_SECRET')
    }
  })

  it('端口不是合法整数时拒绝配置', () => {
    const result = parseConfig({ ...validEnv, PORT: 'invalid' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('PORT')
    }
  })
})
