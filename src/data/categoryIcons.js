// Category to Icon mapping for appliances and tasks
export const applianceCategoryIcons = {
  'Cozinha': 'kitchen',
  'Lavandaria': 'local_laundry_service',
  'Entretenimento': 'tv',
  'Climatização': 'ac_unit',
  'Limpeza': 'vacuum',
  'Cuidados pessoais': 'styler',
  'Tecnologia': 'computer',
  'Outro': 'electrical_services',
}

export const taskCategoryIcons = {
  'Energia': 'bolt',
  'Mobilidade': 'directions_bus',
  'Reciclagem': 'recycling',
  'Água': 'water_drop',
  'Alimentação': 'restaurant',
  'Consumo': 'shopping_bag',
  'Ambiente': 'eco',
  'Outro': 'task_alt',
}

// Get icon for a category
export function getApplianceIcon(category) {
  return applianceCategoryIcons[category] || applianceCategoryIcons['Outro']
}

export function getTaskIcon(category) {
  return taskCategoryIcons[category] || taskCategoryIcons['Outro']
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
  getApplianceIcon,
  getTaskIcon,
  apiDeviceTypes,
}
