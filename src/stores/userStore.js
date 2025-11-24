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
    userIsAdmin: (state) => state.isAdmin,
    getUsers: (state) => state.users,
    getUserById: (state) => (id) => state.users.find(u => u.id === id),
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
    },
    deleteUser(id) {
        if(this.user.id == id){
            this.logout()
        }
        this.users = this.users.filter(u => u.id != id)
    },
    getPoints(amount) {
        this.user.points+=amount
        this.users.map(u => u.id==this.user.id ? this.user : u);
    }
  }
})
