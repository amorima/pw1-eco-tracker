<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="material-symbols-outlined text-green-600 text-5xl">eco</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to your household</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined">error</span>
          <span>{{ error }}</span>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-3 text-gray-400">mail</span>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-3 text-gray-400">lock</span>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">login</span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have a household account?
          <router-link to="/register" class="text-green-600 font-semibold hover:underline">
            Register here
          </router-link>
        </p>
      </div>

      <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-gray-700 font-semibold mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600">info</span>
          Test Account:
        </p>
        <p class="text-xs text-gray-600">Email: demo@eco.com</p>
        <p class="text-xs text-gray-600">Password: demo123</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LoginView',
  
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  
  mounted() {
    this.userStore.seedData()
  },
  
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true
      
      try {
        const result = this.userStore.login(this.email, this.password)
        
        if (result.success) {
          this.$router.push('/profile-selection')
        } else {
          this.error = result.message
        }
      } catch (err) {
        console.error('Login error:', err)
        this.error = 'An error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
