# 公司项目参考的 Java 课程实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 8 周核心版或 10 周扩展版内，使用自有 Demo 建立可迁移到 `hmi-backend` 的 Java 后端基础，同时保留既有 Node.js AI 全栈成果作为后续 Java AI 集成的产品基线。

**Architecture:** 学习实施分为三条明确边界：Node.js AI 项目冻结为功能与行为参考；Java Demo 承担所有基础阶段的实现和试错；`hmi-backend` 仅提供代码阅读与版本差异对照。每个切片都经历无提示设计、有限提示实现、变式迁移和延迟复现；完成单库业务闭环、测试和影响分析后，再进入真实业务代码。

**Tech Stack:** Java 21、Spring Boot 3.5、Maven、MyBatis-Plus、关系型数据库、JUnit 5；参考项目为 Java 8、Spring Boot 2.7.18、Spring Security 5、MyBatis-Plus 和动态数据源。

---

### Task 0: 建立脱稿学习与验收机制

**Files:**
- Modify: `courses/ai-fullstack/NOTES.md`
- Modify: `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`
- Modify: `courses/ai-fullstack/lessons/0048-*.html` 至 `0057-*.html`

- [ ] **Step 1: 课程开始前的无提示设计**

每节课的第一个任务不能给出完整代码。用户先在 10-15 分钟内写出接口契约、涉及文件、数据流和一个失败分支；课程只据此指出缺失边界。

- [ ] **Step 2: 将完整代码改为分层提示**

先提供验收命令、测试预期和接口骨架；只有在用户尝试并说明阻塞点后，才提供 Controller、Service、Mapper 或测试中的局部提示。禁止以整段可复制实现替代用户尝试。

- [ ] **Step 3: 每课增加一个变式任务**

基本需求通过后，为当前切片改变一个条件：例如新增分页筛选、替换错误条件、增加状态限制或收紧权限。用户必须独立定位并修改受影响层。

- [ ] **Step 4: 安排延迟复现与阶段门槛**

在 24-72 小时后从空白文件或新接口复现关键切片；第 2、4、8 周分别进行综合脱稿检查。未达到“能定位文件、写最小实现、运行验证、解释失败边界”时回补，不新增框架或 AI 内容。

- [ ] **Step 5: 验证完成记录有独立证据**

Run: `rg -n "无提示|变式|延迟|脱稿|验收" courses/ai-fullstack/NOTES.md courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`

Expected: 课程规则与第 47 课都包含独立构建和验收要求，不再只以跟做成功判定完成。

### Task 0.5: 进行 Node.js 脱稿诊断

**Files:**
- Create: `courses/ai-fullstack/learning-records/0049-node-independent-construction-baseline.md`
- Create: `courses/ai-fullstack/reference/node-independent-construction-diagnostic.html`

- [ ] **Step 1: 给出简化需求，不提供旧代码或课程链接**

要求用户为“已登录用户发送一条消息，服务端保存消息并返回回复或明确失败”设计一个最小 API。用户需要写出 HTTP 方法和路径、请求与响应、文件职责、伪代码、持久化字段、两个失败分支和验证命令。

- [ ] **Step 2: 按能力维度反馈，而非直接补全代码**

将结果分为需求拆分、路由与分层、异步 API、持久化、鉴权、错误处理和测试七项。每项只记录“可独立完成”“需要提示”或“尚未形成”，并为最弱的一项安排一个 15-30 分钟缩小练习。

- [ ] **Step 3: 将诊断变为 Java 难度基线**

把用户已能独立完成的维度从 Java 初期讲解中压缩；对“需要提示”或“尚未形成”的维度，在 Java 第 1-2 周增加无提示设计和延迟复现，不用新框架掩盖基础缺口。

- [ ] **Step 4: 验证诊断可追溯且不修改产品代码**

