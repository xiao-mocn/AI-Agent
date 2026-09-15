# 小学三年级数学辅导课程重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将小学三年级数学辅导调整为每周两次、课内进阶 40% 与《举一反三》思维专题 60% 的完整课程，并交付首周合并教师 PPT。

**Architecture:** 课程档案记录新的教学使命和可持续的课后反馈规则；年度路线图单独维护主题、比例和 B 版测试节点；每周 PPT 作为唯一课堂呈现物，含两个独立的授课模块。课内内容跟随学校实际进度，思维专题按《举一反三》目录推进，阶段测试不重编试卷。

**Tech Stack:** Markdown、HTML、PowerPoint（`.pptx`）、现有 `courses/primary-math-tutoring/` 课程目录。

---

## 文件结构

| 文件 | 职责 |
| --- | --- |
| `courses/primary-math-tutoring/MISSION.md` | 记录 40%/60%、每周两次课和适用边界。 |
| `courses/primary-math-tutoring/NOTES.md` | 记录 PPT 风格、测试来源和课堂记录要求。 |
| `courses/primary-math-tutoring/learning-records/0002-rebalanced-course-goals.md` | 留存诊断结论与课程方向变更。 |
| `courses/primary-math-tutoring/reference/annual-course-map.html` | 教师用年度主题图：60 次新内容、12 次测评/复盘、4 个 B 版测试节点。 |
| `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx` | 首周合并教师 PPT，包含两次可独立授课的课堂模块。 |
| `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md` | 与 PPT 对应的教师讲授提示、提问语和出口题观察点。 |

### Task 1: 更新课程使命与教学约定

**Files:**
- Modify: `courses/primary-math-tutoring/MISSION.md`
- Modify: `courses/primary-math-tutoring/NOTES.md`
- Create: `courses/primary-math-tutoring/learning-records/0002-rebalanced-course-goals.md`

- [ ] **Step 1: 在 MISSION 的 Success looks like 中加入可量化的课程成功标准**

加入“每周两次课”“新授内容按课内 40% / 思维专题 60% 编排”“学生能说明规律或数量关系的依据”三个标准；保留不超前系统学习和不以刷题替代理解的限制。

- [ ] **Step 2: 在 MISSION 的 Constraints 中固定测试与进度边界**

写明课内主题以学校进度为准；4 个阶段测试只使用《举一反三》B 版对应测试；测试后的讲评必须记录错误类型、有效引导语和下一步调整。

- [ ] **Step 3: 在 NOTES 的当前教学约定中加入 PPT 规范**

写入“每周一份合并教师 PPT、两个独立模块、任务钩子—看见关系—闯关练习—暂停思考—方法命名—出口题”的固定课堂结构；写明不使用大段文字或先给完整答案的呈现方式。

- [ ] **Step 4: 创建目标调整学习记录**

写入如下内容，说明它基于用户对首轮随堂测试“偏简单”的反馈，而非将其错误归因于学生：

```markdown
# 调整小学三年级数学辅导课程目标

首轮随堂测试显示，原先的诊断题对学生挑战不足。课程改为每周两次：新授内容中 40% 用于紧贴校内进度的进阶理解，60% 用于《举一反三》专题，以提升观察、建模、验证和表达能力。

## Implications

- 课内内容不重复基础练习，而是围绕数量关系、图示建模、方法选择和检验设计进阶任务。
- 《举一反三》用“数数图形”做短热身，正式从“找规律”开始；B 版测试作为阶段测评。
- 每周 PPT 将两次课合并，并用出口题和课后记录调节后续难度。
```

