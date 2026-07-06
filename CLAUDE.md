# 项目说明

## 学习课程目录约定

本项目用 `/teach` 技能维护多个学习课程，内容统一放在 `courses/<course-name>/` 下，
和 `.claude/skills/teach/`（技能本身的定义：`SKILL.md`、`*-FORMAT.md`）严格分开：

- `courses/ai-fullstack/` — AI 全栈工程师课程（Node.js 后端 + AI 集成 + 部署）
- `courses/english/` — 程序员英语实战课程（技术面试 / 阅读文档 / 团队协作）

每个课程目录内部结构一致：`MISSION.md`、`RESOURCES.md`、`NOTES.md`、`lessons/`、`learning-records/`。

**调用 `/teach` 时**：如果用户没有明确说是哪个课程，先问清楚是继续哪一个（或要不要开新的），
再进入对应的 `courses/<course-name>/` 目录读写文件——不要把新内容直接建在项目根目录或
`.claude/skills/teach/` 下面。
