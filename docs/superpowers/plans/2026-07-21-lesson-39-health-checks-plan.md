# 第 39 课健康检查回归测试 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为现有的 `/health` 和 `/ready` 端点补齐成功路径的精确响应回归测试。

**Architecture:** 生产路由和数据库检查已满足课程契约，本次仅在已有的集成测试服务中追加两个端点断言。测试复用 `sessions.test.ts` 的测试数据库、HTTP 服务和清理逻辑，不引入新的服务或依赖替身。

**Tech Stack:** TypeScript、Hono、Vitest、Supertest、better-sqlite3。

---

### Task 1: 健康检查成功路径测试

**Files:**
- Modify: `E:/project/AI-Agent/ai-backend/test/sessions.test.ts`
- Verify: `E:/project/AI-Agent/ai-backend/src/utils/app.ts`

- [ ] **Step 1: 在测试文件中添加精确响应断言**

在 `describe('不提供Token', ...)` 之前插入以下测试组：

```ts
describe('健康检查', () => {
  it('进程存活时 /health 返回最小响应且不需要 JWT', async () => {
    const res = await request(server).get('/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('数据库可用时 /ready 返回就绪状态且不需要 JWT', async () => {
    const res = await request(server).get('/ready')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ready' })
  })
})
```

- [ ] **Step 2: 运行定向测试验证既有实现**

Run:

```powershell
Set-Location E:\project\AI-Agent\ai-backend
npm test -- test/sessions.test.ts
```

Expected: Vitest 通过“健康检查”中的两条测试；它们直接通过是预期结果，因为本次为已有正确实现补充回归覆盖，不改动生产行为。

- [ ] **Step 3: 运行完整测试套件**

Run:

```powershell
Set-Location E:\project\AI-Agent\ai-backend
npm test
```

Expected: 所有测试通过，且无新增失败或未处理异常。

### Task 2: 第 39 课学习记录

**Files:**
- Create: `E:/project/AI-Agent/courses/ai-fullstack/learning-records/0041-completed-lesson-39.md`
- Reference: `E:/project/AI-Agent/courses/ai-fullstack/lessons/0039-production-health-checks-and-observability-boundaries.html`

- [ ] **Step 1: 写入学习记录**

记录本课完成情况、两项探针测试、三道思考题答案，以及下一课关于部署后烟雾测试和回滚判定的方向。不要记录数据库 URL、密钥、主机名、错误堆栈或其他敏感诊断信息。

- [ ] **Step 2: 检查变更范围**

Run:

```powershell
Set-Location E:\project\AI-Agent
git status --short
git diff -- ai-backend/test/sessions.test.ts courses/ai-fullstack/learning-records/0041-completed-lesson-39.md
```

Expected: 本课代码变更仅为两条健康检查测试；学习记录仅包含本课摘要与思考题答案。保留工作区中其他未跟踪文件，不暂存、不提交。
