# 完成第九课：Vue 3 聊天界面

用户在后端加了 `app.use('*', cors())`（Hono 内置 CORS 中间件），创建了独立的 Vite + Vue 3 + TypeScript 前端项目（ai-frontend），编写了完整的 Chat 组件（消息列表、输入框、发送按钮、loading 状态、sessionId 管理）。

理解了 CORS 的本质——浏览器拦截响应（不是后端拒绝请求），以及 `cors()` 中间件必须在路由之前注册的原因（OPTIONS 预检请求需要被中间件链优先处理）。

**Implications**：可以进入第十课——流式输出（SSE / Streaming），让 AI 逐字输出、实时显示。
