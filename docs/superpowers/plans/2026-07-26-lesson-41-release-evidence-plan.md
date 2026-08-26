# 第 41 课发布证据与变更记录 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成第 41 节课程页面和一份基于真实 Render 数据库恢复事件的安全发布记录。

**Architecture:** 课程页面沿用第 40 节的内嵌 CSS 与教学结构，发布记录使用 Markdown 固定字段承载版本、变更、探针、风险和回滚点。两个文件只记录状态与摘要，禁止记录连接串、令牌、密钥、用户信息和完整日志。

**Tech Stack:** HTML5、Markdown、PowerShell 5.1、Render 官方文档。

---

### Task 1: 创建发布记录实例

**Files:**
- Create: `E:/project/AI-Agent/docs/releases/2026-07-26-render-database-recovery.md`

- [ ] **Step 1: 写入固定字段的发布记录**

记录必须包含以下六个标题，并使用已经验证的事实：

```markdown
# 发布记录：Render 数据库恢复

## 部署标识与时间
## 变更摘要
## 验收证据
## 风险与限制
## 回滚点
## 后续事项
```

变更摘要只能写“替换过期的免费 Render 数据库并更新服务连接配置”；验收证据只能写 `/health` 返回 `ok` 和 `/ready` 返回 `ready`。不要写 `DATABASE_URL`、JWT、API Key、数据库主机、端口、服务 ID、连接串或用户数据。

- [ ] **Step 2: 检查发布记录的敏感信息边界**

Run:

```powershell
Set-Location E:\project\AI-Agent
$record = Get-Content -Raw -Encoding UTF8 'docs\releases\2026-07-26-render-database-recovery.md'
@('DATABASE_URL', 'JWT_SECRET', 'API_KEY', 'postgres://', 'postgresql://', 'Authorization') |
  ForEach-Object { if ($record -match [regex]::Escape($_)) { throw "发布记录包含敏感字段：$_" } }
```

Expected: 命令无输出且退出码为 `0`。

### Task 2: 创建第 41 节课程页面

**Files:**
- Create: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0041-release-evidence-and-change-records.html`
- Reference: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0040-deployment-smoke-tests-and-rollback.html`
- Reference: `E:/project/AI-Agent/docs/releases/2026-07-26-render-database-recovery.md`

- [ ] **Step 1: 使用与第 40 节一致的页面外壳**

保留 `lang="zh"`、UTF-8、viewport 与 `.goal`、`.step`、`.step-num`、`.tip`、`.warn`、`.danger`、`.quiz` 样式。标题为“第四十一课：发布证据与变更记录”。

- [ ] **Step 2: 写入案例驱动的课程主体**

课程包含“发布记录不是日志堆栈”“哪些信息可以记录”“动手实践”“验收清单”“本课总结”和思考题。四个实践步骤为：收集最小证据、写变更摘要、写风险与回滚点、运行敏感信息检查。页面必须引用 `https://render.com/docs`，并提醒学习者在不清楚时向教师提问。

- [ ] **Step 3: 检查课程结构和敏感信息边界**

Run:

```powershell
Set-Location E:\project\AI-Agent
$lesson = Get-Content -Raw -Encoding UTF8 'courses\ai-fullstack\lessons\0041-release-evidence-and-change-records.html'
@('class="goal"', 'class="step"', 'class="quiz"', 'https://render.com/docs', '下一课将学习') |
  ForEach-Object { if ($lesson -notmatch [regex]::Escape($_)) { throw "课程缺少：$_" } }
if (([regex]::Matches($lesson, 'class="step"')).Count -ne 4) { throw '课程实践步骤数量不是 4' }
if ($lesson -match 'postgres(?:ql)?://[^\s''"<>]+@') { throw '课程包含凭据型数据库 URI' }
```

Expected: 命令无输出且退出码为 `0`。

- [ ] **Step 4: 复核课程文件范围**

Run:

```powershell
Set-Location E:\project\AI-Agent
git diff --check
git status --short
```

Expected: 不出现格式错误；本课新增课程页面和发布记录，工作区已有的其他未跟踪文件保持不动，且不暂存、不提交。
