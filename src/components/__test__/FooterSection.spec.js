/**
 * Testes unitários para o componente FooterSection.
 * Valida a renderização do rodapé com logótipo, texto de copyright e links
 * de navegação. Testa a navegação para as páginas de login, registo, sobre
 * e contactos, bem como os links de redes sociais e métodos de pagamento.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterSection from '@/components/FooterSection.vue'

describe('FooterSection', () => {
  let wrapper
  let routerMock

  beforeEach(() => {
    routerMock = { push: vi.fn() }

    wrapper = mount(FooterSection, {
      global: {
        mocks: {
          $router: routerMock,
        },
      },
    })
  })

  describe('renders', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true) // verifica se componente existe
    })

    it('renders the logo', () => {
      const logo = wrapper.find('img[alt="b.green logo"]')
      expect(logo.exists()).toBe(true) // verifica se logo existe
    })

    it('renders copyright text', () => {
      expect(wrapper.text()).toContain('All rights reserved © 2026 b.green') // verifica se copyright aparece
    })
  })

  describe('navigation links', () => {
    it('navigates to login when login link is clicked', async () => {
      const links = wrapper.findAll('a')
      const loginLink = links.find((link) => link.text() === 'Login')

      await loginLink.trigger('click')
      expect(routerMock.push).toHaveBeenCalledWith({ name: 'login' }) // verifica navegacao para login
    })

    it('navigates to register when register link is clicked', async () => {
      const links = wrapper.findAll('a')
      const registerLink = links.find((link) => link.text() === 'Registar')

      await registerLink.trigger('click')
      expect(routerMock.push).toHaveBeenCalledWith({ name: 'register' }) // verifica navegacao para register
    })

    it('navigates to about when about link is clicked', async () => {
      const links = wrapper.findAll('a')
      const aboutLink = links.find((link) => link.text() === 'Sobre nós')

      await aboutLink.trigger('click')
      expect(routerMock.push).toHaveBeenCalledWith({ name: 'about' }) // verifica navegacao para about
    })

    it('navigates to contacts when contacts link is clicked', async () => {
      const links = wrapper.findAll('a')
      const contactsLink = links.find((link) => link.text() === 'Contactos')

      await contactsLink.trigger('click')
      expect(routerMock.push).toHaveBeenCalledWith({ name: 'contacts' }) // verifica navegacao para contacts
    })
  })

  describe('social media links', () => {
    it('has facebook link with correct href', () => {
      const facebook = wrapper.find('a[href="https://facebook.com"]')
      expect(facebook.exists()).toBe(true) // verifica se link facebook existe
      expect(facebook.attributes('target')).toBe('_blank') // verifica se abre nova tab
    })

    it('has instagram link with correct href', () => {
      const instagram = wrapper.find('a[href="https://instagram.com"]')
      expect(instagram.exists()).toBe(true) // verifica se link instagram existe
    })

    it('renders 4 social media icons', () => {
      const socialLinks = wrapper.findAll('a[target="_blank"]')
      expect(socialLinks.length).toBeGreaterThanOrEqual(4) // verifica se tem 4 redes sociais
    })
  })

  describe('payment methods', () => {
    it('displays MB Way', () => {
      const mbway = wrapper.find('img[alt="MB Way"]')
      expect(mbway.exists()).toBe(true) // verifica se mbway existe
    })

    it('displays Google Pay', () => {
      const googlepay = wrapper.find('img[alt="Google Pay"]')
      expect(googlepay.exists()).toBe(true) // verifica se google pay existe
    })

    it('displays Apple Pay', () => {
      const applepay = wrapper.find('img[alt="Apple Pay"]')
      expect(applepay.exists()).toBe(true) // verifica se apple pay existe
    })
  })
})
