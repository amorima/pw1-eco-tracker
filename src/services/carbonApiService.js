/**
 * Carbon API Service
 * Service for interacting with the b.green carbon emissions API
 * API Base URL: https://www.antonioamorim.pt/api
 */

const API_BASE_URL = import.meta.env.VITE_CARBON_API_BASE_URL || 'https://www.antonioamorim.pt/api'

// Storage key for API key (fallback)
const API_KEY_STORAGE = 'bgreen_api_key'

/**
 * Get API key from environment variable or localStorage
 */
export function getStoredApiKey() {
  // First try environment variable (preferred)
  const envKey = import.meta.env.VITE_CARBON_API_KEY
  if (envKey && envKey !== 'your_api_key_here') {
    return envKey
  }
  
  // Fallback to localStorage
  return localStorage.getItem(API_KEY_STORAGE)
}

/**
 * Store API key in localStorage (for runtime keys)
 */
export function storeApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key)
}

/**
 * Request a new API key using email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, key?: string, message?: string}>}
 */
export async function requestApiKey(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/request-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (data.success && data.data?.key) {
      storeApiKey(data.data.key)
      return {
        success: true,
        key: data.data.key,
        message: data.message,
      }
    }

    return {
      success: false,
      message: data.message || 'Erro ao obter API key',
    }
  } catch (error) {
    console.error('Error requesting API key:', error)
    return {
      success: false,
      message: 'Erro de conexão ao servidor',
    }
  }
}

/**
 * Ensure we have a valid API key, requesting one if necessary
 * @param {string} email - User's email for requesting key if needed
 * @returns {Promise<string|null>}
 */
export async function ensureApiKey(email) {
  let key = getStoredApiKey()

  // If we have an API key from environment, use it
  if (key) {
    return key
  }

  // Otherwise, try to request one (fallback)
  if (email) {
    const result = await requestApiKey(email)
    if (result.success) {
      key = result.key
    }
  }

  return key
}

/**
 * Calculate carbon emissions for an activity
 * @param {string} type - Type of activity (e.g., 'car_gasoline', 'electricity', 'laptop')
 * @param {number} amount - Amount (km, kWh, kg) or minutes for devices
 * @param {boolean} isDevice - Whether this is a device calculation (uses minutes)
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export async function calculateEmissions(type, amount, isDevice = false) {
  const apiKey = getStoredApiKey()

  if (!apiKey) {
    return {
      success: false,
      message: 'API key não encontrada. Por favor, configure a API primeiro.',
    }
  }

  try {
    const body = isDevice ? { type, minutes: amount } : { type, amount }

    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(body),
    })

    if (response.status === 401) {
      return {
        success: false,
        message: 'API key inválida ou em falta',
      }
    }

    if (response.status === 403) {
      return {
        success: false,
        message: 'API key bloqueada',
      }
    }

    if (response.status === 429) {
      return {
        success: false,
        message: 'Limite de pedidos excedido. Aguarde alguns minutos.',
      }
    }

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        data: data.data,
      }
    }

    return {
      success: false,
      message: data.message || 'Erro no cálculo',
    }
  } catch (error) {
    console.error('Error calculating emissions:', error)
    return {
      success: false,
      message: 'Erro de conexão ao servidor',
    }
  }
}

/**
 * Get API information and available types
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export async function getApiInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/info`)
    const data = await response.json()

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error('Error fetching API info:', error)
    return {
      success: false,
      message: 'Erro de conexão ao servidor',
    }
  }
}

/**
 * Map appliance names to API device types
 */
export const applianceToApiType = {
  'Frigorífico': { type: 'refrigerator', isDevice: true },
  'Máquina de lavar roupa': { type: 'washing_machine', isDevice: true },
  'Máquina de lavar loiça': { type: 'dishwasher', isDevice: true },
  'Forno': { type: 'electricity', isDevice: false, factor: 2.4 }, // 2.4 kWh per hour
  'Micro-ondas': { type: 'electricity', isDevice: false, factor: 1.0 },
  'Televisão': { type: 'television', isDevice: true },
  'Ar condicionado': { type: 'air_conditioner', isDevice: true },
  'Aspirador': { type: 'electricity', isDevice: false, factor: 1.4 },
  'Ferro de engomar': { type: 'electricity', isDevice: false, factor: 2.0 },
  'Secador de cabelo': { type: 'electricity', isDevice: false, factor: 1.5 },
  'Computador': { type: 'desktop', isDevice: true },
  'Consola de jogos': { type: 'electricity', isDevice: false, factor: 0.15 },
  'Carregador de telemóvel': { type: 'electricity', isDevice: false, factor: 0.005 },
  'Router Wi-Fi': { type: 'electricity', isDevice: false, factor: 0.01 },
  'Cafeteira': { type: 'electricity', isDevice: false, factor: 1.0 },
}

