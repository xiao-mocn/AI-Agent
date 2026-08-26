# Power EMS 课程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一个面向 EMS 前端开发者的微电网业务入门课程，并交付可离线学习、可即时反馈的第一节课。

**Architecture:** 课程状态和来源分别保存在 `courses/power-ems/` 的 Markdown 文件中；术语参考和首课为独立 HTML 文件，均可直接在浏览器打开。一个无依赖的 Node.js 校验脚本检查课程必须具备的文件、语义边界、可访问链接和交互契约，防止课件内容与课程设计脱节。

**Tech Stack:** 静态 HTML、CSS、原生浏览器 JavaScript、Markdown、Node.js 内置 `fs` 与 `assert`。

---

### Task 1: 建立可验证的课程骨架

**Files:**
- Create: `courses/power-ems/tests/verify-course.mjs`
- Create: `courses/power-ems/MISSION.md`
- Create: `courses/power-ems/NOTES.md`
- Create: `courses/power-ems/RESOURCES.md`
- Create: `courses/power-ems/reference/microgrid-ems-glossary.html`
- Create: `courses/power-ems/lessons/0001-ems-monitoring-basics.html`

- [ ] **Step 1: 写入会失败的结构校验脚本**

创建 `courses/power-ems/tests/verify-course.mjs`，在课程文件还不存在时让脚本因缺失文件退出。脚本只使用 Node 内置模块，并固定检查课程使命、来源、术语参考、首课、三条权威来源链接、风险边界和互动测验标识。

```js
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('courses/power-ems');
const requiredFiles = [
  'MISSION.md',
  'NOTES.md',
  'RESOURCES.md',
  'reference/microgrid-ems-glossary.html',
  'lessons/0001-ems-monitoring-basics.html',
];

for (const relativePath of requiredFiles) {
  assert.ok(existsSync(resolve(root, relativePath)), `Missing ${relativePath}`);
}

const mission = readFileSync(resolve(root, 'MISSION.md'), 'utf8');
assert.match(mission, /微电网 EMS/);
assert.match(mission, /每天 30 分钟/);

const resources = readFileSync(resolve(root, 'RESOURCES.md'), 'utf8');
assert.match(resources, /nrel\.gov/);
assert.match(resources, /energy\.gov/);
assert.match(resources, /ieee\.org/);

const glossary = readFileSync(resolve(root, 'reference/microgrid-ems-glossary.html'), 'utf8');
for (const term of ['功率', '能量', 'SOC', '并网', '离网', '测点时效']) {
  assert.match(glossary, new RegExp(term));
}

const lesson = readFileSync(resolve(root, 'lessons/0001-ems-monitoring-basics.html'), 'utf8');
for (const requiredText of [
  '功率不是能量',
  '需按项目约定确认',
  '控制指令',
  'answerQuestion',
  'microgrid-ems-glossary.html',
]) {
  assert.match(lesson, new RegExp(requiredText));
}

assert.match(lesson, /<meta charset="UTF-8">/);
assert.match(lesson, /viewport/);
console.log('Power EMS course structure verified.');
```

- [ ] **Step 2: 运行校验，确认它因课程文件缺失而失败**

Run: `node courses/power-ems/tests/verify-course.mjs`

Expected: 退出码非 0，错误文本包含 `Missing MISSION.md`。

- [ ] **Step 3: 创建最小课程状态文件和占位 HTML**

创建目录 `courses/power-ems/reference/` 与 `courses/power-ems/lessons/`，并写入以下最小内容，使结构校验只在内容约束上继续提示缺失。所有中文文件以 UTF-8 保存。

```md
<!-- courses/power-ems/MISSION.md -->
# Mission: 微电网 EMS 业务理解

## Why

在 EMS 前端开发中，能够把监控和控制页面上的字段、状态和告警还原为实际业务含义，和产品、算法、运维完成准确的需求澄清，避免把高风险控制操作做成误导性 UI。

## Success looks like

- 能解释一个微电网监控页中光伏、储能、负荷和电网的角色，以及功率、能量、SOC 的区别。
- 能为字段和操作补全数据来源、单位、时效、状态边界、权限和确认要求。
- 能识别需要按项目约定确认的功率正负号、控制策略与保护限制；后续能将该模型迁移到换电站。

## Constraints

- 每天 30 分钟；优先使用短课、检索练习和当前工作中的页面。
- 当前以微电网为主，换电站业务在微电网核心模型建立后再进入。

## Out of scope

- 输配电网设计、继电保护整定和现场电气安全操作。
- 替代项目需求、设备说明书、控制策略或现场审批。
```

```md
<!-- courses/power-ems/NOTES.md -->
# 教学笔记

## 用户画像

- EMS 前端开发者，前端实现能力已有实践基础，电力行业基础从零开始。
- 微电网是当前主要业务，换电站是后续扩展方向。
- 每天可学习 30 分钟，需要直接能帮助需求澄清和页面开发的内容。

## 教学原则

- 先解释页面可见数据和状态，再扩展到调度与控制。
- 每次只引入一个能立刻用于工作的问题。
- 现场和厂商差异明确标为“需按项目约定确认”。
```

