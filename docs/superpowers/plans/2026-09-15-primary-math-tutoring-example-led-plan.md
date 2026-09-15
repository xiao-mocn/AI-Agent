# 小学三年级数学辅导例题先行实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将课内提升和思维专题统一为“经典例题完整讲透，再做同构迁移”的课堂与 PPT 结构。

**Architecture:** 课程约定定义两类课的时间和题目来源；年度路线图为每个课内单元补充压轴/拓展题与《举一反三》连接方向；首周教师 PPT 用连续例题页替换只含引导的页面。B 版测试节点与 40%/60% 新授比例不改变。

**Tech Stack:** Markdown、HTML、Python `python-pptx`、PowerPoint `.pptx`。

---

### Task 1: 固化例题先行的课程约定

**Files:**
- Modify: `courses/primary-math-tutoring/MISSION.md`
- Modify: `courses/primary-math-tutoring/NOTES.md`
- Modify: `courses/primary-math-tutoring/reference/annual-course-map.html`

- [ ] **Step 1: 更新课内提升规则**

在 MISSION 和 NOTES 中明确：课内提升以校内压轴/拓展题为主，采用“8 分钟回忆题、20 分钟完整主例题、10 分钟《举一反三》同思路变式、5 分钟出口题”的结构；《举一反三》只作为同思想连接与拔高，不取代校内主问题。

- [ ] **Step 2: 更新思维专题规则**

写明思维课必须从一道经典例题开始，完整呈现读题建模、关键突破、规范解答、检验和两道由易到难的同构变式；不先讲定义，也不以大量刷题代替讲透。

- [ ] **Step 3: 更新年度路线图的备课提示**

在路线图的课内单元说明和页脚中加入“校内压轴/拓展题为锚点—同思想《举一反三》变式为迁移”的备课提示，并保留现有 24/36/12、B 版测试和五周循环信息。

- [ ] **Step 4: 验证课程约定**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\MISSION.md','E:\project\AI-Agent\courses\primary-math-tutoring\NOTES.md','E:\project\AI-Agent\courses\primary-math-tutoring\reference\annual-course-map.html' -Pattern '压轴|拓展题|例题先行|同构变式|8 分钟'
```

预期：三份文件都能检出新的课堂设计约定。

### Task 2: 重构首周合并教师 PPT 的例题链

**Files:**
- Modify: `courses/primary-math-tutoring/slides/build-week01-ppt.py`
- Modify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md`
- Modify: `courses/primary-math-tutoring/slides/test_build_week01_ppt.py`
- Regenerate: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 先写失败校验**

在 `test_build_week01_ppt.py` 断言两个模块各有“完整题干、建模、关键突破、规范解答与检验、变式迁移”文本标记；运行测试并确认现有 PPT 因缺少至少一个标记而失败。

- [ ] **Step 2: 重构课内模块**

将第一模块改为校内压轴型比较问题：短复习后讲清“相同部分抵消、差量对应差价”的完整例题；再用《举一反三》的对应/差量变式迁移。每页只有一个主要关系，答案不与题干同页。

- [ ] **Step 3: 重构思维模块**

以点阵递增数列作经典主例题，明确展示变化量 +2、+3、+4 的图形依据；增加关键突破页、规范解答页、检验页和两个同构变式。教师提示同步写入每页追问与预期回答。

- [ ] **Step 4: 重建并验证 PPT**

运行：

```powershell
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\build-week01-ppt.py'
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\test_build_week01_ppt.py'
```

预期：PPT 重建成功，校验无输出且退出码为 0；PPT 页数保持 22–28 页。

### Task 3: 交付核对

**Files:**
- Verify: `courses/primary-math-tutoring/MISSION.md`
- Verify: `courses/primary-math-tutoring/NOTES.md`
- Verify: `courses/primary-math-tutoring/reference/annual-course-map.html`
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 核对比例与测试安排未回退**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\MISSION.md','E:\project\AI-Agent\courses\primary-math-tutoring\reference\annual-course-map.html' -Pattern '40%|60%|B 版|24|36|12'
```

预期：40%/60% 比例、B 版测试和 24/36/12 编排仍存在。

- [ ] **Step 2: 检查差异范围**

运行：

```powershell
git status --short -- 'courses/primary-math-tutoring' 'docs/superpowers'
```

预期：只显示数学课程文件和本次设计/计划文件；不暂存、不提交、不推送。

## 自检结果

- 规格覆盖：Task 1 覆盖两类课的题目来源和课堂结构；Task 2 覆盖 PPT 完整例题链；Task 3 覆盖原有比例、测试规则与工作区边界。
- 占位符检查：计划已指定题目来源、每个文件和验证命令，没有遗留空白执行项。
- 一致性检查：所有新要求均保持“课内为锚点、举一反三为迁移”，不改变 B 版测试安排。