Run: `rg -n "需求拆分|路由|持久化|鉴权|测试|独立" courses/ai-fullstack/learning-records/0049-node-independent-construction-baseline.md courses/ai-fullstack/reference/node-independent-construction-diagnostic.html`

Expected: 诊断记录包含能力判断和下一步缩小练习；`ai-backend` 与 `ai-frontend` 没有为诊断而产生改动。

### Task 1: 固定既有 AI 全栈主线的角色

**Files:**
- Modify: `courses/ai-fullstack/NOTES.md`
- Create: `courses/ai-fullstack/learning-records/0049-java-foundation-phase-boundary.md`

- [ ] **Step 1: 记录阶段边界**

在 `NOTES.md` 明确：未来 8-10 周的主学习投入转向 Java 后端基础；`ai-backend` 和 `ai-frontend` 保留为 Node.js AI 功能基线，不在此期间并行添加 Agent、RAG 或新产品功能。

- [ ] **Step 2: 记录 Node 项目的后续处置**

在学习记录中区分两件事：第 1-46 课的 Node.js 主线教学已完成；第 46 课中识别出的上线风险仍是独立待办。它们不被删除，也不作为 Java 基础阶段的阻塞项；Java 课程结束后再决定是否集中收尾上线风险。

- [ ] **Step 3: 验证课程状态可追溯**

Run: `rg -n "Java|Node.js|8-10 周|上线风险" courses/ai-fullstack/NOTES.md courses/ai-fullstack/learning-records/0049-java-foundation-phase-boundary.md`

Expected: 两个文件均能说明 Node 基线保留、Java 阶段时间范围和上线风险的延期处理。

### Task 2: 对齐第 47 课与公司版本差异

**Files:**
- Modify: `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`
- Modify: `courses/ai-fullstack/RESOURCES.md`

- [ ] **Step 1: 保留现代 Demo 基线**

第 47 课继续使用 Java 21 和 Spring Boot 3.5，不替换为公司 Java 8 / Boot 2.7。课程目标仍是创建独立的 `java-backend` Demo 和可测试的健康检查契约。

- [ ] **Step 2: 加入版本对照卡片**

在第 47 课新增简短对照：Demo 使用 `jakarta.*`、Spring Security 6 和 Java 21；公司项目使用 `javax.*`、Spring Security 5 和 Java 8。明确新版 Demo 的依赖和代码不能直接复制到公司模块。

- [ ] **Step 3: 补充一手参考资料**

在 `RESOURCES.md` 增加 Java 21、Spring Boot 3.5、Spring Framework 6 及公司项目现有 Spring Boot 2.7 API 文档的官方链接，并标注其分别用于 Demo 实作或公司代码阅读。

- [ ] **Step 4: 验证课程边界**

Run: `rg -n "Java 21|Spring Boot 3.5|Java 8|2.7|jakarta|javax" courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html courses/ai-fullstack/RESOURCES.md`

Expected: 课程同时说明现代 Demo 技术基线与公司项目兼容边界。

### Task 3: 实施 8 周 Java 基础课程

**Files:**
- Create: `courses/ai-fullstack/lessons/0048-*.html` 至 `0055-*.html`
- Create: `courses/ai-fullstack/learning-records/0050-*.md` 至 `0057-*.md`
- Modify: `courses/ai-fullstack/RESOURCES.md`

- [ ] **Step 1: 第 1-2 周，语言与 Web 基线**

课程覆盖 Java 集合、异常、Maven、JUnit 5、Spring Boot 配置、健康检查与 HTTP。Demo 产物是可启动、可测试的 `java-backend`，不接入数据库或 AI。

- [ ] **Step 2: 第 3-4 周，分层与单库持久化**

课程覆盖 Controller/Service/Mapper、VO/DO、统一响应、Bean Validation、异常处理、MyBatis-Plus、分页和唯一性校验。Demo 产物是一个可创建、更新、查询、分页和删除的单一业务实体。

- [ ] **Step 3: 第 5-6 周，事务与权限**

