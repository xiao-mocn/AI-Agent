# 完成第 47 课：Spring Boot 4 项目骨架与健康契约

已在 `java-backend/` 建立独立的 Spring Boot 4.1.1 + Java 21 Maven 项目，补齐 Spring Web MVC 与 Web MVC 测试依赖。实现了 `HealthController`、`HealthResponse` 和 `GET /health`，并通过 `@WebMvcTest` 断言 HTTP 200、JSON 内容类型与 `status=ok`；启动类、生产代码和测试代码的包路径已调整为同一根包。Maven 测试通过，且已用真实 HTTP 请求确认 `/health` 返回 `{"status":"ok"}`；还完成了 `/version` 的变式练习及其测试。

**思考题回答**：

1. **Q1（MockMvc 与真实 HTTP）**：MockMvc 在 Spring MVC 的模拟请求和响应对象上执行完整的 MVC 处理链，因此很快，适合锁定路由、状态码、内容类型和 JSON 契约。它不会启动嵌入式服务器，也不能覆盖真实端口绑定、服务器启动或容器层行为。真实 HTTP 请求补上这部分运行时证据。两者不是替代关系：先用 MockMvc 快速回归，再用真实请求验证可运行性。
2. **Q2（存活检查边界）**：`/health` 应回答进程本身是否成功启动并可处理最小请求，不应把数据库、LLM 或远程服务故障直接转化为“重启这个进程”。若所有实例都因共享外部依赖短暂故障而被重启，反而可能造成连锁故障。外部依赖是否应影响流量接入，需要在 readiness 语义中按业务后果审慎决定。所以下一课会把进程存活、流量就绪和依赖状态分开表达。
3. **Q3（HTTP 契约优先）**：客户端依赖的是 `GET /health`、200 状态码和 JSON 字段，而不是服务端采用 Hono 函数、Spring Controller 或某个目录名称。迁移到 Java 时可以使用 record、注解路由和包扫描等 Java 惯用方式，只要可观察行为保持不变。把这些行为写成测试，能避免实现重组时悄悄改变接口。内部目录仍然重要，但它服务于维护者，不应成为外部消费者的隐式契约。

**Implications**：第 48 课将用 `@ConfigurationProperties` 和校验把必需运行时配置转成类型化、启动即失败的边界，并通过 Actuator 的 readiness probe 区分“服务进程已启动”和“可以接收流量”。