```html
<!-- 两个 HTML 文件先使用完整文档外壳；下一任务补入正文 -->
<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Power EMS</title></head><body></body></html>
```

- [ ] **Step 4: 写入来源目录并完成最小结构**

创建 `RESOURCES.md`，使用下列三项来源和一项社区，条目须保留“用于”说明：

```md
# 微电网 EMS Resources

## Knowledge

- [NREL: Microgrids](https://www.nrel.gov/grid/microgrids.html)
  美国国家可再生能源实验室对微电网结构、运行模式和控制研究的汇总。用于：解释微电网的组成与并网/离网语境。

- [U.S. Department of Energy: Microgrid Portfolio](https://www.energy.gov/oe/microgrid-portfolio)
  美国能源部的微电网项目与技术方向资料。用于：核对微电网定义、韧性和控制目标。

- [IEEE 2030.7 Working Group](https://standards.ieee.org/ieee/2030.7/5728/)
  微电网控制器功能标准的发布页。用于：理解 EMS/微电网控制的功能边界；标准全文按组织授权获取。

## Wisdom (Communities)

- 项目内：与产品、算法和运维共同完成一次真实监控页走查。
  用于：确认项目的测点命名、功率正负号、状态机、权限和告警升级规则。

## Gaps

- 当前课程不掌握项目的设备说明书、协议点表和控制策略；涉及这些差异时必须标记为“需按项目约定确认”。
```

- [ ] **Step 5: 再次运行校验，确认失败原因已推进到正文约束**

Run: `node courses/power-ems/tests/verify-course.mjs`

Expected: 退出码非 0，错误文本提到术语或首课中的一个缺失内容，而不再出现 `Missing`。

### Task 2: 编写可复用的微电网 EMS 术语参考

**Files:**
- Modify: `courses/power-ems/reference/microgrid-ems-glossary.html`
- Test: `courses/power-ems/tests/verify-course.mjs`

- [ ] **Step 1: 以术语需求驱动正文**

在 `microgrid-ems-glossary.html` 中提供以下六个固定术语卡：`功率`、`能量`、`SOC`、`并网`、`离网`、`测点时效`。每张卡必须依次给出“页面上如何读”“前端要问什么”“不能自行假设什么”三行信息。

```html
<article class="term-card" id="power">
  <h2>功率 <span>kW / MW</span></h2>
  <p><strong>页面上如何读：</strong>某一时刻能量传递的速率；趋势图通常是瞬时值或短周期平均值。</p>
  <p><strong>前端要问什么：</strong>数值是实时值、平均值还是计划值？正负号各表示流向哪里？</p>
  <p><strong>不能自行假设什么：</strong>功率为正不必然代表“发电”；其方向必须以项目点表和页面约定为准。</p>
</article>
```

- [ ] **Step 2: 补齐术语卡的精确内容**

`能量`说明累计量及常见单位 kWh/MWh；`SOC`说明可用容量比例而非功率；`并网`说明与公共电网电气连接；`离网`说明孤岛运行但不等于停电；`测点时效`说明时间戳、质量码或通信状态决定读数是否适合控制。文末加入一条醒目的说明：功率方向、SOC 可用上下限、状态名称与告警等级均“需按项目约定确认”。

- [ ] **Step 3: 添加可打印的参考样式与锚点**

将样式保持为单页、浅色、紧凑的工业资料风格：使用 CSS 变量定义墨色文字、纸白背景、青绿色强调和琥珀色风险提示；设置 `@media print` 去掉无关交互；为六张术语卡设置稳定 `id`，使首课可用 `#power`、`#energy`、`#soc` 等片段链接。

- [ ] **Step 4: 运行结构校验，确认术语约束通过且只剩首课约束**

Run: `node courses/power-ems/tests/verify-course.mjs`

Expected: 退出码非 0，错误文本指向首课缺少的文本、链接或 `answerQuestion`，不再指向术语文件。

### Task 3: 编写第一节离线互动课

**Files:**
- Modify: `courses/power-ems/lessons/0001-ems-monitoring-basics.html`
- Test: `courses/power-ems/tests/verify-course.mjs`

- [ ] **Step 1: 组织首课的教学路径**

标题使用“第 1 课：读懂 EMS 监控页的功率、能量、SOC 与运行状态”。正文按以下顺序组织，避免一次引入调度算法：

1. 场景：监控页显示光伏 420 kW、储能 -180 kW、负荷 510 kW、电网 270 kW、SOC 63%。
2. “功率不是能量”：功率回答此刻流动多快，能量回答一段时间累计多少。
3. 四设备能量流图：光伏、储能、负荷、电网，通过箭头说明这是示意且方向约定需按项目确认。
4. SOC 与状态：SOC 是容量比例；并网/离网是系统连接状态；都不能单独决定是否允许控制。
5. 前端走查清单：点位单位、符号约定、数据时间戳、质量码/通信状态、权限、二次确认与审计。
6. 两道情景题、推荐资源及向教师提问的提示。

