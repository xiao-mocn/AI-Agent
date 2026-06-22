# 完成第十三课：Vue Router 登录页面

用户实现了完整的前端路由与登录流程：新增 `LoginView.vue`（登录/注册 Tab 切换、表单验证、loading 状态动画、错误/成功提示）；新增 `ChatView.vue`（从 App.vue 迁移聊天逻辑，token 改从 `localStorage.getItem('token')` 读取）；新增 `src/router/index.ts`（`createWebHistory`，`beforeEach` 路由守卫，无 token 自动跳转 `/login`，`/login` 路由排除在守卫外防止死循环）；`App.vue` 精简为 `<RouterView />`，`main.ts` 注册 vue-router。

后端 `index.ts` 中间件同步升级：`app.use('*', ...)` 改为 `app.use('/api/*', ...)`，校验逻辑从静态 ALLOWED_TOKEN 字符串比对改为 `jwt.verify()`，`/register` 和 `/login` 路由不再被拦截。

**修复 bug**：`ChatView.vue` 原来读取 `localStorage.getItem('api_token')`，与 `LoginView.vue` 存储用的 `'token'` key 不一致，提交前已修正为统一使用 `'token'`。

**Implications**：前后端鉴权体系已完整闭环。下一步可进入第十四课——优化用户体验（401 自动跳登录页、退出登录、token 刷新机制，或引入多会话管理）。
