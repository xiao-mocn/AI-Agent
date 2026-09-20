# 小学数学思维优先课件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用“加减巧算”替代乘法主课，生成一份以思维提升为主、课内短复习为辅的 120 分钟学生 PPT 和教师提示稿。

**Architecture:** 课程档案说明课内错因复习只占开场，教辅专题承担完整主例题、检测和迁移。学生 PPT 与教师提示分离；自动测试读取新 PPT 文本，防止乘法主课和旧商品消元题再次成为当前辅导内容。

**Tech Stack:** Markdown、HTML、Python 3、python-pptx、unittest、Pillow。

---

### Task 1: 先把思维优先规则写成失败测试

**Files:**
- Modify: `courses/primary-math-tutoring/tests/test_source_alignment.py`
- Test: `courses/primary-math-tutoring/tests/test_source_alignment.py`

- [ ] **Step 1: 将当前课件常量改为新加减巧算课件，并替换断言**

```python
PPT = ROOT / "slides" / "0004-week-02-addition-subtraction-strategies.pptx"

def test_course_archive_keeps_school_review_short_and_thinking_topic_primary(self):
    syllabus = read(ROOT / "SYLLABUS.md")
    resources = read(ROOT / "RESOURCES.md")
    self.assertIn("课内只做短诊断和易错点复现", syllabus)
    self.assertIn("思维专题承担完整主例题、独立检测和迁移", syllabus)
    self.assertIn("数数图形 → 找找规律 → 加减巧算 → 巧添符号", resources)

def test_current_deck_uses_addition_subtraction_as_the_only_main_topic(self):
    text = ppt_text(PPT)
    for marker in ("加减巧算", "数数图形｜复习热身", "巧添符号｜预热", "第 2 节｜独立检测"):
        self.assertIn(marker, text)
    for forbidden in ("两、三位数乘一位数", "购买 A", "对齐一种数量", "教师提示"):
        self.assertNotIn(forbidden, text)
```

- [ ] **Step 2: 运行测试，确认失败原因是新课件和新规则尚未生成**

Run: `python courses/primary-math-tutoring/tests/test_source_alignment.py`
Expected: FAIL，缺少 `0004-week-02-addition-subtraction-strategies.pptx` 且课程档案还未包含思维优先措辞。

### Task 2: 修正课程档案与教师提示

**Files:**
- Modify: `courses/primary-math-tutoring/SYLLABUS.md`
- Modify: `courses/primary-math-tutoring/RESOURCES.md`
- Modify: `courses/primary-math-tutoring/reference/annual-course-map.html`
- Modify: `courses/primary-math-tutoring/slides/0003-week-02-multiplication-foundations-notes.md`
- Create: `courses/primary-math-tutoring/slides/0004-week-02-addition-subtraction-strategies-notes.md`

- [ ] **Step 1: 将课程定位改为“课内短复习、思维主课”**

在 `SYLLABUS.md` 写入：

```markdown
课内只做短诊断和易错点复现，不将学校新单元作为辅导主课；思维专题承担完整主例题、独立检测和迁移。学校进度用于选择复习题和判断概念边界，不机械决定专题顺序。
```

在 `RESOURCES.md` 的已核验材料后增加：

```markdown
## 当前辅导策略

数数图形、找找规律只作短复习或热身；本轮从加减巧算进入，再学习巧添符号。课内作业只用于诊断 E1/E2/E6，不替代思维主专题。
```

- [ ] **Step 2: 更新路线图和乘法草稿状态**

年度路线图当前节点改为：“学校进入第二单元；辅导主专题为加减巧算，课内内容仅作短诊断”。在旧乘法教师稿第一行加“历史草稿，不用于本轮思维辅导”。

- [ ] **Step 3: 写教师提示稿**

新教师稿应包含：24 分钟课内错因题和数数图形短热身；主例题 `457 + 321 + 143 + 479`；检测 `311 + 137 + 89 + 63`；迁移 `324 + (276 - 155)`；预热 `1 2 3 4 5 = 10`。每题写答案、关键追问和 E1/E5/E6 判断，不向学生 PPT 泄露教师提示。

- [ ] **Step 4: 运行档案断言，确认通过**

Run: `python courses/primary-math-tutoring/tests/test_source_alignment.py`
Expected: 课程档案相关测试通过；PPT 测试仍因新 PPT 尚未生成而失败。

### Task 3: 生成加减巧算学生 PPT

**Files:**
- Create: `courses/primary-math-tutoring/slides/build-week02-addition-subtraction-ppt.py`
- Create: `courses/primary-math-tutoring/slides/0004-week-02-addition-subtraction-strategies.pptx`
- Test: `courses/primary-math-tutoring/tests/test_source_alignment.py`

- [ ] **Step 1: 使用现有 `python-pptx` 卡片布局生成 18 页学生版**

依次创建：封面、闭环路线、课内短诊断、诊断反馈、数数图形复习热身、热身反馈、主例题、静想、凑整配对分析、规范解答、减加凑整、连续减法改写、方法卡、独立检测、检测反馈、带括号迁移检测、迁移反馈、巧添符号预热。

关键页面文字为：

```text
主例题：457 + 321 + 143 + 479
看见结构：457 + 143 = 600；321 + 479 = 800
独立检测：311 + 137 + 89 + 63
迁移检测：324 + (276 − 155)
课末预习：1 2 3 4 5 = 10
```

学生版只能在静想或检测题后显示答案；不包含“教师提示”“乘法主例题”“购买 A”。

- [ ] **Step 2: 运行生成器和测试**

Run: `python courses/primary-math-tutoring/slides/build-week02-addition-subtraction-ppt.py; python courses/primary-math-tutoring/tests/test_source_alignment.py`
Expected: 生成 18 页 PPT；所有 `unittest` 测试通过。

### Task 4: 视觉与最终验证

**Files:**
- Verify: `courses/primary-math-tutoring/slides/0004-week-02-addition-subtraction-strategies.pptx`
- Create: `courses/primary-math-tutoring/slides/rendered-week02-addition-subtraction/week02-grid.jpg`

- [ ] **Step 1: 用本机 PowerPoint 将 18 页导出为 PNG，再用 `render_slide_grid.py --cols 4` 生成缩略图网格**

Expected: 网格含 18 页，题目页位于反馈页前，文字在卡片内，无教师用信息。

- [ ] **Step 2: 运行最终验证**

Run: `python courses/primary-math-tutoring/tests/test_source_alignment.py; python courses/primary-math-tutoring/slides/test_build_week01_ppt.py; git diff --check`
Expected: 全部通过；保留旧乘法草稿和无关英语文件，不提交 Git。
