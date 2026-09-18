# 第 50 课设计：Repository 的最小概念与可替换数据源

## 目标

让学习者在不引入数据库或 JPA 的前提下，理解 Repository 是 Service 获取数据的边界。完成后，`VersionService` 不再知道版本数据来自内存、配置文件还是未来的数据库；Controller 对外的 URL、状态码和 JSON 契约保持不变。

## 课程范围

- 新增一个面向业务的 `ReleaseRepository` 接口，只表达“根据发布标签查找版本”。
- 提供 `InMemoryReleaseRepository` 实现，使用只读内存数据模拟存储。
- 让 `VersionService` 通过构造方法依赖 Repository；查询为空时仍抛出 `ReleaseNotFoundException`。
- 添加 Service 层测试：Repository 返回记录时返回版本，Repository 返回空时抛出业务异常。
- 保持 `VersionController`、`ApiExceptionHandler` 和既有 Controller 测试不变。

本课不引入 JPA、数据库连接、实体映射、SQL、事务或分页；它们留给后续持久化课程。

## 组件与数据流

```text
GET /versions/{releaseLabel}
  -> VersionController
  -> VersionService
  -> ReleaseRepository
  -> InMemoryReleaseRepository
  -> VersionResponse 或空结果

空结果 -> VersionService 抛 ReleaseNotFoundException
       -> ApiExceptionHandler 返回 404 JSON
```

`ReleaseRepository` 返回 `Optional<VersionResponse>`：Repository 只报告是否找到数据，不决定 HTTP 语义。`VersionService` 负责把空结果解释为业务上的“标签不存在”。

## 验收标准

1. `ReleaseRepository` 是明确、可替换的数据访问接口。
2. `InMemoryReleaseRepository` 是 Spring 管理的实现，且不把 HTTP 状态码或 JSON 响应逻辑放入其中。
3. `VersionService` 使用 Repository，不直接维护内存 Map。
4. `/version` 与 `/versions/local` 保持 200 JSON；`/versions/missing` 保持统一 404 JSON。
5. 新增 Service 测试，Maven 全量测试通过。

## 教学结构

第 50 课延续第 49 课的中文、单页 HTML 模板，包含数据流脱稿练习、分步代码实现、两道接口边界判断题和一道变式练习。它强调“Repository 不是数据库本身”，而是一道允许未来替换数据来源、又不影响上层契约的边界。
