# ---- 阶段一：builder，装依赖 + 编译原生模块 ----
FROM node:24-slim AS builder
WORKDIR /app

# better-sqlite3 编译需要这些系统工具
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# ---- 阶段二：runtime，只留运行需要的东西 ----
FROM node:24-slim
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]