# 第 40 课部署后烟雾测试与回滚判定 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一份可在 1 小时内完成的单页 HTML 课程，教授部署后烟雾测试、停止条件和回滚判定。

**Architecture:** 课程沿用第 39 节的内嵌 CSS 与内容结构，避免引入运行时依赖。内容以 Render 为例，但命令和检查清单保持平台无关；所有请求限于健康探针，避免调用 AI 或写入业务数据。

**Tech Stack:** HTML5、内嵌 CSS、PowerShell 5.1、Render 官方文档。

---

### Task 1: 生成第 40 节课程页面

**Files:**
- Create: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0040-deployment-smoke-tests-and-rollback.html`
- Reference: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0039-production-health-checks-and-observability-boundaries.html`
- Reference: `E:/project/AI-Agent/courses/ai-fullstack/RESOURCES.md`

- [ ] **Step 1: 复制第 39 节的页面外壳与样式**

保留 `lang="zh"`、`charset="UTF-8"`、响应式 viewport，以及以下课程组件的 CSS：`.goal`、`.step`、`.step-num`、`.tip`、`.warn`、`.danger`、`.quiz`。标题改为“第四十课：部署后烟雾测试与回滚判定”。

- [ ] **Step 2: 写入课程主体**

页面必须依次包含：

```html
<div class="goal"><strong>本课你会学到：</strong><ul><li>用三层检查判断发布是否可继续。</li></ul></div>
<h2>一、烟雾测试是发布后的最小证据</h2>
<h2>二、三层验收：存活、就绪、最小业务</h2>
<h2>三、停止与回滚必须先于发布决定</h2>
<h2>四、动手实践</h2>
<div class="step"><span class="step-num">1</span><strong>记录发布版本与观察窗口</strong></div>
<h2>五、验收清单</h2>
<h2>六、本课总结</h2>
<div class="quiz"><h3>思考题</h3><p><strong>Q1</strong>：为什么健康探针通过仍不足以继续发布？</p></div>
<p>下一课将学习<strong>第四十一课：发布证据与变更记录</strong>。</p>
```

四个实践步骤分别为：记录发布版本与观察窗口；检查 `/health` 和 `/ready`；用只读或不产生业务数据的最小请求验证入口；按预先写明的停止与回滚条件行动。探针命令使用如下无敏感值模板：

```powershell
$baseUrl = 'https://your-service.example'
Invoke-WebRequest "$baseUrl/health" | Select-Object StatusCode, Content
Invoke-WebRequest "$baseUrl/ready" | Select-Object StatusCode, Content
```

页面必须明确说明不要用 `POST /api/chat` 作为烟雾测试，原因是它需要 JWT、调用 AI 且可能写入业务数据。引用 Render 官方文档：`https://render.com/docs`。

- [ ] **Step 3: 执行页面结构检查**

Run:

```powershell
Set-Location E:\project\AI-Agent
$lesson = Get-Content -Raw -Encoding UTF8 'courses\ai-fullstack\lessons\0040-deployment-smoke-tests-and-rollback.html'
@('class="goal"', 'class="step"', 'class="quiz"', 'https://render.com/docs', '下一课将学习') |
  ForEach-Object { if ($lesson -notmatch [regex]::Escape($_)) { throw "课程缺少：$_" } }
```

Expected: 命令无输出且退出码为 `0`。

- [ ] **Step 4: 审查页面内容边界**

Run:

```powershell
Set-Location E:\project\AI-Agent
Select-String -Path 'courses\ai-fullstack\lessons\0040-deployment-smoke-tests-and-rollback.html' -Pattern 'DEEPSEEK_API_KEY|JWT_SECRET|DATABASE_URL|POST /api/chat'
```

Expected: 不出现前三个敏感配置名；允许出现 `POST /api/chat`，但仅在明确说明“不要用于烟雾测试”的段落中。
