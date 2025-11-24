<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-black bg-opacity-50 py-4">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-green-500 text-3xl">eco</span>
          <span class="text-xl font-bold text-white">Eco Tracker</span>
        </div>
        <button 
          @click="handleLogout"
          class="text-white hover:text-gray-300 transition flex items-center gap-2"
        >
          <span class="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-5xl mx-auto px-4 py-20">
      <h1 class="text-5xl font-bold text-white text-center mb-12">
        Who's taking action today?
      </h1>

      <!-- Profiles Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div 
          v-for="profile in profiles" 
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="group cursor-pointer"
        >
          <div 
            class="aspect-square rounded-lg overflow-hidden mb-4 border-4 border-transparent group-hover:border-white transition"
            :style="{ backgroundColor: profile.color }"
          >
            <div class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-white" style="font-size: 80px;">
                {{ profile.avatar }}
              </span>
            </div>
          </div>
          <p class="text-white text-center font-medium group-hover:text-gray-300 transition">
            {{ profile.name }}
          </p>
          <p class="text-gray-400 text-sm text-center">
            {{ profile.points }} pts · Level {{ profile.level }}
          </p>
        </div>

        <!-- Add Profile Button -->
        <div 
          @click="showAddProfile = true"
          class="group cursor-pointer"
        >
          <div 
            class="aspect-square rounded-lg overflow-hidden mb-4 border-4 border-transparent group-hover:border-white transition bg-gray-800 flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-400 group-hover:text-white transition" style="font-size: 80px;">
              add_circle
            </span>
          </div>
          <p class="text-gray-400 text-center font-medium group-hover:text-white transition">
            Add Profile
          </p>
        </div>
      </div>

      <!-- Household Info -->
      <div class="text-center text-gray-400">
        <p class="text-sm">{{ currentHousehold?.householdName }}</p>
      </div>
    </div>

    <!-- Add Profile Modal -->
    <div 
      v-if="showAddProfile" 
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
      @click.self="showAddProfile = false"
    >
      <div class="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined">person_add</span>
          Create Profile
        </h2>

        <form @submit.prevent="handleCreateProfile" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              v-model="newProfile.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Family member name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Avatar Icon
            </label>
            <div class="grid grid-cols-4 gap-3">
              <div 
                v-for="icon in avatarIcons" 
                :key="icon"
                @click="newProfile.avatar = icon"
                :class="[
                  'aspect-square rounded-lg flex items-center justify-center cursor-pointer transition',
                  newProfile.avatar === icon 
                    ? 'bg-green-600 ring-2 ring-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                <span class="material-symbols-outlined text-white text-3xl">
                  {{ icon }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div class="grid grid-cols-6 gap-2">
              <div 
                v-for="color in colorOptions" 
                :key="color"
                @click="newProfile.color = color"
                :class="[
                  'aspect-square rounded-lg cursor-pointer transition',
                  newProfile.color === color ? 'ring-2 ring-white scale-110' : ''
                ]"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showAddProfile = false"
              class="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'ProfileSelectionView',
  
  data() {
    return {
      showAddProfile: false,
      newProfile: {
        name: '',
        avatar: 'person',
        color: '#3b82f6'
      },
      avatarIcons: ['person', 'face', 'child_care', 'elderly', 'boy', 'girl', 'family_restroom', 'pets'],
      colorOptions: ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']
    }
  },
  
  computed: {
    userStore() {
      return useUserStore()
    },
    
    currentHousehold() {
      return this.userStore.getCurrentHousehold
    },
    
    profiles() {
      return this.userStore.getHouseholdProfiles
    }
  },
  
  methods: {
    selectProfile(profileId) {
      this.userStore.selectProfile(profileId)
      this.$router.push('/leaderboard')
    },
    
    handleCreateProfile() {
      const result = this.userStore.createProfile(this.newProfile)
      
      if (result.success) {
        this.showAddProfile = false
        this.newProfile = {
          name: '',
          avatar: 'person',
          color: '#3b82f6'
        }
      }
    },
    
    handleLogout() {
      this.userStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
