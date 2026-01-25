/**
 * Testes unitários para o componente CardButton.
 * Valida a renderização do botão e as suas variantes (edit, delete, confirm),
 * verificando os ícones e cores correspondentes a cada variante.
 * Testa também a emissão de eventos de clique.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CardButton from '@/components/CardButton.vue'

describe('CardButton', () => {
  describe('render', () => {
    it('should render component', () => {
      const wrapper = mount(CardButton)
      expect(wrapper.exists()).toBe(true)
    })

    it('should render button', () => {
      const wrapper = mount(CardButton)
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })
  })

  describe('variant edit', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(CardButton)
    })

    it('should have edit icon', () => {
      const icon = wrapper.find('i')
      expect(icon.classes()).toContain('fa-pen') // verifica se ícone é edit
    })

    it('should have info text', () => {
      const button = wrapper.find('button') // seleciona o botão
      expect(button.classes()).toContain('text-(--semantic-info-default)') // verifica se a classe de cor é info
    })
  })

  describe('variant delete', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(CardButton, {
        props: { variant: 'delete' },
      })
    })

    it('should have delete icon', () => {
      const icon = wrapper.find('i')
      expect(icon.classes()).toContain('fa-trash') // verifica se ícone é delete
    })

    it('should have error colour text', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('text-(--semantic-error-default)') // verifica se a classe de cor é error
    })
  })

  describe('variant confirm', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(CardButton, {
        props: { variant: 'confirm' },
      })
    })

    it('should have check icon', () => {
      const icon = wrapper.find('i')
      expect(icon.classes()).toContain('fa-check') // verifica se ícone é check
    })

    it('should have success colour text', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('text-(--semantic-success-default)') // verifica se a classe de cor é success
    })
  })

  describe('interactive', () => {
    it('should emmit click', async () => {
      const wrapper = mount(CardButton)
      await wrapper.trigger('click') // trigger click event

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click').length).toBeGreaterThan(0) // verifica se foi emitido pelo menos uma vez
    })
  })
})
