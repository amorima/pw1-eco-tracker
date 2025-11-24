import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    households: JSON.parse(localStorage.getItem('eco-households') || '[]'),
    currentHousehold: JSON.parse(localStorage.getItem('eco-current-household') || 'null'),
    currentProfile: JSON.parse(localStorage.getItem('eco-current-profile') || 'null'),
    isLoggedIn: !!localStorage.getItem('eco-current-household'),
    isAdmin: false
  }),

  getters: {
    userIsLoggedIn: (state) => state.isLoggedIn,
    userIsAdmin: (state) => state.isAdmin,
    getAllHouseholds: (state) => state.households,
    getCurrentHousehold: (state) => state.currentHousehold,
    getCurrentProfile: (state) => state.currentProfile,
    getHouseholdProfiles: (state) => state.currentHousehold?.profiles || [],
    getProfileById: (state) => (profileId) => {
      if (!state.currentHousehold) return null
      return state.currentHousehold.profiles.find(p => p.id === profileId)
    },
    getHouseholdStats: (state) => {
      if (!state.currentHousehold) return null
      const totalPoints = state.currentHousehold.profiles.reduce((sum, p) => sum + (p.points || 0), 0)
      const totalCO2 = state.currentHousehold.profiles.reduce((sum, p) => sum + (p.co2Saved || 0), 0)
      return {
        totalPoints,
        totalCO2,
        memberCount: state.currentHousehold.profiles.length
      }
    },
    getHouseholdLeaderboard: (state) => {
      if (!state.currentHousehold) return []
      return [...state.currentHousehold.profiles]
        .sort((a, b) => (b.points || 0) - (a.points || 0))
    }
  },

  actions: {
    // HOUSEHOLD CRUD
    register(householdData) {
      const newHousehold = {
        id: Date.now().toString(),
        email: householdData.email,
        password: householdData.password,
        householdName: householdData.householdName,
        profiles: [],
        createdAt: new Date().toISOString(),
        role: 'user'
      }
      this.households.push(newHousehold)
      this._saveHouseholds()
      return newHousehold
    },

    login(email, password) {
      const household = this.households.find(h => h.email === email && h.password === password)
      if (household) {
        this.currentHousehold = household
        this.isLoggedIn = true
        this.isAdmin = household.role === 'admin'
        localStorage.setItem('eco-current-household', JSON.stringify(household))
        return { success: true, household }
      }
      return { success: false, message: 'Invalid credentials' }
    },

    logout() {
      this.currentHousehold = null
      this.currentProfile = null
      this.isLoggedIn = false
      this.isAdmin = false
      localStorage.removeItem('eco-current-household')
      localStorage.removeItem('eco-current-profile')
    },

    // PROFILE CRUD
    createProfile(profileData) {
      if (!this.currentHousehold) return { success: false, message: 'No household logged in' }

      const newProfile = {
        id: Date.now().toString(),
        name: profileData.name,
        avatar: profileData.avatar || 'account_circle',
        color: profileData.color || '#10b981',
        points: 0,
        level: 1,
        badges: [],
        co2Saved: 0,
        createdAt: new Date().toISOString()
      }

      this.currentHousehold.profiles.push(newProfile)
      this._updateCurrentHousehold()
      return { success: true, profile: newProfile }
    },

    updateProfile(profileId, updates) {
      if (!this.currentHousehold) return false

      const index = this.currentHousehold.profiles.findIndex(p => p.id === profileId)
      if (index !== -1) {
        this.currentHousehold.profiles[index] = { ...this.currentHousehold.profiles[index], ...updates }
        this._updateCurrentHousehold()
        
        if (this.currentProfile?.id === profileId) {
          this.currentProfile = this.currentHousehold.profiles[index]
          localStorage.setItem('eco-current-profile', JSON.stringify(this.currentProfile))
        }
        return true
      }
      return false
    },

    deleteProfile(profileId) {
      if (!this.currentHousehold) return false

      const index = this.currentHousehold.profiles.findIndex(p => p.id === profileId)
      if (index !== -1) {
        this.currentHousehold.profiles.splice(index, 1)
        this._updateCurrentHousehold()
        
        if (this.currentProfile?.id === profileId) {
          this.currentProfile = null
          localStorage.removeItem('eco-current-profile')
        }
        return true
      }
      return false
    },

    selectProfile(profileId) {
      const profile = this.getProfileById(profileId)
      if (profile) {
        this.currentProfile = profile
        localStorage.setItem('eco-current-profile', JSON.stringify(profile))
        return true
      }
      return false
    },

    // GAMIFICATION
    addPoints(points, profileId = null) {
      const targetProfileId = profileId || this.currentProfile?.id
      if (!targetProfileId) return

      const profile = this.getProfileById(targetProfileId)
      if (!profile) return

      profile.points += points

      // Level up logic
      const newLevel = Math.floor(profile.points / 100) + 1
      if (newLevel > profile.level) {
        profile.level = newLevel
      }

      this.updateProfile(targetProfileId, profile)
    },

    addBadge(badge, profileId = null) {
      const targetProfileId = profileId || this.currentProfile?.id
      if (!targetProfileId) return

      const profile = this.getProfileById(targetProfileId)
      if (!profile) return

      if (!profile.badges.includes(badge)) {
        profile.badges.push(badge)
        this.updateProfile(targetProfileId, profile)
      }
    },

    updateCO2Saved(amount, profileId = null) {
      const targetProfileId = profileId || this.currentProfile?.id
      if (!targetProfileId) return

      const profile = this.getProfileById(targetProfileId)
      if (!profile) return

      profile.co2Saved += amount
      this.updateProfile(targetProfileId, profile)
    },

    // PRIVATE HELPERS
    _saveHouseholds() {
      localStorage.setItem('eco-households', JSON.stringify(this.households))
    },

    _updateCurrentHousehold() {
      const index = this.households.findIndex(h => h.id === this.currentHousehold.id)
      if (index !== -1) {
        this.households[index] = this.currentHousehold
        this._saveHouseholds()
        localStorage.setItem('eco-current-household', JSON.stringify(this.currentHousehold))
      }
    },

    // SEED DATA
    seedData() {
      if (this.households.length === 0) {
        const demoHousehold = {
          id: '1',
          email: 'demo@eco.com',
          password: 'demo123',
          householdName: 'Demo Family',
          role: 'user',
          profiles: [
            {
              id: '1',
              name: 'John',
              avatar: 'person',
              color: '#3b82f6',
              points: 250,
              level: 3,
              badges: ['first-activity'],
              co2Saved: 12.5,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              name: 'Sarah',
              avatar: 'person',
              color: '#ec4899',
              points: 180,
              level: 2,
              badges: [],
              co2Saved: 8.3,
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              name: 'Kids',
              avatar: 'child_care',
              color: '#f59e0b',
              points: 95,
              level: 1,
              badges: [],
              co2Saved: 3.2,
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString()
        }

        this.households = [demoHousehold]
        this._saveHouseholds()
      }
    }
  }
})
