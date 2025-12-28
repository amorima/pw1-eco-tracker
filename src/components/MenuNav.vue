<template>
    <nav :class="[ landing ? 'bg-(--system-foreground)' : '', 'h-20 flex justify-center' ]">
        <div class="flex w-full max-w-7xl items-center justify-between px-6 lg:px-[184px]">
            <img @click="landing ? $router.push({name:'landing'}) : $router.push({name:'home'})" src="./../assets/Logo.svg" class="h-10">
            <div class="flex gap-(--spacing-md) items-center">
                <template v-if="landing">
                    <MenuButton :landing="true">Funcionalidades</MenuButton>
                    <MenuButton :landing="true">Impacto</MenuButton>
                    <MenuButton :landing="true">Testemunhos</MenuButton>
                    <MenuButton @click="$router.push({name:'login'})" :landing="true">Entrar</MenuButton>
                    <ActionButton @click="$router.push({name:'register'})">Registar</ActionButton>
                </template>
                <template v-else>
                    <MenuButton :landing="false">Estatisticas</MenuButton>
                    <MenuButton :landing="false">Consumos</MenuButton>
                    <MenuButton :landing="false">Tarefas</MenuButton>
                    <MenuButton :landing="false">Ferramentas</MenuButton>
                    <div class="flex gap-4 text-(--text-body-titles)">
                        <span @click="isDark = !isDark" class="material-symbols-outlined">{{isDark ? 'dark_mode' : 'light_mode'}}</span>
                        <span class="material-symbols-outlined">grid_on</span>
                        <span @click="$router.push({name:'profile'})" class="material-symbols-outlined">account_circle</span>
                    </div>
                </template>
            </div>
        </div>
    </nav>
</template>

<script>
import ActionButton from './ActionButton.vue';
import MenuButton from './MenuButton.vue';

    export default {
        components: {
            MenuButton,
            ActionButton
        },
        data() {
            return {
                isDark: false
            }
        },
        props: {
            landing: {
                type: Boolean,
                default: true
            },
        },
    }
</script>

<style scoped>

</style>