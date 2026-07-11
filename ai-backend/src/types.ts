// Hono 的共享 Env 类型：requireAuth 中间件通过 c.set('userId', ...) 写入，
// 业务路由通过 c.get('userId') 读取，两边必须用同一个类型才能对上
export type AppEnv = {
  Variables: {
    userId: number
  }
}
