# 小学三年级数学来源对齐与第二单元首周课件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一份严格衔接学校第二单元“两、三位数乘一位数”的连续双课时学生 PPT，并修正课程档案和教师提示，使所有材料可追溯到学生课本、学校进度和《举一反三》原书目录。

**Architecture:** 课程档案只记录来源、进度和边界；教师提示保存答案、追问与错因判断；学生 PPT 只呈现可观察、可作答的任务。一个 Python 验证脚本读取 Markdown/HTML/PPTX 文本，阻止旧商品价格消元题、错误的单元定位和不完整的课堂闭环重新出现。

**Tech Stack:** Markdown、HTML、Python 3、python-pptx、Pillow、pytest。

---

### Task 1: 写出来源对齐的失败测试

**Files:**
- Create: `courses/primary-math-tutoring/tests/test_source_alignment.py`
- Test: `courses/primary-math-tutoring/tests/test_source_alignment.py`

- [ ] **Step 1: 创建测试，定义课程档案与新 PPT 的不可回退条件**

```python
from pathlib import Path

from pptx import Presentation

ROOT = Path(__file__).resolve().parents[1]
PPT = ROOT / "slides" / "0003-week-02-multiplication-foundations.pptx"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def ppt_text(path: Path) -> str:
    presentation = Presentation(path)
    return "\n".join(
        shape.text
        for slide in presentation.slides
        for shape in slide.shapes
        if hasattr(shape, "text")
    )


def test_course_archive_records_school_progress_and_source_boundary():
    syllabus = read(ROOT / "SYLLABUS.md")
    resources = read(ROOT / "RESOURCES.md")
    assert "第一单元“混合运算与数量关系（一）”与“一天的时间”均已完成" in syllabus
    assert "第二单元“两、三位数乘一位数”" in syllabus
    assert "学生课本照片 > 学校实际进度 > 《小学奥数举一反三》原书" in resources
    assert "数数图形 → 找找规律 → 加减巧算 → 巧添符号" in resources


def test_student_deck_is_a_multiplication_lesson_not_the_retired_elimination_lesson():
    text = ppt_text(PPT)
    assert "两、三位数乘一位数" in text
    assert "把数分成几个百、几个十和几个一" in text
    assert "一天的时间｜快速诊断" in text
    assert "数数图形｜观察热身" in text
    assert "第 2 节｜独立检测" in text
    assert "第 2 节｜课末预习" in text
    assert "购买 A" not in text
    assert "对齐一种数量" not in text
    assert "教师提示" not in text
    assert "商品价格消元" not in text


def test_deck_has_one_main_example_and_answer_pages_follow_question_pages():
    presentation = Presentation(PPT)
    slides = [
        "\n".join(shape.text for shape in slide.shapes if hasattr(shape, "text"))
        for slide in presentation.slides
    ]
    assert 16 <= len(slides) <= 22
    assert sum("主例题" in slide for slide in slides) == 1
    assert next(i for i, slide in enumerate(slides) if "静想一下" in slide) < next(
        i for i, slide in enumerate(slides) if "分解来看" in slide
    )
    assert next(i for i, slide in enumerate(slides) if "第 2 节｜独立检测" in slide) < next(
        i for i, slide in enumerate(slides) if "第 2 节｜检测反馈" in slide
    )
```

- [ ] **Step 2: 运行失败测试，确认目前缺少新档案和新 PPT**

Run: `python -m pytest courses/primary-math-tutoring/tests/test_source_alignment.py -q`
Expected: FAIL，原因是 `0003-week-02-multiplication-foundations.pptx` 以及断言中的来源记录尚不存在。

### Task 2: 修正课程档案并建立教师稿

**Files:**
- Modify: `courses/primary-math-tutoring/SYLLABUS.md`
- Modify: `courses/primary-math-tutoring/RESOURCES.md`
- Modify: `courses/primary-math-tutoring/reference/annual-course-map.html`
- Create: `courses/primary-math-tutoring/slides/0003-week-02-multiplication-foundations-notes.md`

- [ ] **Step 1: 更新进度和来源边界**

在 `SYLLABUS.md` 的课程定位增加以下文字，替换原先模糊的“当前衔接”描述：

