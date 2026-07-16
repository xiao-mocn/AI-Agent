# 完成第33课：CI 中的覆盖率门槛与测试报告

新增 Vitest 覆盖率配置，使用 V8 provider 输出 text 和 HTML 报告，并以 65/40/65/65 作为当前项目的 statements、branches、functions、lines 起始门槛。GitHub Actions 现在运行 `npm run test:coverage`，无论测试是否失败都会上传 `ai-backend/coverage` 为 `coverage-report` Artifact；同时将生成的覆盖率目录排除在 Git 之外。

**思考题回答**：
1. **Q1（`if: always()`）**：门槛失败只能说明低于标准，不能说明具体缺口。上传步骤使用 `if: always()` 后，失败运行仍会保留 HTML 报告，开发者可据此定位未覆盖文件和分支，而不是在本地猜测。
2. **Q2（门槛演进）**：只有在高风险分支已补测且报告长期稳定时，才适合从 45% 快速提高到 80%。对存量项目直接强制高门槛会阻塞正常改动、诱发无意义测试；应以当前基线为起点，风险驱动地逐步提高。
3. **Q3（Artifact 路径）**：`working-directory` 只影响 `run` 命令，不影响 `upload-artifact` Action 的路径解析。报告实际位于仓库根目录下的 `ai-backend/coverage`，写成 `coverage` 会找不到文件并导致上传失败。

**Implications**：第34课将学习质量门槛的演进与回归测试策略，把覆盖率数字与认证、资源归属和错误处理等高风险业务行为结合起来。
