# 完成第七课：SQLite 持久化

用户用 better-sqlite3 替换了内存 sessionMap，新建 src/db.ts 封装数据库初始化和三条预编译语句（insertMsg / getHistory / countSession）。
路由逻辑改为：检查 session 是否存在 → 写 user 消息 → 读完整历史 → 调用 AI → 写 assistant 回复。
chat.db 加入 .gitignore，验证了重启后历史仍然存在。

有一处遗漏：AI 回复后忘记写入数据库（insertMsg assistant 那行），由教师在 commit 前修复并解释原因。

**Implications**：可以进入第八课——部署到互联网，把本地应用发布到公开 URL。
