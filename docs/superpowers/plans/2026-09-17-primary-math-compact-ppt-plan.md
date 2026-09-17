# 小学三年级数学紧凑双课时 PPT 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 固化正式教学大纲，并将一周一次、连续两节 60 分钟课的学生 PPT 压缩为总共两道经典例题。

**Architecture:** `SYLLABUS.md` 记录课程目标、20/65/15 时间比例、易错点复习和年度专题路标。学生 PPT 每个 60 分钟模块只保留一条例题链：易错点诊断、主例题、静想、分析、一次扩展、检测与反馈、课末预习；两模块共两道主例题。

**Tech Stack:** Markdown、Python `python-pptx`、PowerPoint `.pptx`。

---

### Task 1: 固化正式教学大纲

**Files:**
- Create: `courses/primary-math-tutoring/SYLLABUS.md`

- [ ] **Step 1: 写入课程总则**

记录一周一次连续两节课、每节 60 分钟，以及 20% 校内易错点与提升、65% 思维例题、15% 课末预习。

- [ ] **Step 2: 写入课堂固定流程**

每节课按“方法卡/易错点诊断—主例题—静想—分析—一次扩展—检测与反馈—课末预习”执行；说明每周合并 PPT 总共只使用两道主例题。

- [ ] **Step 3: 写入年度主题与测评规则**

列出运算规律、乘法、数据长度、图形、除法、综合应用和高阶思维七个阶段；保留 B 版阶段测试、微练习、机动周和期末冲刺。

### Task 2: 压缩首周学生 PPT

**Files:**
- Modify: `courses/primary-math-tutoring/slides/build-week01-ppt.py`
- Modify: `courses/primary-math-tutoring/slides/test_build_week01_ppt.py`
- Regenerate: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 写失败校验**

在测试中限制 PPT 有且仅有两处“经典例题”主标题，且总页数不超过 20 页。

- [ ] **Step 2: 保留两条主例题链**

第 1 节保留“对齐数量后消去未知量”，第 2 节保留“三角点阵递增”。每条链最多 8 页，包含易错点小诊断、主例题、静想、分析、一次扩展、检测、反馈和预习。

- [ ] **Step 3: 删除重复内容**

删除总览、重复解释、第二道完整变式、重复答案页和非必要的课堂标签；检测反馈只保留一条关键依据。

- [ ] **Step 4: 重建并验证**

运行：

```powershell
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\build-week01-ppt.py'
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\test_build_week01_ppt.py'
```

预期：PPT 为 14–20 页，存在两条主例题链，学生版禁止词校验继续通过。

### Task 3: 核对交付

**Files:**
- Verify: `courses/primary-math-tutoring/SYLLABUS.md`
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 核对大纲与 PPT**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\SYLLABUS.md' -Pattern '20%|65%|15%|两道主例题|易错点'
python -c "from pptx import Presentation; p=Presentation(r'E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns.pptx'); print(len(p.slides))"
```

预期：大纲包含关键规则，PPT 页数为 14–20。

- [ ] **Step 2: 检查工作区**

运行：

```powershell
git status --short -- 'courses/primary-math-tutoring' 'docs/superpowers'
```

预期：仅有本次数学课程与计划文件改动；不暂存、不提交、不推送。
