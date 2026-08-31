# AI 全栈第 48 课零基础重写 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将第 48 课改写为一节完整、详细、可验证的后端零基础课程，同时保留运行时配置与就绪检查的原有学习目标。

**Architecture:** 只重写一个独立 HTML 课程文件，不修改 `java-backend/` 中已经通过验证的示例项目。页面按“问题 → 概念 → 最小改动 → 立即验证 → 状态语义 → 巩固”的顺序组织；内嵌少量 JavaScript 提供术语自检和选择题即时反馈。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript；示例环境为 Java 21、Spring Boot 4.1.1、Maven Wrapper、PowerShell 5.1。

---

## 文件结构

- 修改：`courses/ai-fullstack/lessons/0048-runtime-configuration-and-readiness.html` — 第 48 课的完整教学内容、样式和交互。
- 不修改：`java-backend/` — 课程继续以第 47 课已验证的 Maven 项目为起点，避免把“课程内容重写”和“用户工作代码变更”混在一起。
- 不修改：`courses/ai-fullstack/learning-records/0049-completed-lesson-47.md` — 它是已完成课程的历史记录，不应因下一课重写而改写。

### Task 1: 重建零基础教学叙事

**Files:**
- Modify: `courses/ai-fullstack/lessons/0048-runtime-configuration-and-readiness.html`

- [x] **Step 1: 保留页面基础信息并重写学习目标**

将标题保持为“第四十八课：运行时配置与就绪检查”，将预计时长调整为 90–120 分钟。开头使用“服务启动但发布标签为空”的情境，并给出本课完成后能解释的四个问题：配置文件、配置绑定、启动失败、就绪状态。

- [x] **Step 2: 加入后端最小词汇表和必学分层**

在第一次操作前加入“先认识本课的四个角色”小节：`application.properties` 是配置清单，`pom.xml` 是依赖清单，启动类是 Spring Boot 的入口，`AppProperties` 是配置的 Java 表达。加入两个显式标记：

```text
本课必须掌握：配置键、配置绑定、启动时校验、readiness 的含义。
暂时知道即可：Bean Validation 的完整规范、Kubernetes 的部署细节、健康组的高级定制。
```

- [x] **Step 3: 用完整的增量操作替换概念跳跃**

将实践拆为下列连续步骤，每步固定包含“修改哪里”“为什么改”“完整代码”“省略后果”“执行命令”“预期现象”：

1. 在 `pom.xml` 添加 Actuator 和 Validation starter，并解释 starter 是依赖包集合、Maven 会下载并放到测试/运行 classpath。
2. 创建 `src/main/java/com/example/ai/java_backend/config/AppProperties.java`，展示完整 record：

```java
package com.example.ai.java_backend.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(@NotBlank String releaseLabel) { }
```

逐项解释 package、import、record、字段、每个注解以及 kebab-case 配置键与 camelCase Java 字段的对应关系。

3. 在 `JavaBackendApplication.java` 添加 `@ConfigurationPropertiesScan`，展示包含原有 `main` 方法的完整启动类，并说明根包扫描边界。
4. 在 `application.properties` 写入：

```properties
app.release-label=local
management.endpoint.health.probes.enabled=true
management.endpoint.health.probes.add-additional-paths=true
```

解释三行各自的用途，并明确示例绝不能改写为真实密码或 API Key。

- [x] **Step 4: 加入正常与受控失败的双验证**

给出两种 PowerShell 命令和明确的观察重点：

```powershell
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

正常启动后，在另一个 PowerShell 窗口运行：

```powershell
Invoke-RestMethod http://localhost:8080/health
```

再使用只对本次进程生效的临时覆盖命令：

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--app.release-label="
```

课程必须说明该失败是预期结果，日志应指向 `app.release-label` 或 `releaseLabel`，并解释它证明了什么；完成后使用 `Ctrl+C` 退出进程。

### Task 2: 解释健康端点的运行语义

**Files:**
- Modify: `courses/ai-fullstack/lessons/0048-runtime-configuration-and-readiness.html`

- [x] **Step 1: 区分自定义 `/health` 与 Actuator 端点**

