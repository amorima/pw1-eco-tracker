import { vi } from 'vitest'

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

globalThis.localStorage = localStorageMock

// Mock ApexCharts to prevent "Element not found" errors
vi.mock('vue3-apexcharts', () => ({
  default: {
    name: 'apexchart',
    template: '<div class="apexchart-mock"></div>',
    props: ['type', 'options', 'series', 'height', 'width']
  }
}))
