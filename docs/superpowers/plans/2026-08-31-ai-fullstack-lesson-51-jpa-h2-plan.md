# AI 全栈第 51 课：JPA 实体与 H2 持久化 Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第 51 课 HTML，指导学习者以 Spring Data JPA 和 H2 替换内存 Repository，而不改变既有业务和 HTTP 契约。

**Architecture:** `ReleaseRepository` 保持为业务边界；`ReleaseJpaRepository` 只处理 JPA 查询，`JpaReleaseRepository` 将 `ReleaseEntity` 映射为既有 `VersionResponse`。课程页面呈现全部可复制代码，不修改真实 `java-backend` 代码。

**Tech Stack:** UTF-8 HTML/CSS/JavaScript、Spring Boot、Spring Data JPA、H2、JUnit 5、Spring Boot Test。

---

## 文件结构

- 创建：`courses/ai-fullstack/lessons/0051-jpa-entity-and-h2-persistence.html` — 单页课程、代码步骤、互动题、官方资料。
- 参考：`courses/ai-fullstack/lessons/0050-repository-and-error-boundary.html` — 复用页面视觉和交互结构。
- 参考：`java-backend/pom.xml`、`java-backend/src/main/resources/application.properties` — 课程中准确展示依赖和配置落点。
- 参考：`java-backend/src/main/java/com/example/ai/java_backend/version/ReleaseRepository.java`、`VersionService.java` — 确保课程不让上层依赖 JPA 类型。

### Task 1: 写出持久化改造的学习步骤

**Files:**
- Create: `courses/ai-fullstack/lessons/0051-jpa-entity-and-h2-persistence.html`
- Reference: `java-backend/pom.xml`
- Reference: `java-backend/src/main/java/com/example/ai/java_backend/version/ReleaseRepository.java`
- Reference: `java-backend/src/main/resources/application.properties`

- [ ] **Step 1: 说明目标、范围和验收结果**

页面开头说明：本课只把数据源从 `Map` 改为 H2/JPA；`VersionService`、`VersionController`、`ReleaseNotFoundException` 与 JSON 错误契约保持不变。写明最终命令：

```powershell
cd E:\project\AI-Agent\java-backend
.\mvnw.cmd clean test
```

期望 `BUILD SUCCESS`；`/version` 和 `/versions/local` 返回 `{"version":"1.0.1"}`，`/versions/missing` 仍为统一 404 JSON。

- [ ] **Step 2: 展示新增 Maven 依赖**

在 `java-backend/pom.xml` 的 `<dependencies>` 新增：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

解释前者提供实体映射和 Spring Data 查询，后者提供运行期内存数据库；明确不引入 MySQL、Flyway、分页、关联映射和 H2 控制台。

- [ ] **Step 3: 展示 `ReleaseEntity` 的完整实现**

创建 `java-backend/src/main/java/com/example/ai/java_backend/version/ReleaseEntity.java`：

```java
package com.example.ai.java_backend.version;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "releases")
public class ReleaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "release_label", nullable = false, unique = true)
    private String releaseLabel;

    @Column(nullable = false)
    private String version;

    protected ReleaseEntity() {
    }

    public ReleaseEntity(String releaseLabel, String version) {
        this.releaseLabel = releaseLabel;
        this.version = version;
    }

    public Long getId() { return id; }
    public String getReleaseLabel() { return releaseLabel; }
    public String getVersion() { return version; }
}
```

解释实体描述存储结构，`VersionResponse` 描述 API 返回值，二者不能混为一类。

- [ ] **Step 4: 展示查询接口和业务适配器**

创建 `java-backend/src/main/java/com/example/ai/java_backend/version/ReleaseJpaRepository.java`：

```java
package com.example.ai.java_backend.version;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleaseJpaRepository extends JpaRepository<ReleaseEntity, Long> {
    Optional<ReleaseEntity> findByReleaseLabel(String releaseLabel);
}
```

创建 `java-backend/src/main/java/com/example/ai/java_backend/version/JpaReleaseRepository.java`：

```java
package com.example.ai.java_backend.version;

import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaReleaseRepository implements ReleaseRepository {
    private final ReleaseJpaRepository releaseJpaRepository;

    public JpaReleaseRepository(ReleaseJpaRepository releaseJpaRepository) {
        this.releaseJpaRepository = releaseJpaRepository;
    }

    @Override
    public Optional<VersionResponse> findByReleaseLabel(String releaseLabel) {
        return releaseJpaRepository.findByReleaseLabel(releaseLabel)
                .map(entity -> new VersionResponse(entity.getVersion()));
    }
}
```

在 `InMemoryReleaseRepository.java` 删除 `@Repository` 与对应 import，保留其为非 Spring Bean。解释这是为了只注入一个 `ReleaseRepository`，空结果仍交给 `VersionService` 转为既有异常。

