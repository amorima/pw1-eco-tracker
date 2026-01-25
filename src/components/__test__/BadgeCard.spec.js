import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeCard from '@/components/BadgeCard.vue'

describe('BadgeCard', () => {
  let wrapper

  const defaultProps = {
    title: 'Teste',
    icon: 'emoji_events',
    locked: false,
  }

  beforeEach(() => {
    wrapper = mount(BadgeCard, {
      props: defaultProps,
    })
  })

  describe('renders', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true) // verifica se renderizou o componente
    })

    it('should have the correct title', () => {
      expect(wrapper.text()).toContain('Teste') // verifica se é o titulo certo
    })

    it('should have the right icon', () => {
      const icon = wrapper.find('i') // cria icon de teste
      expect(icon.exists()).toBe(true) // verifica se existe
      expect(icon.classes()).toContain('emoji_events') // veririca se é o certo
    })
  })

  describe('unlocked', () => {
    it('should have the right colour when unlocked', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-(--system-ring)') // verifica se tem o background certo
      expect(button.classes()).not.toContain('bg-(--system-card)') // verifica que nao tem o background errado
    })

    it('should have white icon when unlocked', () => {
      const icon = wrapper.find('i')
      // cria um array com as classes do icon
      expect(icon.classes()).toContain('text-white') // verifica se tem a cor branca
      expect(icon.classes()).not.toContain('text-(--text-disabled)') // verifica que nao tem a cor disabled
    })

    it('should have the right text colour when unlocked', () => {
      const text = wrapper.find('p')
      expect(text.classes()).toContain('text-(--system-card)') // verifica se tem a cor certa
      expect(text.classes()).not.toContain('text-(--text-disabled)') // verifica que nao tem a cor disabled
    })
  })

  describe('locked', () => {
    beforeEach(async () => {
      await wrapper.setProps({ locked: true })
    })

    it('should have grey background', () => {
      const button = wrapper.find('button') // cria o botao de teste
      expect(button.classes()).toContain('bg-(--system-card)') // verifica se tem o background certo
      expect(button.classes()).toContain('border') // verifica se tem border
      expect(button.classes()).not.toContain('bg-(--system-ring)') // verifica que nao tem o background errado
    })

    it('icon shouldnt have white text color', () => {
      const icon = wrapper.find('i') // cria o icon de teste
      expect(icon.classes()).toContain('text-(--text-disabled)') // verifica se tem a cor disabled
      expect(icon.classes()).not.toContain('text-white') // verifica que nao tem a cor branca
    })

    it('should have disabled text when locked', () => {
      const text = wrapper.find('p')
      expect(text.classes()).toContain('text-(--text-disabled)') // verifica se tem a cor disabled
      expect(text.classes()).not.toContain('text-(--system-card)')
    })
  })

  describe('interactive', () => {
    it('should trigger clicks whenever clicked', async () => {
      await wrapper.trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click') // verifica se emite click
      expect(wrapper.emitted('click')).toHaveLength(1) // verifica se emite click de todo
    })

    it('should emmit multiple clicks', async () => {
      await wrapper.trigger('click')
      await wrapper.trigger('click')
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(3) // verifica se emite varios clicks
    })

    it('should emmit click even locked', async () => {
      await wrapper.setProps({ locked: true })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1) // verifica se emite click bloqueado
    })
  })

  describe('props', () => {
    it('should accept different icons', async () => {
      await wrapper.setProps({ icon: 'star' })
      const icon = wrapper.find('i')
      expect(icon.classes()).toContain('star') // verifica se aceita icons diferentes
    })

    it('should accept different titles', async () => {
      await wrapper.setProps({ title: 'Novo Título' })
      expect(wrapper.text()).toContain('Novo Título') // verifica se aceita titulos diferentes dado por prop
    })

    it('should change between locked and unlocked', async () => {
      const button = wrapper.find('button')

      expect(button.classes()).toContain('bg-(--system-ring)') // veririca se esta bloqueado inicialmente

      await wrapper.setProps({ locked: true }) // bloquear prop
      expect(button.classes()).toContain('bg-(--system-card)')

      await wrapper.setProps({ locked: false }) // desbloquear prop
      expect(button.classes()).toContain('bg-(--system-ring)')
    })
  })

  describe('acessibilidade', () => {
    it('should change to pointer', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('cursor-pointer') // verifica se o cursor muda para pointer
    })

    it('should have hover effect', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('transition-all') // verifica se ha transição
    })

    it('should transition', () => {
      const button = wrapper.find('button')
      expect(button.classes()).toContain('transition-all') // verifica se ha transição
    })
  })
})
