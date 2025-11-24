<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: currentProfile?.color }"
            >
              <span class="material-symbols-outlined text-white text-2xl">
                {{ currentProfile?.avatar }}
              </span>
            </div>
            <div>
              <h2 class="font-bold text-gray-800">{{ currentProfile?.name }}</h2>
              <p class="text-sm text-gray-600">{{ currentProfile?.points }} pts · Lvl {{ currentProfile?.level }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <router-link 
              to="/leaderboard"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <span class="material-symbols-outlined">leaderboard</span>
            </router-link>
            <router-link 
              to="/profile-selection"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <span class="material-symbols-outlined">swap_horiz</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome back, {{ currentProfile?.name }}!</h1>
        <p class="text-gray-600">What eco-friendly action will you take today?</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-green-600">star</span>
            <span class="text-2xl font-bold text-gray-800">{{ currentProfile?.points || 0 }}</span>
          </div>
          <p class="text-sm text-gray-600">Total Points</p>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-blue-600">trending_up</span>
            <span class="text-2xl font-bold text-gray-800">{{ currentProfile?.level || 1 }}</span>
          </div>
          <p class="text-sm text-gray-600">Level</p>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-emerald-600">co2</span>
            <span class="text-2xl font-bold text-gray-800">{{ (currentProfile?.co2Saved || 0).toFixed(1) }}</span>
          </div>
          <p class="text-sm text-gray-600">kg CO₂ Saved</p>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-orange-600">check_circle</span>
            <span class="text-2xl font-bold text-gray-800">{{ recentActivities.length }}</span>
          </div>
          <p class="text-sm text-gray-600">Activities</p>
        </div>
      </div>

      <!-- Log Activity Section -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-green-600">add_circle</span>
          Log Activity
        </h2>

        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined">check_circle</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Activity Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="activity in activityTypes"
            :key="activity.id"
            @click="logActivity(activity)"
            class="group p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center"
          >
            <div class="w-16 h-16 mx-auto mb-3 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition">
              <span class="material-symbols-outlined text-gray-600 group-hover:text-green-600 text-3xl transition">
                {{ activity.icon }}
              </span>
            </div>
            <h3 class="font-semibold text-gray-800 mb-1 text-sm">{{ activity.name }}</h3>
            <div class="flex items-center justify-center gap-1 text-green-600 text-xs">
              <span class="material-symbols-outlined text-sm">star</span>
              <span>+{{ activity.points }} pts</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ activity.co2Saved }}kg CO₂</p>
          </button>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600">history</span>
          Recent Activities
        </h2>

        <div v-if="recentActivities.length === 0" class="text-center py-12 text-gray-500">
          <span class="material-symbols-outlined text-6xl mb-4 text-gray-300">eco</span>
          <p>No activities yet. Start logging to earn points!</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-green-600 text-2xl">
                  {{ activity.icon }}
                </span>
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ activity.typeName }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600">+{{ activity.points }} pts</p>
              <p class="text-xs text-gray-500">{{ activity.co2Saved }}kg CO₂</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { useActivitiesStore } from '@/stores/activitiesStore'

export default {
  name: 'HomeScreenView',
  
  data() {
    return {
      successMessage: '',
      recentActivities: []
    }
  },
  
  computed: {
    userStore() {
      return useUserStore()
    },
    
    activitiesStore() {
      return useActivitiesStore()
    },
    
    currentProfile() {
      return this.userStore.getCurrentProfile
    },
    
    activityTypes() {
      return this.activitiesStore.getActivityTypes
    }
  },
  
  mounted() {
    this.loadRecentActivities()
  },
  
  methods: {
    logActivity(activityType) {
      if (!this.currentProfile) return

      const result = this.activitiesStore.logActivity({
        profileId: this.currentProfile.id,
        typeId: activityType.id,
        date: new Date().toISOString()
      })

      if (result.success) {
        this.successMessage = `Great! You earned ${activityType.points} points!`
        this.loadRecentActivities()

        setTimeout(() => {
          this.successMessage = ''
        }, 3000)
      }
    },

    loadRecentActivities() {
      if (this.currentProfile) {
        this.recentActivities = this.activitiesStore.getRecentActivities(this.currentProfile.id, 5)
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffMinutes < 1) return 'Just now'
      if (diffMinutes < 60) return `${diffMinutes}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`

      return date.toLocaleDateString()
    }
  }
}
</script>
