# 完成第十四课：前端体验完善

用户实现了三个功能：**401 自动跳登录页**（`res.status === 401` 时清 token 并 `router.push('/login')`）；**退出登录按钮**（Header 右上角，点击清 token 跳回登录页）；**多会话侧边栏**（`Session` 类型 + `sessions` 数组 + `activeSession` computed，侧边栏暗色主题样式，新建/切换对话）。

**修复 bug**：模板中 `v-for="msg in messages"` 仍读旧的独立 `ref`，而非 `activeSession.messages`，导致消息不显示；`createSession` 函数被模板调用但未定义。两处均在提交前修复。

**思考题要点**：多会话持久化用 `localStorage` + `watch({ deep: true })`，大数据量用 IndexedDB；无感续签需双 token（access + refresh）；多标签页退出同步用 `window.addEventListener('storage', ...)` 监听 localStorage 变化。

**Implications**：前端功能已较完整。下一步进入第十五课——部署上线，重点解决 Vue Router history 模式在 Render 上刷新 404 的问题，以及整理生产环境变量。
