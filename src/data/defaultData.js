import { getApplianceIcon, getTaskIcon } from './categoryIcons'

// Default appliances with the new data structure
export const defaultAppliances = [
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
    name: 'Máquina de lavar roupa',
    type: 'washing_machine',
    powerWatts: 2000,
    category: 'Lavandaria',
    description: 'Máquina de lavar roupa',
    imgUrl: null,
    isDefault: true,
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
  }
]

// Default tasks with the new data structure
export const defaultTasks = [
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
    title: 'Reciclar plástico',
    category: 'Reciclagem',
    points: 10,
    description: 'Separar e reciclar embalagens de plástico',
    imgUrl: null,
    co2saved: 0.5,
    isDefault: true,
  },
  {
    id: '4',
    title: 'Duche de 5 minutos',
    category: 'Água',
    points: 8,
    description: 'Tomar duches rápidos para poupar água e energia',
    imgUrl: null,
    co2saved: 0.3,
    isDefault: true,
  },
  {
    id: '5',
    title: 'Desligar aparelhos em standby',
    category: 'Energia',
    points: 7,
    description: 'Desligar completamente aparelhos eletrónicos',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
  },
  {
    id: '6',
    title: 'Refeição vegetariana',
    category: 'Alimentação',
    points: 12,
    description: 'Fazer uma refeição sem carne',
    imgUrl: null,
    co2saved: 1.5,
    isDefault: true,
  },
  {
    id: '7',
    title: 'Usar saco reutilizável',
    category: 'Consumo',
    points: 5,
    description: 'Levar saco próprio às compras',
    imgUrl: null,
    co2saved: 0.1,
    isDefault: true,
  },
  {
    id: '8',
    title: 'Lavar roupa a frio',
    category: 'Energia',
    points: 10,
    description: 'Lavar roupa com água fria (máx 30°C)',
    imgUrl: null,
    co2saved: 0.6,
    isDefault: true,
  },
  {
    id: '9',
    title: 'Andar de bicicleta',
    category: 'Mobilidade',
    points: 20,
    description: 'Usar bicicleta para deslocações curtas',
    imgUrl: null,
    co2saved: 3,
    isDefault: true,
  },
  {
    id: '10',
    title: 'Compostar resíduos orgânicos',
    category: 'Reciclagem',
    points: 15,
    description: 'Fazer compostagem com restos de comida',
    imgUrl: null,
    co2saved: 1,
    isDefault: true,
  },
  {
    id: '11',
    title: 'Secar roupa ao ar',
    category: 'Energia',
    points: 12,
    description: 'Secar roupa naturalmente em vez de usar secadora',
    imgUrl: null,
    co2saved: 0.8,
    isDefault: true,
  },
  {
    id: '12',
    title: 'Comprar produtos locais',
    category: 'Consumo',
    points: 18,
    description: 'Comprar alimentos produzidos localmente',
    imgUrl: null,
    co2saved: 1.2,
    isDefault: true,
  },
  {
    id: '13',
    title: 'Plantar uma árvore',
    category: 'Ambiente',
    points: 50,
    description: 'Plantar uma árvore ou planta',
    imgUrl: null,
    co2saved: 21,
    isDefault: true,
  },
  {
    id: '14',
    title: 'Reparar em vez de substituir',
    category: 'Consumo',
    points: 25,
    description: 'Reparar um objeto em vez de comprar novo',
    imgUrl: null,
    co2saved: 5,
    isDefault: true,
  },
  {
    id: '15',
    title: 'Participar em limpeza comunitária',
    category: 'Ambiente',
    points: 30,
    description: 'Participar numa ação de limpeza local',
    imgUrl: null,
    co2saved: 2,
    isDefault: true,
  }
]

// Helper functions to add icon getters dynamically
export function enrichAppliance(appliance) {
  return {
    ...appliance,
    get icon() { return getApplianceIcon(this.category) }
  }
}

export function enrichTask(task) {
  return {
    ...task,
    get icon() { return getTaskIcon(this.category) }
  }
}

// Default badges
export const defaultBadges = [
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    icon: 'star',
    description: 'Primeiro perfil criado',
    requirements: { type: 'profile_created', value: 1 }
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    icon: 'local_fire_department',
    description: '7 dias de streak',
    requirements: { type: 'streak', value: 7 }
  },
  {
    id: 'eco_warrior',
    title: 'Eco Warrior',
    icon: 'eco',
    description: 'Poupou 10kg de CO2',
    requirements: { type: 'co2_saved', value: 10 }
  },
  {
    id: 'level_5',
    title: 'Nível 5',
    icon: 'emoji_events',
    description: 'Alcançou o nível 5',
    requirements: { type: 'level', value: 5 }
  },
  {
    id: 'first_reward',
    title: 'Primeira Recompensa',
    icon: 'card_giftcard',
    description: 'Resgatou a primeira recompensa',
    requirements: { type: 'rewards_redeemed', value: 1 }
  }
]

// Default rewards
export const defaultRewards = [
  {
    id: '1',
    title: 'Escolher filme na noite de cinema',
    description: 'Escolha o filme para a próxima noite de cinema em família',
    points_cost: 50,
    imgUrl: null
  },
  {
    id: '2',
    title: 'Jantar fora',
    description: 'Um jantar no restaurante da sua escolha',
    points_cost: 120,
    imgUrl: null
  },
  {
    id: '3',
    title: 'Dia sem tarefas domésticas',
    description: 'Dispensa de todas as tarefas domésticas por um dia',
    points_cost: 80,
    imgUrl: null
  },
  {
    id: '4',
    title: 'Escolher a música no carro',
    description: 'Controle total do rádio durante uma viagem',
    points_cost: 20,
    imgUrl: null
  },
  {
    id: '5',
    title: 'Sobremesa extra',
    description: 'Uma sobremesa extra à sua escolha',
    points_cost: 30,
    imgUrl: null
  },
  {
    id: '6',
    title: 'Tempo extra de jogos',
    description: '30 minutos extra de tempo de jogos',
    points_cost: 40,
    imgUrl: null
  }
]

export default {
  defaultAppliances,
  defaultTasks,
  defaultBadges,
  defaultRewards,
  enrichAppliance,
  enrichTask,
}
