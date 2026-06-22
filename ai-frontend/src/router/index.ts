import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../LoginView.vue'
import ChatView from '../ChatView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ChatView },
    { path: '/login', component: LoginView },
  ],
})

// 路由守卫：没有 token 就跳转登录页
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') return '/login'
})

export default router