# 完成第28课：对话列表与会话生命周期管理

新增独立的 `sessions` 表作为会话的唯一权威来源（`id`/`user_id`/`title`/`created_at`/`updated_at`），`messages.session_id` 用外键 `REFERENCES sessions(id) ON DELETE CASCADE` 关联它；`db.ts` 新增 `createSessionIfNotExists`/`listSessions`/`renameSession`/`deleteSession` 四个函数，归属校验全部写进 SQL 的 `WHERE`；新建 `src/business/sessions.ts` 暴露 `GET/PATCH/DELETE /api/sessions[/:id]` 三个接口，并在 `index.ts` 里注册到 `requireAuth` 之后；`chat.ts` 在写入第一条消息前调用 `createSessionIfNotExists` 幂等建档。

核对实现时发现一处核心缺陷并已修复：`messages` 表（PG 和 SQLite 两个分支）最初都没有真正加上外键约束，那行 `REFERENCES sessions(id) ON DELETE CASCADE` 被误粘贴进了 `sessions` 表自身的定义里（变成毫无意义的自引用列），导致 `deleteSession` 依赖的级联删除完全不生效，会留下孤儿消息。已改成给 `messages.session_id` 正确加外键、去掉 `sessions` 表里多出来的列，并写了临时验证脚本插入两条消息后调用 `deleteSession`，确认 `countSession` 从 2 变成 0，级联删除生效后删除了验证脚本。本地 `chat.db` 因表结构破坏性变更已删除，下次启动会按新结构重建。

**思考题回答**：
1. **Q1（级联删除 vs 手动删除顺序）**：没有 `ON DELETE CASCADE` 时直接删 `sessions` 会留下 `messages` 里的孤儿数据；反过来手动分两步删时必须在同一事务里"先删子表 messages，再删父表 sessions"，顺序或事务保护缺一不可，否则会产生数据不一致。
2. **Q2（WHERE 里的 user_id 校验）**：只用 `WHERE id = ?` 会造成任意用户越权修改他人会话标题的 IDOR 漏洞；只在路由层判断虽然理论上能达到同样效果，但需要多一次查询、多一个可能被后续改动漏掉的判断点，不如写进 SQL 原子可靠。
3. **Q3（默认标题的局限与异步生成）**：截前20字符在消息很短或是代码片段时标题没有意义；AI 生成标题应该放在异步路径（比如复用第24课的队列），避免阻塞主请求链路增加延迟，且标题延迟出现不影响消息本身的存储和展示。

**Implications**：第29课将学习前端接入会话列表与切换——把这节课新增的三个接口接到 Vue 聊天界面里，做一个左侧边栏展示"我的所有会话"，支持点击切换、双击重命名、悬浮删除。
