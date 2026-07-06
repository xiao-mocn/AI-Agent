# 完成第四课：多轮对话记忆

用户通过 sessionId + 内存 Map 实现了多轮对话，AI 能记住同一会话中之前说过的话。
理解了 LLM 是无状态的，历史由调用方自己维护。

代码已包含 sessionMap、history push 逻辑、test.http 中包含两条测试请求。

**Implications**：可以进入第五课——System Prompt，给 AI 设定角色和行为规则。
