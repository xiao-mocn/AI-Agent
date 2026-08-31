# 完成第 49 课：Service 层与统一错误响应

在 `java-backend/` 中将版本查询的业务判断提取到 `VersionService`，通过构造方法注入给 `VersionController`；新增 `ReleaseNotFoundException`、`ApiError` 与 `ApiExceptionHandler`，使未知发布标签稳定返回 404 JSON。控制器测试用 `@MockitoBean` 隔离 Service，并补充 UTF-8 源码编译配置；当前 Maven 测试共 4 项通过。

**思考题回答**：

1. **Q1（为什么 Service 不直接返回 404）**：Service 要表达的是“这个发布标签不存在”的业务事实，而不是 HTTP 的呈现方式。它抛出 `ReleaseNotFoundException` 后，可以在 HTTP 入口由统一异常处理器转成 404 JSON。这样同一业务规则日后被定时任务、消息消费者或其他接口复用时，不会被 HTTP 状态码绑死。Controller 也不必重复编写相同的错误响应。
2. **Q2（为什么 `@WebMvcTest` 使用 `@MockitoBean`）**：`@WebMvcTest` 的目标是验证 URL、状态码和 JSON 等 HTTP 契约，不是验证真实 Service 的业务实现。`@MockitoBean` 提供可控的假 `VersionService`，让测试能明确安排成功返回值或抛出业务异常。于是 Controller 测试不会受配置读取、数据访问等下层细节干扰。真实 Service 的规则应在独立的 Service 测试中验证。
3. **Q3（readiness 与 404 的边界）**：readiness 描述整个应用实例是否适合接收流量，供平台或负载均衡器决策。404 描述一个已经到达且被应用接收的请求，因业务资源不存在而得到的结果。前者是实例运行状态，后者是单次请求的业务结果；两者都可以返回 JSON，但不能用其中一个替代另一个。遇到 404 不应重启实例。

**Implications**：第 50 课将引入 Repository 的最小概念，把 Service 从内存中的业务规则延伸到数据存取，同时保持错误契约稳定。
