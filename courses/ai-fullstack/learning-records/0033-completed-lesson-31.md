# 完成第31课：让 CI 自动跑 API 测试

已在 `.github/workflows/ci.yml` 的类型检查后、Docker 构建前加入 `npm test`。工作流沿用 `ai-backend` 作为工作目录，并在 `main` 的 push 与 Pull Request 时触发。通过 Vitest Mock 外部 AI 调用，因此 CI 不需要真实的 DeepSeek 密钥。

**思考题回答**

1. **Q1（测试与 Docker 的顺序）**：`npm test` 应放在 Docker 构建前，因为测试通常更快、资源消耗更低，能尽早阻止不符合行为约定的代码继续进入后续阶段。若先构建 Docker，测试失败时仍会浪费下载基础镜像、安装依赖和构建镜像层的时间。CI 的顺序应让反馈最快、最便宜的检查先执行。这样开发者能从测试失败日志直接定位业务回归，而不是先等待无关的镜像构建完成。
2. **Q2（npm ci 失败排查）**：我会先检查 `ai-backend/package.json`、`ai-backend/package-lock.json` 是否一起提交，以及 lock 文件是否与依赖声明一致。再比对本地是否误用了 `npm install`、Node 版本是否与工作流的 Node 24 一致。不能直接改掉 CI 的 `npm ci`，因为它刻意要求依赖树可复现；绕过它只会隐藏 lock 文件不一致的问题。应修正并提交锁文件，让干净环境和本地环境使用同一套依赖。
3. **Q3（真实 DeepSeek API 验证）**：真实 API 调用会受网络、服务状态、额度、模型行为和费用影响，不适合放进每次 push 的确定性回归测试。常规 CI 继续使用 Mock，验证路由、鉴权、数据库与应用行为。真实调用应作为单独的受控集成测试，例如手动触发或定时运行，并通过 GitHub Secrets 注入专用低权限密钥。它还应限制请求量、设置超时并把结果与普通单元/API 测试分开报告。

**Implications**：第32课将清理每次测试生成的临时 SQLite 数据库，并用覆盖率报告找出尚未验证的关键分支。
