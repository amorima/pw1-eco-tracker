import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CollapsibleCard from '@/components/CollapsibleCard.vue'

describe('CollapsibleCard', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CollapsibleCard, {
      props: {
        title: 'teste',
      },
      slots: {
        default: '<p>Conteúdo do card</p>',
      },
    })
  })

  describe('render', () => {
    it('should render component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should render title', () => {
      expect(wrapper.text()).toContain('teste') // verifica se titulo aparece
    })

    it('should render slot', () => {
      expect(wrapper.text()).toContain('Conteúdo do card') // verifica se conteudo do slot aparece
    })

    it('should have drag icon', () => {
      const dragIcon = wrapper.find('.drag-handle .material-symbols-outlined')
      expect(dragIcon.text()).toBe('drag_indicator') // verifica se icone de drag aparece
    })
  })

  describe('state', () => {
    it('should start openm by default', () => {
      expect(wrapper.vm.isOpen).toBe(true) // verifica se comecou aberto
    })

    it('should render collapse icon when open', () => {
      const icons = wrapper.findAll('.material-symbols-outlined')
      const toggleIcon = icons[icons.length - 1]
      expect(toggleIcon.text()).toBe('collapse_all') // verifica se icone de colapsar aparece
    })

    it('should render expand when closed', async () => {
      await wrapper.setProps({ modelValue: false })
      const icons = wrapper.findAll('.material-symbols-outlined') // pega todos os icones
      const toggleIcon = icons[icons.length - 1] // pega o ultimo icone toggle
      expect(toggleIcon.text()).toBe('expand_all') // verifica se icone de expandir aparece
    })

    it('should render content when open', () => {
      expect(wrapper.vm.isOpen).toBe(true)
      const content = wrapper.find('.overflow-hidden')
      expect(content.isVisible()).toBe(true) // verifica se conteudo é visivel
    })
  })

  describe('props', () => {
    it('should accept custom title', () => {
      const customWrapper = mount(CollapsibleCard, {
        props: { title: 'custom' }, // muda titulo
      })
      expect(customWrapper.text()).toContain('custom') // verifica se titulo muda
    })

    it('should accept different values formodelValue', async () => {
      expect(wrapper.vm.isOpen).toBe(true) // verifica estado inicial
      await wrapper.setProps({ modelValue: false }) // muda prop
      expect(wrapper.vm.isOpen).toBe(false) // verifica se estado mudou
    })
  })

  describe('style', () => {
    it('should have border and corner radius', () => {
      const card = wrapper.find('.border-2')
      expect(card.exists()).toBe(true)
      expect(card.classes()).toContain('rounded-[14px]')
    })

    it('should have pointer cursor', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('cursor-pointer') // verifica se cursor é pointer
    })

    it('should have move cursor', () => {
      const dragHandle = wrapper.find('.drag-handle')
      expect(dragHandle.classes()).toContain('cursor-move') // verifica se cursor é move
    })
  })
})
