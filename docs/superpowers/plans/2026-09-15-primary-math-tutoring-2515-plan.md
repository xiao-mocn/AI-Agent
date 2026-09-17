# 小学三年级数学辅导 25/60/15 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将课程与首周 PPT 调整为 25% 校内压轴/拓展、60% 经典思维例题、15% 课末预习的结构。

**Architecture:** 课程档案与路线图记录新的时间比例和题目职责；首周 PPT 以两组完整例题链承载校内拓展与思维训练，并在两个模块结尾加入不讲透答案的预习问题。

**Tech Stack:** Markdown、HTML、Python `python-pptx`、PowerPoint `.pptx`。

---

### Task 1: 更新课程比例与路线图

**Files:**
- Modify: `courses/primary-math-tutoring/MISSION.md`
- Modify: `courses/primary-math-tutoring/NOTES.md`
- Modify: `courses/primary-math-tutoring/reference/annual-course-map.html`

- [ ] **Step 1: 将课程比例改为 25% / 60% / 15%**

在 MISSION 中明确：25% 校内压轴/拓展题、60%《举一反三》经典思路、15% 课末预习；保留 B 版阶段测试规则。

- [ ] **Step 2: 将 PPT 固定为五段式**

在 NOTES 中写入“例题展示—例题分析—思维扩展—检测—课末预习”；每次课最后 6–7 分钟只放下一校内知识的情境与预测问题。

- [ ] **Step 3: 更新路线图总览和备课提示**

将路线图 24/36/12 的表述替换为 25/60/15 内容时间比例，并在页脚写入“先选经典主例题，最后加一则课末预习题”。保留 36 个思维专题和 B 版测试节点。

- [ ] **Step 4: 验证比例与测试规则**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\MISSION.md','E:\project\AI-Agent\courses\primary-math-tutoring\NOTES.md','E:\project\AI-Agent\courses\primary-math-tutoring\reference\annual-course-map.html' -Pattern '25%|60%|15%|课末预习|B 版'
```

预期：三份文件全部命中比例和预习规则，路线图仍命中 B 版测试。

### Task 2: 重构首周 PPT 与教师提示

**Files:**
- Modify: `courses/primary-math-tutoring/slides/build-week01-ppt.py`
- Modify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md`
- Modify: `courses/primary-math-tutoring/slides/test_build_week01_ppt.py`
- Regenerate: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 写失败校验**

在 PPT 测试中断言两个模块分别存在“例题展示、例题分析、思维扩展、检测、课末预习”五个文本标记；先运行测试并确认当前 PPT 缺少课末预习标记。

- [ ] **Step 2: 加入课内模块的课末预习**

在第一个模块末尾增加“下一单元：一天的时间”预习页，用“从 8:45 到 12:20 经过多久”的时间线问题让学生预测分段方法，不出现正式解法。

- [ ] **Step 3: 加入思维模块的课末预习**

在第二个模块末尾增加时间线变式预习页，要求学生标出起点、终点和经过时间的未知量，不提前给出计算步骤。

- [ ] **Step 4: 重建并验证 PPT**

运行：

```powershell
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\build-week01-ppt.py'
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\test_build_week01_ppt.py'
```

预期：PPT 重建成功，校验无输出且退出码为 0，页数为 22–28 页。

### Task 3: 最终核对

**Files:**
- Verify: `courses/primary-math-tutoring/MISSION.md`
- Verify: `courses/primary-math-tutoring/NOTES.md`
- Verify: `courses/primary-math-tutoring/reference/annual-course-map.html`
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 核对 PPT 的五段式标记与页数**

运行：

```powershell
python -c "from pptx import Presentation; p=Presentation(r'E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns.pptx'); print(len(p.slides))"
```

预期：输出 22 至 28 的页数；测试脚本已确认每个模块包含五段式标记。

- [ ] **Step 2: 检查工作区差异**

运行：

```powershell
git status --short -- 'courses/primary-math-tutoring' 'docs/superpowers'
```

预期：只显示本次数学课程与设计/计划文件；不暂存、不提交、不推送。

## 自检结果

- 规格覆盖：Task 1 对应课程比例，Task 2 对应 PPT 五段式，Task 3 对应内容和工作区核对。
- 占位符检查：计划写明具体比例、预习问题、文件路径和验证命令。
- 一致性检查：预习只在课末出现，且不取代 25% 的校内拓展或 60% 的思维主线。
