<template>
  <!-- Backdrop overlay -->
  <div 
    v-if="isOpen" 
    @click="toggleChat"
    class="fixed inset-0 bg-black/50 z-40"
  ></div>
  
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Window -->
    <div 
      v-if="isOpen"
      class="bg-(--system-card) border border-(--system-ring) flex flex-col gap-[10px] items-end justify-end overflow-hidden p-4 rounded-[8px] w-[396px] h-[495px] mb-[90px]"
    >
      <!-- Header -->
      <div class="absolute bg-(--system-card-foreground) flex h-[56px] items-center justify-between left-0 top-0 overflow-hidden px-4 py-2 w-full">
        <div class="flex gap-[10px] items-center">
          <p class="font-['Noto_Sans'] font-bold text-[16px] leading-[1.5] text-white">
            Assistente Virtual
          </p>
          <div class="w-[7px] h-[7px] bg-green-500 rounded-full"></div>
        </div>
        <button @click="toggleChat" class="w-[24px] h-[24px] cursor-pointer hover:opacity-80">
          <span class="material-symbols-outlined text-[24px] text-white">close</span>
        </button>
      </div>
      
      <!-- Messages Area -->
      <div class="flex-1 w-full overflow-y-auto mt-[56px] mb-[132px] px-2">
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
          <p class="font-['Noto_Sans'] font-normal text-[14px] text-(--text-disabled) text-center">
            Olá! Como posso ajudar hoje?
          </p>
        </div>
        
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <!-- User Message -->
          <div v-if="message.type === 'user'" class="flex justify-end mb-2">
            <div class="bg-(--system-ring) px-4 py-2 rounded-[8px] max-w-[80%]">
              <p class="font-['Noto_Sans'] font-normal text-[14px] text-white">
                {{ message.content }}
              </p>
            </div>
          </div>
          
          <!-- Bot Message -->
          <div v-if="message.type === 'bot'" class="flex justify-start mb-2">
            <div class="bg-(--system-background) border border-(--system-border) px-4 py-2 rounded-[8px] max-w-[80%]">
              <p class="font-['Noto_Sans'] font-normal text-[14px] text-(--text-body)">
                {{ message.content }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start mb-2">
          <div class="bg-(--system-background) border border-(--system-border) px-4 py-2 rounded-[8px]">
            <p class="font-['Noto_Sans'] font-normal text-[14px] text-(--text-disabled)">
              A escrever...
            </p>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-[10px] w-full absolute bottom-[72px] left-0 px-4">
        <button 
          v-for="action in quickActions" 
          :key="action.id"
          @click="sendQuickAction(action.text)"
          class="bg-(--system-ring) flex items-center justify-center h-[56px] overflow-hidden p-[10px] rounded-[4px] cursor-pointer hover:opacity-90"
        >
          <p class="font-['Noto_Sans'] font-normal text-[14px] text-white text-center">
            {{ action.label }}
          </p>
        </button>
      </div>
      
      <!-- Input Area -->
      <div class="flex gap-[10px] items-center justify-center w-full absolute bottom-4 left-0 px-4">
        <div class="flex-1">
          <div class="bg-(--system-background) border-2 border-(--system-ring) flex items-center overflow-hidden p-[12px] rounded-[8px] h-[56px] w-full">
            <input
              v-model="currentMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Pergunte qualquer coisa"
              class="font-['Noto_Sans'] font-bold text-[16px] text-(--text-disabled) bg-transparent border-none outline-none w-full"
            />
          </div>
        </div>
        <button 
          @click="sendMessage"
          class="bg-(--system-ring) overflow-hidden rounded-[6px] w-[56px] h-[56px] flex items-center justify-center cursor-pointer hover:opacity-90"
          :disabled="!currentMessage.trim() || isLoading"
        >
          <span class="material-symbols-outlined text-[34px] text-white transform rotate-90">
            arrow_upward
          </span>
        </button>
      </div>
    </div>
    
    <!-- Floating Button -->
    <button 
      @click="toggleChat"
      class="bg-(--system-ring) flex items-center overflow-hidden p-2 rounded-full cursor-pointer hover:opacity-90 shadow-lg"
    >
      <span class="material-symbols-outlined text-[54px] text-white">
        support_agent
      </span>
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
      validator: (value) => ['general', 'admin', 'profile'].includes(value)
    }
  },
  data() {
    return {
      isOpen: false,
      currentMessage: '',
      messages: [],
      isLoading: false,
      quickActions: [
        { id: 1, label: 'Falar com assistente', text: 'Preciso de ajuda' },
        { id: 2, label: 'Ver último consumo', text: 'Qual foi o meu último consumo?' },
        { id: 3, label: 'Ver ranking', text: 'Qual é a minha posição no ranking?' },
        { id: 4, label: 'Troubleshooting', text: 'Tenho um problema técnico' }
      ]
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
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen && this.messages.length === 0) {
        // Add welcome message
        this.messages.push({
          type: 'bot',
          content: 'Olá! Sou o assistente virtual da B.green. Como posso ajudar?',
          timestamp: new Date()
        })
      }
    },
    
    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return
      
      const userMessage = this.currentMessage.trim()
      this.currentMessage = ''
      
      // Add user message
      this.messages.push({
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      })
      
      // Scroll to bottom
      this.$nextTick(() => {
        const messagesArea = this.$el.querySelector('.overflow-y-auto')
        if (messagesArea) {
          messagesArea.scrollTop = messagesArea.scrollHeight
        }
      })
      
      // Show loading
      this.isLoading = true
      
      try {
        // Call API with user context
        const response = await this.callChatbotAPI(userMessage)
        
        // Add bot response
        this.messages.push({
          type: 'bot',
          content: response,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Chatbot API error:', error)
        this.messages.push({
          type: 'bot',
          content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
          timestamp: new Date()
        })
      } finally {
        this.isLoading = false
        
        // Scroll to bottom
        this.$nextTick(() => {
          const messagesArea = this.$el.querySelector('.overflow-y-auto')
          if (messagesArea) {
            messagesArea.scrollTop = messagesArea.scrollHeight
          }
        })
      }
    },
    
    sendQuickAction(text) {
      this.currentMessage = text
      this.sendMessage()
    },
    
    async callChatbotAPI(message) {
      const endpoint = import.meta.env.VITE_CHATBOT_API_ENDPOINT
      const apiKey = import.meta.env.VITE_CHATBOT_API_KEY
      const channelId = import.meta.env.VITE_CHATBOT_CHANNEL_ID
      
      // Debug: Log environment variables
      console.log('🔧 Environment Variables:', {
        endpoint: endpoint ? '✅ Set' : '❌ Missing',
        apiKey: apiKey ? '✅ Set' : '❌ Missing',
        channelId: channelId ? '✅ Set' : '❌ Missing'
      })
      
      if (!endpoint || !apiKey || !channelId) {
        console.error('❌ Missing environment variables for chatbot')
        console.error('Endpoint:', endpoint)
        console.error('API Key:', apiKey ? 'Set (hidden)' : 'Not set')
        console.error('Channel ID:', channelId)
        throw new Error('Configuração do chatbot incompleta')
      }
      
      // Create FormData with required fields
      const formData = new FormData()
      
      // Required fields
      formData.append("channel_id", channelId)
      formData.append("thread_id", `thread_${this.activeProfile?.id || 'guest'}_${Date.now()}`)
      
      // User information including context
      const userInfo = {
        userId: this.activeProfile?.id,
        userName: this.activeProfile?.name,
        userEmail: this.activeUser?.email,
        context: this.context,
        timestamp: new Date().toISOString()
      }
      formData.append("user_info", JSON.stringify(userInfo))
      
      // The actual message
      formData.append("message", message)
      
      // Optional: Add user_id
      if (this.activeProfile?.id) {
        formData.append("user_id", this.activeProfile.id.toString())
      }
      
      // Optional: Add user_context for additional context
      const userContext = {
        contextType: this.context,
        profileType: this.activeProfile?.isAdmin ? 'admin' : 'user',
        profileLevel: this.activeProfile?.level || 1,
        profilePoints: this.activeProfile?.points || 0,
        householdSize: this.activeUser?.profiles?.length || 1
      }
      formData.append("user_context", JSON.stringify(userContext))
      
      // Debug: Log request details
      console.log('📤 Sending request to:', endpoint)
      console.log('📝 Message:', message)
      console.log('👤 Active Profile:', this.activeProfile)
      console.log('🏠 Active User:', this.activeUser?.email)
      
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            'x-api-key': apiKey
          },
          body: formData
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
        let fullResponse = ''
        
        console.log('📖 Reading stream...')
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk
          console.log('📦 Chunk received:', chunk.substring(0, 100))
        }
        
        console.log('✅ Full response received:', fullResponse.substring(0, 200))
        
        // Parse the response (adjust based on actual API response format)
        try {
          const data = JSON.parse(fullResponse)
          console.log('📊 Parsed JSON:', data)
          return data.response || data.message || data.content || fullResponse
        } catch (parseError) {
          console.log('⚠️ Not JSON, returning as plain text')
          // If not JSON, return as plain text
          return fullResponse
        }
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
    }
  }
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
