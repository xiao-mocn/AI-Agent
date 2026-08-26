# 第 42 课：数据持久化策略与恢复演练

## 目标

让学习者理解本地 SQLite 与托管 PostgreSQL 的持久化和恢复边界，并通过独立临时 SQLite 副本完成一次可验证的备份与恢复演练。

## 教学范围

- 比较 SQLite 与托管 PostgreSQL 的存储位置、适用场景、备份责任和恢复方式。
- 介绍 RPO（可接受数据丢失窗口）与 RTO（可接受恢复时间）在小型 AI 应用中的实际含义。
- 在临时目录创建演练数据库、副本备份、独立恢复副本并验证表与数据。
- 创建不含业务数据的恢复演练记录，记录目标、时间、验证结果和限制。

## 安全边界

- 不读取、复制、修改或删除 `ai-backend/chat.db`。
- 不连接 Render 数据库，不变更任何线上配置或服务。
- 演练数据只包含虚构的单条记录，临时文件在验证后删除。
- 不在课程记录中写入连接串、密钥、令牌或真实用户数据。

## 课程结构

页面沿用第 41 节单页 HTML 样式，包含目标、理论说明、四步动手实践、验收清单、总结、三道思考题和下一课预告。

1. 解释恢复可验证性与“服务可连接”的区别。
2. 用表格对比 SQLite 与托管 PostgreSQL 的恢复责任边界。
3. 演示 RPO/RTO 如何决定备份频率与恢复演练节奏。
4. 提供 PowerShell 和 Node.js 命令，在临时路径创建、备份、恢复并验证 SQLite 副本。
5. 在 `docs/recovery/` 创建一次恢复演练记录。

## 验收标准

- 创建 `courses/ai-fullstack/lessons/0042-data-persistence-and-recovery-drill.html`。
- 创建 `docs/recovery/2026-07-26-sqlite-recovery-drill.md`。
- HTML 包含 `.goal`、四个 `.step`、`.quiz`、Node.js SQLite 官方资料链接和最后一个下一课预告段落。
- 演练记录明确说明未触碰现有 `chat.db` 或 Render 数据库。
