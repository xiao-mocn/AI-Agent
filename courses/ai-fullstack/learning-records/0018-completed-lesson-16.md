# 完成第十六课：数据库迁移（SQLite → PostgreSQL）

用户完成了 SQLite 到 PostgreSQL 的双模式迁移：
- `db.ts` 重构为 async 函数，按 `isPG`（`DATABASE_URL` 是否存在）分支走 PG 或 SQLite
- 新增 `initDB()` 函数，`index.ts` 在 `serve` 前调用，完成建表
- `business/user.ts`、`business/chat.ts` 全部改用 `await` 调用
- 安装 `pg` / `@types/pg` 依赖

**思考题回答**：
1. **Q1（Prisma ORM 优劣）**：Prisma 类型安全、Schema 版本化、无需 `if (isPG)` 分支；但学习成本高、构建需 generate、小项目偏重。当前项目 SQL 简单，裸 `pg` 够用；团队变大后再考虑引入
2. **Q2（消除双分支）**：策略模式——定义 `IDatabase` 接口，`SQLiteDB` 和 `PostgresDB` 各自实现，入口处 `isPG ? new PostgresDB() : new SQLiteDB()` 只做一次切换
3. **Q3（10,000 行限制）**：迁移到 Neon/Supabase（免费层无行数限制）；或定期归档旧消息；或升级 Render 付费套餐（$7/月起）

**Implications**：第十七课将处理 Web 安全基础（XSS / CSRF 防护 + 安全响应头）。
