# 完成第二十二课：Docker 容器化

写了 `ai-backend/Dockerfile`（多阶段构建：builder 阶段装 `python3`/`make`/`g++` 编译 `better-sqlite3` 等原生模块，runtime 阶段只复制编译好的 `node_modules` 和源码）和 `.dockerignore`，`HEALTHCHECK` 接入了第二十一课的 `/health` 接口。实际构建运行时遇到了 WSL2 环境未就绪、Render 数据库内网地址不可达、外部连接强制要求 SSL 等一连串真实部署问题，逐一解决后在 `db.ts` 里给 PG 连接池加了 `ssl: { rejectUnauthorized: false }`，最终 `docker ps` 显示容器状态为 `(healthy)`。

**思考题回答**：
1. **Q1（跨平台原生模块）**：Windows 编译出的 `.node` 二进制是 PE 格式、面向 MSVC 运行时，Linux 容器要的是 ELF 格式配 glibc，操作系统加载器完全无法解析对方的格式，通常会报类似"invalid ELF header"或找不到共享库的加载错误，而不是运行时逻辑错误——这也是为什么 Dockerfile 必须让 `npm ci` 在容器内部重新跑一遍。
2. **Q2（HEALTHCHECK 探测 /ready 的风险）**：数据库抖动几秒会让 `/ready` 连续返回 503，`docker ps` 判定容器 unhealthy，如果配了自动重启策略就会去杀一个其实完全正常的进程——和第二十一课 liveness 查数据库的连锁反应是同一个错误模式：把"依赖暂时不可用"当成"进程本身坏了"来处理。
3. **Q3（分层缓存与 COPY 顺序）**：Docker 镜像按指令分层缓存，如果一开始就 `COPY . .` 再 `npm ci`，源码改一行都会让这层缓存失效进而重跑耗时的依赖安装；先单独 `COPY package.json package-lock.json` 再 `npm ci`，只有依赖清单变化时才会重新安装，源码怎么改都能复用缓存层，构建速度快很多。

**Implications**：第二十三课将学习 CI/CD 自动化部署，用 GitHub Actions 在每次推送代码后自动跑测试、构建镜像，实现"合并代码即部署"的自动化流水线。
