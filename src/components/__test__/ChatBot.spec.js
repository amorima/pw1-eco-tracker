import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChatBot from '@/components/ChatBot.vue'

describe('ChatBot', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(ChatBot)
  })

  describe('render', () => {
    it('should render component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should render agent icon', () => {
      const icons = wrapper.findAll('i.fa-solid')
      expect(icons.length).toBeGreaterThan(0) // verifica se icone do agente aparece
    })
  })

  describe('open and close', () => {
    it('should open chat when clicked', async () => {
      expect(wrapper.vm.isOpen).toBe(false) // verifica que começa fechado
      await wrapper.vm.toggleChat() // abre o chat
      expect(wrapper.vm.isOpen).toBe(true) // verifica que abriu
    })

    it('should render title', async () => {
      await wrapper.vm.toggleChat() // abre o chat
      expect(wrapper.text()).toContain('Assistente Virtual') // verifica título
    })

    it('should close when clicked again', async () => {
      await wrapper.vm.toggleChat() // abre o chat
      expect(wrapper.vm.isOpen).toBe(true) // verifica que abriu
      await wrapper.vm.toggleChat() // fecha o chat
      expect(wrapper.vm.isOpen).toBe(false) // verifica que fechou
    })
  })

  describe('message', () => {
    it('shouldnt send empty message', async () => {
      const initialLength = wrapper.vm.messages.length // comprimento inicial
      wrapper.vm.currentMessage = '   ' // mensagem vazia
      await wrapper.vm.sendMessage() // tenta enviar
      expect(wrapper.vm.messages.length).toBe(initialLength) // verifica se nao enviou
    })

    it('should clear input after sent', async () => {
      wrapper.vm.currentMessage = 'Teste' // mensagem de teste
      wrapper.vm.sendMessage() // envia mensagem
      expect(wrapper.vm.currentMessage).toBe('') // verifica se limpou input
    })
  })

  describe('quick Actions', () => {
    it('should have 4 options', () => {
      expect(wrapper.vm.quickActions.length).toBe(4)
    })

    it('should have right title options', () => {
      expect(wrapper.vm.quickActions[0].label).toBe('O que é a b.green?')
      expect(wrapper.vm.quickActions[1].label).toBe('Ver último consumo')
      expect(wrapper.vm.quickActions[2].label).toBe('Ver ranking')
      expect(wrapper.vm.quickActions[3].label).toBe('Troubleshooting')
    })
  })

  describe('props', () => {
    it('should accept context as prop', () => {
      const wrapperWithContext = mount(ChatBot, {
        props: { context: 'admin' },
        global: { plugins: [createPinia()] },
      })
      expect(wrapperWithContext.vm.context).toBe('admin')
    })

    it('should have general context as default', () => {
      expect(wrapper.vm.context).toBe('general') // verifica valor padrão do contexto
    })
  })

  describe('state', () => {
    it('should start closed', () => {
      expect(wrapper.vm.isOpen).toBe(false)
    })

    it('should have empty message input', () => {
      expect(wrapper.vm.messages).toEqual([])
    })

    it('should have connected status', () => {
      expect(wrapper.vm.connectionStatus).toBe('connected')
    })

    it('shouldnt be loading', () => {
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })
})
