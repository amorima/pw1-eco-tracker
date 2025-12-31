import { defineStore } from 'pinia';
import { mockTasks } from '@/data/mockTasks';
import { useUserStore } from './userStore';

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    allTasks: [...mockTasks],
  }),
  getters: {
    // Get tasks available for current household
    availableTasks: (state) => {
      const userStore = useUserStore()
      if (!userStore.currentUser?.tasks) return []
      
      return state.allTasks.filter(task => 
        userStore.currentUser.tasks.includes(task.id)
      )
    },
    
    // Get tasks by category
    tasksByCategory: (state) => {
      const userStore = useUserStore()
      const available = state.allTasks.filter(task => 
        userStore.currentUser?.tasks?.includes(task.id)
      )
      
      const grouped = {}
      available.forEach(task => {
        if (!grouped[task.category]) {
          grouped[task.category] = []
        }
        grouped[task.category].push(task)
      })
      return grouped
    },
    
    // Get tasks by difficulty
    tasksByDifficulty: (state) => (difficulty) => {
      const userStore = useUserStore()
      return state.allTasks.filter(task => 
        task.difficulty === difficulty &&
        userStore.currentUser?.tasks?.includes(task.id)
      )
    }
  },
  actions: {
    // Complete a task (delegates to userStore)
    completeTask(taskId) {
      const userStore = useUserStore()
      return userStore.completeTask(taskId)
    }
  },
});
