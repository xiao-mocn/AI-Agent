# 完成第八课：部署到 Render

用户使用 Render（而非课程示例的 Railway）完成了部署。
遇到两个问题：Start Command 默认是 `node index.js` 需手动改为 `npm start`；DB_PATH 指向不存在的 `/data` 目录导致 better-sqlite3 报错，删除该环境变量后恢复默认路径解决。
理解了 PaaS 部署流程：Start Command、环境变量、PORT 动态读取的必要性。

数据库当前无持久化（Render 免费计划不支持 Disk），重启后历史丢失，功能正常。

**Implications**：可以进入第九课——Vue 3 前端聊天界面，把 API 接口接入浏览器 UI。
