import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeModal from '@/components/BadgeModal.vue'

describe('BadgeModal', () => {
  const earnedBadge = {
    title: 'Eco Warrior',
    icon: 'eco',
    description: 'Salvou 100kg de CO2',
    earned: true,
    earnedAt: '2025-01-15T10:30:00Z',
    requirement: { type: 'co2_saved', value: 100 },
  }

  const lockedBadge = {
    title: 'Streak Master',
    icon: 'local_fire_department',
    description: 'Mantenha uma sequência de 7 dias',
    earned: false,
    requirement: { type: 'streak', value: 7 },
  }

  describe('render', () => {
    it('should render the component', () => {
      // teste para ver se o componente renderiza
      const wrapper = mount(BadgeModal, {
        props: { isOpen: true, badge: earnedBadge },
      })
      expect(wrapper.exists()).toBe(true) // verifica se renderizou o componente
    })

    it('should have title, description n icon', () => {
      // teste para ver se tem titulo descrição e icon
      const wrapper = mount(BadgeModal, {
        props: { isOpen: true, badge: earnedBadge },
      })
      expect(wrapper.text()).toContain('Eco Warrior') // verifica se é o titulo certo
      expect(wrapper.text()).toContain('Salvou 100kg de CO2') // verifica se é a descrição certa

      const icons = wrapper.findAll('i')
      const badgeIcon = icons.find((icon) => icon.attributes('style')?.includes('font-size: 48px'))
      expect(badgeIcon.classes()).toContain(earnedBadge.icon) // veririca se é o certo
    })
  })

  describe('unlocked', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(BadgeModal, {
        props: { isOpen: true, badge: earnedBadge },
      })
    })

    it('should have "Consquitado!" when unlocked', () => {
      expect(wrapper.text()).toContain('Conquistado!') // verifica se tem o texto certo

      const icons = wrapper.findAll('i') // cria um array com os icones
      const hasVerified = icons.some((icon) => icon.classes().includes('fa-circle-check'))
      expect(hasVerified).toBe(true) // veririca se tem o icon certo
    })

    it('should have coloured background', () => {
      const badgeIcon = wrapper.find('.w-24') // encontra o icone da badge
      expect(badgeIcon.classes()).toContain('bg-(--system-ring)') // verifica se tem o background certo
    })

    it('should display earned date', () => {
      expect(wrapper.text()).toContain('15 de janeiro de 2025') // verifica se tem a data certa
    })
  })

  describe('locked', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(BadgeModal, {
        props: { isOpen: true, badge: lockedBadge },
      })
    })

    it('should have "Por conquistar" ann locked icon', () => {
      expect(wrapper.text()).toContain('Por conquistar') // verifica se tem o texto certo

      const icons = wrapper.findAll('i') // cria um array com os icones
      const hasLock = icons.some((icon) => icon.classes().includes('fa-lock')) //
      expect(hasLock).toBe(true) // veririca se tem o icon certo
    })

    it('should have requirement text to unlock', () => {
      expect(wrapper.text()).toContain('Mantenha uma streak de 7 dias') // verifica se tem o texto certo
    })
  })

  describe('formats', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(BadgeModal, {
        props: { isOpen: true, badge: earnedBadge },
      })
    })

    it('should have the right date format', () => {
      const result = wrapper.vm.formatDate('2025-01-15T10:30:00Z')
      expect(result).toBe('15 de janeiro de 2025') // verifica se a data está no formato certo
    })

    it('should have the right text for requirements', () => {
      expect(wrapper.vm.getRequirementText({ type: 'streak', value: 7 })).toBe(
        'Mantenha uma streak de 7 dias',
      ) // verifica se o texto está certo

      expect(wrapper.vm.getRequirementText({ type: 'co2_saved', value: 100 })).toBe(
        'Poupe 100kg de CO2',
      ) // verifica se o texto está certo

      expect(wrapper.vm.getRequirementText(null)).toBe(
        'Continue a usar a aplicação para desbloquear!',
      ) // verifica se o texto está certo
    })
  })

  describe('interactive', () => {
    it('should close when close button clicked', async () => {
      const wrapper = mount(BadgeModal, {
        props: { isOpen: true, badge: earnedBadge },
      })

      const button = wrapper.find('button') // encontra o botao de fechar
      await button.trigger('click') // clica no botao

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1) // verifica se emitiu o evento de fechar uma vez
    })
  })
})
