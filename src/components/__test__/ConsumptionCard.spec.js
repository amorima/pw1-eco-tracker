import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConsumptionCard from '@/components/ConsumptionCard.vue'

describe('FAQItem', () => {
  let wrapper

  const defaultProps = {
    label: 'Teste',
    image: '/src/assets/img/ana.jpg',
    unit: 'hr',
    placeholder: 'Introduza o valor...',
    energyConsumed: 100,
  }

  beforeEach(() => {
    wrapper = mount(ConsumptionCard, {
      props: defaultProps,
    })
  })

  describe('renders', () => {
    it('should render the component', () => {
      expect(wrapper.vm.ConsumptionCard).toBe(true) // verifica se o componente existe
    })

    it('should have the right label', () => {
      expect(wrapper.text().toContain('Teste'))
    })

    it('should have the right energy consumed', () => {
      expect(wrapper.text().toContain('100 kWh'))
    })

    it('should have the right image', () => {
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(defaultProps.image)
      expect(img.attributes('alt')).toBe(defaultProps.label)
    })

    it('shouldnt have energy badge when energyConsummed is null', async () => {
      await wrapper.setProps({ energyConsumed: null })
      expect(wrapper.text()).not.toContain('kWh')
    })

    it('should have the right unity', () => {
      expect(wrapper.text()).toContain('hr')
    })

    it('deve exibir placeholder customizado', async () => {
      await wrapper.setProps({ placeholder: 'Digite aqui' })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Digite aqui')
    })

    it('deve exibir o ícone de seta no botão', () => {
      const icon = wrapper.find('.material-symbols-outlined')
      expect(icon.exists()).toBe(true)
      expect(icon.text()).toBe('arrow_forward_ios')
    })
  })
})
