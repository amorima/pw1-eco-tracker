import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FAQItem from '@/components/FAQItem.vue'

describe('FAQItem', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(FAQItem)
  })

  describe('renders', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true) // verifica se o componente existe
    })

    it('renders the question', () => {
      expect(wrapper.text()).toContain('Como funciona o sistema de monitorização?') // verifica se o a pergunta existe TEM DE ESTAR EM PORTUGUES
    })

    it('renders content when the card is open', async () => {
      await wrapper.vm.toggleOpen() // espera abrir o card
      expect(wrapper.text()).toContain('Registe manualmente os consumos') // verifica se a resposta existe quando aberto o card TEM DE ESTAR EM PORTUGUES
    })
  })

  describe('initial state of the card', () => {
    it('the card starts open by default', () => {
      expect(wrapper.vm.isOpen).toBe(false) // verifica se o card começa fechado
    })

    it('would start open if defaultOpen was true', () => {
      const openWrapper = mount(FAQItem, {
        props: {
          defaultOpen: true, // altera a prop para true
        },
      })

      expect(openWrapper.vm.isOpen).toBe(true) // verifica se o card inicia aberto
    })

    it('doesnt show the answer when the card is closed', () => {
      expect(wrapper.vm.isOpen).toBe(false) // confirma que está fechado
      expect(wrapper.text()).toContain('Registe manualmente os consumos')
    })
  })

  describe('interactive', () => {
    // testa interatividade card
    it('changes card state on click', async () => {
      expect(wrapper.vm.isOpen).toBe(false) // espera card ficar fechado por defeito

      await wrapper.trigger('click') // clica no card
      expect(wrapper.vm.isOpen).toBe(true) // espera-se que o card abra

      await wrapper.trigger('click') // clica novamente
      expect(wrapper.vm.isOpen).toBe(false) // espera-se que o card se feche
    })

    it('rotate the icon when clicked', async () => {
      const icon = wrapper.find('.material-symbols-outlined') // seleciona o ícone

      expect(icon.classes()).not.toContain('rotate-180') // espera-se que o icon nao esteja rodado

      await wrapper.trigger('click') // ao clicar no card
      expect(icon.classes()).toContain('rotate-180') // espera-se que o icon rode
    })
  })
})
