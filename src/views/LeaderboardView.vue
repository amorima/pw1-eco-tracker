<template>
  <div class="min-h-screen bg-linear-to-br from-purple-50 to-blue-50">
    <!-- Header -->
    <header class="bg-(--system-background) shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-purple-600 text-3xl">leaderboard</span>
          <span class="text-2xl font-bold text-gray-800">Household Ranking</span>
        </div>
        <router-link to="/profile-selection" class="text-gray-600 hover:text-purple-600 transition flex items-center gap-1">
          <span class="material-symbols-outlined">swap_horiz</span>
          <span class="hidden md:inline">Switch Profile</span>
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Current Profile Card -->
      <div class="bg-(--system-background) rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex items-center gap-4">
          <div 
            class="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            :style="{ backgroundColor: currentProfile?.color }"
          >
            <img v-if="currentProfile?.avatarUrl" :src="currentProfile.avatarUrl" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-white text-4xl">
              person
            </span>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-800">{{ currentProfile?.name }}</h2>
            <p class="text-gray-600">{{ currentProfile?.points }} points · Level {{ currentProfile?.level }}</p>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-1 text-emerald-600">
              <span class="material-symbols-outlined">co2</span>
              <span class="text-2xl font-bold">{{ (userStore.currentProfileCo2Saved || 0).toFixed(1) }}kg</span>
            </div>
            <p class="text-sm text-gray-500">CO₂ Saved</p>
          </div>
        </div>
      </div>

      <!-- Leaderboard Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ currentHousehold?.householdName }}
        </h1>
        <p class="text-gray-600">Who's leading the eco-challenge?</p>
      </div>

      <!-- Leaderboard -->
      <div class="bg-(--system-background) rounded-2xl shadow-lg overflow-hidden mb-8">
        <div 
          v-for="(profile, index) in leaderboard" 
          :key="profile.id"
          :class="[
            'p-6 flex items-center justify-between transition hover:bg-gray-50',
            profile.id === currentProfile?.id ? 'bg-purple-50' : '',
            index > 0 ? 'border-t border-gray-200' : ''
          ]"
        >
          <!-- Rank & Avatar -->
          <div class="flex items-center gap-4 flex-1">
            <div class="w-12 text-center">
              <span 
                v-if="index === 0"
                class="material-symbols-outlined text-yellow-500 text-4xl"
              >
                emoji_events
              </span>
              <span 
                v-else-if="index === 1"
                class="material-symbols-outlined text-gray-400 text-4xl"
              >
                emoji_events
              </span>
              <span 
                v-else-if="index === 2"
                class="material-symbols-outlined text-amber-700 text-4xl"
              >
                emoji_events
              </span>
              <span 
                v-else
                class="text-2xl font-bold text-gray-600"
              >
                #{{ index + 1 }}
              </span>
            </div>

            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
              :style="{ backgroundColor: profile.color }"
            >
              <img v-if="profile.avatar" :src="profile.avatar" class="w-full h-full object-cover" />
              <span v-else class="material-symbols-outlined text-white text-3xl">
                person
              </span>
            </div>

            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-800 text-lg">{{ profile.name }}</p>
                <span v-if="profile.id === currentProfile?.id" class="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                  You
                </span>
              </div>
              <p class="text-sm text-gray-600">Level {{ profile.level }}</p>
            </div>
          </div>

          <!-- Points -->
          <div class="text-right">
            <p class="text-2xl font-bold text-purple-600">{{ profile.points }}</p>
            <p class="text-sm text-gray-600">points</p>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="text-center">
        <button 
          @click="goToHome"
          class="px-12 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition shadow-lg flex items-center gap-2 mx-auto"
        >
          <span>Continue to Home</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
        <p class="text-gray-500 text-sm mt-4">Tap to start tracking your activities</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LeaderboardView',
  
  computed: {
    userStore() {
      return useUserStore()
    },
    
    currentHousehold() {
      return this.userStore.currentUser
    },
    
    currentProfile() {
      return this.userStore.currentProfile
    },
    
    leaderboard() {
      return this.userStore.householdLeaderboard
    }
  },
  
  methods: {
    goToHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>

</style>