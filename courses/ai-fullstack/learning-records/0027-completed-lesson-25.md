# 完成第二十五课：WebSocket 实时通信

安装了 `ws@8.21.0`，新增 `src/middleware/websocket.ts`（挂载 WebSocketServer、握手阶段用 JWT 鉴权、维护 `sessionId -> WebSocket` 连接表），并在 `queue.ts` 的 `processTask` 完成后调用 `pushToSession` 通知前端；`index.ts` 里接入 `attachWebSocket(server)` 启动和 `closeWebSocket()` 优雅关闭流程。实现过程中修正了课程示例代码里 `serve()` 返回的 `ServerType`（兼容 http2）与 `ws` 要求的 `http.Server` 类型不匹配的问题。

**思考题回答**：
1. **Q1（SSE 与 WebSocket 的根本区别）**：SSE 依附在客户端主动发起的一次请求上，只能单向推送，无法在客户端没有"先问"时凭空建立通道；WebSocket 握手后是独立于请求/响应生命周期的全双工连接，服务器可以在任意时刻主动推送，天然贴合"后台任务完成后主动通知"的场景。
2. **Q2（重启后的连接与补偿）**：进程重启会断开所有 WebSocket 连接，客户端要做断线重连（指数退避），并且重连后主动调 REST 接口补拉"上次已读之后"的消息，而不能只依赖推送——因为结果早已落库，WebSocket 只是锦上添花的实时提醒，不是唯一真相来源。
3. **Q3（多实例下的连接表问题）**：`Map` 只存在于单个进程内存里，水平扩展后连接可能落在实例 A、处理任务的 worker 却在实例 B，B 找不到连接会静默推送失败。需要用 Redis pub/sub 之类的跨实例广播机制，让持有连接的那个实例负责真正投递。

**Implications**：第二十六课将学习多轮对话的上下文管理，控制传给 AI 的 token 数量，避免既超预算又拖慢响应，同时不丢失关键上下文。
