# 完成第十九课：输入验证与错误处理规范（Zod）

安装了 `zod`，新建 `ai-backend/src/schemas.ts` 集中定义 `RegisterSchema`、`LoginSchema`、`ChatSchema`，并在 `user.ts`（注册/登录）和 `chat.ts`（`/api/chat`）里用 `safeParse` 替换了原来手写的 `if (!xxx) return` 校验。在 `index.ts` 里加上了 `app.onError` 和 `app.notFound` 作为全局兜底，异常统一记录到服务器日志、返回给客户端的是不带堆栈的通用错误信息。顺手把 `db.ts` 里 `sessionId` 的类型从 `string` 放宽为 `string | number`，配合 `ChatSchema` 里 `z.number().int().positive()` 推导出的类型。

**思考题回答**：
1. **Q1（trim 与纯空格）**：`min(1)` 只判断长度，`"   "` 长度为 3 能通过；需要在 `min` 前加 `.trim()`，让纯空格先被裁剪成 `""` 再判断长度，`LoginSchema` 目前还没加，是待修的小漏洞。
2. **Q2（bcrypt 72 位限制）**：来自 bcrypt 底层 Blowfish 算法只处理密码前 72 字节，超出部分静默截断而非报错；不加限制时超长密码的强度打折，且用户改动 72 字节之后的内容不会改变登录结果，容易造成困惑。
3. **Q3（onError 不暴露 err.message）**：异常信息常带数据库连接串、SQL、内部路径等，直接返回等于主动信息泄露，只应 `console.error` 记录在服务器侧；纯本地开发环境（`NODE_ENV === 'development'`）判断下可以例外返回，方便调试。

**Implications**：第二十课将引入 `pino` 做结构化 JSON 日志，让 `onError` 里的 `console.error` 升级为可检索、可分级、能脱敏的生产级日志，解决"后端是黑盒"的问题。
