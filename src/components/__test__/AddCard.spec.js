import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomeScreenView from '@/views/HomeScreenView.vue'
import AddCard from '@/components/AddCard.vue'

describe('HomeScreenView', () => {
  let wrapper

  beforeEach(() => {
    // pinia para stores
    setActivePinia(createPinia())
    wrapper = mount(HomeScreenView, {
      global: {
        stubs: {
          MenuNav: true, // nao carrega MenuNav para mais eficiencia
          ChatBot: true, // nao carrega ChatBot para mais eficiencia
          StatisticsChart: true, // nao carrega StatisticsChart para mais eficiencia
          draggable: true,
        },
      },
    })
  })

  describe('renders', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true) // verifica se componente existe
    })
  })

  describe('opens consumption modal', () => {
    // veriricar se modal abre
    it('opens consumption modal when consumption AddCard is clicked', async () => {
      expect(wrapper.vm.showApplianceModal).toBe(false) // deve estar fechado como default

      const addCards = wrapper.findAllComponents(AddCard) // encontrar e criar array com todas as vezes que o componente é encontrado

      const consumptionAddCard = addCards[0] // AddCard para consumos é o primneiro a aparecer logo é o [0]

      await consumptionAddCard.trigger('click') // simular click

      expect(wrapper.vm.showApplianceModal).toBe(true) // verificar se abriu o modal devido
      expect(wrapper.vm.showTaskModal).toBe(false)
    })
  })

  describe('opens task modal', () => {
    it('opens task modal when task AddCard is clicked', async () => {
      expect(wrapper.vm.showTaskModal).toBe(false) // deve estar fechado como default

      const addCards = wrapper.findAllComponents(AddCard) // encontrar e criar array com todas as vezes que o componente é encontrado

      const taskAddCard = addCards[1] // AddCard para tasks é o segundo a aparecer logo é o [1]

      await taskAddCard.trigger('click') // simular click

      expect(wrapper.vm.showTaskModal).toBe(true) // verificar se abriu o modal devido
      expect(wrapper.vm.showApplianceModal).toBe(false)
    })
  })
})
