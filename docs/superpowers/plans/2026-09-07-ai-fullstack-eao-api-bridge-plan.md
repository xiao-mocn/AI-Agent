# AI 全栈课程 eao-api 上岗桥接调整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 AI 全栈课程的近期目标正式调整为“两周内能够在指导下阅读并修改 eao-api 的简单后端代码”，同时保留长期 AI 全栈目标。

**Architecture:** 本计划只更新课程状态文件，不生成未来十节课程，也不修改 `eao-api`、`eao-front` 或 `java-backend`。`MISSION.md` 负责目标，`NOTES.md` 负责教学策略，`RESOURCES.md` 负责可信的一手代码素材，新的 learning record 记录本次使命转向；第 53～62 课后续根据用户表现逐课生成。

**Tech Stack:** Markdown、PowerShell 5.1、Git 只读检查

---

## 文件结构与职责

**修改：**

- `courses/ai-fullstack/MISSION.md`：课程长期使命、两周近期目标、验收标准与范围边界。
- `courses/ai-fullstack/NOTES.md`：后端上岗桥接阶段的固定教学方式。
- `courses/ai-fullstack/RESOURCES.md`：补充本地公司项目中的一手代码资料与用途。

**创建：**

- `courses/ai-fullstack/learning-records/0054-shift-to-eao-api-backend-onboarding.md`：记录用户目标变化及对后续课程的影响。

**本计划明确不修改：**

- `courses/ai-fullstack/lessons/0052-production-database-profiles-and-flyway.html`
- `E:\project\eao-api\**`
- `E:\project\eao-front\**`
- `java-backend/**`

第 53～62 课和练习项目属于后续逐课实施范围，不在本次课程状态调整中提前创建。

### Task 1: 更新课程使命

**Files:**

- Modify: `courses/ai-fullstack/MISSION.md`

- [ ] **Step 1: 读取现有使命并确认没有并发修改**

Run:

```powershell
Get-Content -Raw -Encoding UTF8 'E:\project\AI-Agent\courses\ai-fullstack\MISSION.md'
git status --short -- 'courses/ai-fullstack/MISSION.md'
```

Expected: 文件仍以“独立从 0 到 1 开发并上线一个有 AI 功能的完整产品”为长期目标，且 Git 状态没有本轮之外的未提交修改。

- [ ] **Step 2: 用以下完整内容替换 MISSION.md**

使用 `apply_patch` 将文件替换为：

```markdown
---
name: ai-fullstack-mission
description: 近期具备公司 Java 后端辅助开发能力，长期能够独立开发 AI 全栈应用
metadata:
  type: project
---

# Mission: AI 全栈工程师

## Why

近期需要参与公司的 Java 后端代码修改，因此先建立阅读、定位和安全修改 `eao-api` 的能力，降低从熟悉的前端开发进入企业后端项目的门槛。长期仍要能够独立开发并上线包含前端、后端 API、数据库和 AI 集成的完整产品。

## Success looks like

**近期目标：eao-api 后端上岗桥接（两周）**

- 看到前端 API 地址后，能在 10 分钟内定位 `Controller → VO → Service → ServiceImpl → Convert → DO → Mapper/XML`
- 能用自己的话解释请求参数、业务规则、数据库查询和响应数据分别经过哪里
- 能在同事或 AI 指导下完成增加字段、增加分页筛选条件和增加简单业务校验
- 修改前能列出影响范围，修改后会检查 Git diff，并运行相关测试或接口验证
- 离开已经练习过的品牌模块后，能在另一个简单 CRUD 模块中迁移同一套定位方法

**长期目标：独立交付 AI 全栈应用**

- 能独立编写并维护 Node.js + TypeScript 或 Java Spring Boot 后端
- 能安全调用 LLM API，实现对话、内容生成等功能
- 能使用数据库持久化业务数据和对话历史
- 能将完整应用部署到可访问的环境
- 遇到全栈问题时，能判断问题位于前端、HTTP、业务、数据访问、数据库还是外部依赖

## Constraints

- 每天 1～2 小时学习时间
- 前端 Vue 3、React 和 TypeScript 已有生产项目经验
- 当前能跟随步骤完成后端练习，但基本不能独立阅读大型 Java 项目
- 两周内优先形成在指导下处理简单后端改动的能力，不追求独立开发复杂模块
- 采用项目驱动方式：约 40% 阅读 `eao-api`/`eao-front`，约 60% 在课程项目中仿真实践
- `eao-api` 和 `eao-front` 在桥接课程中保持只读

## Out of scope

- 两周内独立设计大型后端模块或处理高风险生产缺陷
- 桥接阶段深入 JPA、Flyway、Spring Security、权限、多租户和多数据源内部实现
- 桥接阶段深入 Redis、MQ、MQTT、WebSocket、TDengine、S3 和 Kubernetes
- 机器学习或模型训练
- 同时推进新的 AI 集成功能；完成桥接阶段后再恢复长期主线
```

