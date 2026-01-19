import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FAQItem from '@/components/FAQItem.vue'

describe('FAQItem', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(FAQItem)
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true) // verifica se o componente existe
    })

    it('renderiza o conteúdo da pergunta', () => {
      expect(wrapper.text()).toContain('Como funciona o sistema de monitorização?') // verifica se o a pergunta existe
    })

    it('renderiza conteudo quando aberto o card', async () => {
      await wrapper.vm.toggleOpen() // espera abrir o card
      expect(wrapper.text()).toContain('Registe manualmente os consumos') // verifica se a resposta existe quando aberto o card
    })
  })

  describe('estado inicial do card', () => {
    it('o card começa fechado por padrão', () => {
      expect(wrapper.vm.isOpen).toBe(false) // verifica se o card começa fechado
    })

    it('iria iniciar aberto se defaultOpen começasse true', () => {
      const openWrapper = mount(FAQItem, {
        props: {
          defaultOpen: true, // altera a prop para true
        },
      })

      expect(openWrapper.vm.isOpen).toBe(true) // verifica se o card inicia aberto
    })

    it('nao mostra a resposta quando card esta fechado', () => {
      // verifica se resposta aparece se card tiver fechado
      const answerDiv = wrapper.find('.overflow-hidden > div') // seleciona o div da resposta
      expect(answerDiv.isVisible()).toBe(false) // verifica se o div nao aparece
    })
  })

  describe('interativo', () => {
    // testa interatividade card
    it('altera card ao clicar', async () => {
      expect(wrapper.vm.isOpen).toBe(false) // espera card ficar fechado por defeito

      await wrapper.trigger('click') // clica no card
      expect(wrapper.vm.isOpen).toBe(true) // espera-se que o card abra

      await wrapper.trigger('click') // clica novamente
      expect(wrapper.vm.isOpen).toBe(false) // espera-se que o card se feche
    })

    it('roda o ícone quando aberto', async () => {
      const icon = wrapper.find('.material-symbols-outlined') // seleciona o ícone

      expect(icon.classes()).not.toContain('rotate-180') // espera-se que o icon nao esteja rodado

      await wrapper.trigger('click') // ao clicar no card
      expect(icon.classes()).toContain('rotate-180') // espera-se que o icon rode
    })
  })
})
