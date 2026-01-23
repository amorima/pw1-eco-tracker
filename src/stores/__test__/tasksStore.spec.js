import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '@/stores/tasksStore'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('TasksStore', () => {
  let store

  // Sample test data
  const mockTasks = [
    {
      id: '1',
      title: 'Desligar luzes ao sair de casa',
      category: 'Energia',
      points: 20,
      description: 'Desligar todas as luzes quando sair de uma divisão',
      imgUrl: null,
      co2saved: 10,
      isDefault: true,
    },
    {
      id: '2',
      title: 'Usar transporte público',
      category: 'Mobilidade',
      points: 15,
      description: 'Usar transporte público em vez de carro próprio',
      imgUrl: null,
      co2saved: 7.5,
      isDefault: true,
    },
    {
      id: '3',
      title: 'Custom Task',
      category: 'Outros',
      points: 10,
      description: 'A custom task',
      imgUrl: null,
      co2saved: 5,
      isDefault: false,
    },
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTasksStore()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================
  // FETCH TESTS
  // ==========================================
  describe('fetchTasks', () => {
    it('should fetch all tasks successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTasks),
      })

      const result = await store.fetchTasks()

      expect(result.success).toBe(true)
      expect(store.tasks.length).toBe(3)
      expect(store.tasks[0].title).toBe('Desligar luzes ao sair de casa')
    })

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      const result = await store.fetchTasks()

      expect(result.success).toBe(false)
      expect(store.error).toBeTruthy()
    })

    it('should set loading state during fetch', async () => {
      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(mockTasks),
        }), 100))
      )

      const fetchPromise = store.fetchTasks()
      expect(store.isLoading).toBe(true)
      
      await fetchPromise
      expect(store.isLoading).toBe(false)
    })
  })

  // ==========================================
  // CREATE TESTS
  // ==========================================
  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const newTask = {
        title: 'New Eco Task',
        category: 'Energia',
        points: 25,
        co2saved: 12,
        description: 'A new test task',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...newTask, id: '999', isDefault: false }),
      })

      const result = await store.createTask(newTask)

      expect(result.success).toBe(true)
      expect(result.task.title).toBe('New Eco Task')
      expect(result.task.isDefault).toBe(false)
      expect(store.tasks.length).toBe(1)
    })

    it('should auto-calculate co2saved if not provided', async () => {
      const newTask = {
        title: 'Minimal Task',
        category: 'Test',
        points: 20,
        // co2saved not provided
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          ...newTask, 
          id: '999', 
          co2saved: 10, // points * 0.5
          isDefault: false,
          imgUrl: null,
          description: '',
        }),
      })

      const result = await store.createTask(newTask)

      expect(result.success).toBe(true)
      expect(result.task.co2saved).toBe(10) // 20 * 0.5
    })

    it('should handle creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      const result = await store.createTask({
        title: 'Failed',
        category: 'Test',
        points: 10,
      })

      expect(result.success).toBe(false)
      expect(store.error).toBeTruthy()
    })
  })

  // ==========================================
  // UPDATE TESTS
  // ==========================================
  describe('updateTask', () => {
    beforeEach(() => {
      store.tasks = JSON.parse(JSON.stringify(mockTasks))
    })

    it('should update an existing task successfully', async () => {
      const updates = {
        title: 'Updated Task',
        points: 30,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockTasks[0], ...updates, co2saved: 15 }),
      })

      const result = await store.updateTask('1', updates)

      expect(result.success).toBe(true)
      expect(result.task.title).toBe('Updated Task')
      expect(result.task.points).toBe(30)
      expect(store.tasks[0].title).toBe('Updated Task')
    })

    it('should fail when task not found', async () => {
      const result = await store.updateTask('999', { title: 'Not Found' })

      expect(result.success).toBe(false)
      expect(result.message).toContain('não encontrada')
    })

    it('should preserve task ID during update', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockTasks[0], id: '1', title: 'Updated' }),
      })

      const result = await store.updateTask('1', { id: 'different-id', title: 'Updated' })

      expect(result.task.id).toBe('1')
    })

    it('should recalculate co2saved based on new points if not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockTasks[0], points: 40, co2saved: 20 }),
      })

      const result = await store.updateTask('1', { points: 40 })

      expect(result.task.co2saved).toBe(20) // 40 * 0.5
    })
  })

  // ==========================================
  // DELETE TESTS
  // ==========================================
  describe('deleteTask', () => {
    beforeEach(() => {
      store.tasks = JSON.parse(JSON.stringify(mockTasks))
    })

    it('should delete a custom task successfully', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })

      const result = await store.deleteTask('3') // Custom task

      expect(result.success).toBe(true)
      expect(store.tasks.length).toBe(2)
      expect(store.tasks.find(t => t.id === '3')).toBeUndefined()
    })

    it('should not delete default tasks', async () => {
      const result = await store.deleteTask('1') // Default task

      expect(result.success).toBe(false)
      expect(result.message).toContain('padrão')
      expect(store.tasks.length).toBe(3) // Unchanged
    })

    it('should handle delete errors', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })

      const result = await store.deleteTask('3')

      expect(result.success).toBe(false)
    })
  })

  // ==========================================
  // GETTERS TESTS
  // ==========================================
  describe('Getters', () => {
    beforeEach(() => {
      store.tasks = JSON.parse(JSON.stringify(mockTasks))
    })

    describe('allTasks', () => {
      it('should return all tasks with icons', () => {
        const all = store.allTasks

        expect(all.length).toBe(3)
        expect(all[0]).toHaveProperty('icon')
      })
    })

    describe('defaultTasks', () => {
      it('should return only default tasks', () => {
        const defaults = store.defaultTasks

        expect(defaults.length).toBe(2)
        defaults.forEach(task => {
          expect(task.isDefault).toBe(true)
        })
      })
    })

    describe('customTasks', () => {
      it('should return only custom tasks', () => {
        const custom = store.customTasks

        expect(custom.length).toBe(1)
        expect(custom[0].title).toBe('Custom Task')
        expect(custom[0].isDefault).toBe(false)
      })
    })

    describe('tasksByCategory', () => {
      it('should group tasks by category', () => {
        const grouped = store.tasksByCategory

        expect(grouped['Energia']).toBeDefined()
        expect(grouped['Energia'].length).toBe(1)
        expect(grouped['Mobilidade'].length).toBe(1)
        expect(grouped['Outros'].length).toBe(1)
      })
    })

    describe('getTaskById', () => {
      it('should return task by ID with icon', () => {
        const task = store.getTaskById('1')

        expect(task).toBeDefined()
        expect(task.title).toBe('Desligar luzes ao sair de casa')
        expect(task).toHaveProperty('icon')
      })

      it('should return null for non-existent ID', () => {
        const task = store.getTaskById('999')

        expect(task).toBeNull()
      })
    })

    describe('categories', () => {
      it('should return unique sorted categories', () => {
        const categories = store.categories

        expect(categories.length).toBe(3)
        expect(categories).toEqual(['Energia', 'Mobilidade', 'Outros'])
      })
    })

    describe('tasksByPoints', () => {
      it('should return tasks sorted by points descending', () => {
        const sorted = store.tasksByPoints

        expect(sorted[0].points).toBe(20)
        expect(sorted[1].points).toBe(15)
        expect(sorted[2].points).toBe(10)
      })
    })

    describe('tasksByCo2', () => {
      it('should return tasks sorted by CO2 saved descending', () => {
        const sorted = store.tasksByCo2

        expect(sorted[0].co2saved).toBe(10)
        expect(sorted[1].co2saved).toBe(7.5)
        expect(sorted[2].co2saved).toBe(5)
      })
    })
  })

  // ==========================================
  // ACTIVITY STATS TESTS
  // ==========================================
  describe('getActivityStats', () => {
    beforeEach(() => {
      store.tasks = JSON.parse(JSON.stringify(mockTasks))
    })

    it('should return empty stats for no activity data', () => {
      const stats = store.getActivityStats(null, 7)

      expect(stats.total).toBe(0)
      expect(Object.keys(stats.byTask).length).toBe(0)
      expect(Object.keys(stats.byCategory).length).toBe(0)
    })

    it('should calculate total CO2 saved correctly', () => {
      const today = new Date().toISOString()
      const activities = [
        { task_id: '1', completedAt: today, co2saved: 10, pointsEarned: 20 },
        { task_id: '2', completedAt: today, co2saved: 7.5, pointsEarned: 15 },
      ]

      const stats = store.getActivityStats(activities, 7)

      expect(stats.total).toBeCloseTo(17.5)
    })

    it('should group by task correctly', () => {
      const today = new Date().toISOString()
      const activities = [
        { task_id: '1', completedAt: today, co2saved: 10, pointsEarned: 20 },
        { task_id: '1', completedAt: today, co2saved: 10, pointsEarned: 20 },
        { task_id: '2', completedAt: today, co2saved: 7.5, pointsEarned: 15 },
      ]

      const stats = store.getActivityStats(activities, 7)

      expect(stats.byTask.length).toBe(2)
      
      const task1 = stats.byTask.find(t => t.id === '1')
      expect(task1.co2saved).toBeCloseTo(20)
      expect(task1.count).toBe(2)
    })

    it('should group by category correctly', () => {
      const today = new Date().toISOString()
      const activities = [
        { task_id: '1', completedAt: today, co2saved: 10, pointsEarned: 20 },
        { task_id: '2', completedAt: today, co2saved: 7.5, pointsEarned: 15 },
      ]

      const stats = store.getActivityStats(activities, 7)

      expect(stats.byCategory.length).toBe(2)
      
      const energia = stats.byCategory.find(c => c.category === 'Energia')
      expect(energia.co2saved).toBe(10)
      
      const mobilidade = stats.byCategory.find(c => c.category === 'Mobilidade')
      expect(mobilidade.co2saved).toBe(7.5)
    })

    it('should filter by date range correctly', () => {
      const today = new Date().toISOString()
      const tenDaysAgo = new Date()
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
      
      const activities = [
        { task_id: '1', completedAt: today, co2saved: 10, pointsEarned: 20 },
        { task_id: '1', completedAt: tenDaysAgo.toISOString(), co2saved: 10, pointsEarned: 20 },
      ]

      const stats = store.getActivityStats(activities, 7)

      expect(stats.total).toBeCloseTo(10) // Only today's activity
    })

    it('should return byDay array with correct structure when data exists', () => {
      const today = new Date().toISOString()
      const activities = [
        { task_id: '1', completedAt: today, co2saved: 10, pointsEarned: 20 },
      ]

      const stats = store.getActivityStats(activities, 7)

      expect(stats.byDay.length).toBe(7)
      expect(stats.byDay[0]).toHaveProperty('date')
      expect(stats.byDay[0]).toHaveProperty('co2saved')
      expect(stats.byDay[0]).toHaveProperty('points')
      expect(stats.byDay[0]).toHaveProperty('count')
    })
  })

  // ==========================================
  // FILTER AND SEARCH TESTS
  // ==========================================
  describe('filterByCategory', () => {
    beforeEach(() => {
      store.tasks = JSON.parse(JSON.stringify(mockTasks))
    })

    it('should filter tasks by category', () => {
      const energiaTasks = store.filterByCategory('Energia')

      expect(energiaTasks.length).toBe(1)
      expect(energiaTasks[0].category).toBe('Energia')
    })

    it('should return all tasks if no category specified', () => {
      const allTasks = store.filterByCategory(null)

      expect(allTasks.length).toBe(3)
    })

    it('should return empty array for non-existent category', () => {
      const tasks = store.filterByCategory('NonExistent')

      expect(tasks.length).toBe(0)
    })
  })

  describe('searchTasks', () => {
    beforeEach(() => {
      store.tasks = JSON.parse(JSON.stringify(mockTasks))
    })

    it('should search tasks by title', () => {
      const results = store.searchTasks('luzes')

      expect(results.length).toBe(1)
      expect(results[0].title).toContain('luzes')
    })

    it('should search tasks by description', () => {
      const results = store.searchTasks('transporte público')

      expect(results.length).toBe(1)
    })

    it('should be case-insensitive', () => {
      const results = store.searchTasks('LUZES')

      expect(results.length).toBe(1)
    })

    it('should return all tasks if no query specified', () => {
      const results = store.searchTasks('')

      expect(results.length).toBe(3)
    })

    it('should return empty array for non-matching query', () => {
      const results = store.searchTasks('xyz123')

      expect(results.length).toBe(0)
    })
  })

  // ==========================================
  // ERROR HANDLING TESTS
  // ==========================================
  describe('Error Handling', () => {
    it('should clear error state', () => {
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('should set error on failed operations', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await store.fetchTasks()

      expect(store.error).toBeTruthy()
    })
  })
})
