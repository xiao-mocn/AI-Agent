import { parseConfig } from './configSchema'

const result = parseConfig(process.env)

if (!result.success) {
  const invalidKeys = result.error.issues
    .map((issue) => issue.path.join('.'))
    .join(', ')

  throw new Error(`启动配置无效：${invalidKeys}`)
}

export const config = result.data