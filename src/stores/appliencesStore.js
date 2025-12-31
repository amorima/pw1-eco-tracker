import { defineStore } from 'pinia';
import { mockAppliances } from '@/data/mockAppliances';
import { useUserStore } from './userStore';

export const useAppliancesStore = defineStore('appliances', {
  state: () => ({
    allAppliances: [...mockAppliances],
  }),
  getters: {
    // Get appliances configured for current household
    availableAppliances: (state) => {
      const userStore = useUserStore()
      if (!userStore.currentUser?.appliances) return []
      
      return state.allAppliances.filter(app => 
        userStore.currentUser.appliances.includes(app.id)
      )
    },
    
    // Get appliances by category
    appliancesByCategory: (state) => {
      const userStore = useUserStore()
      const available = state.allAppliances.filter(app => 
        userStore.currentUser?.appliances?.includes(app.id)
      )
      
      const grouped = {}
      available.forEach(app => {
        if (!grouped[app.category]) {
          grouped[app.category] = []
        }
        grouped[app.category].push(app)
      })
      return grouped
    },
    
    // Calculate daily energy consumption for household
    dailyEnergyConsumption: (state) => {
      const userStore = useUserStore()
      const available = state.allAppliances.filter(app => 
        userStore.currentUser?.appliances?.includes(app.id)
      )
      
      return available.reduce((total, app) => {
        const dailyKwh = (app.avgPowerConsumption * app.avgUsageHoursPerDay) / 1000
        return total + dailyKwh
      }, 0)
    },
    
    // Calculate daily CO2 emissions for household
    dailyCo2Emissions: (state) => {
      const userStore = useUserStore()
      const available = state.allAppliances.filter(app => 
        userStore.currentUser?.appliances?.includes(app.id)
      )
      
      return available.reduce((total, app) => {
        const dailyKwh = (app.avgPowerConsumption * app.avgUsageHoursPerDay) / 1000
        const co2 = dailyKwh * app.co2PerKwh
        return total + co2
      }, 0)
    }
  },
  actions: {
    // Track appliance usage for current profile
    trackUsage(applianceId, hoursUsed, date = new Date().toISOString().split('T')[0]) {
      const userStore = useUserStore()
      if (!userStore.currentProfile) {
        return { success: false, message: 'Nenhum perfil selecionado' }
      }
      
      const appliance = this.allAppliances.find(a => a.id === applianceId)
      if (!appliance) {
        return { success: false, message: 'Aparelho não encontrado' }
      }
      
      const energyConsumed = (appliance.avgPowerConsumption * hoursUsed) / 1000 // kWh
      const co2Emitted = energyConsumed * appliance.co2PerKwh
      
      const usage = {
        id: Date.now(),
        applianceId,
        date,
        hoursUsed,
        energyConsumed,
        co2Emitted
      }
      
      userStore.currentProfile.applianceUsage.push(usage)
      
      // Update profile in user's profiles array
      const profileIndex = userStore.currentUser.profiles.findIndex(
        p => p.id === userStore.currentProfile.id
      )
      if (profileIndex !== -1) {
        userStore.currentUser.profiles[profileIndex] = { ...userStore.currentProfile }
      }
      
      return { 
        success: true, 
        energyConsumed,
        co2Emitted,
        message: 'Consumo registado!' 
      }
    }
  },
});
