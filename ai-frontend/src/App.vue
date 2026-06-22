<template>
  <div class="chat">
    <div class="messages">
      <div v-for="(msg, i) in messages" :key="i" :class="`bubble ${msg.role}`">{{ msg.content }}</div>
      <div v-if="loading" class="bubble assistant loading">…</div>
    </div>
    <div class="input-row">
      <input v-model="input" placeholder="输入消息…" @keydown.enter="send" :disabled="loading" />
      <button @click="send" :disabled="loading">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Message = { role: 'user' | 'assistant'; content: string }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const sessionId = crypto.randomUUID()  // 每次打开页面生成新会话

const messages = ref<Message[]>([])
const input = ref('')
const loading = ref(false)

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId }),
    })
    if (!res.ok) throw new Error('请求失败')

    // 创建一个空的 assistant 消息，边读边填充
    messages.value.push({ role: 'assistant', content: '' })
    const lastMsg = messages.value[messages.value.length - 1]
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      // SSE 格式：每行一个 event
      const lines = text.split('\n')
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6)
        if (payload === '[DONE]') break
        const { delta } = JSON.parse(payload)
        lastMsg.content += delta  // 追加到消息气泡里
      }
    }
  } catch {
    messages.value.push({ role: 'assistant', content: '出错了，请稍后重试' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
}

.bubble {
  max-width: 75%;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 0.95rem;
  white-space: pre-wrap;
}

.bubble.user {
  align-self: flex-end;
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 3px;
}

.bubble.assistant {
  align-self: flex-start;
  background: #f4f4f0;
  color: #1a1a1a;
  border-bottom-left-radius: 3px;
}

.bubble.loading {
  opacity: 0.5;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e2dc;
}

.input-row input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border: 1px solid #e2e2dc;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}

.input-row input:focus {
  border-color: #2563eb;
}

.input-row button {
  padding: 0.6rem 1.2rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}

.input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>