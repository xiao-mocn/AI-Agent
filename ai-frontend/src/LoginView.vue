<template>
  <div class="auth-wrap">
    <div class="auth-box">
      <!-- Logo -->
      <div class="logo">
        <span class="logo-icon">✦</span>
        <span class="logo-text">AI Chat</span>
      </div>

      <!-- Tab 切换 -->
      <div class="tabs">
        <button :class="['tab', { active: isLogin }]" @click="isLogin = true; error = ''">登录</button>
        <button :class="['tab', { active: !isLogin }]" @click="isLogin = false; error = ''">注册</button>
      </div>

      <!-- 表单 -->
      <div class="form">
        <div class="field">
          <label>用户名</label>
          <input v-model="username" placeholder="请输入用户名" autocomplete="username" @keydown.enter="submit" />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="password" placeholder="请输入密码" type="password" autocomplete="current-password" @keydown.enter="submit" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="successMsg" class="success">{{ successMsg }}</p>

        <button class="submit-btn" :disabled="loading" @click="submit">
          <span v-if="loading" class="spinner"></span>
          <span v-else>{{ isLogin ? '登录' : '注册账号' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const router = useRouter()
const isLogin = ref(true)
const username = ref('')
const password = ref('')
const error = ref('')
const successMsg = ref('')
const loading = ref(false)

async function submit() {
  if (!username.value || !password.value) { error.value = '请填写用户名和密码'; return }
  error.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    const path = isLogin.value ? '/login' : '/register'
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await res.json()
    if (!res.ok) { error.value = data.error; return }

    if (isLogin.value) {
      localStorage.setItem('token', data.token)
      router.push('/')
    } else {
      successMsg.value = '注册成功，请登录'
      isLogin.value = true
      password.value = ''
    }
  } catch {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.auth-box {
  background: #fff;
  border-radius: 20px;
  padding: 40px 36px 36px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.logo-icon {
  font-size: 22px;
  color: #667eea;
}
.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 0.5px;
}

/* Tabs */
.tabs {
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
}
.tab {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}
.tab.active {
  background: #fff;
  color: #667eea;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  text-align: left;
  align-self: flex-start;
}
.field input {
  padding: 11px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #f9fafb;
}
.field input:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}
.field input::placeholder {
  color: #9ca3af;
}

/* Messages */
.error {
  font-size: 13px;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0;
}
.success {
  font-size: 13px;
  color: #10b981;
  background: #ecfdf5;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0;
}

/* Submit button */
.submit-btn {
  margin-top: 4px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
}
.submit-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}
.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>