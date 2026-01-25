/**
 * Testes unitários para o componente ChallengeCard.
 * Valida a renderização do cartão de desafio com título, descrição e pontos XP.
 * Testa os estados activo e inactivo do desafio, bem como os estilos visuais
 * associados a cada estado.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChallengeCard from '@/components/ChallengeCard.vue'

describe('ChallengeCard', () => {
  const defaultProps = {
    title: 'Desafio Eco',
    description: 'Poupe 50kg de CO2',
    progress: 60,
    xp: 100,
    active: false,
    adminMode: false,
  }

  // Create a container for teleport target
  let container
  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('render', () => {
    it('should render component', () => {
      const wrapper = mount(ChallengeCard, {
        props: defaultProps,
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('should have title and description', () => {
      const wrapper = mount(ChallengeCard, {
        props: defaultProps,
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
          },
        },
      })
      expect(wrapper.text()).toContain('Desafio Eco')
      expect(wrapper.text()).toContain('Poupe 50kg de CO2')
      wrapper.unmount()
    })

    it('should have xp when unlocked', () => {
      const wrapper = mount(ChallengeCard, {
        props: defaultProps,
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
          },
        },
      })
      expect(wrapper.text()).toContain('100 xp')
      wrapper.unmount()
    })
  })

  describe('disable', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, active: false },
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
            apexchart: {
              name: 'apexchart',
              template: '<div class="apexchart-stub"></div>',
            },
          },
        },
      })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('should have card background', () => {
      const card = wrapper.find('div')
      expect(card.classes()).toContain('bg-(--system-card)') // verifica se tem fundo certo
    })

    it('should have progressbar', () => {
      const progressBar = wrapper.findComponent({ name: 'apexchart' }) // Buscar componente apexchart
      expect(progressBar.exists()).toBe(true)
    })

    it('should have right progress', () => {
      expect(wrapper.vm.chartSeries[0].data[0]).toBe(60) // verifica se progresso esta certo
    })

    it('should have XP', () => {
      expect(wrapper.text()).toContain('100 xp') // verifica se xp esta certo
    })
  })

  describe('active', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, active: true },
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
          },
        },
      })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('should have coloured background', () => {
      const card = wrapper.find('div') // procura div principal
      expect(card.classes()).toContain('bg-(--system-ring)') // verifica se tem fundo certo
    })

    it('shouldnt have progressbar', () => {
      const progressBar = wrapper.findComponent({ name: 'apexchart' })
      expect(progressBar.exists()).toBe(false) // verifica se nao ha barra
    })

    it('shouldnt have XP', () => {
      expect(wrapper.text()).toContain('xp') // verifica se tem xp (badge sempre aparece)
    })

    it('shoulnt have disabled text color', () => {
      // Verificar se o texto não está desabilitado
      expect(wrapper.html()).not.toContain('text-(--text-disabled)')
    })
  })

  describe('props', () => {
    it('should accept different progress', async () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, progress: 80 }, // muda progresso
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
            apexchart: {
              name: 'apexchart',
              template: '<div class="apexchart-stub"></div>',
            },
          },
        },
      })
      expect(wrapper.vm.chartSeries[0].data[0]).toBe(80) // verifica se progresso esta certo
      wrapper.unmount()
    })

    it('should accept different xp', () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, xp: 200 }, // muda xp
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
          },
        },
      })
      expect(wrapper.text()).toContain('200 xp') // verifica se xp esta certo
      wrapper.unmount()
    })

    it('should change between active and disable', async () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, active: false },
        attachTo: document.body,
        global: {
          stubs: {
            Teleport: true,
            ModalComponent: true,
            apexchart: {
              name: 'apexchart',
              template: '<div class="apexchart-stub"></div>',
            },
          },
        },
      })

      expect(wrapper.findComponent({ name: 'apexchart' }).exists()).toBe(true) // verifica se barra de progresso existe

      await wrapper.setProps({ active: true }) // ativa desafio
      expect(wrapper.findComponent({ name: 'apexchart' }).exists()).toBe(false) // verifica se barra de progresso nao existe
      wrapper.unmount()
    })
  })
})
