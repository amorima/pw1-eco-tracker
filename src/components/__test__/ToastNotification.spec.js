import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastNotification from '@/components/ToastNotification.vue'

describe('ToastNotification', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ToastNotification, {
      props: {
        message: 'teste',
      },
    })
  })

  describe('render', () => {
    it('should render component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should render message', () => {
      expect(wrapper.text()).toContain('teste')
    })

    it('should render icon', () => {
      const icon = wrapper.find('.material-symbols-outlined')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('variant success', () => {
    beforeEach(() => {
      wrapper = mount(ToastNotification, {
        props: {
          variant: 'success',
          message: 'Sucesso!',
        },
      })
    })

    it('should have success as default', () => {
      const defaultWrapper = mount(ToastNotification, {
        props: { message: 'Teste' },
      })
      expect(defaultWrapper.vm.variant).toBe('success') // verifica se o variant default e success
    })

    it('should have primary background', () => {
      const container = wrapper.find('div')
      expect(container.classes()).toContain('bg-(--primary-secondary)') // verifica se tem fundo certo
    })

    it('should render check icon', () => {
      const icon = wrapper.find('.material-symbols-outlined') // procura icon
      expect(icon.text()).toBe('check_circle') // verifica se o icone e certo
    })
  })

  describe('variant error', () => {
    beforeEach(() => {
      wrapper = mount(ToastNotification, {
        props: {
          variant: 'error',
          message: 'Erro!',
        },
      })
    })

    it('should have error background', () => {
      const container = wrapper.find('div')
      expect(container.classes()).toContain('bg-(--semantic-error-light)') // verifica se tem fundo certo
    })

    it('should render error icon', () => {
      const icon = wrapper.find('.material-symbols-outlined') // procura icon
      expect(icon.text()).toBe('error') // verifica se o icone e certo
    })
  })

  describe('props', () => {
    it('should accept custom message', () => {
      const customWrapper = mount(ToastNotification, {
        props: { message: 'mensagem' },
      })
      expect(customWrapper.text()).toContain('mensagem') // verifica se mensagem custom aparece
    })

    it('should have empty name as default', () => {
      const emptyWrapper = mount(ToastNotification)
      expect(emptyWrapper.vm.message).toBe('') // verifica se tem nome vazio
    })

    it('should change between variants', async () => {
      expect(wrapper.vm.iconName).toBe('check_circle')

      await wrapper.setProps({ variant: 'error' }) // muda para error
      expect(wrapper.vm.iconName).toBe('error') // verifica se é icon certo

      await wrapper.setProps({ variant: 'success' }) // muda para success
      expect(wrapper.vm.iconName).toBe('check_circle') // verifica se é icon certo
    })
  })

  describe('style', () => {
    it('should have round corners', () => {
      const container = wrapper.find('div')
      expect(container.classes()).toContain('rounded-full') // verifica round corner
    })
  })
})