```markdown
学生已完成第一单元“混合运算与数量关系（一）”与“一天的时间”全部校内内容；下周开始第二单元“两、三位数乘一位数”。已完成单元只用短诊断复现，不再安排系统新授。第二单元的算理、估算、竖式意义和应用优先于教辅专题。
```

在 `RESOURCES.md` 增加来源优先级和已拍摄材料目录：

```markdown
## 教学来源优先级

学生课本照片 > 学校实际进度 > 《小学奥数举一反三》原书 > 公开资料。公开资料只用于核对版本与目录，不能替代学生手中的书。

## 已核验材料

- 课本《一天的时间》：一天 24 小时、24 时记时法、经过时间、合理安排一天、记时知识拓展；校内已完成，只作短诊断。
- 《小学奥数举一反三》A 版三年级前四周：数数图形 → 找找规律 → 加减巧算 → 巧添符号；本周只取“数数图形”一道观察热身，不替代第二单元乘法。
```

- [ ] **Step 2: 把年度路线图的当前节点改为第二单元启动**

在 `annual-course-map.html` 的“课内单元”之前增加醒目的说明卡，文本为：

```html
<section class="rule"><strong>当前校内节点（2026-09-20）：</strong>第一单元和“⼀天的时间”已经完成；下一周开始第二单元“两、三位数乘一位数”。已完成内容只做短诊断，连续双课时的主例题必须服务当前乘法单元。</section>
```

将原先“数数图形安排在首周第二课的开场热身，与找规律形成一组观察任务”的段落改成“原书前四周顺序保留；当前周仅选数数图形的一道任务热身，不将任何教辅专题替代校内乘法主例题”。

- [ ] **Step 3: 创建教师提示稿，写清 120 分钟答案、追问和调整规则**

`0003-week-02-multiplication-foundations-notes.md` 包含以下固定内容：

```markdown
# 第 2 周教师提示｜两、三位数乘一位数的算理

## 来源与边界

- 学校进度：第一单元和“一天的时间”已完成；本周启动第二单元。
- 本周热身：《举一反三》A 版第 1 周“数数图形”仅 1 题，限 5 分钟。
- 已废弃材料：`0002-week-01-quantity-modeling-and-patterns.*` 的商品价格消元主例题不再授课。

## 24 分钟短诊断

1. `18 − 3 × 4`，答案 6；追问“为什么先算乘法？”（E1）。
2. 图书馆 8:30 开馆、17:00 闭馆，答案 8 小时 30 分；追问“起点和终点分别是什么？”（E2/E6）。

## 36 分钟主例题

题目：学校买 3 盒彩笔，每盒 124 支，一共多少支？

关键表达：`124 = 100 + 20 + 4`；`124 × 3 = 300 + 60 + 12 = 372`。每一部分都要回到“3 盒里有几个百、几个十、几个一”。用估算 `120 × 3 = 360` 检查 372 是否合理。

## 42 分钟检测

- 独立检测：`213 × 4`，答案 852；要求写出估算和竖式/分解中的一种解释。
- 迁移：每排 132 个座位，共 3 排，答案 396 个；先估 `130 × 3`，后解释 `2 × 3` 的来源。
- E1：运算或进位顺序混乱；E2：数位/条件对应错误；E6：不做估算或代回检查。

## 18 分钟预热

情境：每箱 206 瓶水，4 箱约有多少瓶？只收集“先估再算”的想法，不讲竖式算法。
```

- [ ] **Step 4: 运行来源档案测试，确认仍只因 PPT 尚未生成而失败**

Run: `python -m pytest courses/primary-math-tutoring/tests/test_source_alignment.py::test_course_archive_records_school_progress_and_source_boundary -q`
Expected: PASS。

### Task 3: 生成学生课堂 PPTX

**Files:**
- Create: `courses/primary-math-tutoring/slides/build-week02-multiplication-ppt.py`
- Create: `courses/primary-math-tutoring/slides/0003-week-02-multiplication-foundations.pptx`
- Test: `courses/primary-math-tutoring/tests/test_source_alignment.py`

