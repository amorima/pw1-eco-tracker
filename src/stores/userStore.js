import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [],
    user: null,
    isLoggedIn: false,
    isAdmin: false
  }),
  
  getters: {
    userIsLoggedIn: (state) => state.isLoggedIn,
    userIsAdmin: (state) => state.isAdmin
  },
  
  actions: {
    register(userData) {
        this.users.push(userData)
    },
    login(userData) {
      this.user = userData
      this.isLoggedIn = true
      this.isAdmin = userData.role === 'admin'
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      this.isAdmin = false
    }
  }
})
