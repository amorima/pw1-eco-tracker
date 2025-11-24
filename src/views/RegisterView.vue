<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="material-symbols-outlined text-green-600 text-5xl">family_home</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Household</h1>
        <p class="text-gray-600">Start tracking your family's eco-impact</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined">error</span>
          <span>{{ error }}</span>
        </div>
        
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined">check_circle</span>
          <span>{{ success }}</span>
        </div>

        <div>
          <label for="householdName" class="block text-sm font-medium text-gray-700 mb-2">
            Household Name
          </label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-3 text-gray-400">home</span>
            <input
              id="householdName"
              v-model="householdName"
              type="text"
              required
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Smith Family"
            />
          </div>
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
              placeholder="family@email.com"
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
              minlength="6"
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-3 text-gray-400">lock_reset</span>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
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
          <span class="material-symbols-outlined">group_add</span>
          {{ loading ? 'Creating...' : 'Create Household' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-green-600 font-semibold hover:underline">
            Sign in here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'RegisterView',
  
  data() {
    return {
      householdName: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      loading: false
    }
  },
  
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  
  methods: {
    async handleRegister() {
      this.error = ''
      this.success = ''
      
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }
      
      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters'
        return
      }
      
      const existingHousehold = this.userStore.getAllHouseholds.find(h => h.email === this.email)
      if (existingHousehold) {
        this.error = 'Email already registered'
        return
      }
      
      this.loading = true
      
      try {
        const newHousehold = this.userStore.register({
          householdName: this.householdName,
          email: this.email,
          password: this.password
        })
        
        if (newHousehold) {
          this.success = 'Household created! Redirecting to login...'
          
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        }
      } catch (err) {
        console.error('Registration error:', err)
        this.error = 'An error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
