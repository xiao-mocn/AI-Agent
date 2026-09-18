# 第 51 课设计：JPA 实体与 H2 持久化 Repository

## 目标

将第 50 课的内存数据源替换为 H2 内存数据库与 Spring Data JPA，同时保持 `VersionService`、`VersionController` 和 HTTP 错误契约的职责边界稳定。学习者应理解 JPA 实体描述存储结构、Spring Data Repository 提供技术查询能力、适配器把技术数据映射为业务接口。

## 课程范围

- 在 `pom.xml` 中加入 Spring Data JPA 与 H2 依赖。
- 新建 `ReleaseEntity`，包含数据库主键、发布标签和版本号。
- 新建 Spring Data JPA 查询接口，按发布标签返回可选实体。
- 新建 JPA 适配器实现已有 `ReleaseRepository`，将实体映射为 `VersionResponse`。
- 使用 `application.properties` 配置 H2 内存数据库，使用 `data.sql` 初始化 `local` 发布记录。
- 移除 `InMemoryReleaseRepository` 的 Spring 组件身份，确保容器只有一个 `ReleaseRepository` 实现。
- 新增 JPA 查询测试；保留既有 Service 与 Controller 测试。

本课不引入外部 MySQL/PostgreSQL、Flyway/Liquibase、分页、关联映射、事务边界或 H2 控制台。

## 组件与数据流

```text
GET /versions/local
  -> VersionController
  -> VersionService
  -> ReleaseRepository
  -> JpaReleaseRepository
  -> Spring Data ReleaseJpaRepository
  -> H2 releases 表
  -> ReleaseEntity
  -> VersionResponse
```

查询无结果时，JPA 查询接口返回空 `Optional`；适配器按原样传递空结果，`VersionService` 仍负责抛出 `ReleaseNotFoundException`，全局异常处理器仍负责生成 404 JSON。

## 数据模型与配置

`releases` 表有三列：`id`（自增主键）、`release_label`（唯一业务标签）、`version`（对外版本值）。`data.sql` 只写入 `local / 1.0.1` 一条记录。H2 连接使用进程内存 URL，应用停止后数据消失，避免课程引入本地数据库安装成本。

## 验收标准

1. 应用启动后，JPA 能根据 `local` 查询到初始化记录。
2. Service 仍只依赖 `ReleaseRepository`，不直接导入 JPA 类型。
3. Spring 容器中没有多个同类型 `ReleaseRepository` 实现的注入歧义。
4. `/version` 与 `/versions/local` 返回 `{"version":"1.0.1"}`；`/versions/missing` 保持统一 404 JSON。
5. `mvn clean test` 通过，包含已有健康、应用、Controller、Service 测试和新增 JPA 查询测试。

## 教学结构

第 51 课沿用第 50 课的单页 UTF-8 HTML 格式：先用“替换数据源但不改上层”的问题引入，再分步配置依赖、实体、查询接口、适配器、初始化数据与测试。互动题验证实体与 DTO 的区别、适配器的职责以及为什么 H2 数据会在进程停止后消失；最后预告生产数据库迁移或事务主题。
