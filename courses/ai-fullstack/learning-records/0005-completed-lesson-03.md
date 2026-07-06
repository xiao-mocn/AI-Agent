# 完成第三课：接入 DeepSeek API

用户成功用 openai SDK + DeepSeek baseURL 替换了假回复，接口可以返回真实 AI 回复。
使用 dotenv 管理 API Key，创建了 .env 和 .gitignore。

**Implications**：可以进入第四课——多轮对话记忆。
目前每次请求都是独立的，AI 不记得上下文，下一步在服务器端用 Map 维护会话历史。
