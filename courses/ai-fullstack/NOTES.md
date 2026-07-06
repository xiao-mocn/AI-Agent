# 教学笔记

## 用户偏好

- 用简体中文交流和教学
- 前端（Vue 3 + React）双栈熟练，TypeScript 有生产项目经验
- 每天 1-2 小时，倾向于每次完成有成就感的小目标
- 目标驱动型：知道"为什么"之后再学"怎么做"更有动力

## 节奏建议

- 课程保持短小精悍，每节课给一个明确的"胜利点"
- 后端内容尽量用 TypeScript（用户已熟悉），减少语言切换成本
- 避免先讲大量理论，尽快让用户跑起来看到效果

## AI 接口选择

- 用户使用 DeepSeek API（没有 Claude API 访问权限）
- 使用 openai SDK + baseURL 指向 DeepSeek，兼容 OpenAI 格式
- 模型：deepseek-chat（DeepSeek-V3）
