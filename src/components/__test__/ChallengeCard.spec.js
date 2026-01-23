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
      expect(wrapper.text()).toContain('100xp')
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
      const progressBar = wrapper.find('.h-\\[8px\\]') // Escapar colchetes
      expect(progressBar.exists()).toBe(true)
    })

    it('should have right progress', () => {
      const progressFill = wrapper.find('[style*="width"]') // style com width
      expect(progressFill.attributes('style')).toContain('width: 60%') // verifica se progresso esta certo
    })

    it('should have XP', () => {
      expect(wrapper.text()).toContain('100xp') // verifica se xp esta certo
    })

    it('deve ter texto desabilitado', () => {
      // Buscar pelo container de texto específico
      const textContainers = wrapper.findAll('.flex.flex-col')
      const textContainer = textContainers.find(
        (el) =>
          el.classes().includes('text-(--text-disabled)') || el.classes().includes('text-nowrap'),
      )
      expect(textContainer).toBeDefined()
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
      const progressBar = wrapper.find('.h-\\[8px\\]')
      expect(progressBar.exists()).toBe(false) // verifica se nao ha barra
    })

    it('shouldnt have XP', () => {
      expect(wrapper.text()).not.toContain('xp') // verifica se nao tem xp
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
      const progressFill = wrapper.find('[style*="width"]') // style com width
      expect(progressFill.attributes('style')).toContain('width: 80%') // verifica se progresso esta certo
    })

    it('should accept different xp', () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, xp: 200 }, // muda xp
      })
      expect(wrapper.text()).toContain('200xp') // verifica se xp esta certo
    })

    it('should change between active and disable', async () => {
      const wrapper = mount(ChallengeCard, {
        props: { ...defaultProps, active: false },
      })

      expect(wrapper.find('.h-\\[8px\\]').exists()).toBe(true) // verifica se barra de progresso existe

      await wrapper.setProps({ active: true }) // ativa desafio
      expect(wrapper.find('.h-\\[8px\\]').exists()).toBe(false) // verifica se barra de progresso nao existe
    })
  })
})