以对照表写清楚：`/health` 是本项目第 47 课创建、面向当前最小契约的接口；`/actuator/health/readiness` 是 Actuator 提供的就绪状态端点；`/readyz` 是为平台探针增加的主端口别名。避免宣称三者内容或职责完全相同。

- [x] **Step 2: 添加 readiness 验证与状态解释**

在正常启动步骤后加入：

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health/readiness
Invoke-RestMethod http://localhost:8080/readyz
```

写明预期 JSON 含有 `"status":"UP"`，并解释 `UP` 只表示当前健康组认为实例可服务，不代表所有业务场景永久正确。

- [x] **Step 3: 用平台动作解释 liveness 与 readiness**

加入对照内容：liveness 回答“进程自身是否需要重启”，readiness 回答“负载均衡器是否应将请求转给此实例”。明确当前课程不探测数据库和 LLM：共享依赖短暂故障时重启全部应用实例会扩大故障；是否把依赖纳入 readiness 需先有降级和流量策略。

### Task 3: 加入面向理解的互动、排错与验证

**Files:**
- Modify: `courses/ai-fullstack/lessons/0048-runtime-configuration-and-readiness.html`

- [x] **Step 1: 添加两个即时反馈练习**

保留原生 JavaScript，无第三方依赖：

```javascript
function answerQuestion(questionId, button, isCorrect, explanation) {
  const question = document.getElementById(questionId);
  if (question.dataset.answered) return;
  question.dataset.answered = 'true';
  question.querySelectorAll('button').forEach((item) => { item.disabled = true; });
  button.classList.add(isCorrect ? 'correct' : 'wrong');
  const feedback = question.querySelector('[data-feedback]');
  feedback.textContent = explanation;
  feedback.className = `feedback show ${isCorrect ? '' : 'warn'}`;
}
```

一个练习要求判断某配置应为必填还是可选并解释后果；另一个练习检验“停止分流”与“重启实例”的选择。答案反馈必须解释原因。

- [x] **Step 2: 添加常见错误对照和完成清单**

添加至少四项可行动排错项：包路径与启动类根包不一致、忘记添加 Maven 依赖、配置键拼写错误、端口 8080 已被占用。每项给出观察现象、检查位置与修正方向。完成清单必须覆盖：正常测试、`/health` 原有契约、两个 readiness 地址、受控失败、未提交敏感值。

- [x] **Step 3: 保留官方一手资料链接和下一课衔接**

链接 Spring Boot 官方 Externalized Configuration、Actuator Enabling 和 Actuator Endpoints 页面。下一课预告只说明会学习 Service 层与统一错误响应，不提前要求用户掌握其实现。

- [x] **Step 4: 执行静态验证**

运行：

```powershell
git diff --check -- courses/ai-fullstack/lessons/0048-runtime-configuration-and-readiness.html
Select-String -LiteralPath 'courses\ai-fullstack\lessons\0048-runtime-configuration-and-readiness.html' -Pattern 'application.properties','@ConfigurationProperties','@NotBlank','/actuator/health/readiness','/readyz','liveness','readiness' -Encoding UTF8
```

预期：第一条命令无输出且退出码为 0；第二条命令能找到所有必需主题。随后在浏览器打开 HTML，手动点击两个练习的正确和错误选项，确认只显示一次解释且按钮被禁用。

- [ ] **Step 5: 提交建议（仅在用户确认后）**

建议单独提交课程文件：

```powershell
git add -- courses/ai-fullstack/lessons/0048-runtime-configuration-and-readiness.html
git diff --cached --check
git commit -m "docs(ai-fullstack): 重写第48课零基础讲解"
```

不包含 `java-backend/`、第 47 课学习记录或 `docs/superpowers/` 中的流程文件。

## 自查结果

- **规格覆盖：** Task 1 覆盖配置绑定、校验、零基础解释和双验证；Task 2 覆盖 Actuator、readiness、liveness 及依赖边界；Task 3 覆盖互动、排错、验收和官方资料。
- **占位符：** 已检查，不含待实现占位词或含糊的“适当处理”步骤。
- **一致性：** 包名统一为 `com.example.ai.java_backend`；配置键为 `app.release-label`，对应 Java 字段 `releaseLabel`；端点统一为 `/actuator/health/readiness` 与 `/readyz`。
