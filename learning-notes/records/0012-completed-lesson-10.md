# 完成第十课：流式输出（SSE / Streaming）

用户在前端实现了 SSE 流式读取：send() 函数不再 `res.json()`，而是拿到 `res.body` 的 ReadableStream，用 `TextDecoder` 逐块解码，按行解析 SSE 格式（`data: <JSON>`），提取 `delta` 字段追加到最后一条 assistant 消息，实现逐字打字效果。

关键细节：
- 先 `push` 一条空 assistant 消息，再拿引用 `lastMsg`，避免下标计算错误
- `[DONE]` 标记用于终止循环（而非依赖 `done` flag，因为后端可能分块传输）
- `res.ok` 判断在读取 body 之前，失败时 body 无需消费

**Implications**：可以进入第十一课——工程化与代码组织，把单文件的 App.vue 拆分为多个组件，并学习 composable / 状态管理。
