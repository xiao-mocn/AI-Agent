# 第 50 课：Repository 的最小概念与可替换数据源 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一份让初学者通过内存实现理解 Repository 边界的第 50 课交互式 HTML 课程。

**Architecture:** 延续第 49 课的单页 UTF-8 HTML、浅色阅读版式与原生 JavaScript 互动反馈。课程按“接口边界 → 内存实现 → Service 协作 → Service 测试 → 验证”组织，不修改 Java 项目源码。

**Tech Stack:** 静态 HTML5、CSS、原生 JavaScript、Spring Boot 示例代码、PowerShell 验证。

---

### Task 1: 编写第 50 课内容结构

**Files:**
- Create: `courses/ai-fullstack/lessons/0050-repository-boundary-and-in-memory-storage.html`
- Reference: `java-backend/src/test/java/com/example/ai/java_backend/version/VersionControllerTest.java`
- Reference: `courses/ai-fullstack/lessons/0049-service-layer-and-api-errors.html`
- Reference: `docs/superpowers/specs/2026-08-31-ai-fullstack-lesson-50-repository-design.md`

- [ ] **Step 1: 写出课程目标与脱稿练习**

页面说明 Repository 是 Service 获取数据的边界，不是数据库本身；定义三个可检查目标：识别接口职责、解释 `Optional` 的意义、解释为何 Controller 无须随数据源替换而修改。脱稿练习要求用户写出下列数据流：

```text
GET /versions/local
-> VersionController
-> VersionService
-> ReleaseRepository
-> InMemoryReleaseRepository
-> VersionResponse
```

- [ ] **Step 2: 写出最小接口与内存实现示例**

课程代码统一使用以下契约；它不包含 HTTP 注解、状态码或 JSON 序列化逻辑：

```java
package com.example.ai.java_backend.version;

import java.util.Optional;

public interface ReleaseRepository {
  Optional<VersionResponse> findByReleaseLabel(String releaseLabel);
}
```

```java
package com.example.ai.java_backend.version;

import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryReleaseRepository implements ReleaseRepository {
  private final Map<String, VersionResponse> versions = Map.of(
      "local", new VersionResponse("1.0.1"));

  @Override
  public Optional<VersionResponse> findByReleaseLabel(String releaseLabel) {
    return Optional.ofNullable(versions.get(releaseLabel));
  }
}
```

### Task 2: 编写 Service 协作与测试教学步骤

**Files:**
- Create: `courses/ai-fullstack/lessons/0050-repository-boundary-and-in-memory-storage.html`

- [ ] **Step 1: 给出 `VersionService` 的完整替换示例**

```java
package com.example.ai.java_backend.version;

import org.springframework.stereotype.Service;

@Service
public class VersionService {
  private final ReleaseRepository releaseRepository;

  public VersionService(ReleaseRepository releaseRepository) {
    this.releaseRepository = releaseRepository;
  }

  public VersionResponse currentVersion() {
    return findForReleaseLabel("local");
  }

  public VersionResponse findForReleaseLabel(String releaseLabel) {
    return releaseRepository.findByReleaseLabel(releaseLabel)
        .orElseThrow(() -> new ReleaseNotFoundException(releaseLabel));
  }
}
```

- [ ] **Step 2: 给出两种 Service 测试用例**

```java
package com.example.ai.java_backend.version;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class VersionServiceTest {
  @Mock
  ReleaseRepository releaseRepository;

  VersionService versionService;

  @BeforeEach
  void setUp() {
    versionService = new VersionService(releaseRepository);
  }

@Test
void returnsVersionProvidedByRepository() {
  given(releaseRepository.findByReleaseLabel("local"))
      .willReturn(Optional.of(new VersionResponse("1.0.1")));

  assertThat(versionService.findForReleaseLabel("local").version())
      .isEqualTo("1.0.1");
}

@Test
void throwsBusinessExceptionWhenRepositoryHasNoRelease() {
  given(releaseRepository.findByReleaseLabel("missing"))
      .willReturn(Optional.empty());

  assertThatThrownBy(() -> versionService.findForReleaseLabel("missing"))
      .isInstanceOf(ReleaseNotFoundException.class)
      .hasMessage("找不到发布标签：missing");
}
}
```

- [ ] **Step 3: 加入三题互动检索练习与变式练习**

题目分别验证：Repository 与数据库的区别、空结果由哪层翻译为业务异常、切换到 JPA 时哪些层不应变化。变式练习要求学习者新增 `staging` 内存记录，并预测 `/versions/staging` 的响应。

### Task 3: 验证并打开课程页面

**Files:**
- Verify: `courses/ai-fullstack/lessons/0050-repository-boundary-and-in-memory-storage.html`

- [ ] **Step 1: 验证 HTML 的必要结构与 UTF-8 内容**

Run:

```powershell
$lesson = Get-Content -LiteralPath 'E:\project\AI-Agent\courses\ai-fullstack\lessons\0050-repository-boundary-and-in-memory-storage.html' -Raw -Encoding UTF8
@('<div class="goal">', '<div class="step">', '<div class="quiz">', 'ReleaseRepository', 'InMemoryReleaseRepository') | ForEach-Object {
  if ($lesson -notlike "*$_*") { throw "课程缺少：$_" }
}
```

Expected: 命令退出码为 0。

- [ ] **Step 2: 使用默认浏览器打开课程**

Run:

```powershell
Start-Process -FilePath 'E:\project\AI-Agent\courses\ai-fullstack\lessons\0050-repository-boundary-and-in-memory-storage.html'
```

Expected: 默认浏览器显示第 50 课，页面包含目标、分步练习、互动题与下一课预告。
