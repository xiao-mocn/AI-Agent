# AI 全栈第 47 课重写实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将第 47 课更新为基于 Spring Boot 4.1.1 与 Java 21 的最小 `/health` 外部契约实践课。

**Architecture:** 单一自包含 HTML 课程页，按“脱稿设计 → 分层实践 → 两层验证 → 变式练习”组织。课程采用自定义 Controller 保持 Node.js 的 `GET /health` 契约；Actuator 仅作为下一课的边界说明。

**Tech Stack:** UTF-8 HTML、CSS、原生 JavaScript、Java 21、Spring Boot 4.1.1、Spring MVC、JUnit Jupiter、MockMvc、PowerShell。

---

### Task 1: 校准技术基线与课程边界

**Files:**
- Read: `docs/superpowers/specs/2026-08-26-ai-fullstack-lesson-47-rewrite-design.md`
- Read: `courses/ai-fullstack/learning-records/0048-completed-lesson-46.md`
- Modify: `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`

- [ ] **Step 1: 固定课程元数据**

将页面标题、页内 H1 和课程元信息设为以下内容，避免继续出现 Spring Boot 3.5.x：

```html
<title>第四十七课：Spring Boot 4 项目骨架与健康契约</title>
<h1>第四十七课：Spring Boot 4 项目骨架与健康契约</h1>
<p class="meta">目标时长 60 分钟 · Java 副线起点 · Spring Boot 4.1.1 · Java 21</p>
```

- [ ] **Step 2: 写明外部行为边界**

在“本课目标”中固定以下契约，并明确它不检查数据库、缓存、LLM 或任何密钥：

```text
GET /health → HTTP 200 → {"status":"ok"}
```

- [ ] **Step 3: 链接一手资料**

在页面的“依据与延伸”部分加入 Spring Boot 官方系统要求、测试文档、应用可用性文档的可点击链接；说明 4.1.1 至少需要 Java 17，因此 Java 21 是本课明确选项。

### Task 2: 构建脱稿驱动的实践课程

**Files:**
- Modify: `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`

- [ ] **Step 1: 加入脱稿设计任务与即时反馈**

实现三个输入框和一个“检查思路”按钮。按钮在任一输入为空时提示完成填写；填写后显示对照要点：路径与方法、`HealthResponse` record、Controller 与 Web 层测试的职责。

```html
<textarea id="contract" placeholder="例如：GET /health 返回什么？"></textarea>
<button type="button" onclick="reviewDesign()">检查思路</button>
<p id="design-feedback" aria-live="polite"></p>
```

- [ ] **Step 2: 给出 Spring Initializr 与目录边界**

列出 Maven、Java、Spring Boot 4.1.1、Group `com.example.ai`、Artifact `java-backend`、Jar、Java 21 和 Spring Web。明确新目录是 `java-backend/`，不得覆盖 `ai-backend/`，不得复制 `.env`、数据库文件或密钥。

- [ ] **Step 3: 先写测试，再写最小实现**

使用 Spring Boot 4 的 Web MVC 测试包名，测试 `GET /health` 的状态码、JSON 内容类型与 `status` 字段：

```java
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;

@WebMvcTest(HealthController.class)
class HealthControllerTest {
    @Autowired MockMvc mvc;

    @Test
    void healthMatchesContract() throws Exception {
        mvc.perform(get("/health"))
           .andExpect(status().isOk())
           .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
           .andExpect(jsonPath("$.status").value("ok"));
    }
}
```

随后给出 `HealthResponse` record 与只返回该 record 的 Controller：

```java
public record HealthResponse(String status) { }

@RestController
class HealthController {
    @GetMapping("/health")
    HealthResponse health() {
        return new HealthResponse("ok");
    }
}
```

- [ ] **Step 4: 加入两层运行验证**

给出测试命令和真实请求命令，并写明预期证据：

```powershell
Set-Location java-backend
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

```powershell
$response = Invoke-RestMethod -Uri 'http://localhost:8080/health'
if ($response.status -ne 'ok') { throw 'health contract mismatch' }
```

### Task 3: 加入检索练习、变式练习与后续边界

**Files:**
- Modify: `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`

- [ ] **Step 1: 增加三题即时反馈测验**

题目分别检查：MockMvc 的验证范围、`/health` 不依赖外部系统的原因、HTTP 契约比内部目录更重要的原因。三道正确选项使用长度相同的中文文案，避免格式泄露答案。

- [ ] **Step 2: 增加变式练习**

要求学习者在不看前文的情况下新增 `GET /version`，返回固定版本号，并为该路由补上状态码、内容类型和 JSON 字段断言。明确这只是本地练习，不要求提交业务代码。

- [ ] **Step 3: 写明下一课边界**

预告第 48 课使用 Actuator 区分应用存活、流量就绪和外部依赖；本课不把数据库或其他外部系统塞进 `/health`，以免故障引发错误重启或掩盖问题。

### Task 4: 验证课程文件

**Files:**
- Test: `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`

- [ ] **Step 1: 验证 UTF-8、HTML 结构与版本信息**

运行：

```powershell
$path = 'courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html'
$html = Get-Content -LiteralPath $path -Encoding UTF8 -Raw
if ($html -notmatch '<!DOCTYPE html>' -or $html -notmatch '<meta charset="UTF-8">') { throw 'invalid html document' }
if ($html -notmatch 'Spring Boot 4\.1\.1' -or $html -match 'Spring Boot 3\.5') { throw 'version baseline mismatch' }
if ($html -notmatch 'org\.springframework\.boot\.webmvc\.test\.autoconfigure\.WebMvcTest') { throw 'missing Boot 4 test import' }
'COURSE_CONTENT_OK'
```

预期输出：`COURSE_CONTENT_OK`。

- [ ] **Step 2: 用 Node.js 解析 HTML**

运行：

```powershell
node -e "const fs=require('fs');const h=fs.readFileSync('courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html','utf8');if(!h.includes('</html>')||!h.includes('function reviewDesign')||!h.includes('function answerQuestion'))process.exit(1);console.log('HTML_PARSE_CHECK_OK')"
```

预期输出：`HTML_PARSE_CHECK_OK`。

- [ ] **Step 3: 打开页面进行人工确认**

运行：

```powershell
Start-Process -FilePath 'E:\project\AI-Agent\courses\ai-fullstack\lessons\0047-spring-boot-skeleton-and-health-check.html'
```

检查中文文本、按钮和代码块是否可读；确认不新增或修改 `java-backend/`、学习记录和其他课程文件。
