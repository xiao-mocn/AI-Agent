# 完成第 48 课：运行时配置与就绪检查

在 `java-backend/` 中加入了 Actuator 与 Validation 依赖，创建 `config/AppProperties` record，通过 `@ConfigurationProperties`、`@Validated` 和 `@NotBlank` 绑定并校验 `app.release-label`。启动类已开启 `@ConfigurationPropertiesScan`，配置文件已启用健康探针与主端口附加路径；实际访问验证了 `/health` 返回 `{"status":"ok"}`，`/actuator/health/readiness` 和 `/readyz` 均返回 `{"status":"UP"}`。

**思考题回答**：

1. **Q1（启动时校验）**：关键配置缺失时，服务即使进程存在也可能无法正确提供功能。启动失败会把问题固定在部署边界，日志能直接指向缺失的配置键。若等到业务请求进入后才发现空值，影响范围更大，也更难定位。
2. **Q2（readiness 的平台动作）**：readiness 表示“当前是否接收新流量”，而不是“进程是否必须重启”。实例暂时未就绪时，负载均衡器可以先不分流；进程是否需要重启，要看 liveness 与具体故障原因。这样能避免把外部依赖短暂波动误判为应用进程损坏。
3. **Q3（外部依赖边界）**：外部数据库或 LLM 不应直接加入 liveness，因为重启应用实例无法修复共享依赖本身，反而可能扩大故障。是否将它们纳入 readiness，要基于业务是否能降级、是否必须依赖它们才能响应来决定。当前项目尚未定义该策略，因此先保持最小探针边界。

**Implications**：第 49 课将引入 Service 层与统一错误响应，明确 Controller 只处理 HTTP 输入输出，业务规则和错误语义由独立的服务层管理。
