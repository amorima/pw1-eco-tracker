import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

export const useActivitiesStore = defineStore('activitiesStore', {
  state: () => ({
    activities: JSON.parse(localStorage.getItem('eco-activities') || '[]'),
    activityTypes: [
      { id: 'bike', name: 'Cycling', icon: 'directions_bike', points: 10, co2Saved: 0.5 },
      { id: 'public-transport', name: 'Public Transport', icon: 'directions_bus', points: 8, co2Saved: 0.3 },
      { id: 'recycle', name: 'Recycling', icon: 'recycling', points: 5, co2Saved: 0.2 },
      { id: 'walk', name: 'Walking', icon: 'directions_walk', points: 7, co2Saved: 0.4 },
      { id: 'reusable-bag', name: 'Reusable Bag', icon: 'shopping_bag', points: 3, co2Saved: 0.1 },
      { id: 'energy-save', name: 'Energy Saving', icon: 'lightbulb', points: 15, co2Saved: 1.0 },
      { id: 'plant-tree', name: 'Plant a Tree', icon: 'eco', points: 50, co2Saved: 5.0 },
      { id: 'compost', name: 'Composting', icon: 'compost', points: 12, co2Saved: 0.8 }
    ]
  }),

  getters: {
    getActivityTypes: (state) => state.activityTypes,
    getProfileActivities: (state) => (profileId) => {
      return state.activities.filter(a => a.profileId === profileId)
    },
    getRecentActivities: (state) => (profileId, limit = 10) => {
      return state.activities
        .filter(a => a.profileId === profileId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
    }
  },

  actions: {
    logActivity(activityData) {
      const userStore = useUserStore()
      const activityType = this.activityTypes.find(t => t.id === activityData.typeId)

      if (!activityType) return { success: false, message: 'Invalid activity type' }

      const newActivity = {
        id: Date.now().toString(),
        profileId: activityData.profileId,
        typeId: activityData.typeId,
        typeName: activityType.name,
        icon: activityType.icon,
        points: activityType.points,
        co2Saved: activityType.co2Saved,
        date: activityData.date || new Date().toISOString(),
        notes: activityData.notes || ''
      }

      this.activities.push(newActivity)
      this._saveActivities()

      // Update profile gamification
      userStore.addPoints(newActivity.points, activityData.profileId)
      userStore.updateCO2Saved(newActivity.co2Saved, activityData.profileId)

      return { success: true, activity: newActivity }
    },

    _saveActivities() {
      localStorage.setItem('eco-activities', JSON.stringify(this.activities))
    }
  }
})

