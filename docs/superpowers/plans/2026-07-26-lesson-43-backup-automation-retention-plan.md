# 第 43 课：备份自动化与保留策略 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成第 43 课页面，并以临时 SQLite 虚构数据完成一次“多份备份、保留最新两份、恢复验证”的安全演练及证据记录。

**Architecture:** 课程页面复用第 42 课的单文件 HTML 样式和教学结构。演练是一个一次性的 Node 内联命令：临时根目录由 `fs.mkdtempSync` 创建，所有备份和清理操作限制在该目录；`better-sqlite3` 只打开该临时目录中的源库和恢复副本。演练记录只保留非敏感结果摘要。

**Tech Stack:** HTML/CSS、Node.js、`better-sqlite3`、Windows PowerShell 5.1、Vitest。

---

### Task 1: 编写第 43 课 HTML

**Files:**
- Create: `courses/ai-fullstack/lessons/0043-backup-automation-and-retention-policy.html`
- Reference: `courses/ai-fullstack/lessons/0042-data-persistence-and-recovery-drill.html`
- Reference: `docs/superpowers/specs/2026-07-26-lesson-43-backup-automation-retention-design.md`

- [ ] **Step 1: 读取第 42 课，复用其 `<style>`、`goal`、`step`、`quiz` 与末尾预告的页面结构。**

  Run: `Get-Content -Raw -Encoding UTF8 'courses\ai-fullstack\lessons\0042-data-persistence-and-recovery-drill.html'`

  Expected: 单文件页面包含既有浅色背景、最大 860px 内容宽度和课程提示框样式。

- [ ] **Step 2: 创建第 43 课页面，标题为“第四十三课：备份自动化与保留策略”。**

  页面必须包含以下完整教学内容：

  - `goal` 中列出：区分备份脚本与调度器、用可排序命名选择备份、解释“保留两份”与 RPO 的关系、从保留副本验证恢复。
  - 理论章节说明：时间戳命名便于排序和审计，但不等于任务已被定时执行；保留策略解决存储增长但不替代恢复测试；RPO 反推备份间隔；Render 托管数据库需要单独核对其备份能力。
  - `warn` 明确禁止读取、复制、修改或删除 `ai-backend/chat.db`，禁止连接 Render 或线上服务，禁止把本课命令当作生产备份方案。
  - 四个 `step`：划定临时目录边界、创建虚构源库、运行多备份和保留演练、记录非敏感证据。
  - 主阅读资源链接为 `https://www.sqlite.org/docs.html`。
  - 验收清单至少包含：目录中只剩最新两份、恢复查询得到虚构记录、记录写明边界与限制。
  - `quiz` 中包含三道题：时间戳命名为何不是自动调度、保留策略为何仍须恢复验证、为何本地 SQLite 演练不能证明 Render 数据库恢复能力。
  - 总结列表包含备份频率、保留策略、恢复验证和线上边界四点。
  - 最后一个 `<p>` 预告“第四十四课：备份失败可见性与恢复运行手册”。

- [ ] **Step 3: 在第 43 课的第三个实践步骤放入下方完整命令，并解释该命令的成功标准。**

```powershell
node -e "const fs=require('fs'),os=require('os'),path=require('path'),Database=require('better-sqlite3'); const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ai-agent-backup-')); try { const source=path.join(dir,'source.db'); const db=new Database(source); db.exec('CREATE TABLE drill_records (id INTEGER PRIMARY KEY, label TEXT NOT NULL)'); db.prepare('INSERT INTO drill_records (label) VALUES (?)').run('backup-retention-drill'); db.close(); const names=['backup-2026-07-26T080000Z.db','backup-2026-07-26T090000Z.db','backup-2026-07-26T100000Z.db','backup-2026-07-26T110000Z.db']; for (const name of names) fs.copyFileSync(source,path.join(dir,name)); const backups=fs.readdirSync(dir).filter(name=>name.startsWith('backup-')&&name.endsWith('.db')).sort(); const kept=backups.slice(-2); for (const name of backups.slice(0,-2)) fs.unlinkSync(path.join(dir,name)); const remaining=fs.readdirSync(dir).filter(name=>name.startsWith('backup-')&&name.endsWith('.db')).sort(); if (remaining.length!==2 || remaining.join('|')!==kept.join('|')) throw new Error('retention verification failed'); const restored=path.join(dir,'restored.db'); fs.copyFileSync(path.join(dir,kept[1]),restored); const check=new Database(restored,{readonly:true}); const row=check.prepare('SELECT id, label FROM drill_records').get(); check.close(); if (!row || row.id!==1 || row.label!=='backup-retention-drill') throw new Error('restore verification failed'); console.log(JSON.stringify({result:'retained-and-restored',kept,record:row})); } finally { fs.rmSync(dir,{recursive:true,force:true}); }"
```

  成功标准必须同时是：只保留 `backup-2026-07-26T100000Z.db` 和 `backup-2026-07-26T110000Z.db`，并且恢复副本能查询到 `id=1`、`label=backup-retention-drill`。页面需说明 `try/finally` 的清理目标仅为 `mkdtempSync` 返回的目录。

