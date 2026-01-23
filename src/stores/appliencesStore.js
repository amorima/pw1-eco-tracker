// Appliances Store for managing household appliances and usage tracking
import { defineStore } from 'pinia'
import { getApplianceIcon, apiDeviceTypes } from '@/data/categoryIcons'
import { calculateApplianceEmissions } from '@/services/carbonApiService'

export const useAppliancesStore = defineStore('appliancesStore', {
  state: () => ({
    // All available appliances from database
    appliances: [],
    
    // Loading states
    isLoading: false,
    isCalculating: false,
    
    // Error handling
    error: null,
    
    // Last API calculation result
    lastCalculation: null,
  }),

  getters: {
    /**
     * Get all appliances enriched with icons
     */
    allAppliances: (state) => {
      return state.appliances.map(app => ({
        ...app,
        icon: getApplianceIcon(app.category),
      }))
    },
    
    /**
     * Get default appliances (system defaults)
     */
    defaultAppliances: (state) => {
      return state.appliances
        .filter(app => app.isDefault)
        .map(app => ({
          ...app,
          icon: getApplianceIcon(app.category),
        }))
    },
    
    /**
     * Get custom (user-created) appliances
     */
    customAppliances: (state) => {
      return state.appliances
        .filter(app => !app.isDefault)
        .map(app => ({
          ...app,
          icon: getApplianceIcon(app.category),
        }))
    },
    
    /**
     * Get appliances grouped by category
     */
    appliancesByCategory: (state) => {
      const grouped = {}
      
      state.appliances.forEach(app => {
        const category = app.category || 'Outros'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push({
          ...app,
          icon: getApplianceIcon(app.category),
        })
      })
      
      return grouped
    },
    
    /**
     * Get valid device types for API calls
     */
    validApiDeviceTypes: () => apiDeviceTypes,
    
    /**
     * Check if an appliance type is valid for API
     */
    isValidApiType: () => (type) => {
      return apiDeviceTypes.includes(type)
    },
    
    /**
     * Get appliance by ID (enriched with icon)
     */
    getApplianceById: (state) => (id) => {
      const app = state.appliances.find(a => String(a.id) === String(id))
      if (!app) return null
      
      return {
        ...app,
        icon: getApplianceIcon(app.category),
      }
    },
    
    /**
     * Get categories list
     */
    categories: (state) => {
      const cats = new Set()
      state.appliances.forEach(app => {
        if (app.category) cats.add(app.category)
      })
      return Array.from(cats).sort()
    },
  },

  actions: {
    /**
     * Fetch all appliances from API
     */
    async fetchAppliances() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('http://localhost:3000/appliances')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar aparelhos')
        }
        
        this.appliances = await response.json()
        
        return { success: true }
      } catch (error) {
        console.error('Error fetching appliances:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Calculate CO2 emissions for appliance usage
     * Uses the Carbon API with appliance.type for device type
     * 
     * @param {Object} appliance - The appliance object
     * @param {number} hoursUsed - Duration of usage in hours
     * @returns {Object} - Calculation result with energy and CO2 data
     */
    async calculateEmissions(appliance, hoursUsed) {
      this.isCalculating = true
      this.error = null
      
      try {
        const result = await calculateApplianceEmissions(appliance, hoursUsed)
        
        if (result.success) {
          this.lastCalculation = {
            appliance_id: appliance.id,
            timestamp: new Date().toISOString(),
            hoursUsed,
            ...result.data,
          }
        }
        
        return result
      } catch (error) {
        console.error('Error calculating emissions:', error)
        this.error = error.message
        
        // Fallback to local calculation
        const fallback = this.calculateEmissionsLocal(appliance, hoursUsed)
        return {
          success: true,
          data: fallback,
          source: 'local',
        }
      } finally {
        this.isCalculating = false
      }
    },
    
    /**
     * Local calculation fallback (when API unavailable)
     * Uses powerWatts from appliance
     * 
     * @param {Object} appliance - The appliance object
     * @param {number} hoursUsed - Duration in hours
     * @returns {Object} - Calculated energy and CO2 data
     */
    calculateEmissionsLocal(appliance, hoursUsed) {
      // Use powerWatts from appliance or fallback
      const powerWatts = appliance.powerWatts || 200
      const minutes = Math.round(hoursUsed * 60)
      
      // Calculate energy in kWh: (watts * hours) / 1000
      const kwh = (powerWatts * hoursUsed) / 1000
      
      // Portuguese grid average: ~0.188 kg CO2/kWh
      const co2 = kwh * 0.188
      
      return {
        type: appliance.type || 'electricity',
        carbon_kg_co2: co2,
        minutes: minutes,
        kwh: kwh,
        device_power_watts: powerWatts,
        source: 'local',
      }
    },
    
    /**
     * Create a new appliance
     */
    async createAppliance(applianceData) {
      this.isLoading = true
      this.error = null
      
      try {
        const newAppliance = {
          id: String(Date.now()),
          name: applianceData.name,
          type: applianceData.type || 'electricity',
          powerWatts: applianceData.powerWatts || 100,
          category: applianceData.category,
          description: applianceData.description || '',
          imgUrl: applianceData.imgUrl || null,
          isDefault: false,
        }
        
        const response = await fetch('http://localhost:3000/appliances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppliance),
        })
        
        if (!response.ok) {
          throw new Error('Erro ao criar aparelho')
        }
        
        const created = await response.json()
        this.appliances.push(created)
        
        return { success: true, appliance: created }
      } catch (error) {
        console.error('Error creating appliance:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Update an existing appliance
     */
    async updateAppliance(applianceId, updates) {
      this.isLoading = true
      this.error = null
      
      try {
        const index = this.appliances.findIndex(a => String(a.id) === String(applianceId))
        if (index === -1) {
          throw new Error('Aparelho não encontrado')
        }
        
        const updated = {
          ...this.appliances[index],
          ...updates,
          id: applianceId, // Ensure ID doesn't change
        }
        
        const response = await fetch(`http://localhost:3000/appliances/${applianceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        if (!response.ok) {
          throw new Error('Erro ao atualizar aparelho')
        }
        
        const serverUpdated = await response.json()
        this.appliances[index] = serverUpdated
        
        return { success: true, appliance: serverUpdated }
      } catch (error) {
        console.error('Error updating appliance:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Delete an appliance
     */
    async deleteAppliance(applianceId) {
      this.isLoading = true
      this.error = null
      
      try {
        const appliance = this.appliances.find(a => String(a.id) === String(applianceId))
        
        if (appliance?.isDefault) {
          throw new Error('Não é possível eliminar aparelhos padrão')
        }
        
        const response = await fetch(`http://localhost:3000/appliances/${applianceId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Erro ao eliminar aparelho')
        }
        
        this.appliances = this.appliances.filter(a => String(a.id) !== String(applianceId))
        
        return { success: true }
      } catch (error) {
        console.error('Error deleting appliance:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Get consumption statistics for a time period
     * Requires appliance usage data from profile
     */
    getConsumptionStats(applianceUsage, days = 7) {
      if (!applianceUsage || !applianceUsage.length) {
        return { total: 0, byDay: [], byAppliance: {} }
      }
      
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      const filteredUsage = applianceUsage.filter(u => 
        new Date(u.usedAt) >= cutoffDate
      )
      
      // Total emissions
      const total = filteredUsage.reduce((sum, u) => sum + (u.co2emited || 0), 0)
      
      // By day
      const byDayMap = {}
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        byDayMap[dateStr] = { date: dateStr, co2: 0, kwh: 0, count: 0 }
      }
      
      filteredUsage.forEach(u => {
        const dateStr = u.usedAt.split('T')[0]
        if (byDayMap[dateStr]) {
          byDayMap[dateStr].co2 += u.co2emited || 0
          byDayMap[dateStr].kwh += u.energy_consumed || 0
          byDayMap[dateStr].count++
        }
      })
      
      const byDay = Object.values(byDayMap).reverse()
      
      // By appliance
      const byAppliance = {}
      filteredUsage.forEach(u => {
        const appId = u.appliance_id
        if (!byAppliance[appId]) {
          const app = this.appliances.find(a => String(a.id) === String(appId))
          byAppliance[appId] = {
            id: appId,
            name: app?.name || 'Desconhecido',
            icon: getApplianceIcon(app?.category),
            co2: 0,
            kwh: 0,
            count: 0,
          }
        }
        byAppliance[appId].co2 += u.co2emited || 0
        byAppliance[appId].kwh += u.energy_consumed || 0
        byAppliance[appId].count++
      })
      
      return {
        total,
        byDay,
        byAppliance: Object.values(byAppliance)
          .sort((a, b) => b.co2 - a.co2),
      }
    },
    
    /**
     * Clear any errors
     */
    clearError() {
      this.error = null
    },
  },
})
