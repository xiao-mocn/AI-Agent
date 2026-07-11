# 完成第27课：多会话与用户维度的资源隔离

给 `requireAuth` 加了 `c.set('userId', ...)`，把 JWT 解出的身份挂到 Context 上（配合新增的 `AppEnv` 类型做了正式的 `Variables` 声明，而不只是课程示例里的类型断言）；`messages` 表（PG + SQLite 两个分支）加了 `user_id NOT NULL` 列；`insertMsg`/`getHistory`/`countSession` 全部带上 `userId` 参数，归属校验写进 SQL 的 `WHERE session_id = ? AND user_id = ?` 条件里；`chat.ts` 用 `c.get('userId')` 把身份贯穿到每次数据库调用。

**思考题回答**：
1. **Q1（SQL 过滤 vs JS filter）**：JS filter 依赖开发者每次都记得写、且不能被后续改动漏掉，一旦漏写就是越权读取，还很难在 code review 中发现；SQL `WHERE` 是数据库层的硬保证，查不到就是查不到，没有中间状态可绕过。
2. **Q2（c.set 传递 userId）**：解码逻辑只在 `requireAuth` 写一次，业务路由复用验证结果；如果每个路由自己调用 `jwt.verify`，逻辑重复且容易在某个新路由漏做校验，直接形成认证绕过漏洞。
3. **Q3（NOT NULL 列迁移）**：直接 `ADD COLUMN ... NOT NULL` 在有存量数据时会失败（旧行没有值可填）；稳妥做法是先加可空列、回填存量数据、确认全部有值后再补 `NOT NULL` 约束，且要在新代码上线前完成迁移。

**Implications**：第28课将基于 `user_id` 隔离基础，实现"查看我的所有会话"、"删除会话"、"重命名会话标题"等会话生命周期管理功能。