- [ ] **Step 5: 展示 H2 配置和种子数据**

将 `java-backend/src/main/resources/application.properties` 改为：

```properties
spring.application.name=java-backend
spring.datasource.url=jdbc:h2:mem:versiondb;DB_CLOSE_DELAY=-1
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
```

创建 `java-backend/src/main/resources/data.sql`：

```sql
INSERT INTO releases (release_label, version) VALUES ('local', '1.0.1');
```

说明 Hibernate 先建表、再运行 `data.sql`；`jdbc:h2:mem:` 中的数据只存在于当前进程。

- [ ] **Step 6: 先写会失败的 JPA 测试，再实现并回归**

创建 `java-backend/src/test/java/com/example/ai/java_backend/version/ReleaseJpaRepositoryTest.java`：

```java
package com.example.ai.java_backend.version;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class ReleaseJpaRepositoryTest {
    @Autowired
    private ReleaseJpaRepository releaseJpaRepository;

    @Test
    void findsSeededLocalReleaseByLabel() {
        var release = releaseJpaRepository.findByReleaseLabel("local");
        assertThat(release).isPresent().get()
                .extracting(ReleaseEntity::getVersion)
                .isEqualTo("1.0.1");
    }
}
```

先运行：

```powershell
cd E:\project\AI-Agent\java-backend
.\mvnw.cmd -Dtest=ReleaseJpaRepositoryTest test
```

实体和查询接口尚不存在时，期望编译失败并提示类型不存在。完成上述实现后再次运行，期望该测试通过；再运行 `.\mvnw.cmd clean test`，期望全部旧测试和该新增测试通过。故障提示必须写明：`NoUniqueBeanDefinitionException` 时先检查内存实现的 `@Repository` 是否删除。

### Task 2: 完成课程交互与资料区

**Files:**
- Modify: `courses/ai-fullstack/lessons/0051-jpa-entity-and-h2-persistence.html`

- [ ] **Step 1: 复用第 50 课的课程骨架**

复制 `0050-repository-and-error-boundary.html` 的 UTF-8、响应式 CSS、`<section class="goal">`、`<section class="step">`、`<section class="quiz">`、资料区和 JavaScript 交互结构；仅替换为第 51 课内容，不修改第 50 课。

- [ ] **Step 2: 写入三道可判定互动题**

每题三个选项，提交后显示解释，无账号或网络请求。正确答案分别为：

```text
1. 实体不直接作为接口返回值：实体是存储结构，VersionResponse 是对外契约。
2. JpaReleaseRepository 的职责：调用 Spring Data 并映射实体为 VersionResponse。
3. H2 数据停止后消失：jdbc:h2:mem: 数据只在当前应用进程内存中。
```

- [ ] **Step 3: 添加官方链接和下一课预告**

在资料区添加 Spring Boot SQL 数据库初始化文档和 Spring Data JPA 参考文档直达链接。结尾预告下一课讨论生产数据库迁移时的配置差异和数据迁移边界，不提前实现 MySQL 或迁移工具。

### Task 3: 验证并打开课程页

**Files:**
- Verify: `courses/ai-fullstack/lessons/0051-jpa-entity-and-h2-persistence.html`
- Verify: `java-backend/pom.xml`

- [ ] **Step 1: 验证课程 HTML 的结构和核心术语**

运行：

```powershell
$lesson = 'E:\project\AI-Agent\courses\ai-fullstack\lessons\0051-jpa-entity-and-h2-persistence.html'
$html = Get-Content -LiteralPath $lesson -Raw -Encoding UTF8
@('class="goal"', 'class="step"', 'class="quiz"', 'spring-boot-starter-data-jpa', 'com.h2database', 'ReleaseEntity', 'JpaReleaseRepository', 'ReleaseJpaRepositoryTest', 'data.sql', 'spring.jpa.defer-datasource-initialization') |
    ForEach-Object { if ($html -notmatch [regex]::Escape($_)) { throw "课程页缺少：$_" } }
```

期望命令无输出且退出成功。失败时只补齐提示缺失的页面内容。

- [ ] **Step 2: 运行真实后端的回归测试**

运行：

```powershell
cd E:\project\AI-Agent\java-backend
.\mvnw.cmd clean test
```

期望 `BUILD SUCCESS`。若失败，保留完整错误输出并按错误定位，不把代码测试失败归因于静态课程页面。

- [ ] **Step 3: 用默认浏览器打开第 51 课**

运行：

```powershell
Start-Process -FilePath 'E:\project\AI-Agent\courses\ai-fullstack\lessons\0051-jpa-entity-and-h2-persistence.html'
```

期望默认浏览器打开课程。课程页此时不提交；学习者完成第 51 课、通过验证并再次调用 `advance-lesson` 后，才提交课程页和学习记录。
