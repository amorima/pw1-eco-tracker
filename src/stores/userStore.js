// User Store for managing authentication and profile data
import { defineStore } from 'pinia'
import { ensureApiKey } from '@/services/carbonApiService'
import { getApplianceIcon, getTaskIcon } from '@/data/categoryIcons'

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
  persist: {
    storage: localStorage,
    pick: ['currentUser','currentProfile']
  },

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

    // Get appliances configured for household (enriched with icon)
    householdAppliances: (state) => {
      if (!state.currentUser?.appliances) return []
      return state.availableAppliances
        .filter((app) => state.currentUser.appliances.some(id => String(id) === String(app.id)))
        .map(app => ({
          ...app,
          icon: getApplianceIcon(app.category)
        }))
    },

    // Get tasks available for household (enriched with icon)
    householdTasks: (state) => {
      if (!state.currentUser?.tasks) return []
      return state.availableTasks
        .filter((task) => state.currentUser.tasks.some(id => String(id) === String(task.id)))
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category)
        }))
    },

    // Get current profile's activity history
    currentProfileActivities: (state) => {
      return state.currentProfile?.activity_history || []
    },

    // Get current profile's appliance usage
    currentProfileApplianceUsage: (state) => {
      return state.currentProfile?.appliance_history || []
    },

    // Get current profile's redeemed rewards
    currentProfileRewards: (state) => {
      return state.currentProfile?.rewards_history || []
    },

    // Get current profile's badges
    currentProfileBadges: (state) => {
      return state.currentProfile?.badges || []
    },
    
    // Calculate level from XP: level = Math.floor(xp / 100) + 1
    currentProfileLevel: (state) => {
      const xp = state.currentProfile?.xp || 0
      return Math.floor(xp / 100) + 1
    },
    
    // Get current profile's points (stored value)
    currentProfilePoints: (state) => {
      return state.currentProfile?.points || 0
    },
    
    // Calculate total CO2 saved from activity history
    currentProfileCo2Saved: (state) => {
      const activities = state.currentProfile?.activity_history || []
      return activities.reduce((sum, a) => sum + (a.co2saved || 0), 0)
    },

    // Calculate total CO2 emitted from appliance usage history
    currentProfileCo2Emitted: (state) => {
      const usages = state.currentProfile?.appliance_history || []
      return usages.reduce((sum, u) => sum + (u.co2emited || 0), 0)
    },

    // Calculate effective CO2 (emitted - saved)
    currentProfileEffectiveCo2: (state) => {
      const activities = state.currentProfile?.activity_history || []
      const usages = state.currentProfile?.appliance_history || []
      const saved = activities.reduce((sum, a) => sum + (a.co2saved || 0), 0)
      const emitted = usages.reduce((sum, u) => sum + (u.co2emited || 0), 0)
      return emitted - saved
    },

    // Calculate total household CO2 saved
    householdTotalCo2Saved: (state) => {
      if (!state.currentUser?.profiles) return 0
      return state.currentUser.profiles.reduce((total, profile) => {
        const activities = profile.activity_history || []
        const co2 = activities.reduce((sum, a) => sum + (a.co2saved || 0), 0)
        return total + co2
      }, 0)
    },

    // Get leaderboard for household profiles
    householdLeaderboard: (state) => {
      if (!state.currentUser?.profiles) return []
      
      const profilesWithPoints = state.currentUser.profiles.map(profile => {
        return {
          ...profile,
          points: profile.points || 0,
          level: Math.floor((profile.xp || 0) / 100) + 1,
          avatar: profile.avatarUrl,
        }
      })
      
      return profilesWithPoints
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
              points: profile.points || 0,
              level: Math.floor((profile.xp || 0) / 100) + 1,
              avatar: profile.avatarUrl,
              userEmail: user.email,
            })
          })
        }
      })
      return allProfiles
        .sort((a, b) => b.points - a.points)
        .slice(0, 50)
        .map((profile, index) => ({
          ...profile,
          rank: index + 1,
        }))
    },
    
    // Get all badges with earned status for current profile
    allBadgesWithStatus: (state) => {
      const profileBadges = state.currentProfile?.badges || []
      const profileBadgeIds = profileBadges.map(b => b.id_badge)
      
      return state.availableBadges.map(badge => {
        const earnedBadge = profileBadges.find(b => b.id_badge === badge.id)
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
      return state.currentProfile?.rewards_history || []
    },
    
    // Get current profile's challenges progress
    currentProfileChallenges: (state) => {
      if (!state.householdChallenges.length) return []
      
      const activities = state.currentProfile?.activity_history || []
      
      return state.householdChallenges.map(challenge => {
        let progress = 0
        
        if (challenge.type === 'completions' && challenge.task_id) {
          progress = activities.filter(a => String(a.task_id) === String(challenge.task_id)).length
        } else if (challenge.type === 'streak') {
          progress = state.currentProfile?.streak || 0
        }
        
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
      const usages = state.currentProfile?.appliance_history || []
      const seen = new Set()
      const unique = []
      
      const sorted = [...usages].sort((a, b) => 
        new Date(b.usedAt) - new Date(a.usedAt)
      )
      
      for (const usage of sorted) {
        if (!seen.has(usage.appliance_id) && unique.length < limit) {
          seen.add(usage.appliance_id)
          const appliance = state.availableAppliances.find(
            a => String(a.id) === String(usage.appliance_id)
          )
          if (appliance) {
            unique.push({
              ...usage,
              appliance: {
                ...appliance,
                icon: getApplianceIcon(appliance.category)
              },
            })
          }
        }
      }
      
      return unique
    },
    
    // Get last N unique completed tasks
    recentTaskCompletions: (state) => (limit = 5) => {
      const activities = state.currentProfile?.activity_history || []
      const seen = new Set()
      const unique = []
      
      const sorted = [...activities].sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      )
      
      for (const activity of sorted) {
        if (!seen.has(activity.task_id) && unique.length < limit) {
          seen.add(activity.task_id)
          const task = state.availableTasks.find(
            t => String(t.id) === String(activity.task_id)
          )
          if (task) {
            unique.push({
              ...activity,
              task: {
                ...task,
                icon: getTaskIcon(task.category)
              },
            })
          }
        }
      }
      
      return unique
    },
    
    // Get week days for streak visualization
    weekDaysStreak: (state) => {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const streak = state.currentProfile?.streak || 0
      
      const result = []
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
      const xp = state.currentProfile?.xp || 0
      const level = Math.floor(xp / 100) + 1
      return level * 100
    },
    
    // Calculate XP progress percentage
    xpProgressPercentage: (state) => {
      const xp = state.currentProfile?.xp || 0
      return xp % 100
    },
  },

  actions: {
    /**
     * Fetch system resources (appliances, tasks, badges, rewards) from API
     */
    async fetchResources() {
      try {
        const [appliancesRes, tasksRes, badgesRes, rewardsRes, challengesRes] = await Promise.all([
          fetch('http://localhost:3000/appliances'),
          fetch('http://localhost:3000/tasks'),
          fetch('http://localhost:3000/badges'),
          fetch('http://localhost:3000/rewards'),
          fetch('http://localhost:3000/challenges'),
        ])

        if (appliancesRes.ok) this.availableAppliances = await appliancesRes.json()
        if (tasksRes.ok) this.availableTasks = await tasksRes.json()
        if (badgesRes.ok) this.availableBadges = await badgesRes.json()
        if (rewardsRes.ok) {
          const rewards = await rewardsRes.json()
          const validRewards = rewards.filter(r => r.id !== null && r.id !== undefined && r.id !== 'null')
          this.householdRewards = validRewards
        }
        if (challengesRes.ok) this.householdChallenges = await challengesRes.json()
        
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userData.email)) {
          return { success: false, message: 'Email inválido' }
        }

        const response = await fetch(`http://localhost:3000/users?email=${userData.email}`)
        const existingUsers = await response.json()

        if (existingUsers.length > 0) {
          return { success: false, message: 'Este email já está registado' }
        }

        if (userData.password !== userData.confirmPassword) {
          return { success: false, message: 'As passwords não coincidem' }
        }

        const newUser = {
          id: String(Date.now()),
          email: userData.email,
          password: userData.password,
          createdAt: new Date().toISOString(),
          maxProfiles: 4,
          appliances: [],
          tasks: [],
          profiles: [],
        }

        const createResponse = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })

        if (!createResponse.ok) {
          throw new Error('Erro ao criar utilizador')
        }

        return { success: true, message: 'Conta criada com sucesso' }
      } catch (error) {
        console.error('Register error:', error)
        return { success: false, message: 'Erro ao registar conta. Tente novamente.' }
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
          return { success: false, message: 'Email ou password incorretos' }
        }

        const user = users[0]
        this.currentUser = user

        if (!user.profiles || user.profiles.length === 0) {
          return {
            success: true,
            requiresSetup: true,
            message: 'Login efetuado. Por favor complete a configuração inicial.',
          }
        }

        const defaultProfileId = localStorage.getItem(`defaultProfile_${user.id}`)
        if (defaultProfileId) {
          const defaultProfile = user.profiles.find((p) => String(p.id) === String(defaultProfileId))
          if (defaultProfile) {
            this.currentProfile = defaultProfile
            return {
              success: true,
              requiresSetup: false,
              autoSelectedProfile: true,
              message: `Bem-vindo, ${defaultProfile.name}!`,
            }
          }
        }

        return { success: true, requiresSetup: false, message: 'Login efetuado com sucesso' }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: 'Erro ao efetuar login. Verifique a sua conexão.' }
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

      this.currentUser.maxProfiles = setupData.maxProfiles
      this.currentUser.appliances = setupData.appliances.map(String)
      this.currentUser.tasks = setupData.activities.map(String)

      const adminProfile = {
        id: String(Date.now()),
        name: setupData.adminProfile.name,
        age: setupData.adminProfile.age || null,
        avatarUrl: setupData.adminProfile.avatar || null,
        isAdmin: true,
        birthDate: null,
        createdAt: new Date().toISOString(),
        xp: 0,
        points: 0,
        streak: 0,
        settings: {
          pin: setupData.adminProfile.pin || null,
          notification: true,
          deviceDefault: true,
          header_background: 'bg-gradient-to-r from-green-400 to-emerald-500',
        },
        activity_history: [],
        appliance_history: [],
        rewards_history: [],
        badges: [
          {
            id_badge: 'early_adopter',
            title: 'Early Adopter',
            description: 'Primeiro perfil criado',
            icon: 'star',
            earnedAt: new Date().toISOString(),
          },
        ],
        lastActivitie: null,
      }

      this.currentUser.profiles = [adminProfile]
      this.currentProfile = adminProfile

      localStorage.setItem(`defaultProfile_${this.currentUser.id}`, adminProfile.id.toString())

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        return { success: true, message: 'Configuração concluída!' }
      } catch {
        return { success: false, message: 'Erro ao guardar configuração.' }
      }
    },

    /**
     * Select a profile to use
     */
    selectProfile(profileId) {
      if (!this.currentUser?.profiles) return false

      const profile = this.currentUser.profiles.find((p) => String(p.id) === String(profileId))
      if (!profile) return false

      this.currentProfile = profile
      localStorage.setItem(`defaultProfile_${this.currentUser.id}`, profile.id.toString())
      
      return true
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

      if (this.currentUser.profiles.length >= this.currentUser.maxProfiles) {
        return { success: false, message: `Limite de ${this.currentUser.maxProfiles} perfis atingido` }
      }

      if (this.currentUser.profiles.find(p => p.name.toLowerCase() === profileData.name.toLowerCase())) {
        return { success: false, message: 'Já existe um perfil com este nome' }
      }

      const newProfile = {
        id: String(Date.now()),
        name: profileData.name,
        age: profileData.age || null,
        avatarUrl: profileData.avatar || null,
        isAdmin: false,
        birthDate: null,
        createdAt: new Date().toISOString(),
        xp: 0,
        points: 0,
        streak: 0,
        settings: {
          pin: profileData.pin || null,
          notification: true,
          deviceDefault: false,
          header_background: 'bg-gradient-to-r from-blue-400 to-cyan-500',
        },
        activity_history: [],
        appliance_history: [],
        rewards_history: [],
        badges: [],
        lastActivitie: null,
      }

      this.currentUser.profiles.push(newProfile)

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return { success: true, profile: newProfile, message: 'Perfil criado com sucesso!' }
      } catch {
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

      const profileIndex = this.currentUser.profiles.findIndex((p) => String(p.id) === String(profileId))
      if (profileIndex === -1) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      const oldSettings = { ...this.currentUser.profiles[profileIndex].settings }

      this.currentUser.profiles[profileIndex].settings = {
        ...this.currentUser.profiles[profileIndex].settings,
        ...settings,
      }

      if (String(this.currentProfile?.id) === String(profileId)) {
        this.currentProfile = this.currentUser.profiles[profileIndex]
      }

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        return { success: true, message: 'Definições atualizadas!' }
      } catch {
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

      const profileIndex = this.currentUser.profiles.findIndex((p) => String(p.id) === String(profileId))
      if (profileIndex === -1) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      const profile = this.currentUser.profiles[profileIndex]

      if (profile.isAdmin && this.currentUser.profiles.length === 1) {
        return { success: false, message: 'Não é possível eliminar o único perfil administrador' }
      }

      const profileBackup = { ...profile }
      this.currentUser.profiles.splice(profileIndex, 1)

      let wasActiveProfile = false
      if (String(this.currentProfile?.id) === String(profileId)) {
        wasActiveProfile = true
        this.currentProfile = null
      }

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        return { success: true, message: 'Perfil eliminado com sucesso!' }
      } catch {
        this.currentUser.profiles.splice(profileIndex, 0, profileBackup)
        if (wasActiveProfile) {
          this.currentProfile = profileBackup
        }
        return { success: false, message: 'Erro ao eliminar perfil.' }
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

      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      const activity = {
        id: String(Date.now()),
        task_id: String(task.id),
        completedAt: new Date().toISOString(),
        pointsEarned: task.points,
        co2saved: task.co2saved,
      }

      if (!this.currentProfile.activity_history) {
        this.currentProfile.activity_history = []
      }
      
      this.currentProfile.activity_history.push(activity)
      this.currentProfile.xp = (this.currentProfile.xp || 0) + task.points
      this.currentProfile.points = (this.currentProfile.points || 0) + task.points

      const newLevel = Math.floor(this.currentProfile.xp / 100) + 1
      const oldLevel = Math.floor((this.currentProfile.xp - task.points) / 100) + 1
      const leveledUp = newLevel > oldLevel

      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => String(p.id) === String(this.currentProfile.id),
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      await this.updateStreak()
      const badgeResult = await this.checkAndAwardBadges()

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          pointsEarned: task.points,
          co2Saved: task.co2saved,
          leveledUp,
          newLevel: leveledUp ? newLevel : null,
          newBadges: badgeResult.newBadges || [],
          message: `+${task.points} pontos! 🎉`,
        }
      } catch {
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao completar tarefa.' }
      }
    },

    /**
     * Redeem a reward
     */
    async redeemReward(reward) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }

      const currentPoints = this.currentProfilePoints
      if (currentPoints < reward.points_cost) {
        return { success: false, message: 'Pontos insuficientes' }
      }

      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      const redemption = {
        id: String(Date.now()),
        id_reward: String(reward.id),
        title: reward.title,
        points_cost: reward.points_cost,
        status: 'pendente',
        redemedAt: new Date().toISOString(),
      }

      if (!this.currentProfile.rewards_history) {
        this.currentProfile.rewards_history = []
      }
      this.currentProfile.rewards_history.push(redemption)
      
      // Subtract points for the reward
      this.currentProfile.points = (this.currentProfile.points || 0) - reward.points_cost

      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => String(p.id) === String(this.currentProfile.id),
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return { success: true, message: 'Recompensa resgatada!' }
      } catch {
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao resgatar recompensa.' }
      }
    },
    
    /**
     * Cancel a pending reward and return points (Admin action)
     */
    async cancelReward(profileId, redemptionId) {
      if (!this.currentUser?.profiles) {
        return { success: false, message: 'Nenhum utilizador autenticado' }
      }
      
      if (!this.currentProfile?.isAdmin) {
        return { success: false, message: 'Apenas administradores podem cancelar recompensas' }
      }

      const targetProfile = this.currentUser.profiles.find((p) => String(p.id) === String(profileId))
      if (!targetProfile) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      const rewardIndex = (targetProfile.rewards_history || []).findIndex(
        (r) => String(r.id) === String(redemptionId)
      )
      
      if (rewardIndex === -1) {
        return { success: false, message: 'Recompensa não encontrada' }
      }
      
      const reward = targetProfile.rewards_history[rewardIndex]
      
      if (reward.status !== 'pendente' && reward.status !== 'pending') {
        return { success: false, message: 'Apenas recompensas pendentes podem ser canceladas' }
      }

      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      targetProfile.rewards_history[rewardIndex].status = 'cancelado'
      
      // Return points to the profile
      targetProfile.points = (targetProfile.points || 0) + reward.points_cost

      if (String(this.currentProfile?.id) === String(profileId)) {
        this.currentProfile = targetProfile
      }

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          pointsReturned: reward.points_cost,
          message: 'Recompensa cancelada. Pontos devolvidos!',
        }
      } catch {
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

      const targetProfile = this.currentUser.profiles.find((p) => String(p.id) === String(profileId))
      if (!targetProfile) {
        return { success: false, message: 'Perfil não encontrado' }
      }
      
      const rewardIndex = (targetProfile.rewards_history || []).findIndex(
        (r) => String(r.id) === String(redemptionId)
      )
      
      if (rewardIndex === -1) {
        return { success: false, message: 'Recompensa não encontrada' }
      }

      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))

      targetProfile.rewards_history[rewardIndex].status = 'completo'

      if (String(this.currentProfile?.id) === String(profileId)) {
        this.currentProfile = targetProfile
      }

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return { success: true, message: 'Recompensa completada!' }
      } catch {
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
      const lastActivity = this.currentProfile.lastActivitie 
        ? new Date(this.currentProfile.lastActivitie).toISOString().split('T')[0]
        : null
      
      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))
      
      if (lastActivity === today) {
        return { success: true, message: 'Streak já atualizado hoje', streak: this.currentProfile.streak }
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      if (lastActivity === yesterdayStr) {
        this.currentProfile.streak = (this.currentProfile.streak || 0) + 1
      } else {
        this.currentProfile.streak = 1
      }
      
      this.currentProfile.lastActivitie = new Date().toISOString()

      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => String(p.id) === String(this.currentProfile.id),
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      await this.checkAndAwardBadges()

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
      } catch {
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
      const currentBadgeIds = (this.currentProfile.badges || []).map(b => b.id_badge)
      
      for (const badge of this.availableBadges) {
        if (currentBadgeIds.includes(badge.id)) continue
        
        let earned = false
        const req = badge.requirements
        
        switch (req?.type) {
          case 'streak':
            earned = (this.currentProfile.streak || 0) >= req.value
            break
          case 'co2_saved':
            earned = this.currentProfileCo2Saved >= req.value
            break
          case 'level':
            earned = this.currentProfileLevel >= req.value
            break
          case 'rewards_redeemed':
            earned = (this.currentProfile.rewards_history || []).filter(
              r => r.status === 'completo'
            ).length >= req.value
            break
          case 'task_category_count': {
            const categoryTasks = (this.currentProfile.activity_history || []).filter(a => {
              const task = this.availableTasks.find(t => String(t.id) === String(a.task_id))
              return task?.category === req.category
            })
            earned = categoryTasks.length >= req.value
            break
          }
          case 'profile_created':
            earned = true
            break
        }
        
        if (earned) {
          const newBadge = {
            id_badge: badge.id,
            title: badge.title,
            description: badge.description,
            icon: badge.icon,
            earnedAt: new Date().toISOString(),
          }
          
          if (!this.currentProfile.badges) {
            this.currentProfile.badges = []
          }
          
          this.currentProfile.badges.push(newBadge)
          newBadges.push(newBadge)
          
          this.currentProfile.xp = (this.currentProfile.xp || 0) + 50
        }
      }
      
      if (newBadges.length > 0) {
        const profileIndex = this.currentUser.profiles.findIndex(
          (p) => String(p.id) === String(this.currentProfile.id),
        )
        if (profileIndex !== -1) {
          this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
        }
      }
      
      return { success: true, newBadges }
    },
    
    /**
     * Track appliance usage with full API response data
     */
    async trackApplianceUsage(applianceId, hoursUsed, apiData = null) {
      if (!this.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }
      
      const appliance = this.availableAppliances.find(
        a => String(a.id) === String(applianceId)
      )
      
      if (!appliance) {
        return { success: false, message: 'Aparelho não encontrado' }
      }

      const profileBackup = JSON.parse(JSON.stringify(this.currentProfile))
      const profilesBackup = JSON.parse(JSON.stringify(this.currentUser.profiles))
      
      let usageData = apiData
      if (!usageData) {
        try {
          const { calculateApplianceEmissions } = await import('@/services/carbonApiService')
          const apiResult = await calculateApplianceEmissions(appliance, hoursUsed)
          
          if (apiResult.success && apiResult.data) {
            usageData = apiResult.data
          }
        } catch (error) {
          console.warn('API calculation failed, using fallback:', error)
        }
      }
      
      if (!usageData) {
        const powerWatts = appliance.powerWatts || 200
        const minutes = Math.round(hoursUsed * 60)
        const kwh = (powerWatts * hoursUsed) / 1000
        const co2 = kwh * 0.188
        
        usageData = {
          type: appliance.type || 'electricity',
          carbon_kg_co2: co2,
          minutes: minutes,
          kwh: kwh,
          device_power_watts: powerWatts,
        }
      }
      
      const usage = {
        id: String(Date.now()),
        appliance_id: String(applianceId),
        usedAt: new Date().toISOString(),
        duration: usageData.minutes,
        energy_consumed: usageData.kwh,
        co2emited: usageData.carbon_kg_co2,
      }
      
      if (!this.currentProfile.appliance_history) {
        this.currentProfile.appliance_history = []
      }
      
      this.currentProfile.appliance_history.push(usage)

      const profileIndex = this.currentUser.profiles.findIndex(
        (p) => String(p.id) === String(this.currentProfile.id),
      )
      if (profileIndex !== -1) {
        this.currentUser.profiles[profileIndex] = { ...this.currentProfile }
      }

      await this.updateStreak()

      try {
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })

        return {
          success: true,
          usage,
          message: `Consumo registado: ${usageData.carbon_kg_co2.toFixed(2)} kg CO2`,
        }
      } catch {
        this.currentProfile = profileBackup
        this.currentUser.profiles = profilesBackup
        return { success: false, message: 'Erro ao registar consumo.' }
      }
    },
    
    /**
     * Get pending rewards for admin approval
     */
    getPendingRewardsForApproval() {
      if (!this.currentUser?.profiles) return []
      
      const pending = []
      
      for (const profile of this.currentUser.profiles) {
        const profilePending = (profile.rewards_history || [])
          .filter(r => r.status === 'pendente' || r.status === 'pending')
          .map(r => ({
            ...r,
            profileId: profile.id,
            profileName: profile.name,
            profileAvatar: profile.avatarUrl,
          }))
        
        pending.push(...profilePending)
      }
      
      return pending.sort((a, b) => new Date(b.redemedAt) - new Date(a.redemedAt))
    },
    
    /**
     * Get statistics for current profile
     */
    getProfileStatistics() {
      if (!this.currentProfile) return null
      
      const activities = this.currentProfile.activity_history || []
      const usages = this.currentProfile.appliance_history || []
      
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        const dayActivities = activities.filter(a => 
          a.completedAt.split('T')[0] === dateStr
        )
        const dayUsages = usages.filter(u => 
          u.usedAt.split('T')[0] === dateStr
        )
        
        last7Days.push({
          date: dateStr,
          label: date.toLocaleDateString('pt-PT', { weekday: 'short' }),
          points: dayActivities.reduce((sum, a) => sum + (a.pointsEarned || 0), 0),
          co2Saved: dayActivities.reduce((sum, a) => sum + (a.co2saved || 0), 0),
          co2Emitted: dayUsages.reduce((sum, u) => sum + (u.co2emited || 0), 0),
          tasksCompleted: dayActivities.length,
        })
      }
      
      return {
        totalPoints: this.currentProfilePoints,
        totalCo2Saved: this.currentProfileCo2Saved,
        totalCo2Emitted: this.currentProfileCo2Emitted,
        totalEffectiveCo2: this.currentProfileEffectiveCo2,
        streak: this.currentProfile.streak || 0,
        level: this.currentProfileLevel,
        xp: this.currentProfile.xp || 0,
        last7Days,
        totalTasks: activities.length,
        totalUsages: usages.length,
      }
    },
    
    // Profile Management
    async updateProfile(profileId, updates) {
      try {
        const profileIndex = this.currentUser.profiles.findIndex(p => String(p.id) === String(profileId))
        if (profileIndex === -1) throw new Error('Profile not found')
        
        // Map avatar to avatarUrl if needed
        if (updates.avatar && !updates.avatarUrl) {
          updates.avatarUrl = updates.avatar
          delete updates.avatar
        }
        
        this.currentUser.profiles[profileIndex] = {
          ...this.currentUser.profiles[profileIndex],
          ...updates,
        }
        
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        
        if (String(this.currentProfile?.id) === String(profileId)) {
          this.currentProfile = this.currentUser.profiles[profileIndex]
        }
        
        return { success: true }
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },
    
    async updateMaxProfiles(newMax) {
      try {
        this.currentUser.maxProfiles = newMax
        
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        
        return { success: true }
      } catch (error) {
        console.error('Error updating max profiles:', error)
        throw error
      }
    },
    
    // Rewards Management
    async createReward(rewardData) {
      try {
        const newReward = {
          id: String(Date.now()),
          title: rewardData.title,
          description: rewardData.description || '',
          points_cost: rewardData.points_cost || rewardData.points,
          imgUrl: rewardData.imgUrl || rewardData.image || null,
        }
        
        const response = await fetch('http://localhost:3000/rewards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReward),
        })
        
        const created = await response.json()
        this.householdRewards.push(created)
        
        return { success: true }
      } catch (error) {
        console.error('Error creating reward:', error)
        throw error
      }
    },
    
    async updateReward(rewardId, updates) {
      try {
        if (!rewardId || rewardId === null) {
          throw new Error('Invalid reward ID')
        }
        
        const rewardIndex = this.householdRewards.findIndex(r => String(r.id) === String(rewardId))
        if (rewardIndex === -1) throw new Error('Reward not found')
        
        const updated = {
          ...this.householdRewards[rewardIndex],
          title: updates.title,
          description: updates.description || '',
          points_cost: updates.points_cost || updates.points,
          imgUrl: updates.imgUrl || updates.image || null,
          id: rewardId,
        }
        
        const response = await fetch(`http://localhost:3000/rewards/${rewardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        if (!response.ok) throw new Error('Failed to update reward')
        
        const serverUpdated = await response.json()
        this.householdRewards[rewardIndex] = serverUpdated
        
        return { success: true }
      } catch (error) {
        console.error('Error updating reward:', error)
        throw error
      }
    },
    
    async deleteReward(rewardId) {
      try {
        if (!rewardId) throw new Error('Invalid reward ID')
        
        const response = await fetch(`http://localhost:3000/rewards/${rewardId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) throw new Error('Failed to delete reward')
        
        this.householdRewards = this.householdRewards.filter(r => String(r.id) !== String(rewardId))
        
        return { success: true }
      } catch (error) {
        console.error('Error deleting reward:', error)
        throw error
      }
    },
    
    // Appliances Management
    async createAppliance(applianceData) {
      try {
        const newAppliance = {
          id: String(Date.now()),
          name: applianceData.name,
          type: applianceData.type || 'electricity',
          powerWatts: applianceData.powerWatts || 100,
          category: applianceData.category,
          description: applianceData.description || '',
          imgUrl: applianceData.imgUrl || applianceData.image || null,
          isDefault: false,
        }
        
        const response = await fetch('http://localhost:3000/appliances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppliance),
        })
        
        const created = await response.json()
        this.availableAppliances.push(created)
        
        if (!this.currentUser.appliances.some(id => String(id) === String(created.id))) {
          this.currentUser.appliances.push(created.id)
          await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.currentUser),
          })
        }
        
        return { success: true }
      } catch (error) {
        console.error('Error creating appliance:', error)
        throw error
      }
    },
    
    async updateAppliance(applianceId, updates) {
      try {
        const applianceIndex = this.availableAppliances.findIndex(a => String(a.id) === String(applianceId))
        if (applianceIndex === -1) throw new Error('Appliance not found')
        
        const updated = {
          ...this.availableAppliances[applianceIndex],
          ...updates,
          id: applianceId,
        }
        
        const response = await fetch(`http://localhost:3000/appliances/${applianceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        if (!response.ok) throw new Error('Failed to update appliance')
        
        const serverUpdated = await response.json()
        this.availableAppliances[applianceIndex] = serverUpdated
        
        return { success: true }
      } catch (error) {
        console.error('Error updating appliance:', error)
        throw error
      }
    },
    
    async deleteAppliance(applianceId) {
      try {
        const response = await fetch(`http://localhost:3000/appliances/${applianceId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) throw new Error('Failed to delete appliance')
        
        this.availableAppliances = this.availableAppliances.filter(a => String(a.id) !== String(applianceId))
        
        this.currentUser.appliances = this.currentUser.appliances.filter(id => String(id) !== String(applianceId))
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        
        return { success: true }
      } catch (error) {
        console.error('Error deleting appliance:', error)
        throw error
      }
    },
    
    // Tasks Management
    async createTask(taskData) {
      try {
        const newTask = {
          id: String(Date.now()),
          title: taskData.title,
          category: taskData.category,
          points: taskData.points,
          description: taskData.description || '',
          imgUrl: taskData.imgUrl || taskData.image || null,
          co2saved: taskData.co2saved || taskData.points * 0.5,
          isDefault: false,
        }
        
        const response = await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        })
        
        const created = await response.json()
        this.availableTasks.push(created)
        
        if (!this.currentUser.tasks.some(id => String(id) === String(created.id))) {
          this.currentUser.tasks.push(created.id)
          await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.currentUser),
          })
        }
        
        return { success: true }
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },
    
    async updateTask(taskId, updates) {
      try {
        const taskIndex = this.availableTasks.findIndex(t => String(t.id) === String(taskId))
        if (taskIndex === -1) throw new Error('Task not found')
        
        const updated = {
          ...this.availableTasks[taskIndex],
          ...updates,
          co2saved: updates.co2saved || updates.points * 0.5,
          id: taskId,
        }
        
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        if (!response.ok) throw new Error('Failed to update task')
        
        const serverUpdated = await response.json()
        this.availableTasks[taskIndex] = serverUpdated
        
        return { success: true }
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },
    
    async deleteTask(taskId) {
      try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) throw new Error('Failed to delete task')
        
        this.availableTasks = this.availableTasks.filter(t => String(t.id) !== String(taskId))
        
        this.currentUser.tasks = this.currentUser.tasks.filter(id => String(id) !== String(taskId))
        await fetch(`http://localhost:3000/users/${this.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentUser),
        })
        
        return { success: true }
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    },

    // Challenge CRUD operations
    async createChallenge(challengeData) {
      try {
        const newChallenge = {
          id: String(Date.now()),
          target: challengeData.target || 1,
          xp_awarded: challengeData.xp_awarded || challengeData.xp || 50,
          type: challengeData.type,
          task_id: challengeData.task_id || null,
          title: challengeData.title,
          description: challengeData.description,
          isDefault: false,
          createdAt: new Date().toISOString(),
        }
        
        const response = await fetch('http://localhost:3000/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChallenge),
        })
        
        const created = await response.json()
        this.householdChallenges.push(created)
        
        return { success: true }
      } catch (error) {
        console.error('Error creating challenge:', error)
        throw error
      }
    },
    
    async updateChallenge(challengeId, updates) {
      try {
        const challengeIndex = this.householdChallenges.findIndex(c => String(c.id) === String(challengeId))
        if (challengeIndex === -1) throw new Error('Challenge not found')
        
        const updated = {
          ...this.householdChallenges[challengeIndex],
          target: updates.target || 1,
          xp_awarded: updates.xp_awarded || updates.xp,
          type: updates.type,
          task_id: updates.task_id || null,
          title: updates.title,
          description: updates.description,
        }
        
        await fetch(`http://localhost:3000/challenges/${challengeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        this.householdChallenges[challengeIndex] = updated
        
        return { success: true }
      } catch (error) {
        console.error('Error updating challenge:', error)
        throw error
      }
    },
    
    async deleteChallenge(challengeId) {
      try {
        await fetch(`http://localhost:3000/challenges/${challengeId}`, {
          method: 'DELETE',
        })
        
        this.householdChallenges = this.householdChallenges.filter(c => String(c.id) !== String(challengeId))
        
        return { success: true }
      } catch (error) {
        console.error('Error deleting challenge:', error)
        throw error
      }
    },

    // Legacy method for backwards compatibility
    async completeTask(taskId) {
      return this.completeTaskWithApi(taskId)
    },
  },
})
