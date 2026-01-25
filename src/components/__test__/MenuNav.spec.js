import { mount } from '@vue/test-utils';
import MenuNav from '@/components/MenuNav.vue';
import { describe, it, expect } from 'vitest';

describe('MenuNav.vue', () => {
    it('Renders Correct Menu Passed as Prop', async () => {
        const wrapper = mount(MenuNav, {
            props: {landing: true}
        })

        expect(wrapper.text()).toContain('Funcionalidades')
        expect(wrapper.text()).not.toContain('Estatisticas')


        await wrapper.setProps({landing: false})

        expect(wrapper.text()).toContain('Estatisticas')
        expect(wrapper.text()).not.toContain('Funcionalidades')

    })
})
