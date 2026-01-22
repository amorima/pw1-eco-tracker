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
      <!-- Desktop Menu -->
      <div class="hidden lg:flex gap-(--spacing-md) items-center">
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
            <div v-if="showGridSelector" class="relative">
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

      <!-- Mobile Menu Button -->
      <button
        @click="mobileMenuOpen = true"
        class="lg:hidden p-2 text-(--text-headings) hover:bg-(--system-border) rounded-lg transition-colors"
      >
        <span class="material-symbols-outlined text-3xl">menu</span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="mobile-slide">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-[60] bg-(--system-background) flex flex-col lg:hidden"
      >
        <!-- Mobile Header -->
        <div class="flex items-center justify-between px-6 h-20 border-b border-(--system-border)">
          <img src="@/assets/img/Logo.svg" class="h-10" />
          <button
            @click="mobileMenuOpen = false"
            class="p-2 text-(--text-headings) hover:bg-(--system-border) rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <!-- Mobile Content -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <template v-if="landing">
            <!-- Landing Navigation -->
            <div class="flex flex-col gap-6 text-xl font-medium text-(--text-headings)">
              <a
                @click="handleMobileNav('carrosel')"
                class="cursor-pointer hover:text-(--system-ring)"
                >Funcionalidades</a
              >
              <a
                @click="handleMobileNav('impacto')"
                class="cursor-pointer hover:text-(--system-ring)"
                >Impacto</a
              >
              <a
                @click="handleMobileNav('testemunhos')"
                class="cursor-pointer hover:text-(--system-ring)"
                >Testemunhos</a
              >
            </div>

            <!-- Landing Actions -->
            <div class="mt-auto flex flex-col gap-4">
              <button
                @click="handleMobileRoute('login')"
                class="w-full py-4 text-(--text-headings) font-bold border-2 border-(--system-border) rounded-xl hover:bg-(--system-border) transition-colors"
              >
                Entrar
              </button>
              <ActionButton
                @click="handleMobileRoute('register')"
                class="w-full justify-center py-4"
              >
                Registar
              </ActionButton>
            </div>
          </template>

          <template v-else>
            <!-- App Navigation -->
            <div class="flex flex-col gap-6 text-xl font-medium text-(--text-headings)">
              <a class="cursor-pointer hover:text-(--system-ring)">Estatisticas</a>
              <a class="cursor-pointer hover:text-(--system-ring)">Consumos</a>
              <a class="cursor-pointer hover:text-(--system-ring)">Tarefas</a>
              <a class="cursor-pointer hover:text-(--system-ring)">Ferramentas</a>
            </div>

            <!-- App Actions -->
            <div class="mt-auto border-t border-(--system-border) pt-6 flex flex-col gap-6">
              <!-- Dark Mode -->
              <button
                @click="toggleDarkMode"
                class="flex items-center justify-between w-full text-(--text-headings) hover:text-(--system-ring)"
              >
                <span class="text-lg">Modo Escuro</span>
                <span class="material-symbols-outlined text-2xl">
                  {{ isDark ? 'dark_mode' : 'light_mode' }}
                </span>
              </button>

              <!-- Profile Actions -->
              <div class="flex flex-col gap-4">
                <button
                  @click="handleMobileRoute('profile')"
                  class="flex items-center gap-3 text-(--text-headings)"
                >
                  <span class="material-symbols-outlined">person</span>
                  <span class="text-lg">Perfil</span>
                </button>
                <button
                  v-if="isAdmin"
                  @click="handleMobileRoute('admin')"
                  class="flex items-center gap-3 text-(--text-headings)"
                >
                  <span class="material-symbols-outlined">admin_panel_settings</span>
                  <span class="text-lg">Dashboard Admin</span>
                </button>
                <button
                  @click="handleMobileRoute('profile-selection')"
                  class="flex items-center gap-3 text-(--text-headings)"
                >
                  <span class="material-symbols-outlined">swap_horiz</span>
                  <span class="text-lg">Mudar Perfil</span>
                </button>
                <button
                  @click="logout"
                  class="flex items-center gap-3 text-(--semantic-error-default)"
                >
                  <span class="material-symbols-outlined">logout</span>
                  <span class="text-lg">Sair</span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
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
      mobileMenuOpen: false,
    }
  },
  props: {
    landing: {
      type: Boolean,
      default: true,
    },
    showGridSelector: {
      type: Boolean,
      default: false,
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
  watch: {
    mobileMenuOpen(isOpen) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
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
    document.body.style.overflow = ''
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
    handleMobileNav(sectionId) {
      this.mobileMenuOpen = false
      this.scrollToSection(sectionId)
    },
    handleMobileRoute(routeName) {
      this.mobileMenuOpen = false
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

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
