// User Store for managing authentication and profile data
import { defineStore } from 'pinia'
import { ensureApiKey } from '@/services/carbonApiService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    // Current logged in user account (email/password level)
    currentUser: null,

    // Current active profile under the user account
    currentProfile: null,

    // All users database (fetched from API)
    users: [],

    // Available appliances and tasks for selection
    availableAppliances: [],
    availableTasks: [],
    
    // System badges (all available badges)
    availableBadges: [],
    
    // Household rewards (set by admin)
    householdRewards: [],
    
    // Household challenges (set by admin)
    householdChallenges: [],
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
    
    // Get all badges with earned status for current profile
    allBadgesWithStatus: (state) => {
      const profileBadges = state.currentProfile?.badges || []
      const profileBadgeIds = profileBadges.map(b => b.id)
      
      return state.availableBadges.map(badge => {
        const earnedBadge = profileBadges.find(b => b.id === badge.id)
        return {
          ...badge,
          earned: profileBadgeIds.includes(badge.id),
          earnedAt: earnedBadge?.earnedAt || null,
        }
      })
    },
    
    // Get available rewards for household
    availableRewardsForHousehold: (state) => {
      return state.householdRewards
    },
    
    // Get current profile's redeemed rewards with status
    currentProfileRedeemedRewards: (state) => {
      return state.currentProfile?.rewardsRedeemed || []
    },
    
    // Get current profile's challenges progress
    currentProfileChallenges: (state) => {
      if (!state.householdChallenges.length) return []
      
      const challengesProgress = state.currentProfile?.challengesProgress || {}
      
      return state.householdChallenges.map(challenge => {
        const progress = challengesProgress[challenge.id] || 0
        return {
          ...challenge,
          progress: Math.min((progress / challenge.target) * 100, 100),
          currentProgress: progress,
          completed: progress >= challenge.target,
        }
      })
    },
    
    // Get last N unique appliance usages
    recentApplianceUsages: (state) => (limit = 5) => {
      const usages = state.currentProfile?.applianceUsage || []
      const seen = new Set()
      const unique = []
      
      // Sort by date descending
      const sorted = [...usages].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )
      
      for (const usage of sorted) {
        if (!seen.has(usage.applianceId) && unique.length < limit) {
          seen.add(usage.applianceId)
          const appliance = state.availableAppliances.find(
            a => String(a.id) === String(usage.applianceId)
          )
          if (appliance) {
            unique.push({
              ...usage,
              appliance,
            })
          }
        }
      }
      
      return unique
    },
    
    // Get last N unique completed tasks
    recentTaskCompletions: (state) => (limit = 5) => {
      const activities = state.currentProfile?.activityHistory || []
      const seen = new Set()
      const unique = []
      
      // Sort by date descending
      const sorted = [...activities].sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      )
      
      for (const activity of sorted) {
        if (!seen.has(activity.taskId) && unique.length < limit) {
          seen.add(activity.taskId)
          const task = state.availableTasks.find(
            t => String(t.id) === String(activity.taskId)
          )
          if (task) {
            unique.push({
              ...activity,
              task,
            })
          }
        }
      }
      
      return unique
    },
    
    // Get week days for streak visualization
    weekDaysStreak: (state) => {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 = Sunday
      const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
      const streak = state.currentProfile?.streak || 0
      const lastActivityDate = state.currentProfile?.lastActivityDate
      
      const result = []
      
      // Rearrange to start from Monday
      const mondayFirst = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
      const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      
      for (let i = 0; i <= 6; i++) {
        result.push({
          label: mondayFirst[i],
          completed: i <= todayIndex && streak > (todayIndex - i),
        })
      }
      
      return result
    },
    
    // Calculate XP needed for next level
    xpForNextLevel: (state) => {
      const level = state.currentProfile?.level || 1
      return level * 100 // 100 XP per level
    },
    
    // Calculate XP progress percentage
    xpProgressPercentage: (state) => {
      const xp = state.currentProfile?.xp || 0
      const level = state.currentProfile?.level || 1
      const xpInCurrentLevel = xp % 100
      return xpInCurrentLevel
    },
  },

  actions: {
    /**
     * Fetch system resources (appliances, tasks, badges, rewards) from API
     */
    async fetchResources() {
      try {
        const [appliancesRes, tasksRes, badgesRes, rewardsRes] = await Promise.all([
          fetch('http://localhost:3000/appliances'),
          fetch('http://localhost:3000/tasks'),
          fetch('http://localhost:3000/badges'),
          fetch('http://localhost:3000/rewards'),
        ])

        if (appliancesRes.ok) this.availableAppliances = await appliancesRes.json()
        if (tasksRes.ok) this.availableTasks = await tasksRes.json()
        if (badgesRes.ok) this.availableBadges = await badgesRes.json()
        if (rewardsRes.ok) this.householdRewards = await rewardsRes.json()
        
        // Initialize API key if user is logged in
        if (this.currentUser?.email) {
          await ensureApiKey(this.currentUser.email)
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    },
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
          name: userData.name,
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
    
    /**
     * Cancel a pending reward and return points
     */
    async cancelReward(redemptionId) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }

      const rewardIndex = this.currentProfile.rewardsRedeemed.findIndex(
        (r) => r.id === redemptionId
      )
      
      if (rewardIndex === -1) {
        return { success: false, message: 'Recompensa não encontrada' }
      }
      
      const reward = this.currentProfile.rewardsRedeemed[rewardIndex]
      
      if (reward.status !== 'pendente' && reward.status !== 'pending') {
        return { success: false, message: 'Apenas recompensas pendentes podem ser canceladas' }
      }

      // Keep backup in case of error
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      // Update status and return points
      this.currentProfile.rewardsRedeemed[rewardIndex].status = 'cancelado'
      this.currentProfile.rewardsRedeemed[rewardIndex].cancelledAt = new Date().toISOString()
      this.currentProfile.points += reward.pointsCost

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
          pointsReturned: reward.pointsCost,
          message: 'Recompensa cancelada. Pontos devolvidos!',
        }
      } catch (error) {
        // Rollback
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao cancelar recompensa.' }
      }
    },
    
    /**
     * Complete a reward (admin action)
     */
    async completeReward(profileId, redemptionId) {
      if (!this.currentUser?.profiles) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }
      
      if (!this.currentProfile?.isAdmin) {
        return { success: false, message: 'Apenas administradores podem completar recompensas' }
      }

      const targetProfile = this.currentUser.profiles.find((p) => p.id === profileId)
      if (!targetProfile) {
        return { success: false, message: 'Perfil não encontrado' }
      }
      
      const rewardIndex = targetProfile.rewardsRedeemed.findIndex(
        (r) => r.id === redemptionId
      )
      
      if (rewardIndex === -1) {
        return { success: false, message: 'Recompensa não encontrada' }
      }

      // Keep backup
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      // Update status
      targetProfile.rewardsRedeemed[rewardIndex].status = 'completo'
      targetProfile.rewardsRedeemed[rewardIndex].completedAt = new Date().toISOString()

      // Update current profile if it's the target
      if (this.currentProfile?.id === profileId) {
        this.currentProfile = targetProfile
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
          message: 'Recompensa completada!',
        }
      } catch (error) {
        // Rollback
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao completar recompensa.' }
      }
    },
    
    /**
     * Update daily streak
     */
    async updateStreak() {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }

      const today = new Date().toISOString().split('T')[0]
      const lastActivity = this.currentProfile.lastActivityDate
      
      // Keep backup
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))
      
      if (lastActivity === today) {
        // Already logged today
        return { success: true, message: 'Streak já atualizado hoje', streak: this.currentProfile.streak }
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      if (lastActivity === yesterdayStr) {
        // Consecutive day - increment streak
        this.currentProfile.streak += 1
      } else {
        // Streak broken - reset to 1
        this.currentProfile.streak = 1
      }
      
      this.currentProfile.lastActivityDate = today

      // Update in user's profiles
      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => p.id === this.currentProfile.id,
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      // Check for streak badges
      await this.checkAndAwardBadges()

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          streak: this.currentProfile.streak,
          message: `Streak: ${this.currentProfile.streak} dias! 🔥`,
        }
      } catch (error) {
        // Rollback
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao atualizar streak.' }
      }
    },
    
    /**
     * Check and award badges based on current profile stats
     */
    async checkAndAwardBadges() {
      if (!this.currentProfile || !this.availableBadges.length) {
        return { success: false, newBadges: [] }
      }

      const newBadges = []
      const currentBadgeIds = (this.currentProfile.badges || []).map(b => b.id)
      
      for (const badge of this.availableBadges) {
        if (currentBadgeIds.includes(badge.id)) continue
        
        let earned = false
        const req = badge.requirement
        
        switch (req?.type) {
          case 'streak':
            earned = this.currentProfile.streak >= req.value
            break
          case 'co2_saved':
            earned = this.currentProfile.co2Saved >= req.value
            break
          case 'level':
            earned = this.currentProfile.level >= req.value
            break
          case 'rewards_redeemed':
            earned = (this.currentProfile.rewardsRedeemed || []).filter(
              r => r.status === 'completo' || r.status === 'complete'
            ).length >= req.value
            break
          case 'task_category_count':
            const categoryTasks = (this.currentProfile.activityHistory || []).filter(a => {
              const task = this.availableTasks.find(t => String(t.id) === String(a.taskId))
              return task?.category === req.category
            })
            earned = categoryTasks.length >= req.value
            break
          case 'profile_created':
            earned = true // Already awarded at creation
            break
        }
        
        if (earned) {
          const newBadge = {
            id: badge.id,
            title: badge.title,
            icon: badge.icon,
            earnedAt: new Date().toISOString(),
            description: badge.description,
          }
          
          if (!this.currentProfile.badges) {
            this.currentProfile.badges = []
          }
          
          this.currentProfile.badges.push(newBadge)
          newBadges.push(newBadge)
          
          // Award XP for badges
          this.currentProfile.xp += 50
          this.currentProfile.points += 25
        }
      }
      
      if (newBadges.length > 0) {
        // Update in user's profiles
        const profileIndex = this.currentUser.profiles.findIndex(
          (p) => p.id === this.currentProfile.id,
        )
        if (profileIndex !== -1) {
          this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
        }
      }
      
      return { success: true, newBadges }
    },
    
    /**
     * Track appliance usage
     */
    async trackApplianceUsage(applianceId, hoursUsed, co2Emitted = null) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }
      
      const appliance = this.availableAppliances.find(
        a => String(a.id) === String(applianceId)
      )
      
      if (!appliance) {
        return { success: false, message: 'Aparelho não encontrado' }
      }

      // Keep backup
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))
      
      const energyConsumed = (appliance.avgPowerConsumption * hoursUsed) / 1000 // kWh
      const calculatedCo2 = co2Emitted || (energyConsumed * appliance.co2PerKwh)
      
      const usage = {
        id: Date.now(),
        applianceId: String(applianceId),
        date: new Date().toISOString().split('T')[0],
        hoursUsed,
        energyConsumed,
        co2Emitted: calculatedCo2,
      }
      
      if (!this.currentProfile.applianceUsage) {
        this.currentProfile.applianceUsage = []
      }
      
      this.currentProfile.applianceUsage.push(usage)

      // Update in user's profiles
      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => p.id === this.currentProfile.id,
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      // Update streak
      await this.updateStreak()

      // Update in server
      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          usage,
          message: `Consumo registado: ${calculatedCo2.toFixed(2)} kg CO2`,
        }
      } catch (error) {
        // Rollback
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao registar consumo.' }
      }
    },
    
    /**
     * Complete a task with API integration
     */
    async completeTaskWithApi(taskId) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }

      const task = this.availableTasks.find((t) => String(t.id) === String(taskId))
      if (!task) {
        return { success: false, message: 'Tarefa não encontrada' }
      }

      // Keep backup
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      // Add to activity history
      const activity = {
        id: Date.now(),
        taskId: String(task.id),
        completedAt: new Date().toISOString(),
        pointsEarned: task.points,
        co2Saved: task.co2Saved,
      }

      if (!this.currentProfile.activityHistory) {
        this.currentProfile.activityHistory = []
      }
      
      this.currentProfile.activityHistory.push(activity)

      // Update profile stats
      this.currentProfile.points += task.points
      this.currentProfile.co2Saved += task.co2Saved
      this.currentProfile.xp += task.points

      // Check for level up (every 100 XP = 1 level)
      const newLevel = Math.floor(this.currentProfile.xp / 100) + 1
      const leveledUp = newLevel > this.currentProfile.level
      if (leveledUp) {
        this.currentProfile.level = newLevel
      }

      // Update in user's profiles
      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => p.id === this.currentProfile.id,
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      // Update streak
      await this.updateStreak()
      
      // Check for new badges
      const badgeResult = await this.checkAndAwardBadges()

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
          leveledUp,
          newLevel: leveledUp ? newLevel : null,
          newBadges: badgeResult.newBadges || [],
          message: `+${task.points} pontos! 🎉`,
        }
      } catch (error) {
        // Rollback
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao completar tarefa.' }
      }
    },
    
    /**
     * Get pending rewards for admin approval
     */
    getPendingRewardsForApproval() {
      if (!this.currentUser?.profiles) return []
      
      const pending = []
      
      for (const profile of this.currentUser.profiles) {
        const profilePending = (profile.rewardsRedeemed || [])
          .filter(r => r.status === 'pendente' || r.status === 'pending')
          .map(r => ({
            ...r,
            profileId: profile.id,
            profileName: profile.name,
            profileAvatar: profile.avatar,
          }))
        
        pending.push(...profilePending)
      }
      
      return pending.sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt))
    },
    
    /**
     * Get statistics for current profile
     */
    getProfileStatistics() {
      if (!this.currentProfile) return null
      
      const activities = this.currentProfile.activityHistory || []
      const usages = this.currentProfile.applianceUsage || []
      
      // Group by date for the last 7 days
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        const dayActivities = activities.filter(a => 
          a.completedAt.split('T')[0] === dateStr
        )
        const dayUsages = usages.filter(u => u.date === dateStr)
        
        last7Days.push({
          date: dateStr,
          label: date.toLocaleDateString('pt-PT', { weekday: 'short' }),
          points: dayActivities.reduce((sum, a) => sum + a.pointsEarned, 0),
          co2Saved: dayActivities.reduce((sum, a) => sum + a.co2Saved, 0),
          co2Emitted: dayUsages.reduce((sum, u) => sum + u.co2Emitted, 0),
          tasksCompleted: dayActivities.length,
        })
      }
      
      return {
        totalPoints: this.currentProfile.points,
        totalCo2Saved: this.currentProfile.co2Saved,
        streak: this.currentProfile.streak,
        level: this.currentProfile.level,
        xp: this.currentProfile.xp,
        last7Days,
        totalTasks: activities.length,
        totalUsages: usages.length,
      }
    },
  },
})
