import { getApplianceIcon } from './categoryIcons'

export const mockAppliances = [
  {
    id: '1',
    name: 'Frigorífico',
    type: 'refrigerator',
    powerWatts: 150,
    category: 'Cozinha',
    description: 'Frigorífico de casa',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '2',
    name: 'Máquina de lavar roupa',
    type: 'washing_machine',
    powerWatts: 2000,
    category: 'Lavandaria',
    description: 'Máquina de lavar roupa',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '3',
    name: 'Máquina de lavar loiça',
    type: 'dishwasher',
    powerWatts: 1800,
    category: 'Cozinha',
    description: 'Máquina de lavar loiça',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '4',
    name: 'Forno',
    type: 'electricity',
    powerWatts: 2400,
    category: 'Cozinha',
    description: 'Forno elétrico',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '5',
    name: 'Micro-ondas',
    type: 'electricity',
    powerWatts: 1000,
    category: 'Cozinha',
    description: 'Micro-ondas',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '6',
    name: 'Televisão',
    type: 'television',
    powerWatts: 100,
    category: 'Entretenimento',
    description: 'Televisão da sala',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '7',
    name: 'Ar condicionado',
    type: 'air_conditioner',
    powerWatts: 3500,
    category: 'Climatização',
    description: 'Ar condicionado',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '8',
    name: 'Aspirador',
    type: 'electricity',
    powerWatts: 1400,
    category: 'Limpeza',
    description: 'Aspirador de pó',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '9',
    name: 'Ferro de engomar',
    type: 'electricity',
    powerWatts: 2000,
    category: 'Lavandaria',
    description: 'Ferro de engomar',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '10',
    name: 'Secador de cabelo',
    type: 'electricity',
    powerWatts: 1500,
    category: 'Cuidados pessoais',
    description: 'Secador de cabelo',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '11',
    name: 'Computador',
    type: 'desktop',
    powerWatts: 200,
    category: 'Tecnologia',
    description: 'Computador de secretária',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '12',
    name: 'Consola de jogos',
    type: 'electricity',
    powerWatts: 150,
    category: 'Entretenimento',
    description: 'Consola de jogos',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '13',
    name: 'Carregador de telemóvel',
    type: 'electricity',
    powerWatts: 5,
    category: 'Tecnologia',
    description: 'Carregador de telemóvel',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '14',
    name: 'Router Wi-Fi',
    type: 'electricity',
    powerWatts: 10,
    category: 'Tecnologia',
    description: 'Router Wi-Fi',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  },
  {
    id: '15',
    name: 'Cafeteira',
    type: 'electricity',
    powerWatts: 1000,
    category: 'Cozinha',
    description: 'Cafeteira/Máquina de café',
    imgUrl: null,
    isDefault: true,
    get icon() { return getApplianceIcon(this.category) }
  }
]
