import { getTaskIcon } from './categoryIcons'

// Unsplash images for tasks (free to use)
const taskImages = {
  '1': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop', // Desligar luzes
  '2': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop', // Transporte público
  '3': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop', // Reciclar plástico
  '4': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // Duche rápido
  '5': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Desligar standby
  '6': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // Refeição vegetariana
  '7': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', // Saco reutilizável
  '8': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', // Lavar roupa frio
  '9': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop', // Andar de bicicleta
  '10': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', // Compostagem
  '11': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop', // Secar roupa ao ar
  '12': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop', // Produtos locais
  '13': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop', // Plantar árvore
  '14': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop', // Reparar objetos
  '15': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', // Limpeza comunitária
}

export const mockTasks = [
  {
    id: '1',
    title: 'Desligar luzes ao sair de casa',
    category: 'Energia',
    points: 20,
    description: 'Desligar todas as luzes quando sair de uma divisão',
    imgUrl: null,
    co2saved: 0.1,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '2',
    title: 'Usar transporte público',
    category: 'Mobilidade',
    points: 15,
    description: 'Usar transporte público em vez de carro próprio',
    imgUrl: null,
    co2saved: 0.8,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '3',
    title: 'Reciclar plástico',
    category: 'Reciclagem',
    points: 10,
    description: 'Separar e reciclar embalagens de plástico',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '4',
    title: 'Duche de 5 minutos',
    category: 'Água',
    points: 8,
    description: 'Tomar duches rápidos para poupar água e energia',
    imgUrl: null,
    co2saved: 0.1,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '5',
    title: 'Desligar aparelhos em standby',
    category: 'Energia',
    points: 7,
    description: 'Desligar completamente aparelhos eletrónicos',
    imgUrl: null,
    co2saved: 0.1,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '6',
    title: 'Refeição vegetariana',
    category: 'Alimentação',
    points: 12,
    description: 'Fazer uma refeição sem carne',
    imgUrl: null,
    co2saved: 0.8,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '7',
    title: 'Usar saco reutilizável',
    category: 'Consumo',
    points: 5,
    description: 'Levar saco próprio às compras',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '8',
    title: 'Lavar roupa a frio',
    category: 'Energia',
    points: 10,
    description: 'Lavar roupa com água fria (máx 30°C)',
    imgUrl: null,
    co2saved: 0.1,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '9',
    title: 'Andar de bicicleta',
    category: 'Mobilidade',
    points: 20,
    description: 'Usar bicicleta para deslocações curtas',
    imgUrl: null,
    co2saved: 0.8,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '10',
    title: 'Compostar resíduos orgânicos',
    category: 'Reciclagem',
    points: 15,
    description: 'Fazer compostagem com restos de comida',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '11',
    title: 'Secar roupa ao ar',
    category: 'Energia',
    points: 12,
    description: 'Secar roupa naturalmente em vez de usar secadora',
    imgUrl: null,
    co2saved: 0.1,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '12',
    title: 'Comprar produtos locais',
    category: 'Consumo',
    points: 18,
    description: 'Comprar alimentos produzidos localmente',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '13',
    title: 'Plantar uma árvore',
    category: 'Ambiente',
    points: 50,
    description: 'Plantar uma árvore ou planta',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '14',
    title: 'Reparar em vez de substituir',
    category: 'Consumo',
    points: 25,
    description: 'Reparar um objeto em vez de comprar novo',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
  {
    id: '15',
    title: 'Participar em limpeza comunitária',
    category: 'Ambiente',
    points: 30,
    description: 'Participar numa ação de limpeza local',
    imgUrl: null,
    co2saved: 0.2,
    isDefault: true,
    get icon() {
      return getTaskIcon(this.category)
    },
  },
]
