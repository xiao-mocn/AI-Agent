# 完成第二十三课：CI/CD 自动化部署

为 `ai-backend` 添加了 `.github/workflows/ci.yml`，每次 push 到 `main` 或发起 PR 时自动运行类型检查（`npx tsc --noEmit`）和 Docker 镜像构建验证（`docker build -t ai-backend:ci .`）。由于当前项目还没有真实测试用例，workflow 暂时没有加入 `npm test`，等后续补齐测试后再扩展。

**思考题回答**：
1. **Q1（CI 里为什么要跑 docker build）**：第二十二课已经证明"本地能跑"不等于"容器能跑"，原生模块、系统依赖、Node 版本在本地和 Linux 容器里都可能不同。CI 里加 `docker build` 能在干净的 Ubuntu 环境中提前暴露构建问题，避免坏提交触发 Render 自动部署后才发现线上挂掉。
2. **Q2（固定 node-version 的意义）**：`setup-node` 不指定版本会用 runner 默认 Node，可能与本地、Dockerfile 不一致，导致"我这能跑"。写死 `node-version: '24'` 和 Dockerfile 里的 `node:24-slim` 是同一思路：让本地、CI、生产环境保持一致，减少环境差异带来的意外。
3. **Q3（为什么不自己写 Render 部署脚本）**：自己调用 Render API 需要管理额外密钥、维护调用逻辑、跟进 Render 接口变更，还要自己处理回滚和日志。让 Render 的 Git 集成负责部署，GitHub Actions 专注做"质量门禁"，职责更清晰，也更能发挥平台自带能力。

**Implications**：第二十四课将学习定时任务与后台队列，了解如何在 Node.js 服务里安全地跑定时任务，以及用消息队列处理耗时异步任务，避免阻塞主请求。
