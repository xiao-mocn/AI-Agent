# 完成第五课：System Prompt

用户已在 index.ts 中添加了 SYSTEM_PROMPT 常量，并在初始化 sessionMap 时将其作为第一条 system 消息注入。
理解了 system prompt 在 messages 数组中的位置（必须是第一条），以及它对 AI 行为的约束作用（语言、角色、格式、安全边界）。
ChatMessage 类型已同步扩展 role 为 `'system' | 'user' | 'assistant'`。

**Implications**：可以进入第六课——错误处理，让接口在 API 调用失败时也能给出清晰反馈而不崩溃。