课程覆盖单库事务、状态变化、测试替身、数据隔离、登录和授权。Demo 的状态变更必须有失败分支测试；受保护接口必须验证未认证、无权限和授权成功三种结果。

- [ ] **Step 4: 第 7-8 周，工程质量与入场演练**

课程覆盖请求日志、配置边界、数据库迁移、Maven 构建、发布前检查和影响分析。最后选择公司站点管理的一条接口作为只读样本，写出调用链、受影响模块、验证步骤、风险与回滚条件，不修改公司仓库。

- [ ] **Step 5: 验证核心阶段出口**

Run: `rg --files courses/ai-fullstack/lessons | rg "0048|0049|0050|0051|0052|0053|0054|0055"`

Expected: 八个连续课程文件存在，且每个课程都有对应的学习记录和可执行验收步骤。

### Task 4: 使用公司项目进行只读映射

**Files:**
- Create: `courses/ai-fullstack/reference/hmi-backend-learning-map.html`
- Modify: `courses/ai-fullstack/RESOURCES.md`

- [ ] **Step 1: 记录项目入口与模块职责**

参考 `hmi-backend/pom.xml`、`server/ServerApplication.java`、`module-system`、`module-infra` 和 `module-model`，绘制 Maven 聚合、启动模块、通用能力、基础设施和业务模型的职责图。

- [ ] **Step 2: 记录站点管理调用链**

以 `StationController`、`StationServiceImpl` 和 `StationInfoMapper` 为例，标注请求映射、权限、租户上下文、服务编排、事务边界、数据源和 Mapper 查询的位置。

- [ ] **Step 3: 记录版本对照表**

将 Java 21 / 8、Boot 3.5 / 2.7、`jakarta` / `javax`、Security 6 / 5 写为可快速查阅的差异表，并明确哪些是“阅读时识别”、哪些是“真实需求开始前再练习”。

- [ ] **Step 4: 验证不触碰公司工作树**

Run: `git -C E:\project\hmi-backend status --short`

Expected: 没有因学习材料创建或阅读而产生的公司项目改动。

### Task 5: 实施第 9-10 周扩展与 AI 回归决策

**Files:**
- Create: `courses/ai-fullstack/lessons/0056-redis-and-module-boundaries.html`
- Create: `courses/ai-fullstack/lessons/0057-company-stack-adaptation-readiness.html`
- Create: `courses/ai-fullstack/learning-records/0058-java-foundation-readiness.md`

- [ ] **Step 1: 引入最小 Redis 与模块边界**

仅为已经正确的单库查询加入缓存，并通过测试覆盖命中、未命中与失效；不实现租户、多数据源、跨库事务、任务、WebSocket 或消息。

- [ ] **Step 2: 完成公司技术栈适配阅读**

阅读公司项目的旧版本 API、`@Resource` 注入、`javax.validation`、权限表达式与动态数据源用法，写出与 Demo 的对应关系和禁止直接复制的新版 API。

- [ ] **Step 3: 进行准入评审**

依据设计说明中的四项准入门槛，形成 `ready`、`partial` 或 `not-ready` 结论。只有 `ready` 才进入真实业务代码；否则从对应基础课补强。

- [ ] **Step 4: 决定 AI 主线恢复位置**

准入评审后，先把 Node.js Demo 中已有的对话、流式响应、会话隔离和安全边界迁移到 Java Demo；RAG、工具调用、Agent 与 MCP 仍需有独立业务需求和单独设计，不在本计划中自动启动。

## 验证与交付

- [ ] 核对每个课程都有 Demo 实践、公司代码阅读入口、版本差异与验收标准。
- [ ] 核对 8 周核心版不要求实现动态数据源、跨库事务、任务、WebSocket、消息、RAG 或 Agent。
- [ ] 核对 Node.js AI 项目未被删除、重写或与 Java 基础阶段并行扩展。
- [ ] 不执行自动提交；课程文件由用户审阅后按修改内容分类提交。
