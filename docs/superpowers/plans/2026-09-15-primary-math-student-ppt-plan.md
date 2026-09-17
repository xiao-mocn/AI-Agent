# 小学三年级数学学生课堂演示稿实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首周 PPT 改为只面向学生的逐页揭示课堂演示稿。

**Architecture:** `.pptx` 只保留学生可见的题目、静想、分析、扩展、检测反馈和课末预习；教师追问与课堂记录继续存放在独立的 notes 文件。生成脚本以页面顺序表达“先思考、后显示”的课堂节奏，测试脚本以文本标记和禁止词保证边界。

**Tech Stack:** Python `python-pptx`、PowerPoint `.pptx`、Markdown。

---

### Task 1: 建立学生版 PPT 的失败校验

**Files:**
- Modify: `courses/primary-math-tutoring/slides/test_build_week01_ppt.py`

- [ ] **Step 1: 增加学生可见流程断言**

断言 PPT 同时存在“静想一下”“检测反馈”“课内模块｜课末预习”“思维模块｜课末预习”，并且每个检测反馈页在对应检测页之后。

- [ ] **Step 2: 增加教师内容禁止词断言**

断言 PPT 文本不包含“教师版”“教师复盘”“记录学生”“下次调整”“教师提示”。

- [ ] **Step 3: 运行测试确认失败**

运行：

```powershell
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\test_build_week01_ppt.py'
```

预期：当前 PPT 因教师内容或检测反馈缺失而失败。

### Task 2: 重构 PPT 为学生课堂演示稿

**Files:**
- Modify: `courses/primary-math-tutoring/slides/build-week01-ppt.py`
- Modify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md`
- Regenerate: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 清除教师可见页面与措辞**

删除 PPT 中的教师版标识和两张教师复盘页；将任何“教师”“记录”“下次调整”类文本移至 notes 文件，不放进 PPT。

- [ ] **Step 2: 增加静想页与逐页解答**

在两道主例题后插入“静想一下”页，要求学生画图、列表或写猜想；分析页、规范解答页只出现在静想页之后。

- [ ] **Step 3: 增加检测反馈页**

在每个独立检测页后新增一页“检测反馈”，呈现结果和一句验证理由，不与检测题同页。

- [ ] **Step 4: 保留课末预习页**

保留两个时间线预习页，并确保它们分别位于两个课堂模块的最后一个学生教学页面；不添加计算答案。

- [ ] **Step 5: 更新教师提示边界**

在 notes 文件顶部注明“PPT 为学生演示稿；本文件仅供教师使用”，并保留追问、答案和课堂观察记录。

### Task 3: 重建与交付核对

**Files:**
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`
- Verify: `courses/primary-math-tutoring/slides/test_build_week01_ppt.py`

- [ ] **Step 1: 重建并运行校验**

运行：

```powershell
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\build-week01-ppt.py'
python 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\test_build_week01_ppt.py'
```

预期：PPT 重建成功，测试无输出且退出码为 0。

- [ ] **Step 2: 核对页数与工作区**

运行：

```powershell
python -c "from pptx import Presentation; p=Presentation(r'E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns.pptx'); print(len(p.slides))"
git status --short -- 'courses/primary-math-tutoring' 'docs/superpowers'
```

预期：PPT 为 22–28 页；仅显示本次课程及设计/计划文件，且不暂存、不提交、不推送。

## 自检结果

- 规格覆盖：Task 1 保证学生版边界，Task 2 落实逐页揭示，Task 3 验证交付文件。
- 占位符检查：每个学生版页面类型、禁止词和验证命令均已明确。
- 一致性检查：教师内容只存在于 notes 文件，PPT 始终按“先思考、后显示”呈现。
