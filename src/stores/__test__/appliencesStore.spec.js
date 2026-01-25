import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppliancesStore } from '@/stores/appliencesStore'

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

// Mock the carbon API service
vi.mock('@/services/carbonApiService', () => ({
  calculateApplianceEmissions: vi.fn().mockResolvedValue({
    success: true,
    data: {
      type: 'electricity',
      carbon_kg_co2: 0.05,
      minutes: 60,
      kwh: 0.2,
      device_power_watts: 200,
    },
  }),
}))

describe('AppliancesStore', () => {
  let store

  // Sample test data
  const mockAppliances = [
    {
      id: '1',
      name: 'Frigorífico',
      type: 'refrigerator',
      powerWatts: 150,
      category: 'Cozinha',
      description: 'Frigorífico de casa',
      imgUrl: null,
      isDefault: true,
    },
    {
      id: '2',
      name: 'Televisão',
      type: 'television',
      powerWatts: 100,
      category: 'Entretenimento',
      description: 'TV da sala',
      imgUrl: null,
      isDefault: true,
    },
    {
      id: '3',
      name: 'Custom Appliance',
      type: 'electricity',
      powerWatts: 500,
      category: 'Outros',
      description: 'Custom description',
      imgUrl: null,
      isDefault: false,
    },
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAppliancesStore()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================
  // FETCH TESTS
  // ==========================================
  describe('fetchAppliances', () => {
    it('should fetch all appliances successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAppliances),
      })

      const result = await store.fetchAppliances()

      expect(result.success).toBe(true)
      expect(store.appliances.length).toBe(3)
      expect(store.appliances[0].name).toBe('Frigorífico')
    })

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      const result = await store.fetchAppliances()

      expect(result.success).toBe(false)
      expect(store.error).toBeTruthy()
    })

    it('should set loading state during fetch', async () => {
      mockFetch.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(mockAppliances),
        }), 100))
      )

      const fetchPromise = store.fetchAppliances()
      expect(store.isLoading).toBe(true)

      await fetchPromise
      expect(store.isLoading).toBe(false)
    })
  })

  // ==========================================
  // CREATE TESTS
  // ==========================================
  describe('createAppliance', () => {
    it('should create a new appliance successfully', async () => {
      const newAppliance = {
        name: 'New Appliance',
        type: 'electricity',
        powerWatts: 300,
        category: 'Tecnologia',
        description: 'A new test appliance',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...newAppliance, id: '999', isDefault: false }),
      })

      const result = await store.createAppliance(newAppliance)

      expect(result.success).toBe(true)
      expect(result.appliance.name).toBe('New Appliance')
      expect(result.appliance.isDefault).toBe(false)
      expect(store.appliances.length).toBe(1)
    })

    it('should set default values for optional fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: '999',
          name: 'Minimal',
          type: 'electricity',
          powerWatts: 100,
          category: 'Test',
          description: '',
          imgUrl: null,
          isDefault: false,
        }),
      })

      const result = await store.createAppliance({
        name: 'Minimal',
        category: 'Test',
      })

      expect(result.success).toBe(true)
      expect(result.appliance.type).toBe('electricity')
      expect(result.appliance.powerWatts).toBe(100)
    })

    it('should handle creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      const result = await store.createAppliance({
        name: 'Failed',
        category: 'Test',
      })

      expect(result.success).toBe(false)
      expect(store.error).toBeTruthy()
    })
  })

  // ==========================================
  // UPDATE TESTS
  // ==========================================
  describe('updateAppliance', () => {
    beforeEach(() => {
      store.appliances = JSON.parse(JSON.stringify(mockAppliances))
    })

    it('should update an existing appliance successfully', async () => {
      const updates = {
        name: 'Updated Frigorífico',
        powerWatts: 200,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockAppliances[0], ...updates }),
      })

      const result = await store.updateAppliance('1', updates)

      expect(result.success).toBe(true)
      expect(result.appliance.name).toBe('Updated Frigorífico')
      expect(result.appliance.powerWatts).toBe(200)
      expect(store.appliances[0].name).toBe('Updated Frigorífico')
    })

    it('should fail when appliance not found', async () => {
      const result = await store.updateAppliance('999', { name: 'Not Found' })

      expect(result.success).toBe(false)
      expect(result.message).toContain('não encontrado')
    })

    it('should preserve appliance ID during update', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockAppliances[0], id: '1', name: 'Updated' }),
      })

      const result = await store.updateAppliance('1', { id: 'different-id', name: 'Updated' })

      expect(result.appliance.id).toBe('1')
    })
  })

  // ==========================================
  // DELETE TESTS
  // ==========================================
  describe('deleteAppliance', () => {
    beforeEach(() => {
      store.appliances = JSON.parse(JSON.stringify(mockAppliances))
    })

    it('should delete a custom appliance successfully', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })

      const result = await store.deleteAppliance('3') // Custom appliance

      expect(result.success).toBe(true)
      expect(store.appliances.length).toBe(2)
      expect(store.appliances.find(a => a.id === '3')).toBeUndefined()
    })

    it('should not delete default appliances', async () => {
      const result = await store.deleteAppliance('1') // Default appliance

      expect(result.success).toBe(false)
      expect(result.message).toContain('padrão')
      expect(store.appliances.length).toBe(3) // Unchanged
    })

    it('should handle delete errors', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })

      const result = await store.deleteAppliance('3')

      expect(result.success).toBe(false)
    })
  })

  // ==========================================
  // GETTERS TESTS
  // ==========================================
  describe('Getters', () => {
    beforeEach(() => {
      store.appliances = JSON.parse(JSON.stringify(mockAppliances))
    })

    describe('allAppliances', () => {
      it('should return all appliances with icons', () => {
        const all = store.allAppliances

        expect(all.length).toBe(3)
        expect(all[0]).toHaveProperty('icon')
      })
    })

    describe('defaultAppliances', () => {
      it('should return only default appliances', () => {
        const defaults = store.defaultAppliances

        expect(defaults.length).toBe(2)
        defaults.forEach(app => {
          expect(app.isDefault).toBe(true)
        })
      })
    })

    describe('customAppliances', () => {
      it('should return only custom appliances', () => {
        const custom = store.customAppliances

        expect(custom.length).toBe(1)
        expect(custom[0].name).toBe('Custom Appliance')
        expect(custom[0].isDefault).toBe(false)
      })
    })

    describe('appliancesByCategory', () => {
      it('should group appliances by category', () => {
        const grouped = store.appliancesByCategory

        expect(grouped['Cozinha']).toBeDefined()
        expect(grouped['Cozinha'].length).toBe(1)
        expect(grouped['Entretenimento'].length).toBe(1)
        expect(grouped['Outros'].length).toBe(1)
      })
    })

    describe('getApplianceById', () => {
      it('should return appliance by ID with icon', () => {
        const appliance = store.getApplianceById('1')

        expect(appliance).toBeDefined()
        expect(appliance.name).toBe('Frigorífico')
        expect(appliance).toHaveProperty('icon')
      })

      it('should return null for non-existent ID', () => {
        const appliance = store.getApplianceById('999')

        expect(appliance).toBeNull()
      })
    })

    describe('categories', () => {
      it('should return unique sorted categories', () => {
        const categories = store.categories

        expect(categories.length).toBe(3)
        expect(categories).toEqual(['Cozinha', 'Entretenimento', 'Outros'])
      })
    })

    describe('isValidApiType', () => {
      it('should return valid API device types', () => {
        const validTypes = store.validApiDeviceTypes

        expect(validTypes.length).toBe(8)
        expect(validTypes.some(t => t.value === 'refrigerator')).toBe(true)
        expect(validTypes.some(t => t.value === 'television')).toBe(true)
        expect(validTypes.some(t => t.value === 'laptop')).toBe(true)
      })
    })
  })

  // ==========================================
  // EMISSIONS CALCULATION TESTS
  // ==========================================
  describe('Emissions Calculation', () => {
    describe('calculateEmissionsLocal', () => {
      it('should calculate emissions correctly', () => {
        const appliance = {
          id: '1',
          type: 'electricity',
          powerWatts: 200,
        }

        const result = store.calculateEmissionsLocal(appliance, 1)

        expect(result.kwh).toBe(0.2) // 200W * 1h / 1000
        expect(result.carbon_kg_co2).toBeCloseTo(0.0376, 4) // 0.2 * 0.188
        expect(result.minutes).toBe(60)
        expect(result.device_power_watts).toBe(200)
        expect(result.source).toBe('local')
      })

      it('should use default power if not specified', () => {
        const appliance = {
          id: '1',
          type: 'electricity',
        }

        const result = store.calculateEmissionsLocal(appliance, 1)

        expect(result.device_power_watts).toBe(200) // Default
      })

      it('should handle fractional hours correctly', () => {
        const appliance = {
          id: '1',
          type: 'electricity',
          powerWatts: 100,
        }

        const result = store.calculateEmissionsLocal(appliance, 0.5)

        expect(result.kwh).toBe(0.05) // 100W * 0.5h / 1000
        expect(result.minutes).toBe(30)
      })
    })
  })

  // ==========================================
  // CONSUMPTION STATS TESTS
  // ==========================================
  describe('getConsumptionStats', () => {
    beforeEach(() => {
      store.appliances = JSON.parse(JSON.stringify(mockAppliances))
    })

    it('should return empty stats for no usage data', () => {
      const stats = store.getConsumptionStats(null, 7)

      expect(stats.total).toBe(0)
      expect(Object.keys(stats.byAppliance).length).toBe(0)
    })

    it('should calculate total emissions correctly', () => {
      const today = new Date().toISOString()
      const usage = [
        { appliance_id: '1', usedAt: today, co2emited: 0.1, energy_consumed: 0.5 },
        { appliance_id: '2', usedAt: today, co2emited: 0.2, energy_consumed: 0.8 },
      ]

      const stats = store.getConsumptionStats(usage, 7)

      expect(stats.total).toBeCloseTo(0.3)
    })

    it('should group by appliance correctly', () => {
      const today = new Date().toISOString()
      const usage = [
        { appliance_id: '1', usedAt: today, co2emited: 0.1, energy_consumed: 0.5 },
        { appliance_id: '1', usedAt: today, co2emited: 0.15, energy_consumed: 0.6 },
        { appliance_id: '2', usedAt: today, co2emited: 0.2, energy_consumed: 0.8 },
      ]

      const stats = store.getConsumptionStats(usage, 7)

      expect(stats.byAppliance.length).toBe(2)

      const fridge = stats.byAppliance.find(a => a.id === '1')
      expect(fridge.co2).toBeCloseTo(0.25)
      expect(fridge.count).toBe(2)
    })

    it('should filter by date range correctly', () => {
      const today = new Date().toISOString()
      const tenDaysAgo = new Date()
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

      const usage = [
        { appliance_id: '1', usedAt: today, co2emited: 0.1, energy_consumed: 0.5 },
        { appliance_id: '1', usedAt: tenDaysAgo.toISOString(), co2emited: 0.5, energy_consumed: 2 },
      ]

      const stats = store.getConsumptionStats(usage, 7)

      expect(stats.total).toBeCloseTo(0.1) // Only today's usage
    })

    it('should return byDay array with correct structure when data exists', () => {
      const today = new Date().toISOString()
      const usage = [
        { appliance_id: '1', usedAt: today, co2emited: 0.1, energy_consumed: 0.5 },
      ]

      const stats = store.getConsumptionStats(usage, 7)

      expect(stats.byDay.length).toBe(7)
      expect(stats.byDay[0]).toHaveProperty('date')
      expect(stats.byDay[0]).toHaveProperty('co2')
      expect(stats.byDay[0]).toHaveProperty('kwh')
      expect(stats.byDay[0]).toHaveProperty('count')
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

      await store.fetchAppliances()

      expect(store.error).toBeTruthy()
    })
  })
})
