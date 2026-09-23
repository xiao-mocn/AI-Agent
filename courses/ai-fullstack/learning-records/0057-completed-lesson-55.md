# 完成第55课：读懂请求体与分页响应

本课从前端的 `searchParams` 与 `res.list/res.total` 反向核对了 Java 数据契约。确认 `BrandPageReqVO` 继承 `PageParam`，品牌筛选字段为 `brand`、`manufacturer`；Controller 通过 `@RequestBody` 接收请求体，并返回 `CommonResult<PageResult<BrandRespVO>>`。真实 `eao-front`、`eao-api` 与 `eao-common` 均保持只读。

**思考题回答**：

1. **Q1（继承的分页字段）**：`BrandPageReqVO` 虽然没有直接声明 `pageSize`，但它通过 `extends PageParam` 继承了该字段。对象绑定针对的是完整对象的可访问属性，不只局限在当前类文本里出现的字段。阅读请求 VO 时必须继续查看父类，否则会漏掉分页协议的核心字段。
2. **Q2（total 的语义）**：`PageResult<BrandRespVO>` 的 `total` 是符合筛选条件的记录总量，而不是当前页中的某一条品牌记录。当前页的每条记录在 `list` 中，类型为 `BrandRespVO`。前端分页组件用 `total` 计算可翻到的页数，因此它属于分页容器而不是行数据。
3. **Q3（@RequestBody 的职责）**：`@RequestBody` 表示 Spring 从 POST 请求体读取 JSON，并把它绑定到 `BrandPageReqVO pageReqVO` 参数。它不负责组合 URL，也不负责包装响应或执行数据库查询。输入校验是否触发仍要结合参数注解和项目配置判断，不能仅凭该注解下结论。

**Implications**：第56课将沿 `brandService.getBrandPage(pageReqVO)` 阅读 Service 接口和实现类，理解 Controller、Service、Mapper、Convert 在同一条分页链路中的协作边界。
