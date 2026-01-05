// User Store for managing authentication and profile data
import { defineStore } from 'pinia'
import { mockAppliances } from '@/data/mockAppliances'
import { mockTasks } from '@/data/mockTasks'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    // Current logged in user account (email/password level)
    currentUser: null,

    // Current active profile under the user account
    currentProfile: null,

    // All users database (fetched from API)
    users: [],

    // Available appliances and tasks for selection
    availableAppliances: [...mockAppliances],
    availableTasks: [...mockTasks],
  }),

  getters: {
    // Check if user is logged in (email/password authenticated)
    isLoggedIn: (state) => state.currentUser !== null,

    // Check if current profile has admin privileges
    isAdmin: (state) => state.currentProfile?.isAdmin || false,

    // Check if this is first time setup (no profiles created yet)
    isFirstUse: (state) => !state.currentUser?.profiles || state.currentUser.profiles.length === 0,

    // Get all profiles for current user
    profiles: (state) => state.currentUser?.profiles || [],

    // Get max profiles allowed for current user
    maxProfiles: (state) => state.currentUser?.maxProfiles || 4,

    // Get appliances configured for household
    householdAppliances: (state) => {
      if (!state.currentUser?.appliances) return []
      return state.availableAppliances.filter((app) =>
        state.currentUser.appliances.includes(app.id),
      )
    },

    // Get tasks available for household
    householdTasks: (state) => {
      if (!state.currentUser?.tasks) return []
      return state.availableTasks.filter((task) => state.currentUser.tasks.includes(task.id))
    },

    // Get current profile's activity history
    currentProfileActivities: (state) => {
      return state.currentProfile?.activityHistory || []
    },

    // Get current profile's appliance usage
    currentProfileApplianceUsage: (state) => {
      return state.currentProfile?.applianceUsage || []
    },

    // Get current profile's redeemed rewards
    currentProfileRewards: (state) => {
      return state.currentProfile?.rewardsRedeemed || []
    },

    // Get current profile's badges
    currentProfileBadges: (state) => {
      return state.currentProfile?.badges || []
    },

    // Calculate total household CO2 saved
    householdTotalCo2Saved: (state) => {
      if (!state.currentUser?.profiles) return 0
      return state.currentUser.profiles.reduce((total, profile) => {
        return total + (profile.co2Saved || 0)
      }, 0)
    },

    // Get leaderboard for household profiles
    householdLeaderboard: (state) => {
      if (!state.currentUser?.profiles) return []
      return [...state.currentUser.profiles]
        .sort((a, b) => b.points - a.points)
        .map((profile, index) => ({
          ...profile,
          rank: index + 1,
        }))
    },

    // Get global leaderboard (all profiles from all users)
    globalLeaderboard: (state) => {
      const allProfiles = []
      state.users.forEach((user) => {
        if (user.profiles) {
          user.profiles.forEach((profile) => {
            allProfiles.push({
              ...profile,
              userEmail: user.email,
            })
          })
        }
      })
      return allProfiles
        .sort((a, b) => b.points - a.points)
        .slice(0, 50) // Top 50
        .map((profile, index) => ({
          ...profile,
          rank: index + 1,
        }))
    },
  },

  actions: {
    /**
     * Register new user account (email + password)
     */
    async register(userData) {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userData.email)) {
          return {
            success: false,
            message: 'Email inválido',
          }
        }

        // Validate email doesn't exist
        const response = await fetch(`http://localhost:3000/users?email=${userData.email}`)
        const existingUsers = await response.json()

        if (existingUsers.length > 0) {
          return {
            success: false,
            message: 'Este email já está registado',
          }
        }

        // Validate password confirmation
        if (userData.password !== userData.confirmPassword) {
          return {
            success: false,
            message: 'As passwords não coincidem',
          }
        }

        // Create new user account
        const newUser = {
          email: userData.email,
          password: userData.password, // In production: hash this!
          createdAt: new Date().toISOString(),
          maxProfiles: 4, // Default
          appliances: [],
          tasks: [],
          profiles: [],
        }

        const createResponse = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        })

        if (!createResponse.ok) {
          throw new Error('Erro ao criar utilizador')
        }

        // const createdUser = await createResponse.json();

        return {
          success: true,
          message: 'Conta criada com sucesso',
        }
      } catch (error) {
        console.error('Register error:', error)
        return {
          success: false,
          message: 'Erro ao registar conta. Tente novamente.',
        }
      }
    },

    /**
     * Login with email and password
     */
    async login(credentials) {
      try {
        const response = await fetch(
          `http://localhost:3000/users?email=${credentials.email}&password=${credentials.password}`,
        )
        const users = await response.json()

        if (users.length === 0) {
          return {
            success: false,
            message: 'Email ou password incorretos',
          }
        }

        const user = users[0]
        this.currentUser = user

        // If user has no profiles, redirect to quick start
        if (!user.profiles || user.profiles.length === 0) {
          return {
            success: true,
            requiresSetup: true,
            message: 'Login efetuado. Por favor complete a configuração inicial.',
          }
        }

        // Check for default profile on this device
        const defaultProfile = user.profiles.find((p) => p.settings?.defaultDevice)
        if (defaultProfile) {
          this.currentProfile = defaultProfile
          return {
            success: true,
            requiresSetup: false,
            autoSelectedProfile: true,
            message: `Bem-vindo, ${defaultProfile.name}!`,
          }
        }

        return {
          success: true,
          requiresSetup: false,
          message: 'Login efetuado com sucesso',
        }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          message: 'Erro ao efetuar login. Verifique a sua conexão.',
        }
      }
    },

    /**
     * Logout - clear current user and profile
     */
    logout() {
      this.currentUser = null
      this.currentProfile = null
    },

    /**
     * Complete quick start setup (first time user setup)
     */
    async completeQuickStart(setupData) {
      if (!this.currentUser) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }

      // Update household settings
      this.currentUser.maxProfiles = setupData.maxProfiles
      this.currentUser.appliances = setupData.appliances
      this.currentUser.tasks = setupData.activities

      // Create admin profile
      const adminProfile = {
        id: Date.now(),
        name: setupData.adminProfile.name,
        age: setupData.adminProfile.age || null,
        avatar:
          setupData.adminProfile.avatar ||
          `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        points: 0,
        co2Saved: 0,
        level: 1,
        xp: 0,
        streak: 0,
        settings: {
          pin: null,
          notifications: true,
          defaultDevice: true,
          language: 'pt',
          theme: 'light',
        },
        activityHistory: [],
        applianceUsage: [],
        rewardsRedeemed: [],
        badges: [
          {
            id: 'early_adopter',
            title: 'Early Adopter',
            icon: 'star',
            earnedAt: new Date().toISOString(),
            description: 'Primeiro perfil criado',
          },
        ],
      }

      this.currentUser.profiles = [adminProfile]

      // Set as current profile
      this.currentProfile = adminProfile

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        return { success: true, message: 'Configuração concluída!' }
      } catch (error) {
        return { success: false, message: 'Erro ao guardar configuração.' }
      }
    },

    /**
     * Select a profile to use
     */
    selectProfile(profileId) {
      if (!this.currentUser?.profiles) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }

      const profile = this.currentUser.profiles.find((p) => p.id === profileId)
      if (!profile) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      this.currentProfile = profile
      return { success: true, message: `Bem-vindo, ${profile.name}!` }
    },

    /**
     * Create a new profile under current user
     */
    async createProfile(profileData) {
      if (!this.currentUser) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }

      if (!this.currentUser.profiles) {
        this.currentUser.profiles = []
      }

      // Check max profiles limit
      if (this.currentUser.profiles.length >= this.currentUser.maxProfiles) {
        return {
          success: false,
          message: `Limite de ${this.currentUser.maxProfiles} perfis atingido`,
        }
      }

      // Check for duplicate name
      if (
        this.currentUser.profiles.find(
          (p) => p.name.toLowerCase() === profileData.name.toLowerCase(),
        )
      ) {
        return {
          success: false,
          message: 'Já existe um perfil com este nome',
        }
      }

      // Create new profile
      const newProfile = {
        id: Date.now(),
        name: profileData.name,
        age: profileData.age || null,
        avatar:
          profileData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        isAdmin: false, // Only first profile is admin
        createdAt: new Date().toISOString(),
        points: 0,
        co2Saved: 0,
        level: 1,
        xp: 0,
        streak: 0,
        settings: {
          pin: profileData.pin || null,
          notifications: true,
          defaultDevice: false,
          language: 'pt',
          theme: 'light',
        },
        activityHistory: [],
        applianceUsage: [],
        rewardsRedeemed: [],
        badges: [],
      }

      this.currentUser.profiles.push(newProfile)

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          profile: newProfile,
          message: 'Perfil criado com sucesso!',
        }
      } catch (error) {
        // Rollback local change
        this.currentUser.profiles.pop()
        return { success: false, message: 'Erro ao criar perfil.' }
      }
    },

    /**
     * Update profile settings
     */
    async updateProfileSettings(profileId, settings) {
      if (!this.currentUser?.profiles) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }

      const profileIndex = this.currentUser.profiles.findIndex((p) => p.id === profileId)
      if (profileIndex === -1) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      const oldSettings = { ...this.currentUser.profiles[profileIndex].settings }

      this.currentUser.profiles[profileIndex].settings = {
        ...this.currentUser.profiles[profileIndex].settings,
        ...settings,
      }

      // Update current profile if it's the one being edited
      if (this.currentProfile?.id === profileId) {
        this.currentProfile = this.currentUser.profiles[profileIndex]
      }

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        return { success: true, message: 'Definições atualizadas!' }
      } catch (error) {
        // Rollback
        this.currentUser.profiles[profileIndex].settings = oldSettings
        return { success: false, message: 'Erro ao atualizar definições.' }
      }
    },

    /**
     * Delete a profile
     */
    async deleteProfile(profileId) {
      if (!this.currentUser?.profiles) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }

      const profileIndex = this.currentUser.profiles.findIndex((p) => p.id === profileId)
      if (profileIndex === -1) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      const profile = this.currentUser.profiles[profileIndex]

      // Prevent deleting admin profile if it's the only one
      if (profile.isAdmin && this.currentUser.profiles.length === 1) {
        return {
          success: false,
          message: 'Não é possível eliminar o único perfil administrador',
        }
      }

      // Keep backup in case of error
      const profileBackup = { ...profile }

      this.currentUser.profiles.splice(profileIndex, 1)

      // If current profile was deleted, clear it
      let wasActiveProfile = false
      if (this.currentProfile?.id === profileId) {
        wasActiveProfile = true
        this.currentProfile = null
      }

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        return { success: true, message: 'Perfil eliminado com sucesso!' }
      } catch (error) {
        // Rollback
        this.currentUser.profiles.splice(profileIndex, 0, profileBackup)
        if (wasActiveProfile) {
          this.currentProfile = profileBackup
        }
        return { success: false, message: 'Erro ao eliminar perfil.' }
      }
    },

    /**
     * Complete a task and add points/CO2 savings
     */
    async completeTask(taskId) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }

      const task = this.householdTasks.find((t) => t.id === taskId)
      if (!task) {
        return { success: false, message: 'Tarefa não encontrada' }
      }

      // Keep backup of profile state
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      // Add to activity history
      const activity = {
        id: Date.now(),
        taskId: task.id,
        completedAt: new Date().toISOString(),
        pointsEarned: task.points,
        co2Saved: task.co2Saved,
      }

      this.currentProfile.activityHistory.push(activity)

      // Update profile stats
      this.currentProfile.points += task.points
      this.currentProfile.co2Saved += task.co2Saved
      this.currentProfile.xp += task.points

      // Check for level up (every 100 XP = 1 level)
      const newLevel = Math.floor(this.currentProfile.xp / 100) + 1
      if (newLevel > this.currentProfile.level) {
        this.currentProfile.level = newLevel
      }

      // Update in user's profiles
      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => p.id === this.currentProfile.id,
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          pointsEarned: task.points,
          co2Saved: task.co2Saved,
          message: `+${task.points} pontos! 🎉`,
        }
      } catch (error) {
        // Rollback
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao completar tarefa.' }
      }
    },

    async redeemReward(reward) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }

      // Check if profile has enough points
      if (this.currentProfile.points < reward.points) {
        return {
          success: false,
          message: 'Pontos insuficientes',
        }
      }

      // Keep backup in case of error
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      // Add to redeemed rewards
      const redemption = {
        id: Date.now(),
        rewardId: reward.id,
        title: reward.title,
        pointsCost: reward.points,
        redeemedAt: new Date().toISOString(),
        status: 'pending',
      }

      this.currentProfile.rewardsRedeemed.push(redemption)

      // Deduct points
      this.currentProfile.points -= reward.points

      // Update in user's profiles
      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => p.id === this.currentProfile.id,
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          message: 'Recompensa resgatada!',
        }
      } catch (error) {
        // Rollback
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao resgatar recompensa.' }
      }
    },
  },
})
