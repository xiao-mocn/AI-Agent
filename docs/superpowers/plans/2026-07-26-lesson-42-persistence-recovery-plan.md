# 第 42 课数据持久化策略与恢复演练 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第 42 节课程、一次临时 SQLite 副本恢复演练记录，并验证备份副本可以恢复虚构数据。

**Architecture:** 演练只在操作系统临时目录创建独立 SQLite 文件，使用一条虚构记录验证“创建 -> 备份 -> 恢复 -> 查询”。课程页面解释 SQLite 与托管 PostgreSQL 的边界、RPO/RTO 和恢复证据；不触碰项目数据库或 Render 数据库。

**Tech Stack:** Node.js、better-sqlite3、PowerShell 5.1、HTML5、Markdown、SQLite 官方文档。

---

### Task 1: 执行临时 SQLite 恢复演练

**Files:**
- Create temporarily: `%TEMP%/ai-agent-recovery-*/drill.db`
- Create temporarily: `%TEMP%/ai-agent-recovery-*/backup.db`
- Create temporarily: `%TEMP%/ai-agent-recovery-*/restored.db`
- Verify: `E:/project/AI-Agent/ai-backend/node_modules/better-sqlite3`

- [ ] **Step 1: 创建、备份、恢复并验证虚构数据库**

在 `E:/project/AI-Agent/ai-backend` 执行以下命令；它只使用系统临时目录和固定的虚构数据：

```powershell
node -e "const fs=require('fs'),os=require('os'),path=require('path'),Database=require('better-sqlite3'); const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ai-agent-recovery-')); const source=path.join(dir,'drill.db'),backup=path.join(dir,'backup.db'),restored=path.join(dir,'restored.db'); const db=new Database(source); db.exec('CREATE TABLE drill_records (id INTEGER PRIMARY KEY, label TEXT NOT NULL)'); db.prepare('INSERT INTO drill_records (label) VALUES (?)').run('recovery-drill'); db.close(); fs.copyFileSync(source,backup); fs.copyFileSync(backup,restored); const check=new Database(restored,{readonly:true}); const row=check.prepare('SELECT id, label FROM drill_records').get(); check.close(); if (!row || row.id!==1 || row.label!=='recovery-drill') throw new Error('恢复验证失败'); console.log(JSON.stringify({result:'restored',record:row,temporaryDirectory:dir})); fs.rmSync(dir,{recursive:true,force:true});"
```

Expected: 输出 `result` 为 `restored`，记录 `id` 为 `1`、`label` 为 `recovery-drill`。命令在同一次运行中删除自己创建的临时目录。

- [ ] **Step 2: 记录演练结果**

在 `docs/recovery/2026-07-26-sqlite-recovery-drill.md` 写入演练目标、虚构数据、验证结果、未触碰的系统边界和限制。不要写临时绝对路径、真实数据库文件、连接信息或用户数据。

### Task 2: 创建第 42 节课程页面

**Files:**
- Create: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0042-data-persistence-and-recovery-drill.html`
- Create: `E:/project/AI-Agent/docs/recovery/2026-07-26-sqlite-recovery-drill.md`
- Reference: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0041-release-evidence-and-change-records.html`

- [ ] **Step 1: 使用与第 41 节一致的页面样式**

保留 UTF-8、viewport 和 `.goal`、`.step`、`.step-num`、`.tip`、`.warn`、`.danger`、`.quiz` 样式。标题为“第四十二课：数据持久化策略与恢复演练”。

- [ ] **Step 2: 写入课程主体**

课程包含 SQLite 与托管 PostgreSQL 对比表、RPO/RTO 解释、四个实践步骤、验收清单、总结与三道思考题。四个实践步骤依次为：划定演练边界、创建虚构 SQLite 数据、备份并恢复独立副本、记录恢复证据。引用 `https://www.sqlite.org/docs.html`，并提醒学习者在不确定时向教师提问。

- [ ] **Step 3: 检查课程和恢复记录边界**

Run:

```powershell
Set-Location E:\project\AI-Agent
$lesson = Get-Content -Raw -Encoding UTF8 'courses\ai-fullstack\lessons\0042-data-persistence-and-recovery-drill.html'
$record = Get-Content -Raw -Encoding UTF8 'docs\recovery\2026-07-26-sqlite-recovery-drill.md'
@('class="goal"', 'class="step"', 'class="quiz"', 'https://www.sqlite.org/docs.html', '下一课将学习') |
  ForEach-Object { if ($lesson -notmatch [regex]::Escape($_)) { throw "课程缺少：$_" } }
if (([regex]::Matches($lesson, 'class="step"')).Count -ne 4) { throw '课程实践步骤数量不是 4' }
if ($record -match 'chat\.db|Render|postgres://|postgresql://') { throw '恢复记录越过了演练边界' }
```

Expected: 命令无输出且退出码为 `0`。

- [ ] **Step 4: 运行完整测试与格式检查**

Run:

```powershell
Set-Location E:\project\AI-Agent
git diff --check
npm --prefix ai-backend test
```

Expected: 无格式错误，Vitest 全部通过；不暂存、不提交任何文件。
