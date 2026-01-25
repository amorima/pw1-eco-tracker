// Category to Icon mapping for appliances and tasks (Font Awesome)
// These serve as fallback icons when no specific icon is set

export const applianceCategoryIcons = {
  'Cozinha': 'fa-solid fa-kitchen-set',
  'Lavandaria': 'fa-solid fa-shirt',
  'Entretenimento': 'fa-solid fa-tv',
  'Climatização': 'fa-solid fa-temperature-low',
  'Limpeza': 'fa-solid fa-broom',
  'Cuidados pessoais': 'fa-solid fa-spa',
  'Tecnologia': 'fa-solid fa-laptop',
  'Outro': 'fa-solid fa-plug',
}

export const taskCategoryIcons = {
  'Energia': 'fa-solid fa-bolt',
  'Mobilidade': 'fa-solid fa-bus',
  'Reciclagem': 'fa-solid fa-recycle',
  'Água': 'fa-solid fa-droplet',
  'Alimentação': 'fa-solid fa-utensils',
  'Consumo': 'fa-solid fa-shopping-bag',
  'Ambiente': 'fa-solid fa-leaf',
  'Outro': 'fa-solid fa-circle-check',
}

// Specific icon mapping for each appliance by ID or name
// This provides unique, accurate icons for each appliance
export const applianceSpecificIcons = {
  // By ID
  '1': 'fa-solid fa-temperature-low',      // Frigorífico
  '2': 'fa-solid fa-jug-detergent',        // Máquina de lavar roupa
  '3': 'fa-solid fa-sink',                 // Máquina de lavar loiça
  '4': 'fa-solid fa-fire-burner',          // Forno
  '5': 'fa-solid fa-clock-rotate-left',    // Micro-ondas
  '6': 'fa-solid fa-tv',                   // Televisão
  '7': 'fa-solid fa-fan',                  // Ar condicionado
  '8': 'fa-solid fa-broom',                // Aspirador
  '9': 'fa-solid fa-temperature-arrow-up', // Ferro de engomar
  '10': 'fa-solid fa-wind',                // Secador de cabelo
  '11': 'fa-solid fa-desktop',             // Computador
  '12': 'fa-solid fa-gamepad',             // Consola de jogos
  '13': 'fa-solid fa-mobile-screen',       // Carregador de telemóvel
  '14': 'fa-solid fa-wifi',                // Router Wi-Fi
  '15': 'fa-solid fa-mug-hot',             // Cafeteira

  // By name (for custom/new appliances)
  'Frigorífico': 'fa-solid fa-temperature-low',
  'Máquina de lavar roupa': 'fa-solid fa-jug-detergent',
  'Máquina de lavar loiça': 'fa-solid fa-sink',
  'Forno': 'fa-solid fa-fire-burner',
  'Micro-ondas': 'fa-solid fa-clock-rotate-left',
  'Televisão': 'fa-solid fa-tv',
  'Ar condicionado': 'fa-solid fa-fan',
  'Aspirador': 'fa-solid fa-broom',
  'Ferro de engomar': 'fa-solid fa-temperature-arrow-up',
  'Secador de cabelo': 'fa-solid fa-wind',
  'Computador': 'fa-solid fa-desktop',
  'Consola de jogos': 'fa-solid fa-gamepad',
  'Carregador de telemóvel': 'fa-solid fa-mobile-screen',
  'Router Wi-Fi': 'fa-solid fa-wifi',
  'Cafeteira': 'fa-solid fa-mug-hot',
}

