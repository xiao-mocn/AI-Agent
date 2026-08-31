# 完成第 50 课：Repository 边界与内存数据源

在 `java-backend/` 中新增 `ReleaseRepository` 作为版本数据访问边界，并以 `InMemoryReleaseRepository` 用只读 Map 提供内存实现。`VersionService` 现在只依赖 Repository 接口，将空查询结果翻译为 `ReleaseNotFoundException`；新增 `VersionServiceTest`，且 `mvn clean test` 的 6 个测试全部通过。

**思考题回答**：

1. **Q1（为什么先定义自己的 Repository）**：先定义面向业务的 `ReleaseRepository`，能让我们看清 Service 需要的是“查询发布版本”的能力，而不是某个 JPA API。内存 Map 用最少的技术细节验证这个边界。若一开始引入 JPA，实体、数据库连接和查询注解会掩盖 Repository 的职责。下一课改用数据库时，我们才可以明确看到哪些代码应该变化、哪些不应变化。
2. **Q2（谁解释空结果）**：Repository 返回 `Optional.empty()` 只表示没有查到数据，并不决定这在业务上意味着什么。`VersionService` 把这个结果解释为发布标签不存在，并抛出 `ReleaseNotFoundException`。随后第 49 课的异常处理器把异常转成 404 JSON。这样 Repository 不依赖 HTTP，Controller 也不必重复业务判断。
3. **Q3（切换 JPA 后为何 Controller 不变）**：Controller 只调用 Service 并维护 URL、状态码和 JSON 的外部契约。Service 又只依赖 `ReleaseRepository` 接口，而非内存实现类。将 `InMemoryReleaseRepository` 替换成 JPA 实现时，变化会局限在数据访问层。客户端仍可使用相同的 `/versions/{releaseLabel}` 请求，因此 Controller 不需要改变。

**Implications**：第 51 课将引入 JPA 实体与 H2 数据库，把内存 Repository 替换为持久化实现，并验证上层契约保持稳定。