/**
 * Calculate emissions for an appliance usage
 * API expects: type (required), time (defaults to 60min), watts (default depends on type)
 * API returns: { success, message, data: { type, carbon_kg_co2, unit, factor, minutes, kwh, device_power_watts } }
 * 
 * New data structure uses:
 * - appliance.type: API device type (laptop, desktop, television, etc.)
 * - appliance.powerWatts: Power consumption in watts
 * 
 * @param {object} appliance - Appliance object with type and powerWatts
 * @param {number} hoursUsed - Hours used
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export async function calculateApplianceEmissions(appliance, hoursUsed) {
  const apiKey = getStoredApiKey()

  if (!apiKey) {
    return {
      success: false,
      message: 'API key não encontrada. Por favor, configure a API primeiro.',
    }
  }

  // Valid device types for the API
  const validTypes = ['refrigerator', 'washing_machine', 'dishwasher', 'television', 
                      'air_conditioner', 'desktop', 'laptop', 'electricity']
  
  // Use the type directly from the appliance (new data structure)
  // Fallback to 'electricity' for generic calculations
  const deviceType = appliance.type || 'electricity'
  const type = validTypes.includes(deviceType) ? deviceType : 'electricity'
  
  // Convert hours to minutes for the API
  const minutes = Math.round(hoursUsed * 60)
  
  // Prepare request body - API expects type, time (minutes), and optionally watts
  const body = {
    type: type,
    minutes: minutes,
  }
  
  // If appliance has custom power consumption (powerWatts) and it's generic electricity type, include watts
  if (appliance.powerWatts && type === 'electricity') {
    body.watts = appliance.powerWatts
  }

  try {
    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(body),
    })

    if (response.status === 401) {
      return { success: false, message: 'API key inválida ou em falta' }
    }

    if (response.status === 403) {
      return { success: false, message: 'API key bloqueada' }
    }

    if (response.status === 429) {
      return { success: false, message: 'Limite de pedidos excedido. Aguarde alguns minutos.' }
    }

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        data: {
          type: data.data.type,
          carbon_kg_co2: data.data.carbon_kg_co2,
          unit: data.data.unit,
          factor: data.data.factor,
          minutes: data.data.minutes,
          kwh: data.data.kwh,
          device_power_watts: data.data.device_power_watts,
        },
      }
    }

    return {
      success: false,
      message: data.message || 'Erro no cálculo',
    }
  } catch (error) {
    console.error('Error calculating appliance emissions:', error)
    
    // Fallback calculation if API fails
    // Use powerWatts from new data structure
    const powerWatts = appliance.powerWatts || 200
    const powerKW = powerWatts / 1000
    const kWh = hoursUsed * powerKW
    const co2 = kWh * 0.188 // Portugal grid factor
    
    return {
      success: true,
      data: {
        type: type,
        carbon_kg_co2: co2,
        unit: 'kg CO2e',
        factor: 0.188,
        minutes: minutes,
        kwh: kWh,
        device_power_watts: powerWatts,
      },
    }
  }
}

/**
 * Map task categories to API types for estimation
 */
export const taskCategoryToApiType = {
  'Mobilidade': {
    'Usar transporte público': { type: 'bus', amount: 10 }, // 10km estimate
    'Andar de bicicleta': { type: 'train', amount: 0 }, // No emissions
  },
  'Alimentação': {
    'Refeição vegetariana': { type: 'meal_vegetarian', amount: 1 },
  },
  'Reciclagem': {
    'Reciclar plástico': { type: 'waste_recycled', amount: 1 },
    'Compostar resíduos orgânicos': { type: 'waste_recycled', amount: 2 },
  },
  'Água': {
    'Duche de 5 minutos': { type: 'water', amount: 40 }, // 40L saved estimate
  },
}

/**
 * Calculate CO2 saved from completing a task
 * Uses co2saved field from new data structure (lowercase)
 * @param {object} task - Task object with title and category
 * @returns {Promise<{success: boolean, co2Saved?: number, message?: string}>}
 */
export async function calculateTaskSavings(task) {
  // For most tasks, use the predefined co2saved value (lowercase in new structure)
  // The API is mainly used for consumption tracking
  return {
    success: true,
    co2Saved: task.co2saved || 0,
  }
}

export default {
  requestApiKey,
  ensureApiKey,
  calculateEmissions,
  calculateApplianceEmissions,
  calculateTaskSavings,
  getApiInfo,
  getStoredApiKey,
  storeApiKey,
}