- [ ] **Step 1: 用 `python-pptx` 编写生成器，使用统一 16:9 学生版版式**

生成器使用 `Presentation()`、`Inches(13.333)`、`Inches(7.5)`、Arial 字体与以下颜色：`INK="1F3440"`、`TEAL="126A70"`、`GOLD="E6AA45"`、`PAPER="FBF8F1"`、`MINT="E8F1E8"`、`ROSE="F8E9DE"`。提供 `base()`、`card()`、`text()`、`chip()` 四个小函数，并输出到：

```python
OUT = Path(__file__).with_name("0003-week-02-multiplication-foundations.pptx")
```

按以下顺序生成 18 页；每页答案均晚于对应题目页：

1. 封面：`第 2 周｜乘法里的百、十和一`。
2. 闭环路线：复现、分解、检测、预热。
3. `第 1 节｜已学内容复现`：`18 − 3 × 4` 和图书馆时间题。
4. `一天的时间｜快速诊断`：在时间线上标 8:30 与 17:00。
5. 诊断反馈：6；8 小时 30 分。
6. `数数图形｜观察热身`：5 个点组成一条线，问题“有多少条线段？怎样保证不漏？”。
7. 热身反馈：`4 + 3 + 2 + 1 = 10`，只强调有序记录。
8. `第 1 节｜新内容主例题`：3 盒彩笔、每盒 124 支。
9. `静想一下`：让学生圈出 124 里的百、十、一个位。
10. `分解来看`：`(100 + 20 + 4) × 3` 配 3 组百、十、一个位数量卡。
11. `合起来算`：`300 + 60 + 12 = 372`，逐项解释来源。
12. `估一估，再检查`：`120 × 3 = 360`，372 合理。
13. 方法卡：`分成百、十和一，分别乘，再合起来；先估一估。`
14. `第 2 节｜独立检测`：`213 × 4`，要求写估算和解释。
15. `第 2 节｜检测反馈`：`200×4 + 10×4 + 3×4 = 852`。
16. `第 2 节｜迁移检测`：132 个座位 × 3 排。
17. 迁移反馈：396，并解释 `2×3=6` 代表每排个位上的 2 个座位重复 3 次。
18. `第 2 节｜课末预习`：206 瓶 × 4 箱约多少瓶，只提示“先估再算”。

- [ ] **Step 2: 生成 PPTX**

Run: `python courses/primary-math-tutoring/slides/build-week02-multiplication-ppt.py`
Expected: 输出 `created ...0003-week-02-multiplication-foundations.pptx with 18 slides`。

- [ ] **Step 3: 运行 PPT 与课程对齐测试**

Run: `python -m pytest courses/primary-math-tutoring/tests/test_source_alignment.py -q`
Expected: `3 passed`。

### Task 4: 渲染并核验交付物

**Files:**
- Verify: `courses/primary-math-tutoring/slides/0003-week-02-multiplication-foundations.pptx`
- Verify: `courses/primary-math-tutoring/tests/test_source_alignment.py`

- [ ] **Step 1: 生成四列缩略图网格并目视检查**

Run: `python C:\Users\bao.rg.mo\.agents\skills\powerpoint\scripts\thumbnail.py courses/primary-math-tutoring/slides/0003-week-02-multiplication-foundations.pptx --cols 4 --output_dir courses/primary-math-tutoring/slides/rendered-week02`
Expected: 生成缩略图网格；确认所有文字在卡片内、题目页早于反馈页，且没有教师提示、答案抢跑或商品价格消元内容。

- [ ] **Step 2: 运行最终验证**

Run: `python -m pytest courses/primary-math-tutoring/tests/test_source_alignment.py courses/primary-math-tutoring/slides/test_build_week01_ppt.py -q`
Expected: 新对齐测试通过；旧 PPT 测试仅在旧 PPT 已存在时检查其原有文件，不应修改其历史内容。

- [ ] **Step 3: 检查改动范围**

Run: `git diff --check; git status --short`
Expected: 无空白错误；只包含设计、计划、课程档案、教师提示、新生成器、新 PPT、新测试和缩略图文件，以及本工作前已存在的未跟踪英语课程文件。
