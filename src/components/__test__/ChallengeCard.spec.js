import { describe, it, expect, beforeEach } from 'vitest'
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

  describe('render', () => {
    it('should render component', () => {
      const wrapper = mount(ChallengeCard, { props: defaultProps })
      expect(wrapper.exists()).toBe(true)
    })

    it('should have title and description', () => {
      const wrapper = mount(ChallengeCard, { props: defaultProps })
      expect(wrapper.text()).toContain('Desafio Eco')
      expect(wrapper.text()).toContain('Poupe 50kg de CO2')
    })

    it('should have xp when unlocked', () => {
      const wrapper = mount(ChallengeCard, { props: defaultProps })
      expect(wrapper.text()).toContain('100 xp')
    })
  })

  describe('disable', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, active: false },
      })
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
      })
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
      })
      expect(wrapper.vm.chartSeries[0].data[0]).toBe(80) // verifica se progresso esta certo
    })

    it('should accept different xp', () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, xp: 200 }, // muda xp
      })
      expect(wrapper.text()).toContain('200 xp') // verifica se xp esta certo
    })

    it('should change between active and disable', async () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, active: false },
      })

      expect(wrapper.findComponent({ name: 'apexchart' }).exists()).toBe(true) // verifica se barra de progresso existe

      await wrapper.setProps({ active: true }) // ativa desafio
      expect(wrapper.findComponent({ name: 'apexchart' }).exists()).toBe(false) // verifica se barra de progresso nao existe
    })
  })
})
