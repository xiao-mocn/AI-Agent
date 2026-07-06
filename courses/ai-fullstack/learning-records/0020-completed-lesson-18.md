# 完成第十八课：速率限制与 API 保护

安装了 `hono-rate-limiter`，在 `ai-backend/src/index.ts` 中添加了两层限流：全局按 IP 限流（`/api/*`，60次/分钟）和 AI 接口按用户 ID 精细限流（`/api/chat`，10次/分钟）。同时修复了 CORS 覆盖范围（从 `/api/*` 改为 `*` 以覆盖 `/login`、`/register`），在 `ai-frontend/src/ChatView.vue` 中添加了 429 响应的友好提示处理，并清理了 `chat.ts` 中无用的 `import jwt`。

**思考题回答**：
1. **Q1（代理池绕过）**：IP 限流不够，需叠加用户 ID 维度（已有）+ 注册成本（验证码/手机号）+ 异常行为检测；用户 ID 维度是最有效的，代理换 IP 对账号配额无影响。
2. **Q2（VIP/普通分级限额）**：在 `keyGenerator` 里把 role 编码进 key（`vip:42` vs `user:42`），注册两个独立 limiter 中间件分别设 limit 50 和 10，通过 `skip` 回调让两者按角色互斥生效。
3. **Q3（内存清零严重性）**：单实例场景清零影响可忽略；多实例或滚动发布时计数不共享导致限流失效，高价值 AI 接口（按 Token 计费）下攻击者可利用重启绕过，届时必须换 Redis 共享计数后端。

**Implications**：第十九课将引入 Zod 进行统一输入验证与错误处理规范，让请求体校验和错误信息既安全又清晰。
