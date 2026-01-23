import { getTaskIcon } from './categoryIcons'

export const mockTasks = [
  {
    id: '1',
    title: 'Desligar luzes ao sair de casa',
    category: 'Energia',
    points: 20,
    description: 'Desligar todas as luzes quando sair de uma divisão',
    imgUrl: null,
    co2saved: 10,
    isDefault: true,
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
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
    get icon() { return getTaskIcon(this.category) }
  }
]
