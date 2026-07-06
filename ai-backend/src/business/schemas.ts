import { z } from 'zod'

export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, '用户名至少 3 位')
    .max(30, '用户名最多 30 位')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  password: z
    .string()
    .min(6, '密码至少 6 位')
    .max(72, '密码最多 72 位'),   // bcrypt 只处理前 72 字节
})

export const LoginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

export const ChatSchema = z.object({
  message: z
    .string()
    .min(1, '消息不能为空')
    .max(4000, '消息最多 4000 字'),
  sessionId: z.number().int().positive('sessionId 必须是正整数'),
})