// Specific icon mapping for each task by ID or title
export const taskSpecificIcons = {
  // By ID
  '1': 'fa-solid fa-lightbulb',           // Desligar luzes ao sair de casa
  '2': 'fa-solid fa-bus',                 // Usar transporte público
  '3': 'fa-solid fa-bottle-water',        // Reciclar plástico
  '4': 'fa-solid fa-shower',              // Duche de 5 minutos
  '5': 'fa-solid fa-power-off',           // Desligar aparelhos em standby
  '6': 'fa-solid fa-carrot',              // Refeição vegetariana
  '7': 'fa-solid fa-bag-shopping',        // Usar saco reutilizável
  '8': 'fa-solid fa-snowflake',           // Lavar roupa a frio
  '9': 'fa-solid fa-bicycle',             // Andar de bicicleta
  '10': 'fa-solid fa-seedling',           // Compostar resíduos orgânicos
  '11': 'fa-solid fa-sun',                // Secar roupa ao ar
  '12': 'fa-solid fa-store',              // Comprar produtos locais
  '13': 'fa-solid fa-tree',               // Plantar uma árvore
  '14': 'fa-solid fa-wrench',             // Reparar em vez de substituir
  '15': 'fa-solid fa-people-group',       // Participar em limpeza comunitária

  // By title (for custom/new tasks)
  'Desligar luzes ao sair de casa': 'fa-solid fa-lightbulb',
  'Usar transporte público': 'fa-solid fa-bus',
  'Reciclar plástico': 'fa-solid fa-bottle-water',
  'Duche de 5 minutos': 'fa-solid fa-shower',
  'Desligar aparelhos em standby': 'fa-solid fa-power-off',
  'Refeição vegetariana': 'fa-solid fa-carrot',
  'Usar saco reutilizável': 'fa-solid fa-bag-shopping',
  'Lavar roupa a frio': 'fa-solid fa-snowflake',
  'Andar de bicicleta': 'fa-solid fa-bicycle',
  'Compostar resíduos orgânicos': 'fa-solid fa-seedling',
  'Secar roupa ao ar': 'fa-solid fa-sun',
  'Comprar produtos locais': 'fa-solid fa-store',
  'Plantar uma árvore': 'fa-solid fa-tree',
  'Reparar em vez de substituir': 'fa-solid fa-wrench',
  'Participar em limpeza comunitária': 'fa-solid fa-people-group',
}

// Badge icons (Font Awesome)
export const badgeIcons = {
  'star': 'fa-solid fa-star',
  'local_fire_department': 'fa-solid fa-fire',
  'eco': 'fa-solid fa-leaf',
  'emoji_events': 'fa-solid fa-trophy',
  'military_tech': 'fa-solid fa-medal',
  'card_giftcard': 'fa-solid fa-gift',
  'bolt': 'fa-solid fa-bolt',
  'recycling': 'fa-solid fa-recycle',
  'whatshot': 'fa-solid fa-fire-flame-curved',
  'calendar_month': 'fa-solid fa-calendar-check',
}

// Get icon for a specific appliance (checks ID first, then name, then category fallback)
export function getApplianceIcon(appliance) {
  if (typeof appliance === 'string') {
    // If passed just a category string (backward compatibility)
    return applianceCategoryIcons[appliance] || applianceCategoryIcons['Outro']
  }
  
  // Check by ID first
  if (appliance.id && applianceSpecificIcons[appliance.id]) {
    return applianceSpecificIcons[appliance.id]
  }
  
  // Check by name
  if (appliance.name && applianceSpecificIcons[appliance.name]) {
    return applianceSpecificIcons[appliance.name]
  }
  
  // Fall back to category icon
  return applianceCategoryIcons[appliance.category] || applianceCategoryIcons['Outro']
}

// Get icon for a specific task (checks ID first, then title, then category fallback)
export function getTaskIcon(task) {
  if (typeof task === 'string') {
    // If passed just a category string (backward compatibility)
    return taskCategoryIcons[task] || taskCategoryIcons['Outro']
  }
  
  // Check by ID first
  if (task.id && taskSpecificIcons[task.id]) {
    return taskSpecificIcons[task.id]
  }
  
  // Check by title
  if (task.title && taskSpecificIcons[task.title]) {
    return taskSpecificIcons[task.title]
  }
  
  // Fall back to category icon
  return taskCategoryIcons[task.category] || taskCategoryIcons['Outro']
}

// Get category fallback icon for appliances
export function getApplianceCategoryIcon(category) {
  return applianceCategoryIcons[category] || applianceCategoryIcons['Outro']
}

// Get category fallback icon for tasks
export function getTaskCategoryIcon(category) {
  return taskCategoryIcons[category] || taskCategoryIcons['Outro']
}

// Get badge icon (converts from material symbols name to Font Awesome)
export function getBadgeIcon(iconName) {
  return badgeIcons[iconName] || 'fa-solid fa-award'
}

// API device types mapping
export const apiDeviceTypes = [
  { value: 'laptop', label: 'Portátil' },
  { value: 'desktop', label: 'Computador' },
  { value: 'television', label: 'Televisão' },
  { value: 'air_conditioner', label: 'Ar Condicionado' },
  { value: 'refrigerator', label: 'Frigorífico' },
  { value: 'washing_machine', label: 'Máquina de Lavar' },
  { value: 'dishwasher', label: 'Máquina de Lavar Loiça' },
  { value: 'electricity', label: 'Outro (Eletricidade)' },
]

export default {
  applianceCategoryIcons,
  taskCategoryIcons,
  applianceSpecificIcons,
  taskSpecificIcons,
  badgeIcons,
  getApplianceIcon,
  getTaskIcon,
  getApplianceCategoryIcon,
  getTaskCategoryIcon,
  getBadgeIcon,
  apiDeviceTypes,
}
