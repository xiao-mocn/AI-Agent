# 完成第十一课：Bearer Token API 鉴权

用户在后端加了认证中间件：读取环境变量 `ALLOWED_TOKEN`，校验请求头 `Authorization: Bearer <token>`，不匹配返回 401；没有配置环境变量时直接放行（方便本地开发）。前端从 `localStorage` 读 token，第一次访问时 `prompt` 弹框让用户输入并存储。

遇到一个排查点：配置好后发现没有 token 仍然能访问——原因是 Render 后端没有配置 `ALLOWED_TOKEN` 环境变量，中间件走了放行分支。去 Render 加上环境变量后问题解决。

**Implications**：可以进入第十二课——JWT 用户认证，实现注册/登录，让应用从"单人工具"升级为支持多用户的产品。
