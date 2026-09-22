# 完成第54课：从前端请求定位 BrandController

本课沿品牌分页链路，从 `index.vue` 的 `handleQuery` 定位到 `BrandApi.getBrandPage`，确认 HTTP 坐标为 `POST /model/brand/page`。随后在 `BrandController` 中用类级 `@RequestMapping("/model/brand")` 与方法级 `@PostMapping("/page")` 组合确认了 `getBrandPage(@RequestBody BrandPageReqVO pageReqVO)` 入口。真实 `eao-front` 与 `eao-api` 均保持只读；本课没有修改业务代码。

**思考题回答**：

1. **Q1（为什么完整 URL 搜不到）**：`/model/brand/page` 被拆在两个映射注解中：类级映射保存共享前缀，方法级映射保存具体动作后缀。运行时 Spring 才会把它们组合成完整地址，因此在 Java 源码中搜索完整字符串没有结果并不代表接口不存在。应改为搜索稳定的业务前缀 `/model/brand`，再在命中的 Controller 中核对后缀。
2. **Q2（为什么还要核对 HTTP 方法）**：请求映射由路径和 HTTP 方法共同决定。仅发现 `/model/brand` 或 `/page` 还不能证明页面发出的 `POST` 会进入目标方法；`@PostMapping` 才补齐了方法约束。这个核对可避免把同一路径下的不同端点误判为同一个入口。
3. **Q3（下一步深入什么）**：下一步先看 `@RequestBody` 接收的 `BrandPageReqVO`，因为它定义前端分页和筛选条件怎样进入 Java。再看 `BrandRespVO`、`PageResult` 与 `CommonResult`，就能解释响应为何以 `list`、`total` 的形式回到页面。Service 和 Mapper 的业务、查询细节留到后续课程追踪。

**Implications**：第55课将进入 `BrandPageReqVO` 与 `BrandRespVO`，拆解分页请求字段、响应包装层级，以及它们如何对应前端的 `searchParams`、`list` 和 `total`。
