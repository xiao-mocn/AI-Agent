# AI 全栈工程师 Resources

## Knowledge

### 公司项目一手资料（本地只读）

- `E:\project\eao-api\README.md` 与 `E:\project\eao-api\pom.xml`
  eao-api 的模块职责、构建边界和 Maven 聚合关系。用于：第 53 课绘制项目地图，不作为 Java 语法教材。

- `E:\project\eao-front\src\api\iot\brand\index.ts`
  品牌管理前端 API 地址与 HTTP 方法的一手来源。用于：从熟悉的 TypeScript 调用反查后端入口。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\controller\admin\brand\BrandController.java`
  品牌管理 HTTP 入口。用于：识别 Controller、参数绑定、校验和统一响应包装。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\service\model\brand\BrandService.java` 与 `BrandServiceImpl.java`
  品牌管理业务接口和实现。用于：识别依赖注入、业务校验、事务和 Mapper 调用。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\dal\dataobject\model\brand\BrandInfoDO.java` 与 `dal\mapper\model\brand\BrandInfoMapper.java`
  品牌数据对象和 MyBatis-Plus 查询入口。用于：理解 DO、表映射和分页查询条件。

- `E:\project\eao-api\domains\eao-model\src\main\java\com\dgc\ems\hmi\model\convert\device\BrandConvert.java`
  MapStruct 对象转换边界。用于：理解请求/响应 VO 与数据库 DO 为什么不直接混用。

### 后端基础

- [Apache Maven：多模块项目指南](https://maven.apache.org/guides/mini/guide-multiple-modules.html)
  Maven 官方说明 Reactor 如何收集、排序和构建多个模块。用于：理解 `eao-api` 根 POM 与四个子模块的构建关系。

- [Apache Maven：POM 与项目聚合](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#project-aggregation)
  Maven 官方说明 `packaging=pom`、`modules`、继承和聚合的区别。用于：阅读父 POM 和模块 POM。

- [Spring Boot：组织代码结构](https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html)
  Spring Boot 官方说明主应用类、根包和组件扫描之间的关系。用于：理解 `app` 为什么能够发现领域模块中的组件。

- [Spring Framework：请求映射](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html)
  Spring MVC 官方说明类级共享路径、方法级映射及 `@GetMapping`、`@PostMapping` 等快捷注解。用于：根据 HTTP 方法和 URL 定位 Controller 方法。

- [Spring Framework：注解式 Controller](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann.html)
  Spring MVC 官方说明 `@RestController` 的组件身份和响应体语义。用于：识别 Java 类是否为 HTTP 请求入口。

- [Node.js 官方入门指南](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
  官方文档，覆盖事件循环、模块系统、HTTP 基础。用于：第一次写 Node.js 时的参考基准。

- [Hono 官方文档](https://hono.dev/docs/)
  轻量级、TypeScript-first 的 Web 框架，语法接近前端开发者的直觉。用于：构建后端 API 路由。

- [Prisma 官方入门](https://www.prisma.io/docs/getting-started)
  TypeScript ORM，有完整类型提示，类似前端 SDK 的使用体验。用于：数据库建模和查询。

### AI 集成

- [Anthropic Claude API 官方文档](https://docs.anthropic.com/en/docs/quickstart)
  一手资料，覆盖 Messages API、流式响应、Tool Use。用于：一切 Claude 相关集成。

- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs/introduction)
  统一封装多个 LLM 提供商，提供流式 UI 组件。用于：快速实现前后端流式对话。

### 部署

- [Render 文档](https://render.com/docs)
  托管 Web Service、数据库和部署日志的 PaaS。用于：部署 Node.js 后端并完成发布后的运行状态检查。

- [Vercel 部署文档](https://vercel.com/docs)
  前端和 Serverless Function 的首选平台。用于：部署前端和轻量级 API。

## Wisdom（社区）

- [Discord: Anthropic Developer Community](https://discord.gg/anthropic)
  官方社区，有 Claude API 使用问题的一手解答。

- [r/LocalLLaMA](https://reddit.com/r/localllama) / [r/OpenAI](https://reddit.com/r/openai)
  AI 开发者社区，可以找到实践经验和陷阱分享。

## Gaps

- 尚未找到系统性的「前端转全栈 AI 工程师」中文课程，目前以官方文档 + 实践为主
