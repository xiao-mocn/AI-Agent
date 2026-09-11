---
name: ai-fullstack-mission
description: 近期具备公司 Java 后端辅助开发能力，长期能够独立开发 AI 全栈应用
metadata:
  type: project
---

# Mission: AI 全栈工程师

## Why

近期需要参与公司的 Java 后端代码修改，因此先建立阅读、定位和安全修改 `eao-api` 的能力，降低从熟悉的前端开发进入企业后端项目的门槛。长期仍要能够独立开发并上线包含前端、后端 API、数据库和 AI 集成的完整产品。

## Success looks like

**近期目标：eao-api 后端上岗桥接（两周）**

- 看到前端 API 地址后，能在 10 分钟内定位 `Controller → VO → Service → ServiceImpl → Convert → DO → Mapper/XML`
- 能用自己的话解释请求参数、业务规则、数据库查询和响应数据分别经过哪里
- 能在同事或 AI 指导下完成增加字段、增加分页筛选条件和增加简单业务校验
- 修改前能列出影响范围，修改后会检查 Git diff，并运行相关测试或接口验证
- 离开已经练习过的品牌模块后，能在另一个简单 CRUD 模块中迁移同一套定位方法

**长期目标：独立交付 AI 全栈应用**

- 能独立编写并维护 Node.js + TypeScript 或 Java Spring Boot 后端
- 能安全调用 LLM API，实现对话、内容生成等功能
- 能使用数据库持久化业务数据和对话历史
- 能将完整应用部署到可访问的环境
- 遇到全栈问题时，能判断问题位于前端、HTTP、业务、数据访问、数据库还是外部依赖

## Constraints

- 每天 1～2 小时学习时间
- 前端 Vue 3、React 和 TypeScript 已有生产项目经验
- 当前能跟随步骤完成后端练习，但基本不能独立阅读大型 Java 项目
- 两周内优先形成在指导下处理简单后端改动的能力，不追求独立开发复杂模块
- 采用项目驱动方式：约 40% 阅读 `eao-api`/`eao-front`，约 60% 在课程项目中仿真实践
- `eao-api` 和 `eao-front` 在桥接课程中保持只读

## Out of scope

- 两周内独立设计大型后端模块或处理高风险生产缺陷
- 桥接阶段深入 JPA、Flyway、Spring Security、权限、多租户和多数据源内部实现
- 桥接阶段深入 Redis、MQ、MQTT、WebSocket、TDengine、S3 和 Kubernetes
- 机器学习或模型训练
- 同时推进新的 AI 集成功能；完成桥接阶段后再恢复长期主线