- [ ] **Step 3: 检查使命是否保持短期和长期目标的一致性**

Run:

```powershell
rg -n '近期目标|长期目标|10 分钟|同事或 AI 指导|只读|Out of scope' 'E:\project\AI-Agent\courses\ai-fullstack\MISSION.md'
```

Expected: 六类关键词均能命中；近期目标没有承诺“两周内独立开发复杂后端”，长期 AI 全栈目标没有被删除。

### Task 2: 固化桥接阶段的教学规则

**Files:**

- Modify: `courses/ai-fullstack/NOTES.md`

- [ ] **Step 1: 在“后端教学基线”后新增桥接阶段规则**

使用 `apply_patch` 在 `## 后端教学基线（长期有效）` 的内容之后、`## 节奏建议` 之前插入：

```markdown
## eao-api 后端上岗桥接阶段

- 两周桥接阶段的完成标准是在同事或 AI 指导下完成低风险后端修改，不把“独立开发复杂模块”作为近期要求。
- 每条新链路优先从用户熟悉的 `eao-front` API 调用开始，再沿 URL 和 HTTP 方法定位 `eao-api` 的 Controller。
- 第一周固定使用品牌管理链路，反复练习 `Controller → VO → Service → ServiceImpl → Convert → DO → Mapper/XML`，避免频繁切换业务造成额外负担。
- 真实项目负责训练代码导航，`java-backend` 负责可运行的仿真实践；桥接阶段不直接修改 `eao-api` 和 `eao-front`。
- 用户第一次遇到公司 Starter、权限、多租户、多数据源、审计日志或中间件封装时，只解释它在当前链路中的输入、输出和职责，不立即追踪内部实现。
- 卡住时按“目录提示 → 类名提示 → 方法提示 → 代码解释”逐层给出帮助，避免一开始提供完整答案。
- 每节课先做无答案定位和职责判断，再进行动手练习、Git diff 自查和测试或 HTTP 验证。
- 每节课在 24～72 小时后安排一次短复现；无法完成前一课的脱稿定位时，优先补练，不继续增加框架概念。
- 课程中的简化实现必须显式列出与 `eao-api` 真实写法的差异，避免把教学简化误认为公司生产规范。
- 第 53～62 课组成两周桥接主线；第 52 课保留为选修，不删除、不覆盖。
```

- [ ] **Step 2: 修正原有节奏建议中与当前阶段冲突的表述**

将：

```markdown
- 后端内容尽量用 TypeScript（用户已熟悉），减少语言切换成本
```

替换为：

```markdown
- 解释 Java 后端概念时优先用 TypeScript/Vue 类比降低理解成本，但练习和代码阅读必须回到 Java 与 Spring Boot
```

- [ ] **Step 3: 检查教学规则没有自相矛盾**

Run:

```powershell
rg -n 'eao-api 后端上岗桥接阶段|Controller → VO|目录提示|24～72|第 53～62|TypeScript/Vue 类比' 'E:\project\AI-Agent\courses\ai-fullstack\NOTES.md'
```

Expected: 所有关键词均命中；文件不再要求用 TypeScript 作为主要后端练习语言。

### Task 3: 登记可信的一手项目资料

**Files:**

- Modify: `courses/ai-fullstack/RESOURCES.md`

