type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// 粗略估算：中文场景下 1 个字符约等于 0.7~1 个 token，这里取保守系数 1.5 字符/token
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 1.5)
}

// 按 token 预算裁剪历史：永远保留 system prompt，从最新消息往前累加，超预算就停止
export function trimHistory(messages: ChatMessage[], maxTokens: number): ChatMessage[] {
  const systemMsg = messages[0]?.role === 'system' ? messages[0] : null
  const rest = systemMsg ? messages.slice(1) : messages

  let budget = maxTokens - (systemMsg ? estimateTokens(systemMsg.content) : 0)
  const kept: ChatMessage[] = []

  // 从最新的往前挑，直到预算用完
  for (let i = rest.length - 1; i >= 0; i--) {
    const cost = estimateTokens(rest[i].content)
    if (cost > budget) break
    kept.unshift(rest[i])
    budget -= cost
  }

  return systemMsg ? [systemMsg, ...kept] : kept
}