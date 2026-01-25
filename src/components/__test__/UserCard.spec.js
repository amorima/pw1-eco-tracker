import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'
import CardButton from '@/components/CardButton.vue'

describe('UserCard', () => {
  const mockUser = {
    name: 'Carlos Silva',
    avatar: '/src/assets/img/carlos.jpg',
    ranking: '#1 - 1500 pontos',
  }

  describe('empty card', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(UserCard, {
        props: {
          isEmpty: true,
        },
      })
    })

    it('should render component', () => {
      expect(wrapper.exists()).toBe(true) // verifica se componente existe
    })

    it('should render text "Vazio"', () => {
      expect(wrapper.text()).toContain('Vazio') // verifica se texto vazio aparece
    })

    it('should render icon person_add', () => {
      const icon = wrapper.find('i.fa-user-plus')
      expect(icon.exists()).toBe(true) // verifica se icone de adicionar pessoa aparece
    })

    it('shouldnt render CTA', () => {
      const buttons = wrapper.findAllComponents(CardButton)
      expect(buttons.length).toBe(0) // verifica que nao ha botoes quando vazio
    })

    it('should have muted text colour', () => {
      const nameText = wrapper.find('p')
      expect(nameText.classes()).toContain('text-(--accent-muted-foreground)') // verifica cor de texto desabilitado
    })
  })

  describe('user card', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(UserCard, {
        props: {
          user: mockUser,
          isEmpty: false,
        },
      })
    })

    it('should render users name', () => {
      expect(wrapper.text()).toContain('Carlos Silva') // verifica se nome aparece
    })

    it('should render user rank', () => {
      expect(wrapper.text()).toContain('#1 - 1500 pontos') // verifica se ranking aparece
    })

    it('should render avatar when available', () => {
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true) // verifica se imagem existe
      expect(img.attributes('src')).toBe('/src/assets/img/carlos.jpg') // verifica src da imagem
      expect(img.attributes('alt')).toBe('Carlos Silva') // verifica alt da imagem
    })

    it('should render icon "person" when user doesnt have avatar', () => {
      const wrapperNoAvatar = mount(UserCard, {
        props: {
          user: { ...mockUser, avatar: '' }, // utilizador sem avatar
          isEmpty: false,
        },
      })
      const icon = wrapperNoAvatar.find('i.fa-user')
      expect(icon.exists()).toBe(true) // verifica icone padrao quando nao tem avatar
    })

    it('should have text headings colour', () => {
      const nameText = wrapper.find('p')
      expect(nameText.classes()).toContain('text-(--text-headings)') // verifica cor de texto normal
    })
  })

  describe('CTA', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(UserCard, {
        props: {
          user: mockUser,
          isEmpty: false,
        },
      })
    })

    it('should have edit button', () => {
      const buttons = wrapper.findAllComponents(CardButton)
      const editButton = buttons.find((btn) => btn.props('variant') === 'edit') // procura botao editar
      expect(editButton).toBeDefined() // verifica se botao editar existe
    })

    it('should have delete button', () => {
      const buttons = wrapper.findAllComponents(CardButton)
      const deleteButton = buttons.find((btn) => btn.props('variant') === 'delete') // procura botao deletar
      expect(deleteButton).toBeDefined() // verifica se botao deletar existe
    })

    it('should emmit edit when clicked', async () => {
      const buttons = wrapper.findAllComponents(CardButton)
      const editButton = buttons.find((btn) => btn.props('variant') === 'edit') // procura botao editar

      await editButton.trigger('click')

      expect(wrapper.emitted('edit')).toBeTruthy() // verifica se evento edit foi emitido
      expect(wrapper.emitted('edit')[0][0]).toEqual(mockUser) // verifica se utilizador foi passado
    })
  })

  describe('props', () => {
    it('should accept diffferent object', () => {
      const customUser = {
        name: 'Maria Santos',
        avatar: '/maria.jpg',
        ranking: '#2',
      }
      const wrapper = mount(UserCard, {
        props: { user: customUser },
      })
      expect(wrapper.text()).toContain('Maria Santos') // verifica se aceita utilizador
    })

    it('should have default values', () => {
      const wrapper = mount(UserCard)
      expect(wrapper.vm.user.name).toBe('') // verifica valor padrao do nome
      expect(wrapper.vm.user.avatar).toBe('') // verifica valor padrao do avatar
      expect(wrapper.vm.user.ranking).toBe('') // verifica valor padrao do ranking
    })
  })
})
