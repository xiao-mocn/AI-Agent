# 完成第十七课：Web 安全基础——XSS 与 CSRF 防护

在 `ai-backend/src/index.ts` 中添加了 `secureHeaders()` 中间件并将 CORS 的 `origin` 从 `'*'` 改为精确的 `FRONTEND_URL` 环境变量。同时移除了遗留的 `ALLOWED_TOKEN` 静态令牌旁路逻辑，所有 `/api/*` 路由统一走 JWT 鉴权。修复了 CORS 覆盖范围不含 `/login`、`/register` 路由的 bug，将 `cors()` 中间件从 `/api/*` 改为 `*`。

**思考题回答**：
1. **Q1（HttpOnly Cookie + CSRF）**：HttpOnly 防 XSS 偷 Token，但浏览器自动携带 Cookie 重新引入 CSRF 风险，需叠加 `SameSite=Strict` 或同步 CSRF Token；SameSite + HttpOnly 组合在绝大多数场景已足够。
2. **Q2（username 校验）**：安全上做长度限制（3-30）、字符白名单（字母/数字/下划线）、禁用 admin/root 等保留词；体验上给出明确错误文案，并在前端做实时同步校验，存储时统一大小写策略防账号混淆。
3. **Q3（API Key 前端暴露）**：前端代码对任何人可见，Key 泄露等于开放计费账户——攻击者可绕过你的鉴权/限流直接调用 DeepSeek，产生巨额账单；Key 只能存后端环境变量，前端走自己的后端代理。

**Implications**：第十八课将实现速率限制（`hono-rate-limiter`），通过全局 IP 限流和 AI 接口用户级精细限流，防止接口被恶意滥用。
