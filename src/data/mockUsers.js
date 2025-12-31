export const mockUsers = [
  {
    id: 1,
    email: 'mario@example.com',
    password: '123456', // In production, this would be hashed
    createdAt: '2024-01-15T10:00:00Z',
    
    // Household settings (shared across all profiles)
    maxProfiles: 4,
    appliances: [1, 2, 3, 6, 11, 13, 14, 15], // IDs from mockAppliances
    tasks: [1, 2, 3, 4, 5, 6, 7, 8, 9], // IDs from mockTasks
    
    // Profiles under this account
    profiles: [
      {
        id: 101,
        name: 'Mário Pires',
        age: 35,
        avatar: 'https://i.pravatar.cc/150?img=12',
        isAdmin: true, // First profile is admin
        createdAt: '2024-01-15T10:05:00Z',
        
        // Individual profile data
        points: 243,
        co2Saved: 15.7, // kg
        level: 5,
        xp: 450,
        streak: 12, // consecutive days
        
        // Settings
        settings: {
          pin: null,
          notifications: true,
          defaultDevice: true, // Auto-login on this device
          language: 'pt',
          theme: 'light'
        },
        
        // Activity history
        activityHistory: [
          {
            id: 1001,
            taskId: 1,
            completedAt: '2025-12-31T08:00:00Z',
            pointsEarned: 5,
            co2Saved: 0.05
          },
          {
            id: 1002,
            taskId: 2,
            completedAt: '2025-12-31T09:30:00Z',
            pointsEarned: 15,
            co2Saved: 2.3
          },
          {
            id: 1003,
            taskId: 3,
            completedAt: '2025-12-30T14:00:00Z',
            pointsEarned: 10,
            co2Saved: 0.5
          }
        ],
        
        // Appliance usage tracking
        applianceUsage: [
          {
            id: 2001,
            applianceId: 6,
            date: '2025-12-31',
            hoursUsed: 4.5,
            energyConsumed: 0.45, // kWh
            co2Emitted: 0.10
          },
          {
            id: 2002,
            applianceId: 11,
            date: '2025-12-31',
            hoursUsed: 6,
            energyConsumed: 1.2,
            co2Emitted: 0.28
          }
        ],
        
        // Rewards redeemed
        rewardsRedeemed: [
          {
            id: 3001,
            rewardId: 1,
            title: 'Escolher a música no carro',
            pointsCost: 20,
            redeemedAt: '2025-12-28T18:00:00Z',
            status: 'complete'
          }
        ],
        
        // Badges earned
        badges: [
          {
            id: 'early_adopter',
            title: 'Early Adopter',
            icon: 'star',
            earnedAt: '2024-01-15T10:05:00Z'
          },
          {
            id: 'week_warrior',
            title: 'Week Warrior',
            icon: 'local_fire_department',
            earnedAt: '2024-01-22T23:59:00Z',
            description: '7 days streak'
          }
        ]
      },
      {
        id: 102,
        name: 'Ana Pires',
        age: 32,
        avatar: 'https://i.pravatar.cc/150?img=5',
        isAdmin: false,
        createdAt: '2024-01-16T14:20:00Z',
        points: 189,
        co2Saved: 12.3,
        level: 4,
        xp: 320,
        streak: 8,
        settings: {
          pin: '1234',
          notifications: true,
          defaultDevice: false,
          language: 'pt',
          theme: 'light'
        },
        activityHistory: [
          {
            id: 1004,
            taskId: 4,
            completedAt: '2025-12-31T07:00:00Z',
            pointsEarned: 8,
            co2Saved: 0.3
          },
          {
            id: 1005,
            taskId: 6,
            completedAt: '2025-12-31T13:00:00Z',
            pointsEarned: 12,
            co2Saved: 1.5
          }
        ],
        applianceUsage: [],
        rewardsRedeemed: [],
        badges: []
      },
      {
        id: 103,
        name: 'Pedro',
        age: 8,
        avatar: 'https://i.pravatar.cc/150?img=15',
        isAdmin: false,
        createdAt: '2024-01-16T14:25:00Z',
        points: 156,
        co2Saved: 8.9,
        level: 3,
        xp: 200,
        streak: 5,
        settings: {
          pin: '0000',
          notifications: false,
          defaultDevice: false,
          language: 'pt',
          theme: 'light'
        },
        activityHistory: [],
        applianceUsage: [],
        rewardsRedeemed: [],
        badges: []
      }
    ]
  },
  {
    id: 2,
    email: 'jose@example.com',
    password: '123456',
    createdAt: '2024-02-01T09:00:00Z',
    maxProfiles: 3,
    appliances: [1, 2, 6, 11],
    tasks: [1, 2, 3, 4, 5],
    profiles: [
      {
        id: 201,
        name: 'José Maria',
        age: 28,
        avatar: 'https://i.pravatar.cc/150?img=13',
        isAdmin: true,
        createdAt: '2024-02-01T09:05:00Z',
        points: 238,
        co2Saved: 14.5,
        level: 5,
        xp: 420,
        streak: 15,
        settings: {
          pin: null,
          notifications: true,
          defaultDevice: true,
          language: 'pt',
          theme: 'dark'
        },
        activityHistory: [],
        applianceUsage: [],
        rewardsRedeemed: [
          {
            id: 3002,
            rewardId: 4,
            title: 'Tempo extra de lazer',
            pointsCost: 60,
            redeemedAt: '2025-12-30T20:00:00Z',
            status: 'complete'
          }
        ],
        badges: [
          {
            id: 'eco_warrior',
            title: 'Eco Warrior',
            icon: 'eco',
            earnedAt: '2024-02-15T10:00:00Z',
            description: 'Saved 10kg CO2'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    email: 'manuel@example.com',
    password: '123456',
    createdAt: '2024-03-10T11:30:00Z',
    maxProfiles: 5,
    appliances: [1, 2, 3, 4, 6, 7, 11],
    tasks: [1, 2, 3, 4, 5, 6, 7, 8],
    profiles: [
      {
        id: 301,
        name: 'Manuel Sá',
        age: 42,
        avatar: 'https://i.pravatar.cc/150?img=14',
        isAdmin: true,
        createdAt: '2024-03-10T11:35:00Z',
        points: 186,
        co2Saved: 11.2,
        level: 4,
        xp: 280,
        streak: 6,
        settings: {
          pin: null,
          notifications: true,
          defaultDevice: true,
          language: 'pt',
          theme: 'light'
        },
        activityHistory: [],
        applianceUsage: [],
        rewardsRedeemed: [
          {
            id: 3003,
            rewardId: 2,
            title: 'Jantar fora',
            pointsCost: 120,
            redeemedAt: '2025-12-29T19:00:00Z',
            status: 'pending'
          }
        ],
        badges: []
      }
    ]
  }
]
