<template>
  <!-- Backdrop overlay -->
  <div v-if="isOpen" @click="toggleChat" class="fixed inset-0 bg-black/50 z-40"></div>

  <!-- Container -->
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="fixed inset-0 md:relative md:inset-auto w-screen h-screen md:w-[396px] md:h-[495px] md:rounded-lg bg-white border-2 border-(--system-ring) shadow-2xl flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-(--system-ring) h-14 px-4 flex items-center justify-between shrink-0 border-b border-(--system-ring)"
      >
        <div class="flex gap-2.5 items-center">
          <span class="font-bold text-base text-(--text-body-titles)">Assistente Virtual</span>
          <div
            class="w-2 h-2 rounded-full transition-colors"
            :class="{
              'bg-green-500': connectionStatus === 'connected',
              'bg-red-500': connectionStatus === 'disconnected',
              'bg-orange-500': connectionStatus === 'loading',
            }"
          ></div>
        </div>
        <button
          @click="toggleChat"
          class="w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span class="material-symbols-outlined text-2xl text-(--text-body-titles)">close</span>
        </button>
      </div>

      <!-- Messages Area -->
      <div ref="messagesArea" class="flex-1 overflow-y-auto px-4 py-4 bg-white">
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
          <p class="text-sm text-(--text-disabled) text-center">Olá! Como posso ajudar hoje?</p>
        </div>

        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <!-- User Message -->
          <div v-if="message.type === 'user'" class="flex justify-end">
            <div class="bg-(--system-ring) px-4 py-2 rounded-lg max-w-[80%]">
              <p class="text-sm text-white">{{ message.content }}</p>
            </div>
          </div>

          <!-- Bot Message -->
          <div v-if="message.type === 'bot'" class="flex justify-start">
            <div
              class="bg-(--system-background) border border-(--system-border) px-4 py-2 rounded-lg max-w-[80%]"
            >
              <p class="text-sm text-(--text-body)">{{ message.content }}</p>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div
            class="bg-(--system-background) border border-(--system-border) px-4 py-2 rounded-lg"
          >
            <p class="text-sm text-(--text-disabled)">A escrever...</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="!hasInteracted" class="px-4 py-2 bg-white shrink-0">
        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="action in quickActions"
            :key="action.id"
            @click="sendQuickAction(action.text)"
            class="bg-(--system-ring) px-2.5 py-3 rounded text-sm text-white text-center hover:opacity-90 transition-opacity"
          >
            {{ action.label }}
          </button>
        </div>
      </div>

      <!-- Input Area -->
      <div class="px-4 py-3 bg-white border-t border-(--system-border) shrink-0">
        <div class="flex gap-2.5 items-center">
          <div class="flex-1">
            <input
              v-model="currentMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Pergunte qualquer coisa"
              class="w-full h-14 px-3 bg-(--system-background) border-2 border-(--system-ring) rounded-lg text-sm text-(--text-body) placeholder:text-(--text-disabled) outline-none"
            />
          </div>
          <button
            @click="sendMessage"
            class="w-14 h-14 flex items-center justify-center bg-(--system-ring) rounded-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!currentMessage.trim() || isLoading"
          >
            <span class="material-symbols-outlined text-3xl text-white">send</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="w-16 h-16 bg-(--system-ring) rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 shadow-lg transition-opacity"
    >
      <span class="material-symbols-outlined text-5xl text-white">support_agent</span>
    </button>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'ChatBot',
  props: {
    context: {
      type: String,
      default: 'general',
      validator: (value) => ['general', 'admin', 'profile'].includes(value),
    },
  },
  data() {
    return {
      isOpen: false,
      currentMessage: '',
      messages: [],
      isLoading: false,
      hasInteracted: false,
      connectionStatus: 'connected',
      quickActions: [
        { id: 1, label: 'Falar com assistente', text: 'Preciso de ajuda' },
        { id: 2, label: 'Ver último consumo', text: 'Qual foi o meu último consumo?' },
        { id: 3, label: 'Ver ranking', text: 'Qual é a minha posição no ranking?' },
        { id: 4, label: 'Troubleshooting', text: 'Tenho um problema técnico' },
      ],
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    // Current profile for personalized responses
    activeProfile() {
      return this.userStore.currentProfile
    },
    // Current user account for context
    activeUser() {
      return this.userStore.currentUser
    },
  },
  methods: {
    async toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        if (this.messages.length === 0) {
          this.messages.push({
            type: 'bot',
            content: 'Olá! Sou o assistente virtual da B.green. Como posso ajudar?',
            timestamp: new Date(),
          })
        }
      }
    },

    async checkConnection() {
      this.connectionStatus = 'loading'
      const endpoint = import.meta.env.VITE_CHATBOT_API_ENDPOINT
      const apiKey = import.meta.env.VITE_CHATBOT_API_KEY

      if (!endpoint || !apiKey) {
        this.connectionStatus = 'disconnected'
        return
      }

      try {
        const response = await fetch(endpoint, {
          method: 'HEAD',
          headers: { 'x-api-key': apiKey },
        })
        this.connectionStatus = response.ok ? 'connected' : 'disconnected'
      } catch {
        this.connectionStatus = 'disconnected'
      }
    },

    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return

      this.hasInteracted = true
      const userMessage = this.currentMessage.trim()
      this.currentMessage = ''

      this.messages.push({
        type: 'user',
        content: userMessage,
        timestamp: new Date(),
      })

      this.scrollToBottom()

      this.isLoading = true

      try {
        const response = await this.callChatbotAPI(userMessage)

        this.messages.push({
          type: 'bot',
          content: response,
          timestamp: new Date(),
        })
        this.connectionStatus = 'connected'
      } catch (error) {
        console.error('Chatbot API error:', error)
        this.messages.push({
          type: 'bot',
          content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
          timestamp: new Date(),
        })
        this.connectionStatus = 'disconnected'
      } finally {
        this.isLoading = false
        this.scrollToBottom()
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesArea) {
          this.$refs.messagesArea.scrollTop = this.$refs.messagesArea.scrollHeight
        }
      })
    },

    sendQuickAction(text) {
      this.hasInteracted = true
      this.currentMessage = text
      this.sendMessage()
    },

    async callChatbotAPI(message) {
      const endpoint = import.meta.env.VITE_CHATBOT_API_ENDPOINT
      const apiKey = import.meta.env.VITE_CHATBOT_API_KEY
      const channelId = import.meta.env.VITE_CHATBOT_CHANNEL_ID

      console.log('🔧 Environment Variables:', {
        endpoint: endpoint ? '✅ Set' : '❌ Missing',
        apiKey: apiKey ? '✅ Set' : '❌ Missing',
        channelId: channelId ? '✅ Set' : '❌ Missing',
      })

      if (!endpoint || !apiKey || !channelId) {
        console.error('❌ Missing environment variables for chatbot')
        throw new Error('Configuração do chatbot incompleta')
      }

      const formData = new FormData()

      // Required fields per iaedu API
      formData.append('channel_id', channelId)
      formData.append('thread_id', `thread_${this.activeProfile?.id || 'guest'}_${Date.now()}`)

      // User information - mandatory field
      const userInfo = {
        userId: this.activeProfile?.id,
        userName: this.activeProfile?.name,
        userEmail: this.activeUser?.email,
        context: this.context,
      }
      formData.append('user_info', JSON.stringify(userInfo))

      // The actual message
      formData.append('message', message)

      // Optional: user_id
      if (this.activeProfile?.id) {
        formData.append('user_id', this.activeProfile.id.toString())
      }

      // Optional: user_context with additional context
      const userContext = {
        contextType: this.context,
        profileType: this.activeProfile?.isAdmin ? 'admin' : 'user',
        profileLevel: this.activeProfile?.level || 1,
        profilePoints: this.activeProfile?.points || 0,
      }
      formData.append('user_context', JSON.stringify(userContext))

      // Debug: Log request details
      console.log('📤 Sending request to:', endpoint)
      console.log('📝 Message:', message)
      console.log('👤 Active Profile:', this.activeProfile)
      console.log('🏠 Active User:', this.activeUser?.email)

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
          },
          body: formData,
        })

        console.log('📥 Response status:', response.status, response.statusText)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error Response:', errorText)
          console.error('Status:', response.status)
          console.error('Headers:', Object.fromEntries(response.headers.entries()))
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        // Handle streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assembledMessage = ''

        console.log('📖 Reading stream...')

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })

          // Split by newlines to process each JSON object
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (!line.trim()) continue

            try {
              const data = JSON.parse(line)
              console.log('📦 Chunk parsed:', data)

              // Extract content from token chunks
              if (data.type === 'token' && data.content) {
                assembledMessage += data.content
              } else if (data.type === 'start') {
                console.log('🚀 Stream started')
              } else if (data.type === 'done') {
                console.log('✅ Stream complete')
              }
            } catch {
              console.log('⚠️ Could not parse line:', line)
            }
          }
        }

        console.log('✅ Assembled message:', assembledMessage)

        return assembledMessage || 'Desculpe, não consegui processar a resposta.'
      } catch (error) {
        console.error('❌ Chatbot API error:', error)
        console.error('Error type:', error.constructor.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        throw error
      }
    },

    clearChat() {
      this.messages = []
      this.currentMessage = ''
    },
  },
}
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-feature-settings: 'liga';
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--system-ring, #8cb161);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--text-body-sub-titles, #426934);
}
</style>
