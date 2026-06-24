# 完成第十五课：部署上线

用户实现了 Vue Router history 模式在 Render 上的部署修复：
- 创建了 `public/_redirects` 文件，所有路径返回 `index.html`
- 发现 Render 对 `_redirects` 解析不完整（文件存在但规则未生效）
- 最终在 Render Dashboard → Redirects/Rewrites 添加手工 Rewrite 规则：`/*` → `/index.html`，成功解决刷新 404

**遗留注意事项**：
- `_redirects` 文件已保留在项目中，Netlify 等其他平台可直接使用
- `.gitattributes` 已添加以强制 LF 换行符

**思考题回答**：
1. **Q1（SQLite 数据丢失）**：生产环境应使用托管 PostgreSQL（Render PostgreSQL / Supabase / Neon），第十六课将解决
2. **Q2（多环境 VITE_API_URL）**：本地 `.env.development` + 生产 Render Environment 变量分开配置
3. **Q3（冷启动问题）**：付费套餐、UptimeRobot 定时 ping、或迁移到国内服务器

**Implications**：部署解决后，第十六课将处理数据库迁移（SQLite → PostgreSQL），解决生产数据持久化问题。
