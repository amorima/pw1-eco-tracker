import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
globalThis.localStorage = localStorageMock

describe('UserStore', () => {
  let store

  // Sample test data
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    createdAt: '2024-01-15T10:00:00Z',
    maxProfiles: 4,
    appliances: ['1', '2'],
    tasks: ['1', '2', '3'],
    profiles: [
      {
        id: '101',
        name: 'Test User',
        age: 30,
        avatarUrl: 'https://example.com/avatar.jpg',
        isAdmin: true,
        birthDate: '1994-05-15',
        createdAt: '2024-01-15T10:05:00Z',
        xp: 250,
        points: 100,
        streak: 5,
        settings: {
          pin: null,
          notification: true,
          deviceDefault: true,
          header_background: 'bg-gradient-to-r from-green-400 to-emerald-500',
        },
        activity_history: [],
        appliance_history: [],
        rewards_history: [],
        badges: [],
        lastActivitie: null,
      },
    ],
  }

  const mockTask = {
    id: '1',
    title: 'Test Task',
    category: 'Energia',
    points: 20,
    co2saved: 10,
    description: 'A test task',
  }

  const mockReward = {
    id: '1',
    title: 'Test Reward',
    description: 'A test reward',
    points_cost: 50,
    imgUrl: null,
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useUserStore()
    mockFetch.mockReset()
    localStorageMock.getItem.mockReset()
    localStorageMock.setItem.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================
  // AUTHENTICATION TESTS
  // ==========================================
  describe('Authentication', () => {
    describe('login', () => {
      it('should login successfully with valid credentials', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([mockUser]),
        })

        const result = await store.login({
          email: 'test@example.com',
          password: '123456',
        })

        expect(result.success).toBe(true)
        expect(store.currentUser).toEqual(mockUser)
        expect(store.isLoggedIn).toBe(true)
      })

      it('should fail login with invalid credentials', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })

        const result = await store.login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })

        expect(result.success).toBe(false)
        expect(result.message).toBe('Email ou password incorretos')
        expect(store.currentUser).toBeNull()
      })

      it('should require setup for new users with no profiles', async () => {
        const newUser = { ...mockUser, profiles: [] }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([newUser]),
        })

        const result = await store.login({
          email: 'test@example.com',
          password: '123456',
        })

        expect(result.success).toBe(true)
        expect(result.requiresSetup).toBe(true)
      })

      it('should auto-select default profile if stored in localStorage', async () => {
        localStorageMock.getItem.mockReturnValue('101')
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([mockUser]),
        })

        const result = await store.login({
          email: 'test@example.com',
          password: '123456',
        })

        expect(result.success).toBe(true)
        expect(result.autoSelectedProfile).toBe(true)
        expect(store.currentProfile).toEqual(mockUser.profiles[0])
      })
    })

    describe('logout', () => {
      it('should clear user and profile on logout', () => {
        store.currentUser = mockUser
        store.currentProfile = mockUser.profiles[0]

        store.logout()

        expect(store.currentUser).toBeNull()
        expect(store.currentProfile).toBeNull()
        expect(store.isLoggedIn).toBe(false)
      })
    })

    describe('register', () => {
      it('should register a new user successfully', async () => {
        // Check if email exists
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })
        // Create user
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: '999' }),
        })

        const result = await store.register({
          email: 'new@example.com',
          password: '123456',
          confirmPassword: '123456',
        })

        expect(result.success).toBe(true)
        expect(result.message).toBe('Conta criada com sucesso')
      })

      it('should fail registration with existing email', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([mockUser]),
        })

        const result = await store.register({
          email: 'test@example.com',
          password: '123456',
          confirmPassword: '123456',
        })

        expect(result.success).toBe(false)
        expect(result.message).toBe('Este email já está registado')
      })

      it('should fail registration with mismatched passwords', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })

        const result = await store.register({
          email: 'new@example.com',
          password: '123456',
          confirmPassword: '654321',
        })

        expect(result.success).toBe(false)
        expect(result.message).toBe('As passwords não coincidem')
      })

      it('should fail registration with invalid email format', async () => {
        const result = await store.register({
          email: 'invalid-email',
          password: '123456',
          confirmPassword: '123456',
        })

        expect(result.success).toBe(false)
        expect(result.message).toBe('Email inválido')
      })
    })
  })

  // ==========================================
  // PROFILE CRUD TESTS
  // ==========================================
  describe('Profile CRUD', () => {
    beforeEach(() => {
      store.currentUser = JSON.parse(JSON.stringify(mockUser))
      store.currentProfile = store.currentUser.profiles[0]
    })

    describe('createProfile', () => {
      it('should create a new profile successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const result = await store.createProfile({
          name: 'New Profile',
          age: 25,
          avatar: 'https://example.com/new-avatar.jpg',
          pin: '1234',
        })

        expect(result.success).toBe(true)
        expect(store.currentUser.profiles.length).toBe(2)

        const newProfile = store.currentUser.profiles[1]
        expect(newProfile.name).toBe('New Profile')
        expect(newProfile.age).toBe(25)
        expect(newProfile.points).toBe(0)
        expect(newProfile.xp).toBe(0)
        expect(newProfile.isAdmin).toBe(false)
      })

      it('should fail when max profiles limit is reached', async () => {
        store.currentUser.maxProfiles = 1

        const result = await store.createProfile({
          name: 'New Profile',
        })

        expect(result.success).toBe(false)
        expect(result.message).toContain('Limite')
      })

      it('should fail when profile name already exists', async () => {
        const result = await store.createProfile({
          name: 'Test User', // Same name as existing profile
        })

        expect(result.success).toBe(false)
        expect(result.message).toBe('Já existe um perfil com este nome')
      })

      it('should initialize profile with correct default values', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.createProfile({ name: 'Default Test' })

        const newProfile = store.currentUser.profiles[1]
        expect(newProfile.xp).toBe(0)
        expect(newProfile.points).toBe(0)
        expect(newProfile.streak).toBe(0)
        expect(newProfile.activity_history).toEqual([])
        expect(newProfile.appliance_history).toEqual([])
        expect(newProfile.rewards_history).toEqual([])
        expect(newProfile.badges).toEqual([])
        expect(newProfile.lastActivitie).toBeNull()
      })
    })

    describe('selectProfile', () => {
      it('should select an existing profile', () => {
        store.currentProfile = null

        const result = store.selectProfile('101')

        expect(result).toBe(true)
        expect(store.currentProfile.id).toBe('101')
      })

      it('should fail to select non-existent profile', () => {
        const result = store.selectProfile('999')

        expect(result).toBe(false)
      })

      it('should store selected profile in localStorage', () => {
        store.selectProfile('101')

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          `defaultProfile_${store.currentUser.id}`,
          '101'
        )
      })
    })

    describe('deleteProfile', () => {
      beforeEach(() => {
        // Add a second profile
        store.currentUser.profiles.push({
          id: '102',
          name: 'Second Profile',
          isAdmin: false,
          activity_history: [],
          appliance_history: [],
          rewards_history: [],
          badges: [],
        })
      })

      it('should delete a non-admin profile successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const result = await store.deleteProfile('102')

        expect(result.success).toBe(true)
        expect(store.currentUser.profiles.length).toBe(1)
      })

      it('should not delete the only admin profile', async () => {
        // Remove second profile first
        store.currentUser.profiles = [store.currentUser.profiles[0]]

        const result = await store.deleteProfile('101')

        expect(result.success).toBe(false)
        expect(result.message).toContain('único perfil administrador')
      })

      it('should clear currentProfile if deleted profile was active', async () => {
        store.currentProfile = store.currentUser.profiles[0]
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.deleteProfile('101')

        expect(store.currentProfile).toBeNull()
      })
    })

    describe('updateProfileSettings', () => {
      it('should update profile settings successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const result = await store.updateProfileSettings('101', {
          notification: false,
          pin: '4321',
        })

        expect(result.success).toBe(true)
        expect(store.currentProfile.settings.notification).toBe(false)
        expect(store.currentProfile.settings.pin).toBe('4321')
      })

      it('should fail for non-existent profile', async () => {
        const result = await store.updateProfileSettings('999', {
          notification: false,
        })

        expect(result.success).toBe(false)
      })
    })
  })

  // ==========================================
  // POINTS AND GAMIFICATION TESTS
  // ==========================================
  describe('Points and Gamification', () => {
    beforeEach(() => {
      store.currentUser = JSON.parse(JSON.stringify(mockUser))
      store.currentProfile = store.currentUser.profiles[0]
      store.availableTasks = [mockTask]
    })

    describe('completeTaskWithApi', () => {
      it('should add points when completing a task', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })
        const initialPoints = store.currentProfile.points

        const result = await store.completeTaskWithApi('1')

        expect(result.success).toBe(true)
        expect(result.pointsEarned).toBe(20)
        expect(store.currentProfile.points).toBe(initialPoints + 20)
      })

      it('should add XP when completing a task', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })
        const initialXp = store.currentProfile.xp

        await store.completeTaskWithApi('1')

        expect(store.currentProfile.xp).toBe(initialXp + 20)
      })

      it('should add activity to history', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.completeTaskWithApi('1')

        expect(store.currentProfile.activity_history.length).toBe(1)
        expect(store.currentProfile.activity_history[0].task_id).toBe('1')
        expect(store.currentProfile.activity_history[0].pointsEarned).toBe(20)
        expect(store.currentProfile.activity_history[0].co2saved).toBe(10)
      })

      it('should detect level up correctly', async () => {
        store.currentProfile.xp = 95 // 5 XP away from level 2
        mockFetch.mockResolvedValueOnce({ ok: true })

        const result = await store.completeTaskWithApi('1')

        expect(result.leveledUp).toBe(true)
        expect(result.newLevel).toBe(2)
      })

      it('should fail for non-existent task', async () => {
        const result = await store.completeTaskWithApi('999')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Tarefa não encontrada')
      })
    })

    describe('redeemReward', () => {
      beforeEach(() => {
        store.currentProfile.points = 100
      })

      it('should deduct points when redeeming a reward', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const result = await store.redeemReward(mockReward)

        expect(result.success).toBe(true)
        expect(store.currentProfile.points).toBe(50) // 100 - 50
      })

      it('should add redemption to history', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.redeemReward(mockReward)

        expect(store.currentProfile.rewards_history.length).toBe(1)
        expect(store.currentProfile.rewards_history[0].id_reward).toBe('1')
        expect(store.currentProfile.rewards_history[0].status).toBe('pendente')
      })

      it('should fail when insufficient points', async () => {
        store.currentProfile.points = 10

        const result = await store.redeemReward(mockReward)

        expect(result.success).toBe(false)
        expect(result.message).toBe('Pontos insuficientes')
        expect(store.currentProfile.points).toBe(10) // Unchanged
      })
    })

    describe('cancelReward', () => {
      beforeEach(() => {
        store.currentProfile.isAdmin = true
        store.currentProfile.points = 50
        store.currentProfile.rewards_history = [
          {
            id: '3001',
            id_reward: '1',
            title: 'Test Reward',
            points_cost: 50,
            status: 'pendente',
            redemedAt: '2024-01-15T10:00:00Z',
          },
        ]
      })

      it('should return points when cancelling a reward', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const result = await store.cancelReward('101', '3001')

        expect(result.success).toBe(true)
        expect(result.pointsReturned).toBe(50)
        expect(store.currentProfile.points).toBe(100) // 50 + 50 returned
      })

      it('should mark reward as cancelled', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.cancelReward('101', '3001')

        expect(store.currentProfile.rewards_history[0].status).toBe('cancelado')
      })

      it('should fail for non-admin users', async () => {
        store.currentProfile.isAdmin = false

        const result = await store.cancelReward('101', '3001')

        expect(result.success).toBe(false)
        expect(result.message).toContain('administradores')
      })

      it('should fail for completed rewards', async () => {
        store.currentProfile.rewards_history[0].status = 'completo'

        const result = await store.cancelReward('101', '3001')

        expect(result.success).toBe(false)
        expect(result.message).toContain('pendentes')
      })
    })
  })

  // ==========================================
  // GETTERS TESTS
  // ==========================================
  describe('Getters', () => {
    beforeEach(() => {
      store.currentUser = JSON.parse(JSON.stringify(mockUser))
      store.currentProfile = store.currentUser.profiles[0]
    })

    describe('currentProfilePoints', () => {
      it('should return stored points value', () => {
        store.currentProfile.points = 150

        expect(store.currentProfilePoints).toBe(150)
      })

      it('should return 0 when points is undefined', () => {
        delete store.currentProfile.points

        expect(store.currentProfilePoints).toBe(0)
      })
    })

    describe('currentProfileLevel', () => {
      it('should calculate level correctly from XP', () => {
        store.currentProfile.xp = 0
        expect(store.currentProfileLevel).toBe(1)

        store.currentProfile.xp = 99
        expect(store.currentProfileLevel).toBe(1)

        store.currentProfile.xp = 100
        expect(store.currentProfileLevel).toBe(2)

        store.currentProfile.xp = 250
        expect(store.currentProfileLevel).toBe(3)
      })
    })

    describe('currentProfileCo2Saved', () => {
      it('should calculate total CO2 saved from activities', () => {
        store.currentProfile.activity_history = [
          { co2saved: 10 },
          { co2saved: 5.5 },
          { co2saved: 3 },
        ]

        expect(store.currentProfileCo2Saved).toBe(18.5)
      })

      it('should return 0 for empty history', () => {
        store.currentProfile.activity_history = []

        expect(store.currentProfileCo2Saved).toBe(0)
      })
    })

    describe('householdLeaderboard', () => {
      it('should sort profiles by points descending', () => {
        store.currentUser.profiles = [
          { id: '1', name: 'User A', points: 50, xp: 100, avatarUrl: null },
          { id: '2', name: 'User B', points: 150, xp: 200, avatarUrl: null },
          { id: '3', name: 'User C', points: 100, xp: 150, avatarUrl: null },
        ]

        const leaderboard = store.householdLeaderboard

        expect(leaderboard[0].name).toBe('User B')
        expect(leaderboard[0].rank).toBe(1)
        expect(leaderboard[1].name).toBe('User C')
        expect(leaderboard[1].rank).toBe(2)
        expect(leaderboard[2].name).toBe('User A')
        expect(leaderboard[2].rank).toBe(3)
      })

      it('should include computed level in leaderboard', () => {
        store.currentUser.profiles = [
          { id: '1', name: 'User A', points: 50, xp: 250, avatarUrl: null },
        ]

        const leaderboard = store.householdLeaderboard

        expect(leaderboard[0].level).toBe(3) // 250/100 + 1 = 3.5 -> 3
      })
    })

    describe('xpProgressPercentage', () => {
      it('should calculate XP progress within current level', () => {
        store.currentProfile.xp = 150

        expect(store.xpProgressPercentage).toBe(50) // 150 % 100 = 50
      })

      it('should return 0 at level boundaries', () => {
        store.currentProfile.xp = 200

        expect(store.xpProgressPercentage).toBe(0)
      })
    })
  })

  // ==========================================
  // STREAK TESTS
  // ==========================================
  describe('Streak Management', () => {
    beforeEach(() => {
      store.currentUser = JSON.parse(JSON.stringify(mockUser))
      store.currentProfile = store.currentUser.profiles[0]
    })

    describe('updateStreak', () => {
      it('should increment streak when activity is consecutive', async () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        store.currentProfile.lastActivitie = yesterday.toISOString()
        store.currentProfile.streak = 5
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.updateStreak()

        expect(store.currentProfile.streak).toBe(6)
      })

      it('should reset streak when gap in activity', async () => {
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
        store.currentProfile.lastActivitie = twoDaysAgo.toISOString()
        store.currentProfile.streak = 10
        mockFetch.mockResolvedValueOnce({ ok: true })

        await store.updateStreak()

        expect(store.currentProfile.streak).toBe(1)
      })

      it('should not change streak if already updated today', async () => {
        store.currentProfile.lastActivitie = new Date().toISOString()
        store.currentProfile.streak = 5

        const result = await store.updateStreak()

        expect(result.message).toContain('já atualizado')
        expect(store.currentProfile.streak).toBe(5)
      })
    })
  })
})
