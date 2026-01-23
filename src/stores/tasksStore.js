// Tasks Store for managing eco-tasks and activity tracking
import { defineStore } from 'pinia'
import { getTaskIcon } from '@/data/categoryIcons'

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    // All available tasks from database
    tasks: [],
    
    // Loading states
    isLoading: false,
    
    // Error handling
    error: null,
  }),

  getters: {
    /**
     * Get all tasks enriched with icons
     */
    allTasks: (state) => {
      return state.tasks.map(task => ({
        ...task,
        icon: getTaskIcon(task.category),
      }))
    },
    
    /**
     * Get default tasks (system defaults)
     */
    defaultTasks: (state) => {
      return state.tasks
        .filter(task => task.isDefault)
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category),
        }))
    },
    
    /**
     * Get custom (user-created) tasks
     */
    customTasks: (state) => {
      return state.tasks
        .filter(task => !task.isDefault)
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category),
        }))
    },
    
    /**
     * Get tasks grouped by category
     */
    tasksByCategory: (state) => {
      const grouped = {}
      
      state.tasks.forEach(task => {
        const category = task.category || 'Outros'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push({
          ...task,
          icon: getTaskIcon(task.category),
        })
      })
      
      return grouped
    },
    
    /**
     * Get task by ID (enriched with icon)
     */
    getTaskById: (state) => (id) => {
      const task = state.tasks.find(t => String(t.id) === String(id))
      if (!task) return null
      
      return {
        ...task,
        icon: getTaskIcon(task.category),
      }
    },
    
    /**
     * Get categories list
     */
    categories: (state) => {
      const cats = new Set()
      state.tasks.forEach(task => {
        if (task.category) cats.add(task.category)
      })
      return Array.from(cats).sort()
    },
    
    /**
     * Get tasks sorted by points (highest first)
     */
    tasksByPoints: (state) => {
      return [...state.tasks]
        .sort((a, b) => b.points - a.points)
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category),
        }))
    },
    
    /**
     * Get tasks sorted by CO2 saved (highest first)
     */
    tasksByCo2: (state) => {
      return [...state.tasks]
        .sort((a, b) => b.co2saved - a.co2saved)
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category),
        }))
    },
  },

  actions: {
    /**
     * Fetch all tasks from API
     */
    async fetchTasks() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('http://localhost:3000/tasks')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar tarefas')
        }
        
        this.tasks = await response.json()
        
        return { success: true }
      } catch (error) {
        console.error('Error fetching tasks:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Create a new task
     */
    async createTask(taskData) {
      this.isLoading = true
      this.error = null
      
      try {
        const newTask = {
          id: String(Date.now()),
          title: taskData.title,
          category: taskData.category,
          points: taskData.points,
          co2saved: taskData.co2saved || taskData.points * 0.5,
          description: taskData.description || '',
          imgUrl: taskData.imgUrl || null,
          isDefault: false,
        }
        
        const response = await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        })
        
        if (!response.ok) {
          throw new Error('Erro ao criar tarefa')
        }
        
        const created = await response.json()
        this.tasks.push(created)
        
        return { success: true, task: created }
      } catch (error) {
        console.error('Error creating task:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Update an existing task
     */
    async updateTask(taskId, updates) {
      this.isLoading = true
      this.error = null
      
      try {
        const index = this.tasks.findIndex(t => String(t.id) === String(taskId))
        if (index === -1) {
          throw new Error('Tarefa não encontrada')
        }
        
        const updated = {
          ...this.tasks[index],
          ...updates,
          co2saved: updates.co2saved || updates.points * 0.5,
          id: taskId, // Ensure ID doesn't change
        }
        
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        
        if (!response.ok) {
          throw new Error('Erro ao atualizar tarefa')
        }
        
        const serverUpdated = await response.json()
        this.tasks[index] = serverUpdated
        
        return { success: true, task: serverUpdated }
      } catch (error) {
        console.error('Error updating task:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Delete a task
     */
    async deleteTask(taskId) {
      this.isLoading = true
      this.error = null
      
      try {
        const task = this.tasks.find(t => String(t.id) === String(taskId))
        
        if (task?.isDefault) {
          throw new Error('Não é possível eliminar tarefas padrão')
        }
        
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Erro ao eliminar tarefa')
        }
        
        this.tasks = this.tasks.filter(t => String(t.id) !== String(taskId))
        
        return { success: true }
      } catch (error) {
        console.error('Error deleting task:', error)
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Get activity statistics for a time period
     * Requires activity data from profile
     */
    getActivityStats(activities, days = 7) {
      if (!activities || !activities.length) {
        return { total: 0, byDay: [], byTask: {}, byCategory: {} }
      }
      
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      const filteredActivities = activities.filter(a => 
        new Date(a.completedAt) >= cutoffDate
      )
      
      // Total CO2 saved
      const total = filteredActivities.reduce((sum, a) => sum + (a.co2saved || 0), 0)
      
      // By day
      const byDayMap = {}
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        byDayMap[dateStr] = { date: dateStr, co2saved: 0, points: 0, count: 0 }
      }
      
      filteredActivities.forEach(a => {
        const dateStr = a.completedAt.split('T')[0]
        if (byDayMap[dateStr]) {
          byDayMap[dateStr].co2saved += a.co2saved || 0
          byDayMap[dateStr].points += a.pointsEarned || 0
          byDayMap[dateStr].count++
        }
      })
      
      const byDay = Object.values(byDayMap).reverse()
      
      // By task
      const byTask = {}
      filteredActivities.forEach(a => {
        const taskId = a.task_id
        if (!byTask[taskId]) {
          const task = this.tasks.find(t => String(t.id) === String(taskId))
          byTask[taskId] = {
            id: taskId,
            title: task?.title || 'Desconhecido',
            icon: getTaskIcon(task?.category),
            co2saved: 0,
            points: 0,
            count: 0,
          }
        }
        byTask[taskId].co2saved += a.co2saved || 0
        byTask[taskId].points += a.pointsEarned || 0
        byTask[taskId].count++
      })
      
      // By category
      const byCategory = {}
      filteredActivities.forEach(a => {
        const task = this.tasks.find(t => String(t.id) === String(a.task_id))
        const category = task?.category || 'Outros'
        
        if (!byCategory[category]) {
          byCategory[category] = {
            category,
            icon: getTaskIcon(category),
            co2saved: 0,
            points: 0,
            count: 0,
          }
        }
        byCategory[category].co2saved += a.co2saved || 0
        byCategory[category].points += a.pointsEarned || 0
        byCategory[category].count++
      })
      
      return {
        total,
        byDay,
        byTask: Object.values(byTask).sort((a, b) => b.co2saved - a.co2saved),
        byCategory: Object.values(byCategory).sort((a, b) => b.co2saved - a.co2saved),
      }
    },
    
    /**
     * Filter tasks by category
     */
    filterByCategory(category) {
      if (!category) return this.allTasks
      
      return this.tasks
        .filter(task => task.category === category)
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category),
        }))
    },
    
    /**
     * Search tasks by title or description
     */
    searchTasks(query) {
      if (!query) return this.allTasks
      
      const lowerQuery = query.toLowerCase()
      
      return this.tasks
        .filter(task => 
          task.title.toLowerCase().includes(lowerQuery) ||
          (task.description && task.description.toLowerCase().includes(lowerQuery))
        )
        .map(task => ({
          ...task,
          icon: getTaskIcon(task.category),
        }))
    },
    
    /**
     * Clear any errors
     */
    clearError() {
      this.error = null
    },
  },
})
