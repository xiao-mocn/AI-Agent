# 小学三年级数学连续双课时学习闭环实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用连续 120 分钟双课时、错因码和难度决策规则，使每周课程能根据学生表现稳定调整。

**Architecture:** `SYLLABUS.md` 定义课程总则和年度路标；`ERROR-DIAGNOSTIC.md` 定义诊断码与调整阈值；MISSION、NOTES 和年度路线图同步改为“第 1 节复习与新课、第 2 节测试与预习”；首周 PPT 反映相同顺序。

**Tech Stack:** Markdown、HTML、Python `python-pptx`、PowerPoint `.pptx`。

---

### Task 1: 固化课程操作系统

**Files:**
- Create: `courses/primary-math-tutoring/SYLLABUS.md`
- Create: `courses/primary-math-tutoring/reference/ERROR-DIAGNOSTIC.md`
- Modify: `courses/primary-math-tutoring/MISSION.md`
- Modify: `courses/primary-math-tutoring/NOTES.md`
- Modify: `courses/primary-math-tutoring/reference/annual-course-map.html`

- [ ] **Step 1: 写入连续双课时结构**

固定每周一次、连续两节、共 120 分钟：第 1 节 12 分钟复习与错因诊断、48 分钟新内容；第 2 节 42 分钟检测讲评与迁移、18 分钟预习。

- [ ] **Step 2: 写入错因码**

定义 E1 运算顺序、E2 条件/数量关系、E3 单位答语/合理性、E4 图示建模、E5 规律表达、E6 检验、E7 概念基础；每周只从上次检测、B 版微练习和校内作业中选 1–2 码处理。

- [ ] **Step 3: 写入难度决策表**

按“结果正确、能说明理由、能独立检验”记录：三项达标进入下一专题；缺解释或检验则下周复习；错误或两次以上提示则第二节低门槛重建后再测；同码连续两周则暂停加难题。

- [ ] **Step 4: 扩展课后记录模板**

在 NOTES 的课后记录中新增“错因码、三项表现、下周决策、检测题来源”字段。

### Task 2: 对齐首周学生 PPT

**Files:**
- Modify: `courses/primary-math-tutoring/slides/build-week01-ppt.py`
- Modify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md`
- Modify: `courses/primary-math-tutoring/slides/test_build_week01_ppt.py`
- Regenerate: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 写失败校验**

断言第 1 节含“易错点检测”和“新内容经典例题”，第 2 节含“新内容检测”和“课末预习”，并且检测页在第 1 节例题之后。

- [ ] **Step 2: 调整 PPT 顺序**

第 1 节保留运算顺序/数量关系易错诊断和“对齐数量后消去”主例题；第 2 节移除新的完整主例题，改为对第 1 节方法的独立检测、讲评、迁移检测，再以“两、三位数乘一位数”收尾预习。

- [ ] **Step 3: 更新教师提示**

在 notes 中写出本周的 E1、E2、E6 观察点和对应判定规则；保留教师用答案与记录，不写入学生 PPT。

- [ ] **Step 4: 重建并验证**

运行：

```powershell
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\build-week01-ppt.py'
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\test_build_week01_ppt.py'
```

预期：PPT 重建成功，测试无输出且退出码为 0。

### Task 3: 最终核对

**Files:**
- Verify: `courses/primary-math-tutoring/SYLLABUS.md`
- Verify: `courses/primary-math-tutoring/reference/ERROR-DIAGNOSTIC.md`
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 核对关键规则**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\SYLLABUS.md','E:\project\AI-Agent\courses\primary-math-tutoring\reference\ERROR-DIAGNOSTIC.md' -Pattern '120 分钟|E1|E7|三项|连续两周'
```

预期：两个文件均包含可执行规则。

- [ ] **Step 2: 检查差异范围**

运行：

```powershell
git status --short -- 'courses/primary-math-tutoring' 'docs/superpowers'
```

预期：仅显示数学课程与本计划文件；不暂存、不提交、不推送。
