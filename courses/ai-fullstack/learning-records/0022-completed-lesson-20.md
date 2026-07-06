# 完成第二十课：结构化日志与可观测性（pino）

安装了 `pino`、`pino-http`、`pino-pretty`，新建 `ai-backend/src/business/logger.ts` 集中配置 pino 实例（按 `NODE_ENV` 区分开发/生产日志级别，`redact` 屏蔽 `authorization`/`password`/`token` 字段，开发环境用 `pino-pretty` 美化输出）。在 `index.ts` 里用 `hono/request-id` 生成 requestId，加了一个请求日志中间件记录方法、路径、状态码、耗时，并把上一课 `onError` 里的 `console.error` 升级成带 requestId 的 `logger.error` 结构化日志。顺手把 `schemas.ts` 从 `src/` 移到 `src/business/`，统一业务代码的目录归属。

**思考题回答**：
1. **Q1（requestId 与并发定位）**：没有 requestId 时并发请求的日志会交错打印难以区分；加上后可以拿用户报告的失败时间点去日志系统按 requestId 过滤，串出该请求从入口到报错的完整链路。
2. **Q2（redact 对字符串拼接失效）**：`redact` 按字段路径做结构化匹配，字符串拼接后密码已经变成 `message` 文本的一部分而非独立字段，`redact` 无法识别，不会被脱敏，日志纪律要在打印前就把关。
3. **Q3（生产环境开 debug 的代价）**：不只是磁盘占用，还有序列化和 I/O 带来的性能开销、大量噪音淹没真正需要关注的 info/error 信号、以及 debug 日志往往未经审视更容易带出没走 redact 路径的敏感字段。

**Implications**：第二十一课将学习优雅关闭（graceful shutdown）与健康检查接口，解决"进程收到停止信号时如何不丢请求地安全退出"以及"负载均衡器/容器编排如何判断服务是否存活"的问题。