- [ ] **Step 4: 对生成页面做静态结构检查。**

  Run: `rg -n '<div class="goal">|<div class="step">|<div class="quiz">|第四十四课：备份失败可见性与恢复运行手册' 'courses\ai-fullstack\lessons\0043-backup-automation-and-retention-policy.html'`

  Expected: `goal`、至少四个 `step`、`quiz` 和下一课预告均被匹配到。

### Task 2: 执行临时备份保留演练并记录证据

**Files:**
- Create: `docs/recovery/2026-07-26-backup-retention-drill.md`
- Reference: `docs/recovery/2026-07-26-sqlite-recovery-drill.md`

- [ ] **Step 1: 从 `ai-backend` 工作目录执行 Task 1 的完整 Node 命令。**

  Run: 使用 Task 1 中的命令，工作目录为 `E:\project\AI-Agent\ai-backend`。

  Expected: 标准输出包含：

```json
{"result":"retained-and-restored","kept":["backup-2026-07-26T100000Z.db","backup-2026-07-26T110000Z.db"],"record":{"id":1,"label":"backup-retention-drill"}}
```

- [ ] **Step 2: 新增演练记录，记录目标、模拟保留结果、恢复查询结果、未触碰边界及限制。**

  记录必须明确：仅使用系统临时目录和虚构数据；最终保留两份备份；恢复副本查询到 `id=1` 与 `label=backup-retention-drill`；未读取或操作 `ai-backend/chat.db`；未连接或修改 Render、线上服务、部署配置、凭据或业务数据；临时绝对路径不写入文档。本地 SQLite 演练不等同于 Render 托管数据库备份与恢复能力。

- [ ] **Step 3: 检查演练记录不含不应保留的信息。**

  Run: `$record = Get-Content -Raw -Encoding UTF8 'docs\recovery\2026-07-26-backup-retention-drill.md'; if ($record -match 'C:\\|postgres://|DATABASE_URL|password|token') { throw 'sensitive or absolute-path content found' } else { 'RECOVERY_RECORD_BOUNDARY_CHECK_PASSED' }`

  Expected: `RECOVERY_RECORD_BOUNDARY_CHECK_PASSED`。

### Task 3: 回归验证与交付检查

**Files:**
- Verify: `courses/ai-fullstack/lessons/0043-backup-automation-and-retention-policy.html`
- Verify: `docs/recovery/2026-07-26-backup-retention-drill.md`
- Verify: `ai-backend/test/sessions.test.ts`

- [ ] **Step 1: 运行后端回归测试。**

  Run: `npm test`

  Working directory: `E:\project\AI-Agent\ai-backend`

  Expected: Vitest 显示 `2 passed` 测试文件和 `9 passed` 测试。

- [ ] **Step 2: 检查新增文件与现有改动的空白格式错误。**

  Run: `git diff --check`

  Expected: 退出码为 0；行尾转换警告不属于格式错误。

- [ ] **Step 3: 查看变更边界，不暂存、不提交、不推送。**

  Run: `git status --short`

  Expected: 本课新增的课程 HTML、恢复演练记录、设计与计划文档可见；不包含 `chat.db`、`.env`、Render 配置或无关文件的新增修改。本项目约定要求用户审阅后再决定是否提交。
