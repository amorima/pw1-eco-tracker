import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LandingPage from '@/views/LandingPageView.vue'
import ActionButton from '@/components/ActionButton.vue'

describe('LandingPage', () => {
  let wrapper
  let routerMock

  beforeEach(() => {
    // pinia para stores
    setActivePinia(createPinia())
    routerMock = { push: vi.fn() }
    wrapper = mount(LandingPage, {
      global: {
        stubs: {
          FeatureCarousel: true, // nao carrega MenuNav para mais eficiencia
          FAQItem: true, // nao carrega ChatBot para mais eficiencia
          draggable: true,
        },
        mocks: {
          $router: routerMock,
        },
      },
    })
  })

  describe('renders', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true) // verifica se componente existe
    })
  })
  describe('sends to register', () => {
    // veriricar se envia para a pagina certa
    it('sends the user to the register page when clicked', async () => {
      // should be HomeScreenPage as default

      const actionButtons = wrapper.findAllComponents(ActionButton) // encontrar e criar array com todas as vezes que o componente é encontrado

      const registerButton = actionButtons[0] // AddCard para consumos é o primneiro a aparecer logo é o [0]

      await registerButton.trigger('click') // simular click

      expect(routerMock.push).toHaveBeenCalledWith({ name: 'register' })
    })
  })
})