- [ ] **Step 1: 在 Knowledge 下新增“公司项目一手资料”**

使用 `apply_patch` 在 `## Knowledge` 后、`### 后端基础` 前插入：

```markdown
### 公司项目一手资料（本地只读）

- `E:\project\eao-api\README.md` 与 `E:\project\eao-api\pom.xml`
  eao-api 的模块职责、构建边界和 Maven 聚合关系。用于：第 53 课绘制项目地图，不作为 Java 语法教材。

- `E:\project\eao-front\src\api\iot\brand\index.ts`
  品牌管理前端 API 地址与 HTTP 方法的一手来源。用于：从熟悉的 TypeScript 调用反查后端入口。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\controller\admin\brand\BrandController.java`
  品牌管理 HTTP 入口。用于：识别 Controller、参数绑定、校验和统一响应包装。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\service\model\brand\BrandService.java` 与 `BrandServiceImpl.java`
  品牌管理业务接口和实现。用于：识别依赖注入、业务校验、事务和 Mapper 调用。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\dal\dataobject\model\brand\BrandInfoDO.java` 与 `dal\mapper\model\brand\BrandInfoMapper.java`
  品牌数据对象和 MyBatis-Plus 查询入口。用于：理解 DO、表映射和分页查询条件。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\convert\device\BrandConvert.java`
  MapStruct 对象转换边界。用于：理解请求/响应 VO 与数据库 DO 为什么不直接混用。
```

- [ ] **Step 2: 检查每项资源都有用途说明**

Run:

```powershell
$resourcePath = 'E:\project\AI-Agent\courses\ai-fullstack\RESOURCES.md'
rg -n '公司项目一手资料|用于：第 53 课|用于：从熟悉的 TypeScript|用于：识别 Controller|用于：识别依赖注入|用于：理解 DO|用于：理解请求/响应 VO' $resourcePath
```

Expected: 标题和六条用途说明均命中；没有把生产密码、环境变量值或完整业务源码复制进课程仓库。

### Task 4: 记录使命调整

**Files:**

- Create: `courses/ai-fullstack/learning-records/0054-shift-to-eao-api-backend-onboarding.md`

- [ ] **Step 1: 确认 0054 是下一个可用编号**

Run:

```powershell
Get-ChildItem 'E:\project\AI-Agent\courses\ai-fullstack\learning-records' -Filter '*.md' | Sort-Object Name | Select-Object -Last 5 -ExpandProperty Name
```

Expected: 当前最高编号为 `0053`，不存在其他 `0054-*.md`。

- [ ] **Step 2: 创建学习记录**

使用 `apply_patch` 创建以下完整内容：

```markdown
# 学习目标转向 eao-api 后端上岗桥接

用户即将逐步参与公司的 Java 后端代码修改，但当前面对大型后端项目时基本无法独立阅读代码。近期使命因此调整为：用两周时间建立从前端 API 定位后端入口、追踪分层调用链、在指导下完成低风险修改并验证结果的能力；原有独立开发 AI 全栈应用的目标保留为长期方向。

**Evidence**：用户选择“两周内优先应急上岗”，当前业务模块尚不确定，并确认采用“约 40% 阅读 `eao-api`/`eao-front`、约 60% 在课程项目仿真实践”的方案。

**Implications**：第 52 课保留为选修；第 53～62 课切换到项目地图、前后端接口定位、Controller/VO、Service、Convert/DO/Mapper，以及字段、筛选条件和业务校验修改。两周内暂停 JPA 进阶、AI 集成和复杂中间件，不以独立开发复杂后端为完成标准。
```

- [ ] **Step 3: 检查记录满足“变化、证据、影响”三项信息**

Run:

```powershell
rg -n '近期使命|Evidence|Implications|第 53～62 课|长期方向' 'E:\project\AI-Agent\courses\ai-fullstack\learning-records\0054-shift-to-eao-api-backend-onboarding.md'
```

Expected: 五个关键词均命中，且记录没有声称用户已经掌握尚未验收的能力。

### Task 5: 进行课程状态一致性验证

**Files:**