- [ ] **Step 5: 验证档案内容**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\MISSION.md','E:\project\AI-Agent\courses\primary-math-tutoring\NOTES.md','E:\project\AI-Agent\courses\primary-math-tutoring\learning-records\0002-rebalanced-course-goals.md' -Pattern '40%|60%|每周两次|B 版|出口题'
```

预期：三份文件均命中对应的新约定。

### Task 2: 创建教师用年度课程路线图

**Files:**
- Create: `courses/primary-math-tutoring/reference/annual-course-map.html`

- [ ] **Step 1: 建立路线图的总览区**

使用简洁可打印的 HTML，明确 72 次课的构成：24 次课内进阶、36 次《举一反三》专题、12 次 B 版测试/讲评/错题迁移。总览须解释比例只计算新内容课。

- [ ] **Step 2: 写入五周循环模板**

按下表呈现 10 次新内容的顺序，并注明课内课应替换为当时学校正在学或刚学完的单元：

| 周次 | 第 1 次课 | 第 2 次课 |
| --- | --- | --- |
| 1 | 课内同步进阶 | 思维专题 |
| 2 | 思维专题 | 课内同步进阶 |
| 3 | 思维专题 | 思维专题 |
| 4 | 课内同步进阶 | 思维专题 |
| 5 | 思维专题 | 课内同步进阶 |

- [ ] **Step 3: 列出 36 个思维专题与测试节点**

按《举一反三》目录列出：数数图形（热身）、找规律、加减巧算、巧添符号、算式猜谜、填数游戏、火柴棒游戏、周期问题、和差问题、解决问题（一）、解决问题（二）、植树问题、数字趣谈、重叠问题、巧算周长、简单列举、等量代换（一）、等量代换（二）、乘法速算、“对应”解题、错中求解、盈亏问题、有余除法、文字算式、和倍问题、差倍问题、年龄问题、页码问题、还原问题、鸡兔同笼、平均数问题（一）、平均数问题（二）、逻辑推理、面积计算、最佳安排、抽屉原理。

在第 9、18、27、36 个专题之后分别标记 B 版期中测试（一）、期末测试（一）、期中测试（二）、期末测试（二）；每个标记后写明“下一次课：讲评与错题迁移”。

- [ ] **Step 4: 为 8 个课内单元定义进阶方向**

对应教材目录分别写入：混合运算与数量关系（一）—关系建模与检验；一天的时间—时间线与区间推理；两、三位数乘一位数—估算与算理解释；数据收集与整理—分类标准与图表解读；长度单位—单位换算与估测；平移、旋转和轴对称—变换前后不变量；两、三位数除以一位数—余数意义与验算；数量关系分析（一）/观察物体（二）—多表示建模与空间观察。

- [ ] **Step 5: 验证路线图完整性**

运行：

```powershell
$map = Get-Content -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\reference\annual-course-map.html' -Raw -Encoding UTF8
@('24 次','36 次','12 次','找规律','抽屉原理','B 版期中测试（一）','B 版期末测试（二）') | ForEach-Object { if ($map -notmatch [regex]::Escape($_)) { throw "路线图缺少：$_" } }
```

预期：命令无输出且退出码为 0。

### Task 3: 编写首周 PPT 的课堂内容与教师讲授提示

**Files:**
- Create: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md`

- [ ] **Step 1: 编写第 1 次课“混合运算与数量关系的进阶建模”提示**

固定 40–45 分钟：用两种不同买法的文具问题作任务钩子；指导学生用线段图或关系表表达“总价—单价—数量”；设置一道估算与逆向检验的变式出口题。教师提示中必须包含追问“这个数在题目中表示什么？”和“换一种表示方法，关系变了吗？”。

- [ ] **Step 2: 编写第 2 次课“找规律”提示**

固定 40–45 分钟：先用“数数图形”中的一题作 5 分钟热身；再用图形/数列变化任务引导“观察—描述—猜想—验证—表达”五步。出口题要求学生写出规则并说明至少一个验证例。

- [ ] **Step 3: 编写课堂观察记录区**

为两次课分别预留“学生第一反应、是否能解释依据、卡点、有效引导语、下次调整”五项，和 NOTES 中的课后模板保持同一语义。

- [ ] **Step 4: 验证教学提示结构**

