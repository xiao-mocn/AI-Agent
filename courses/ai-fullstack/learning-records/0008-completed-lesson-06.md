# 完成第六课：错误处理

用户加入了输入验证（`!message || !sessionId` → 返回 400）和 try/catch（AI 调用失败 → 返回 500 + `history.pop()`）。
理解了 400 和 500 状态码的区分，以及为什么失败时需要撤销 history。

有一处实现偏差：try 块内的 API 调用结果未被使用，成功后又在 try 外部重复调用一次，导致每次请求实际消耗两倍 token。这个问题会在第七课重构时一并修正。

**Implications**：可以进入第七课——SQLite 持久化，把内存中的 sessionMap 替换为数据库存储。