- [ ] **Step 2: 实现响应式工业学习页和能量流示意**

使用一个独立的 `<style>` 块实现：最大阅读宽度 900px、浅灰白背景、近黑文字、绿色表示正常、琥珀色表示“需确认”。能量流图使用 HTML 元素和文字箭头，不使用 SVG；在窄屏下改为单列布局。图中明确显示“储能 -180 kW（方向需确认）”，避免把负号解释为放电或充电。

```html
<section class="flow-panel" aria-labelledby="flow-title">
  <div class="section-kicker">监控页拆解</div>
  <h2 id="flow-title">先看角色，再问方向</h2>
  <div class="flow-grid">
    <div class="asset solar"><strong>光伏</strong><span>420 kW</span></div>
    <div class="connector">数据方向<br>需确认</div>
    <div class="asset storage"><strong>储能</strong><span>-180 kW</span></div>
    <div class="connector">服务于</div>
    <div class="asset load"><strong>负荷</strong><span>510 kW</span></div>
    <div class="connector">与之交换</div>
    <div class="asset grid"><strong>电网</strong><span>270 kW</span></div>
  </div>
  <p class="caution">这是一张读页面的角色图，不是潮流计算结果。功率正负号和箭头方向需按项目约定确认。</p>
</section>
```

- [ ] **Step 3: 实现即时反馈的检索题**

加入两道题，每题用四个信息量接近的选项，并在选择后禁用同题按钮、标记对错、显示解释。题目一正确答案为“功率描述此刻传递速率”，题目二正确答案为“先核对点位定义、时间戳和质量状态”。使用下列函数统一处理反馈：

```js
function answerQuestion(questionId, button, correct, explanation) {
  const question = document.getElementById(questionId);
  if (question.dataset.answered) return;
  question.dataset.answered = 'true';

  question.querySelectorAll('button').forEach((item) => {
    item.disabled = true;
  });
  button.classList.add(correct ? 'is-correct' : 'is-wrong');

  const feedback = question.querySelector('[data-feedback]');
  feedback.textContent = explanation;
  feedback.className = `feedback ${correct ? 'is-correct' : 'is-wrong'}`;
}
```

- [ ] **Step 4: 完成引用、边界与课程内链接**

在“推荐资源”中使用 `RESOURCES.md` 的 NREL Microgrids 作为主资源，并在正文至少一次链接到 `../reference/microgrid-ems-glossary.html#power`、`#energy`、`#soc`。添加完整的安全边界文本：`任何控制指令的可用性、限值和联锁，必须以当前项目的策略、权限和现场审批为准；本课不构成操作指令。` 添加“有疑问请直接问我，并带上页面截图或字段名”的提示。

- [ ] **Step 5: 运行课程校验，确认全部断言通过**

Run: `node courses/power-ems/tests/verify-course.mjs`

Expected: `Power EMS course structure verified.`，退出码 0。

### Task 4: 做离线质量检查并交付

**Files:**
- Verify: `courses/power-ems/tests/verify-course.mjs`
- Verify: `courses/power-ems/reference/microgrid-ems-glossary.html`
- Verify: `courses/power-ems/lessons/0001-ems-monitoring-basics.html`

- [ ] **Step 1: 检查 HTML 的关键语义与链接目标**

Run:

```powershell
$files = @(
  'courses/power-ems/reference/microgrid-ems-glossary.html',
  'courses/power-ems/lessons/0001-ems-monitoring-basics.html'
)
foreach ($file in $files) {
  $content = Get-Content -LiteralPath $file -Encoding UTF8 -Raw
  if ($content -notmatch '<!DOCTYPE html>' -or $content -notmatch '<meta charset="UTF-8">' -or $content -notmatch '<meta name="viewport"') {
    throw "Invalid document shell: $file"
  }
}
'HTML document shells verified.'
```

Expected: `HTML document shells verified.`，退出码 0。

- [ ] **Step 2: 运行全量课程结构校验**

Run: `node courses/power-ems/tests/verify-course.mjs`

Expected: `Power EMS course structure verified.`，退出码 0。

- [ ] **Step 3: 检查工作区状态，不暂存、不提交**

Run: `git status --short`

Expected: 显示设计文档、计划文档和新课程文件；不执行 `git add`、`git commit`、`git push`，由用户后续审阅后决定。

## 计划自检

- 设计文档的目标、30 分钟约束、微电网优先、换电站后置、术语参考、首课互动、来源引用与控制安全边界均映射到任务 1 至任务 4。
- 本计划不含未完成占位标记或未定义的后续实现。
- `verify-course.mjs` 中的文件路径、页面标题和关键字符串与任务 1 至任务 3 一致。
- 首课只处理监控语义，不越界讲解现场操作或控制策略执行。
