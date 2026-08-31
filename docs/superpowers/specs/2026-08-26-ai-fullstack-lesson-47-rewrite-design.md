# AI 全栈第 47 课重写设计

## 目标

将第 47 课重写为 Java Spring Boot 副线的第一个可独立完成的学习切片：在不迁移业务、认证、数据库或密钥的前提下，建立 Spring Boot 4.1.1 + Java 21 项目，并实现与 Node.js 保持一致的 `GET /health` 外部契约。

## 决策

- 采用自定义 `GET /health`，固定返回 HTTP 200 和 `{ "status": "ok" }`。
- 不在本课使用 Actuator。Actuator 的健康端点、liveness 与 readiness 会在后续课程单独引入，避免把“进程存活”和“依赖就绪”混为一谈。
- 技术基线更新为 Spring Boot 4.1.1 与 Java 21。Spring Boot 4.1.1 要求至少 Java 17，支持 Java 21。
- Web 层测试使用 `@WebMvcTest` 与 `MockMvc`，另以真实 HTTP 请求补足 Mock 环境不能覆盖的端口与序列化启动验证。

## 学习体验

课程时长控制在约 60 分钟。先给出 5 分钟脱稿任务：学习者先写出路由契约、文件职责和测试断言，再根据分层提示完成项目。验收包含两类证据：Maven 的 Web 层测试结果，以及运行中的应用对 `GET /health` 的真实响应。

课程仅要求生成一个独立 `java-backend/` 目录；严禁复制或读取 Node.js 的 `.env`、数据库文件、JWT 密钥和 API Key。

## 页面与内容结构

1. 为什么从最小外部契约开始。
2. 当前技术基线与 Spring Initializr 参数。
3. 脱稿设计：接口、包路径、响应 record、测试断言。
4. 分层实践：创建项目、编写 Controller、先写测试、再实现、运行真实 HTTP 验证。
5. 验收清单、变式练习与思考题。
6. 下一课预告：类型化运行时配置与 readiness，届时引入 Actuator。

## 范围与验证

本次仅覆盖 `courses/ai-fullstack/lessons/0047-spring-boot-skeleton-and-health-check.html`，不改课程编号、学习记录、应用代码或依赖文件。页面必须使用 UTF-8，含可点击的 Spring Boot 官方链接，且不再宣称 Spring Boot 3.5.x 是当前版本。

完成后将通过 HTML 语义检查、关键字符串检查和浏览器打开验证页面可读取。
