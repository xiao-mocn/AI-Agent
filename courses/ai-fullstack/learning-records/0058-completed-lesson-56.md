# 完成第56课：追踪 Service 的分页编排

本课对照了 Controller 调用、`BrandService` 契约和 `BrandServiceImpl#getBrandPage` 实现，确认分页数据先由 `BrandInfoMapper` 查询为 `PageResult<BrandInfoDO>`，再经 `BrandConvert` 转成 `PageResult<BrandRespVO>`。仅阅读了真实项目代码，没有修改 `eao-api` 或 `eao-front`。

**思考题回答**：

1. **Q1（为什么先看 Service 接口）**：`BrandService` 先告诉我们业务层向 Controller 提供什么能力，以及请求和返回类型是什么；它像一份调用契约。确认契约后，再看 `BrandServiceImpl` 怎样履行它，最后沿实现进入 Mapper，阅读顺序会从稳定边界逐步深入细节。这个分页接口的签名是接收 `BrandPageReqVO` 并返回 `PageResult<BrandRespVO>`。
2. **Q2（Mapper 查询后做什么）**：`brandInfoMapper.selectPage(...)` 返回 `PageResult<BrandInfoDO>`，其中每条记录仍是数据访问层对象。随后 `BrandConvert.INSTANCE.convertPage(pageResult)` 把分页中每个 DO 转成对外的 `BrandRespVO`，同时保留分页容器里的 `list` 和 `total`。因此 Service 编排的是“查询内部数据，再转换成接口数据”，不是把数据库对象原样交给 Controller。
3. **Q3（为什么不直接返回 DO）**：`BrandInfoDO` 服务于数据库映射，可能包含只供后端使用的字段；`BrandRespVO` 则明确接口允许返回哪些内容。直接暴露 DO 会让 API 和数据库结构互相牵连，表结构变化也可能意外改变接口输出。使用 Convert 映射到 RespVO，可以把内部存储模型和对外契约隔开。

**术语说明**：

- **Impl** 是 *Implementation*（实现）的缩写。`BrandServiceImpl implements BrandService` 表示这个类给接口声明的方法提供具体代码；`@Service` 让 Spring 将它注册为业务组件，Controller 注入的是接口类型。
- **Mapper** 是数据访问层的入口，负责按条件读取或写入数据库。这里的 `BrandInfoMapper` 是 MyBatis Mapper 接口，继承了项目的 `BaseMapperX<BrandInfoDO>`；分页方法是 Java 默认方法，构造条件后调用父接口能力执行查询，因此此处没有直接写在 XML 里的分页 SQL。
- **BrandConvert** 是品牌模块的对象转换器。它用 MapStruct 的 `@Mapper` 声明转换方法，并通过 `Mappers.getMapper(BrandConvert.class)` 取得生成的实现；`convertPage` 将 `PageResult<BrandInfoDO>` 映射为 `PageResult<BrandRespVO>`。它负责字段搬运和类型转换，不负责查库或制定业务规则。

**Implications**：第57课将阅读 `BrandInfoMapper.selectPage` 中的条件构造，区分“筛选条件如何表达”和“底层查询由谁执行”，并认识可选条件与排序的写法。