- Verify: `courses/ai-fullstack/MISSION.md`
- Verify: `courses/ai-fullstack/NOTES.md`
- Verify: `courses/ai-fullstack/RESOURCES.md`
- Verify: `courses/ai-fullstack/learning-records/0054-shift-to-eao-api-backend-onboarding.md`

- [ ] **Step 1: 扫描禁止的占位内容和编码异常**

Run:

```powershell
$paths = @(
  'E:\project\AI-Agent\courses\ai-fullstack\MISSION.md',
  'E:\project\AI-Agent\courses\ai-fullstack\NOTES.md',
  'E:\project\AI-Agent\courses\ai-fullstack\RESOURCES.md',
  'E:\project\AI-Agent\courses\ai-fullstack\learning-records\0054-shift-to-eao-api-backend-onboarding.md'
)
rg -n 'TBD|TODO|待定|�|锟斤拷' $paths
```

Expected: `rg` 返回退出码 1，表示没有命中占位文本或常见乱码标记。

- [ ] **Step 2: 检查使命、教学规则和学习记录中的课次一致**

Run:

```powershell
rg -n '第 52 课|第 53～62 课|两周|1～2 小时|只读' 'E:\project\AI-Agent\courses\ai-fullstack\MISSION.md' 'E:\project\AI-Agent\courses\ai-fullstack\NOTES.md' 'E:\project\AI-Agent\courses\ai-fullstack\learning-records\0054-shift-to-eao-api-backend-onboarding.md'
```

Expected: 第 52 课始终被描述为保留或选修，第 53～62 课始终被描述为两周桥接主线；不存在删除第 52 课或直接修改公司仓库的表述。

- [ ] **Step 3: 检查实际改动范围**

Run:

```powershell
git status --short
git diff --check -- 'courses/ai-fullstack/MISSION.md' 'courses/ai-fullstack/NOTES.md' 'courses/ai-fullstack/RESOURCES.md' 'courses/ai-fullstack/learning-records/0054-shift-to-eao-api-backend-onboarding.md'
git diff --stat -- 'courses/ai-fullstack/MISSION.md' 'courses/ai-fullstack/NOTES.md' 'courses/ai-fullstack/RESOURCES.md'
```

Expected: 本计划新增或修改的课程文件只有上述四个；`git diff --check` 无输出；工作区中原有的其他未提交文件保持不变。

- [ ] **Step 4: 人工复核课程状态**

检查以下条件：

- `MISSION.md` 同时包含近期上岗目标和长期 AI 全栈目标；
- `NOTES.md` 要求从前端 API 反查后端，且使用分层提示；
- `RESOURCES.md` 只登记路径和用途，没有复制敏感配置或大段公司源码；
- 学习记录只记录目标变化，没有把未来目标写成已经掌握；
- `lessons/0052-production-database-profiles-and-flyway.html` 保持原样；
- `eao-api`、`eao-front` 和 `java-backend` 没有改动。

Expected: 六项全部满足。

### Task 6: 交付审阅并准备第 53 课

**Files:**

- Reference: `docs/superpowers/specs/2026-09-07-ai-fullstack-eao-api-bridge-design.md`
- Reference: `docs/superpowers/plans/2026-09-07-ai-fullstack-eao-api-bridge-plan.md`

- [ ] **Step 1: 向用户交付课程状态调整结果**

交付说明必须包含：

- 更新了哪些课程状态文件；
- 两周近期目标和长期目标如何共存；
- 验证命令及结果；
- 公司项目保持只读；
- 第 52 课保留为选修；
- 下一步是生成并打开第 53 课“eao-api 多模块项目地图”。

- [ ] **Step 2: 不自动提交 Git**

本项目全局约定要求用户 review 后再确认提交，因此本计划不执行 `git add` 或 `git commit`。只有用户明确要求提交时，才调用 `functional-chinese-commits` 技能，将课程目标调整作为独立中文提交处理。

- [ ] **Step 3: 后续逐课执行边界**

第 53～62 课不在本次批量创建。用户开始下一课时，先使用 `teach` 读取更新后的使命、笔记和学习记录，再按批准的设计逐课生成；每一课都根据上一课的实际回答和验收结果调整难度。
