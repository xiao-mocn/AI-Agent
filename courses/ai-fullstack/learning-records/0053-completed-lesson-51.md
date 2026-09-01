# 完成第 51 课：JPA 实体与 H2 持久化 Repository

在 `java-backend/` 中引入 Spring Data JPA、H2 及 Spring Boot 4 的 JPA 测试模块，新增 `ReleaseEntity`、Spring Data 查询接口和 `JpaReleaseRepository` 适配器。`data.sql` 初始化了 `local / 1.0.1` 与变式练习的 `staging / 1.1.0-rc1`；`VersionService` 和 HTTP 接口的业务契约保持不变，`mvn clean test` 的 7 个测试全部通过。

**思考题回答**：

1. **Q1（实体与 API 契约）**：`ReleaseEntity` 描述数据库表、主键和列约束，而 `VersionResponse` 只表达接口要返回的版本信息。若直接返回实体，表结构的调整会直接影响客户端 JSON，存储细节也会泄漏到 Controller。分开后，数据库列可以演进，接口仍能维持稳定。适配器集中做映射，避免同一转换逻辑散落在多层。
2. **Q2（JpaReleaseRepository 的职责）**：`JpaReleaseRepository` 调用技术层的 Spring Data JPA 接口，取得 `ReleaseEntity` 后映射为业务层承诺的 `VersionResponse`。它不关心 HTTP 状态码，也不手动创建表；这些职责分别属于 Controller/异常处理和 JPA 初始化配置。这样 `VersionService` 只依赖 `ReleaseRepository`，将来切换数据库或查询实现时上层不变。
3. **Q3（H2 内存数据消失）**：`jdbc:h2:mem:` 创建的是 Java 进程内存中的数据库，而不是磁盘上的数据库文件。应用停止后进程内存被释放，所以表和种子数据都会消失。`data.sql` 会在下一次启动时重新插入课程数据，但它不是长期保存机制。生产环境需要独立的持久化数据库与受控迁移。

**Implications**：第 52 课将比较开发用 H2 与生产数据库的配置差异，并引入受版本控制的数据迁移边界。
