<template>
  <div class="layout">
    <!-- 顶部 Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-icon">✦</span>
          <span class="logo-text">AI 助手</span>
        </div>
      </div>
    </header>

    <!-- 消息区域 -->
    <main class="messages" ref="messagesEl">
      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty">
        <div class="empty-icon">✦</div>
        <p class="empty-title">有什么我可以帮你的？</p>
        <p class="empty-sub">我是你的 AI 全栈工程师助教</p>
      </div>

      <div v-for="(msg, i) in messages" :key="i" :class="`row ${msg.role}`">
        <div v-if="msg.role === 'assistant'" class="avatar">✦</div>
        <div class="bubble">{{ msg.content }}</div>
      </div>

      <!-- Loading 动画 -->
      <div v-if="loading" class="row assistant">
        <div class="avatar">✦</div>
        <div class="bubble loading-bubble">
          <span class="dot" /><span class="dot" /><span class="dot" />
        </div>
      </div>

      <div ref="bottomEl" />
    </main>

    <!-- 输入区域 -->
    <footer class="footer">
      <div class="input-wrap">
        <input v-model="input" placeholder="输入消息，按 Enter 发送…" @keydown.enter="send" :disabled="loading" />
        <button @click="send" :disabled="loading || !input.trim()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

type Message = { role: 'user' | 'assistant'; content: string }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const sessionId = crypto.randomUUID()

const messages = ref<Message[]>([])
const input = ref('')
const loading = ref(false)
const bottomEl = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => bottomEl.value?.scrollIntoView({ behavior: 'smooth' }))
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true
  scrollToBottom()

  try {
    let token = localStorage.getItem('token')

    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: text, sessionId }),
    })
    if (!res.ok) throw new Error('请求失败')

    messages.value.push({ role: 'assistant', content: '' })
    const lastMsg = messages.value[messages.value.length - 1]
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (payload === '[DONE]') break
        const { delta } = JSON.parse(payload)
        lastMsg.content += delta
        scrollToBottom()
      }
    }
  } catch {
    messages.value.push({ role: 'assistant', content: '出错了，请稍后重试' })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f6f6f4;
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Header */
.header {
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  flex-shrink: 0;
}

.header-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 1.1rem;
  color: #2563eb;
}

.logo-text {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* 消息列表 */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
}

/* 空状态 */
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #999;
  padding-bottom: 6rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: #2563eb;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #555;
}

.empty-sub {
  font-size: 0.9rem;
}

/* 消息行 */
.row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.row.user {
  flex-direction: row-reverse;
}

/* 头像 */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 气泡 */
.bubble {
  max-width: 72%;
  padding: 0.7rem 1rem;
  border-radius: 16px;
  line-height: 1.65;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.row.user .bubble {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.row.assistant .bubble {
  background: #fff;
  color: #1a1a1a;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* Loading 动画 */
.loading-bubble {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 0.9rem 1rem;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #aaa;
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* 输入区域 */
.footer {
  background: #f6f6f4;
  padding: 1rem 1.5rem 1.5rem;
  flex-shrink: 0;
}

.input-wrap {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: border-color 0.2s;
}

.input-wrap:focus-within {
  border-color: #2563eb;
}

.input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;
  color: #1a1a1a;
  line-height: 1.5;
}

.input-wrap input::placeholder {
  color: #bbb;
}

.input-wrap button {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, opacity 0.15s;
}

.input-wrap button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.input-wrap button:not(:disabled):hover {
  background: #1d4ed8;
}
</style>