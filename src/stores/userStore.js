import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    currentUser: null,
    currentProfile: null,
    users: [],
  }),
  getters: {
    loggedIn:(state) => state.currentUser != null,
    isAdmin:(state) => state.currentUser.isAdmin,
    firstUse:(state) => !state.currentUser.profiles,
    getProfiles:(state) => state.currentProfile.profiles
  },
  actions: {
    createUser(user) {
      if(user.password !== user.confirmPassword) return false
      if(this.users.includes(user.email)) return false
      this.users.push(user)
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
    }
  },
});
