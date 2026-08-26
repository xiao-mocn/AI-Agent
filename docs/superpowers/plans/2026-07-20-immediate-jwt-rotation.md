# Immediate JWT Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce and document immediate JWT secret rotation so tokens signed with an old secret are rejected after deployment.

**Architecture:** Keep the existing single `config.JWT_SECRET` verification path. Add an integration regression test that signs a syntactically valid token with a different secret and verifies that the protected endpoint returns `401`; add a secret-free operational runbook for rotation evidence.

**Tech Stack:** TypeScript, Vitest, Supertest, jsonwebtoken, dotenv.

---

### Task 1: Prove immediate invalidation with an integration test

**Files:**
- Modify: `ai-backend/test/sessions.test.ts`

- [ ] **Step 1: Write the failing test**

Add `jsonwebtoken` to the existing imports and add this case after the invalid-token test:

```ts
it('使用旧密钥签发的格式正确 token 应返回 401', async () => {
  const oldToken = jwt.sign({ userId: 1 }, 'old-secret-that-is-not-the-current-signing-key')

  const res = await request(server)
    .get('/api/sessions')
    .set('Authorization', `Bearer ${oldToken}`)

  expect(res.status).toBe(401)
})
```

- [ ] **Step 2: Run the targeted test before changing production behavior**

Run:

```powershell
Set-Location E:\project\AI-Agent\ai-backend
npm test -- --reporter=verbose test/sessions.test.ts
```

Expected: the new test passes because `requireAuth` verifies only `config.JWT_SECRET`; if it fails, inspect the authentication import chain before changing the middleware.

- [ ] **Step 3: Correct the test teardown guard**

Replace the current `afterAll` server-close block with this implementation so a failed `beforeAll` neither throws nor leaves an unresolved Promise:

```ts
afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }

  if (databaseInitialized) {
    await cleanupTestDB()
  }
})
```

- [ ] **Step 4: Verify the integration test file**

Run the command from Step 2. Expected: all session tests pass, including the old-secret case.

### Task 2: Add a secret-free rotation runbook

**Files:**
- Create: `ai-backend/docs/secret-rotation.md`

- [ ] **Step 1: Create the runbook**

Write a Markdown document with the following sections and exact constraints:

```markdown
# JWT 与 API Key 轮换手册

## 审计记录

记录配置键、轮换原因、新值已在平台设置、`npm run check:config` 结果、旧值撤销时间、验证人。不得记录密钥值、完整哈希、截图或连接串。

## API Key 轮换

1. 在供应商控制台创建新 Key，并仅保存到部署平台密钥管理界面。
2. 更新平台变量后执行 `npm run check:config`，再完成一次受控业务请求。
3. 确认新 Key 生效后撤销旧 Key，记录撤销时间与验证结果。

## JWT 立即轮换

1. 在部署平台替换 `JWT_SECRET`，不设置旧密钥兼容变量。
2. 执行 `npm run check:config` 并部署重启服务。
3. 用新登录获取令牌并访问受保护接口；旧令牌应返回 `401`。
4. 记录轮换原因、时间、验证结果和负责人。
```

- [ ] **Step 2: Verify the runbook contains no credentials**

Run:

```powershell
Select-String -LiteralPath 'E:\project\AI-Agent\ai-backend\docs\secret-rotation.md' -Pattern 'JWT_SECRET=|DEEPSEEK_API_KEY=|postgres://|postgresql://'
```

Expected: no output.

### Task 3: Verify the completed lesson implementation

**Files:**
- Verify: `ai-backend/test/sessions.test.ts`
- Verify: `ai-backend/docs/secret-rotation.md`
- Verify: `ai-backend/src/middleware/auth.ts`

- [ ] **Step 1: Run configuration validation**

```powershell
Set-Location E:\project\AI-Agent\ai-backend
npm run check:config
```

Expected: exit code `0` and a line beginning with `[config-check]` without a secret value.

- [ ] **Step 2: Run type-checking and all tests**

```powershell
npx tsc --noEmit
npm test
```

Expected: both commands exit `0` and all tests pass.

- [ ] **Step 3: Review the staged diff before any commit**

```powershell
Set-Location E:\project\AI-Agent
git diff -- ai-backend/test/sessions.test.ts ai-backend/docs/secret-rotation.md
```

Expected: no credential values, no `JWT_SECRET` fallback, and no old-secret compatibility branch.

## Self-Review

- Spec coverage: Task 1 enforces immediate invalidation; Task 2 records a secret-free operational process; Task 3 verifies configuration, type safety, and regressions.
- Placeholder scan: no TODO or TBD items.
- Type consistency: the test uses existing `server`, `databaseInitialized`, `cleanupTestDB`, and `requireAuth` behavior without new production interfaces.
