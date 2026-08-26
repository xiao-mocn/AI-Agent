---
name: advance-lesson
description: Use when the user wants to advance to the next lesson — checks whether the implementation matches the lesson's requirements, answers quiz questions from the current completed lesson, writes a learning record, commits code to the repo, and generates the next lesson HTML file.
---

# Advance Lesson（推进下一课）

每次手动触发时，完整执行推进一节课的六步流程。

## 触发条件

**仅当用户显式输入 `/advance-lesson` 时执行。禁止自动触发。**

---

## 执行步骤

课程内容统一放在 `courses/<course-name>/` 下（与 `.claude/skills/teach/` 的技能定义分开，见根目录 `CLAUDE.md`）。本技能默认操作 `courses/ai-fullstack/`（涉及代码提交的主线课程）；如果项目里存在多个课程目录且用户没有明确说是哪一门，先问清楚再继续。

### 第一步：确定当前待完成课程

1. 列出 `../courses/ai-fullstack/lessons/` 下所有 `*.html` 文件，按文件名数字前缀排序
2. 列出 `../courses/ai-fullstack/learning-records/` 下所有文件，找出已完成课程编号
3. 最新课程（编号最大的 `.html`）若**没有**对应学习记录，它就是待完成课程
4. 若所有课程都已有学习记录，直接跳到第六步生成下一课

### 第二步：核对实现是否符合课程要求

**在提交代码之前必须先做这一步，不要跳过。**

1. 读取待完成课程 HTML 全文，重点看"动手实践步骤"（`<div class="step">`）里要求实现的具体功能点、关键代码片段，以及 `warn`/`danger`/`good`/`bad` 提示框里强调的约束（比如安全注意事项、必须遵守的顺序）
2. 用 `git diff` / `git status` 查看该课程涉及文件的实际改动，逐项对照课程要求检查：
   - 课程要求实现的功能点是否都实现了
   - 关键约束是否遵守
   - 有没有遗漏、简化或偏离课程要求的地方（文件位置、命名不同不算偏离，只要逻辑和约束都到位）
3. **如果发现不符合项**：
   - 逐条列出：文件路径 + 具体问题 + 课程原本要求的是什么
   - 给出可执行的改进方案（改哪里、怎么改），但不要擅自动手修改代码
   - 如果只是小的疏漏（命名、注释、位置差异），报告后继续往下走（第三步及之后照常执行）
   - 如果是核心功能缺失或明显违反课程强调的安全/正确性约束，先停下来把检测结果报告给用户，等用户明确要"直接改"或"先跳过"再继续，不要自作主张
4. 如果完全符合要求，简要说明"检测通过"并附上核对依据（比如对照了哪几条要求），然后继续下一步

### 第三步：回答思考题

1. 读取待完成课程的 HTML，定位 `<div class="quiz">` 标签内所有问题（Q1、Q2、Q3 等）
2. 逐题输出详细解答，要求：
   - 结合课程内容和实际工程场景
   - 每题 3-6 句，重点讲清楚"为什么"
   - 直接输出所有答案，无需等待用户确认

### 第四步：写学习记录

扫描 `../courses/ai-fullstack/learning-records/` 找到最高序号，新文件序号 +1，写入：

```
# 完成第XX课：[课程标题]

[2-3 句说明：安装了什么、改了哪些文件、实现了什么功能]

**思考题回答**：
1. **Q1（[关键词]）**：[简洁解答]
2. **Q2（[关键词]）**：[简洁解答]
3. **Q3（[关键词]）**：[简洁解答]

**Implications**：第XX课将[下一课主题和方向]。
```

### 第五步：提交代码到仓库

1. 运行 `git status` 查看未提交更改
2. 判断提交类型：
   - 仅有 `.md` 学习记录文件 → `docs:` 前缀
   - 有代码变更 → `feat:` 或 `fix:` 前缀
3. 暂存相关文件并提交，消息格式：
   - `docs: 添加第XX课学习记录——[课程主题]`
   - `feat: 第XX课——[主要变更描述]`
4. **只提交与本课相关的文件**，绝对不要提交 `.env`、`chat.db-shm`、`chat.db-wal` 等无关文件

### 第六步：生成下一课 HTML

1. 读取当前课程末尾段落，找到"下一课"预告（通常是最后一个 `<p>` 标签）
2. 读取背景文件：
   - `../courses/ai-fullstack/MISSION.md` — 用户目标与约束
   - `../courses/ai-fullstack/NOTES.md` — 用户偏好和教学风格
3. 参照已有课程 HTML（相同 CSS、相同 section 结构、简体中文）生成下一课，必须包含：
   - `<div class="goal">` 学习目标清单
   - 分节理论讲解（`<h2>` 分节）
   - 动手实践步骤（`<div class="step">`）
   - 思考题（`<div class="quiz">`，3 题）
   - 本课总结列表
   - 下一课预告（最后一个 `<p>`）
4. 文件命名：`XXXX-[dash-case-topic].html`，保存到 `../courses/ai-fullstack/lessons/`
5. 用 Windows `start` 命令打开文件，让用户可以直接查看：
   ```
   start "" "..\\courses\\ai-fullstack\\lessons\\XXXX-[name].html"
   ```
   若 `start` 失败，在终端输出完整文件路径供用户手动打开

---

## 路径速查

执行时 CWD 通常是 `E:\project\AI-Agent\ai-backend`：

| 目标 | 路径 |
|------|------|
| 课程文件 | `../courses/ai-fullstack/lessons/` |
| 学习记录 | `../courses/ai-fullstack/learning-records/` |
| 课程任务说明 | `../courses/ai-fullstack/MISSION.md` |
| 教学偏好笔记 | `../courses/ai-fullstack/NOTES.md` |

若相对路径无效，改用绝对路径 `E:\project\AI-Agent\courses\ai-fullstack\`。

## 注意事项

- 不要跳过"核对实现是否符合课程要求"直接提交代码
- 核对时发现核心功能缺失或违反课程强调的安全/正确性约束，先报告给用户，等确认再继续，不要自作主张改代码
- 不要跳过思考题直接生成下一课
- 不要自动 `git push`（只做本地 commit）
- 生成的 HTML 要美观可读，CSS 样式与现有课程完全一致
- 遇到路径找不到文件时，先用工具确认目录内容再继续
