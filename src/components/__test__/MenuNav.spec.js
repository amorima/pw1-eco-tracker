/**
 * Testes unitários para o componente MenuNav.
 * Valida a renderização condicional do menu de navegação consoante a prop
 * "landing". Verifica que o menu da landing page mostra "Funcionalidades"
 * e o menu principal mostra "Estatisticas".
 */

import { mount } from '@vue/test-utils'
import MenuNav from '@/components/MenuNav.vue'
import { describe, it, expect } from 'vitest'

describe('MenuNav.vue', () => {
  it('Renders Correct Menu Passed as Prop', async () => {
    const wrapper = mount(MenuNav, {
      props: { landing: true },
    })

    expect(wrapper.text()).toContain('Funcionalidades')
    expect(wrapper.text()).not.toContain('Estatisticas')

    await wrapper.setProps({ landing: false })

    expect(wrapper.text()).toContain('Estatisticas')
    expect(wrapper.text()).not.toContain('Funcionalidades')
  })
})
