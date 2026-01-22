<template>
  <nav
    :class="[
      landing
        ? 'bg-(--system-foreground) h-20 flex justify-center w-full z-30 relative'
        : 'bg-(--system-background) h-20 flex justify-center w-full z-30 relative',
    ]"
  >
    <div class="flex w-full max-w-7xl items-center justify-between px-6 lg:px-[184px]">
      <img
        @click="landing ? $router.push({ name: 'landing' }) : $router.push({ name: 'home' })"
        src="@/assets/img/Logo.svg"
        class="h-10 cursor-pointer"
      />
      <div class="flex gap-(--spacing-md) items-center">
        <template v-if="landing">
          <MenuButton :landing="true" @click="scrollToSection('carrosel')"
            >Funcionalidades</MenuButton
          >
          <MenuButton :landing="true" @click="scrollToSection('impacto')">Impacto</MenuButton>
          <MenuButton :landing="true" @click="scrollToSection('testemunhos')"
            >Testemunhos</MenuButton
          >
          <MenuButton @click="$router.push({ name: 'login' })" :landing="true">Entrar</MenuButton>
          <ActionButton @click="$router.push({ name: 'register' })">Registar</ActionButton>
        </template>
        <template v-else>
          <MenuButton :landing="false">Estatisticas</MenuButton>
          <MenuButton :landing="false">Consumos</MenuButton>
          <MenuButton :landing="false">Tarefas</MenuButton>
          <MenuButton :landing="false">Ferramentas</MenuButton>
          <div class="flex gap-4 text-(--text-body-titles)">
            <span
              @click="toggleDarkMode"
              class="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity"
            >
              {{ isDark ? 'dark_mode' : 'light_mode' }}
            </span>
            <div class="relative">
              <span
                @click="toggleGridDropdown"
                class="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity"
              >
                grid_on
              </span>
              <!-- Grid Dropdown Menu -->
              <div
                v-if="gridDropdownOpen"
                @click.stop
                class="absolute right-0 mt-2 w-48 bg-(--system-background,white) border-2 border-(--system-border,#e7e5e4) rounded-(--border-radius-lg,10px) shadow-lg z-50"
              >
                <div class="py-2">
                  <button
                    @click="selectLayout(1)"
                    class="w-full px-4 py-2 text-left text-(--text-headings,#1c1917) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">view_list</span>
                    <span>Lista</span>
                  </button>
                  <button
                    @click="selectLayout(2)"
                    class="w-full px-4 py-2 text-left text-(--text-headings,#1c1917) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">grid_view</span>
                    <span>Grelha 2x2</span>
                  </button>
                  <button
                    @click="selectLayout(3)"
                    class="w-full px-4 py-2 text-left text-(--text-headings,#1c1917) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2 hidden lg:flex"
                  >
                    <span class="material-symbols-outlined text-xl">view_comfy</span>
                    <span>Grelha 3x3</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="relative">
              <span
                @click="toggleDropdown"
                class="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity"
              >
                account_circle
              </span>
              <!-- Dropdown Menu -->
              <div
                v-if="dropdownOpen"
                @click.stop
                class="absolute right-0 mt-2 w-48 bg-(--system-background,white) border-2 border-(--system-border,#e7e5e4) rounded-(--border-radius-lg,10px) shadow-lg z-50"
              >
                <div class="py-2">
                  <button
                    @click="navigateTo('profile')"
                    class="w-full px-4 py-2 text-left text-(--text-headings,#1c1917) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">person</span>
                    <span>Perfil</span>
                  </button>
                  <button
                    v-if="isAdmin"
                    @click="navigateTo('admin')"
                    class="w-full px-4 py-2 text-left text-(--text-headings,#1c1917) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
                    <span>Dashboard Admin</span>
                  </button>
                  <button
                    @click="switchProfile"
                    class="w-full px-4 py-2 text-left text-(--text-headings,#1c1917) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">swap_horiz</span>
                    <span>Mudar Perfil</span>
                  </button>
                  <div class="border-t border-(--system-border,#e7e5e4) my-1"></div>
                  <button
                    @click="logout"
                    class="w-full px-4 py-2 text-left text-(--semantic-error-default,#dc2626) hover:bg-(--system-input-background,#f5f5f4) transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">logout</span>
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import ActionButton from './ActionButton.vue'
import MenuButton from './MenuButton.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  components: {
    MenuButton,
    ActionButton,
  },
  data() {
    return {
      isDark: false,
      gridDropdownOpen: false,
      dropdownOpen: false,
    }
  },
  props: {
    landing: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    isAdmin() {
      return this.userStore.isAdmin
    },
  },
  mounted() {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      this.isDark = savedDarkMode === 'true'
      this.applyDarkMode()
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      this.applyDarkMode()
      localStorage.setItem('darkMode', this.isDark.toString())
    },
    applyDarkMode() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleGridDropdown() {
      this.gridDropdownOpen = !this.gridDropdownOpen
      this.dropdownOpen = false
    },
    selectLayout(columns) {
      this.$emit('layout-change', columns)
      this.gridDropdownOpen = false
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
      this.gridDropdownOpen = false
    },
    handleClickOutside(event) {
      const dropdown = event.target.closest('.relative')
      if (!dropdown) {
        this.dropdownOpen = false
        this.gridDropdownOpen = false
      }
    },
    navigateTo(routeName) {
      this.dropdownOpen = false
      this.$router.push({ name: routeName })
    },
    switchProfile() {
      this.dropdownOpen = false
      this.$router.push({ name: 'profile-selection' })
    },
    logout() {
      this.dropdownOpen = false
      this.userStore.logout()
      this.$router.push({ name: 'landing' })
    },
    scrollToSection(sectionId) {
      const scroll = () => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }

      if (this.$route.name !== 'landing') {
        this.$router.push({ name: 'landing' }).then(() => {
          this.$nextTick(() => {
            scroll()
          })
        })
      } else {
        this.$nextTick(() => {
          scroll()
        })
      }
    },
  },
}
</script>

<style scoped>
nav {
  font-family: var(--font-family-base);
}
</style>