运行：

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns-notes.md' -Pattern '任务钩子|暂停思考|出口题|这个数在题目中表示什么|观察—描述—猜想—验证—表达'
```

预期：五项结构均被检出。

### Task 4: 生成首周合并教师 PPT

**Files:**
- Create: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`

- [ ] **Step 1: 建立整份 PPT 的视觉语言**

封面写“第 1 周｜看见关系，发现规律”，并在目录页将两次课展示为两张任务卡。使用留白充足的浅色背景、深色正文、单一强调色和少量数学语义图形（线段、点阵、箭头、方格）；不使用无关卡通、复杂纹理或密集段落。

- [ ] **Step 2: 制作第 1 次课模块（10–13 页）**

按“任务钩子 → 看见关系 → 两种表示 → 闯关练习 → 暂停思考 → 方法命名 → 出口题 → 教师复盘”排列。题目页只显示题干和必要图示；解法页独立出现，并同时给出算式、图示与一句理由。

- [ ] **Step 3: 制作第 2 次课模块（10–13 页）**

按“5 分钟热身 → 规律挑战 → 描述变化 → 猜想与验证 → 闯关练习 → 暂停思考 → 方法命名 → 出口题 → 教师复盘”排列。至少包含一种图形规律与一种数列或操作规律，且答案不与题目同页出现。

- [ ] **Step 4: 加入课堂节奏和辅助元素**

为每个模块添加时间提示、独立思考标记和讨论提示；在“暂停思考”页保留明显的书写/口述空间；在最后一页列出教师记录项，不投放给学生时可跳过。

- [ ] **Step 5: 导出并进行视觉检查**

将 PPT 渲染为逐页预览图，检查：文字没有被裁切；每页只有一个主要数学关系；题目页没有泄露答案；两模块标题和视觉风格一致；总页数为 22–28 页。修复发现的问题后再保留最终 `.pptx`。

### Task 5: 完整性核对与交付

**Files:**
- Verify: `courses/primary-math-tutoring/MISSION.md`
- Verify: `courses/primary-math-tutoring/NOTES.md`
- Verify: `courses/primary-math-tutoring/learning-records/0002-rebalanced-course-goals.md`
- Verify: `courses/primary-math-tutoring/reference/annual-course-map.html`
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns.pptx`
- Verify: `courses/primary-math-tutoring/slides/0002-week-01-quantity-modeling-and-patterns-notes.md`

- [ ] **Step 1: 检查文件存在且目录边界正确**

运行：

```powershell
$files = @(
  'E:\project\AI-Agent\courses\primary-math-tutoring\MISSION.md',
  'E:\project\AI-Agent\courses\primary-math-tutoring\NOTES.md',
  'E:\project\AI-Agent\courses\primary-math-tutoring\learning-records\0002-rebalanced-course-goals.md',
  'E:\project\AI-Agent\courses\primary-math-tutoring\reference\annual-course-map.html',
  'E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns.pptx',
  'E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns-notes.md'
)
$files | ForEach-Object { if (-not (Test-Path -LiteralPath $_)) { throw "缺少文件：$_" } }
```

预期：命令无输出且退出码为 0。

- [ ] **Step 2: 检查工作区差异范围**

运行：

```powershell
git status --short -- 'courses/primary-math-tutoring' 'docs/superpowers'
```

预期：仅显示本计划中列出的数学课程文件及本设计/实施计划；不暂存、不提交、不推送任何文件，等待用户决定版本控制动作。

## 自检结果

- 规格覆盖：Task 1 落实目标和教学约定；Task 2 覆盖完整主题、40%/60% 比例、B 版测试；Task 3–4 覆盖“合并 PPT、简洁、生动、完整、清晰、有启发”；Task 5 处理文件和视觉交付检查。
- 占位符检查：计划已明确首周主题、每个交付文件和验证命令，没有遗留空白执行项。
- 一致性检查：所有文件位于 `courses/primary-math-tutoring/`，PPT、教师提示与课程档案使用同一首周主题和相同的两课结构。
