import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    currentUser: null,
    currentProfile: null,
    users: [],
  }),
  getters: {
    loggedIn:(state) => state.currentUser != null,
    isAdmin:(state) => state.currentUser?.isAdmin || false,
    firstUse:(state) => !state.currentUser.profiles,
    getProfiles:(state) => state.currentProfile?.profiles || []
  },
  actions: {
    createUser(user) {
      if(user.password !== user.confirmPassword) return false
      if(this.users.find(u => u.email === user.email)) return false
      
      const newUser = {
        ...user,
        isAdmin: true, // First user is always admin
        profiles: null,
        maxUsers: null,
        appliances: [],
        activities: []
      }
      
      this.users.push(newUser)
      return true
    },
    logIn(user) {
      const foundUser = this.users.find(u => u.email===user.email && u.password===user.password)
      if(foundUser) {
        this.currentUser = foundUser
        return true
      }
      return false
    },
    logOut() {
      this.currentUser = null
      this.currentProfile = null
    },
    completeQuickStart(setupData) {
      if (!this.currentUser) return false
      
      // Update current user with setup data
      this.currentUser.profiles = [{
        id: Date.now().toString(),
        name: setupData.adminProfile.name,
        age: setupData.adminProfile.age || null,
        avatar: setupData.adminProfile.avatar || null,
        isAdmin: true,
        points: 0,
        co2Saved: 0,
        level: 1,
        createdAt: new Date().toISOString()
      }]
      
      this.currentUser.maxUsers = setupData.maxUsers
      this.currentUser.appliances = setupData.appliances
      this.currentUser.activities = setupData.activities
      
      // Set the admin profile as current profile
      this.currentProfile = this.currentUser.profiles[0]
      
      // Update the user in the users array
      const userIndex = this.users.findIndex(u => u.email === this.currentUser.email)
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser
      }
      
      return true
    },
    createProfile(profileData) {
      if (!this.currentUser) {
        return { success: false, message: 'Nenhum usuário logado' }
      }

      if (!this.currentUser.profiles) {
        this.currentUser.profiles = []
      }

      // Check if max users reached
      if (this.currentUser.profiles.length >= this.currentUser.maxUsers) {
        return { success: false, message: 'Número máximo de perfis atingido' }
      }

      // Check if name is unique
      if (this.currentUser.profiles.find(p => p.name === profileData.name)) {
        return { success: false, message: 'Já existe um perfil com este nome' }
      }

      const newProfile = {
        id: Date.now().toString(),
        name: profileData.name,
        age: profileData.age || null,
        avatar: profileData.avatar || null,
        isAdmin: false,
        points: 0,
        co2Saved: 0,
        level: 1,
        createdAt: new Date().toISOString()
      }

      this.currentUser.profiles.push(newProfile)

      // Update the user in the users array
      const userIndex = this.users.findIndex(u => u.email === this.currentUser.email)
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser
      }

      return { success: true, profile: newProfile }
    },
    selectProfile(profileId) {
      if (!this.currentUser || !this.currentUser.profiles) {
        return false
      }

      const profile = this.currentUser.profiles.find(p => p.id === profileId)
      if (profile) {
        this.currentProfile = profile
        return true
      }

      return false
    },
    deleteProfile(profileId) {
      if (!this.currentUser || !this.currentUser.profiles) {
        return { success: false, message: 'Nenhum usuário logado' }
      }

      const profileIndex = this.currentUser.profiles.findIndex(p => p.id === profileId)
      if (profileIndex === -1) {
        return { success: false, message: 'Perfil não encontrado' }
      }

      // Prevent deleting admin profile if it's the only one
      if (this.currentUser.profiles[profileIndex].isAdmin && this.currentUser.profiles.length === 1) {
        return { success: false, message: 'Não é possível excluir o único perfil administrador' }
      }

      this.currentUser.profiles.splice(profileIndex, 1)

      // Update the user in the users array
      const userIndex = this.users.findIndex(u => u.email === this.currentUser.email)
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser
      }

      // If current profile was deleted, reset it
      if (this.currentProfile?.id === profileId) {
        this.currentProfile = null
      }

      return { success: true }
    }
  },
});
