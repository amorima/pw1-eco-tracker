/**
 * Testes unitários para o componente StreakCard.
 * Valida a renderização do cartão de streak com o número de dias consecutivos.
 * Testa o valor por defeito da prop, a aceitação de diferentes valores
 * e a actualização dinâmica da prop.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StreakCard from '@/components/StreakCard.vue'

describe('StreakCard', () => {
  describe('render', () => {
    it('should render component', () => {
      const wrapper = mount(StreakCard)
      expect(wrapper.exists()).toBe(true) // verifica se componente existe
    })

    it('should render streak days', () => {
      const wrapper = mount(StreakCard, {
        props: { days: 7 }, // passa 7 como prop days
      })
      expect(wrapper.text()).toContain('7') // verifica se número de dias aparece
    })

    it('should have "day streak" text', () => {
      const wrapper = mount(StreakCard)
      expect(wrapper.text()).toContain('day streak') // verifica se texto day streak aparece
    })

    it('shound render streak image', () => {
      const wrapper = mount(StreakCard)
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true) // verifica se imagem existe
      expect(img.attributes('alt')).toBe('streak flame') // verifica alt da imagem
    })
  })

  describe('props', () => {
    it('should have 0 as default', () => {
      const wrapper = mount(StreakCard)
      expect(wrapper.vm.days).toBe(0) // verifica se prop days é 0 por padrão
    })

    it('should accept different numbers', () => {
      const wrapper = mount(StreakCard, {
        props: { days: 15 }, // passa 15 como prop days
      })
      expect(wrapper.text()).toContain('15') // verifica se prop days é 15
    })

    it('should change the prop', async () => {
      const wrapper = mount(StreakCard, {
        props: { days: 5 }, // inicia com 5
      })
      expect(wrapper.text()).toContain('5') // verifica se iniciou com 5

      await wrapper.setProps({ days: 10 }) // atualiza prop days para 10
      expect(wrapper.text()).toContain('10') // verifica se atualizou para 10
    })
  })
})
