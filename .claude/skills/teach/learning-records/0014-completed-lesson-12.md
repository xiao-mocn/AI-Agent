# 完成第十二课：JWT 用户认证

用户实现了完整的注册/登录流程：`db.ts` 新增 users 表和 `createUser`/`findUser` 预编译语句；`src/business/user.ts` 封装注册（bcrypt 哈希密码）和登录（校验密码 + 签发 JWT）路由；`src/business/chat.ts` 拆分聊天路由；`index.ts` 改为引入模块方式注册路由，完成了路由模块化重构。

额外亮点：用户主动做了**路由模块化**（business/ 目录），把原本堆在 index.ts 里的代码拆分成独立文件，工程结构更清晰。

**Implications**：可以进入第十三课——前端登录页面，用 Vue Router 实现登录/注册页，把 JWT 存入 localStorage 并在 chat 请求里携带。
