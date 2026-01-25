import { getApplianceIcon } from './categoryIcons'

// Unsplash images for appliances (free to use)
const applianceImages = {
  '1': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop', // Frigorífico
  '2': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop', // Máquina de lavar roupa
  '3': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop', // Máquina de lavar loiça
  '4': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop', // Forno
  '5': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop', // Micro-ondas
  '6': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', // Televisão
  '7': 'https://images.unsplash.com/photo-1631545806609-054520f7d5fc?w=400&h=300&fit=crop', // Ar condicionado
  '8': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop', // Aspirador
  '9': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=300&fit=crop', // Ferro de engomar
  '10': 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=300&fit=crop', // Secador de cabelo
  '11': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', // Computador
  '12': 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=300&fit=crop', // Consola de jogos
  '13': 'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=400&h=300&fit=crop', // Carregador de telemóvel
  '14': 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop', // Router Wi-Fi
  '15': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop', // Cafeteira
}

export const mockAppliances = [
  {
    id: '1',
    name: 'Frigorífico',
    type: 'refrigerator',
    powerWatts: 150,
    category: 'Cozinha',
    description: 'Frigorífico de casa',
    imgUrl: applianceImages['1'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '2',
    name: 'Máquina de lavar roupa',
    type: 'washing_machine',
    powerWatts: 2000,
    category: 'Lavandaria',
    description: 'Máquina de lavar roupa',
    imgUrl: applianceImages['2'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '3',
    name: 'Máquina de lavar loiça',
    type: 'dishwasher',
    powerWatts: 1800,
    category: 'Cozinha',
    description: 'Máquina de lavar loiça',
    imgUrl: applianceImages['3'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '4',
    name: 'Forno',
    type: 'electricity',
    powerWatts: 2400,
    category: 'Cozinha',
    description: 'Forno elétrico',
    imgUrl: applianceImages['4'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '5',
    name: 'Micro-ondas',
    type: 'electricity',
    powerWatts: 1000,
    category: 'Cozinha',
    description: 'Micro-ondas',
    imgUrl: applianceImages['5'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '6',
    name: 'Televisão',
    type: 'television',
    powerWatts: 100,
    category: 'Entretenimento',
    description: 'Televisão da sala',
    imgUrl: applianceImages['6'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '7',
    name: 'Ar condicionado',
    type: 'air_conditioner',
    powerWatts: 3500,
    category: 'Climatização',
    description: 'Ar condicionado',
    imgUrl: applianceImages['7'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '8',
    name: 'Aspirador',
    type: 'electricity',
    powerWatts: 1400,
    category: 'Limpeza',
    description: 'Aspirador de pó',
    imgUrl: applianceImages['8'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '9',
    name: 'Ferro de engomar',
    type: 'electricity',
    powerWatts: 2000,
    category: 'Lavandaria',
    description: 'Ferro de engomar',
    imgUrl: applianceImages['9'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '10',
    name: 'Secador de cabelo',
    type: 'electricity',
    powerWatts: 1500,
    category: 'Cuidados pessoais',
    description: 'Secador de cabelo',
    imgUrl: applianceImages['10'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '11',
    name: 'Computador',
    type: 'desktop',
    powerWatts: 200,
    category: 'Tecnologia',
    description: 'Computador de secretária',
    imgUrl: applianceImages['11'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '12',
    name: 'Consola de jogos',
    type: 'electricity',
    powerWatts: 150,
    category: 'Entretenimento',
    description: 'Consola de jogos',
    imgUrl: applianceImages['12'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '13',
    name: 'Carregador de telemóvel',
    type: 'electricity',
    powerWatts: 5,
    category: 'Tecnologia',
    description: 'Carregador de telemóvel',
    imgUrl: applianceImages['13'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '14',
    name: 'Router Wi-Fi',
    type: 'electricity',
    powerWatts: 10,
    category: 'Tecnologia',
    description: 'Router Wi-Fi',
    imgUrl: applianceImages['14'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  },
  {
    id: '15',
    name: 'Cafeteira',
    type: 'electricity',
    powerWatts: 1000,
    category: 'Cozinha',
    description: 'Cafeteira/Máquina de café',
    imgUrl: applianceImages['15'],
    isDefault: true,
    get icon() { return getApplianceIcon(this) }
  }
]
