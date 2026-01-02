<template>
  <nav
    :class="[
      landing ? 'bg-(--system-foreground)' : '',
      'h-16 sm:h-18 md:h-20',
      'flex justify-center fixed top-0 left-0 w-full z-50',
      'transition-all duration-300',
    ]"
  >
    <div class="flex w-full max-w-7xl items-center px-3 sm:px-4 md:px-6 lg:px-[184px]">
      <!-- Logo -->
      <img
        @click="landing ? $router.push({ name: 'landing' }) : $router.push({ name: 'home' })"
        src="@/assets/img/Logo.svg"
        :class="['cursor-pointer transition-all', 'h-8 sm:h-9 md:h-10']"
        alt="Logo"
      />

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Desktop Menu -->
      <div
        :class="[
          'hidden lg:flex',
          'gap-2 xl:gap-3 2xl:gap-4',
          'items-center',
          'mr-2 xl:mr-3 2xl:mr-4',
        ]"
      >
        <template v-if="landing">
          <MenuButton
            :landing="true"
            @click="scrollToSection('carrosel')"
            :class="menuButtonClasses"
          >
            Funcionalidades
          </MenuButton>
          <MenuButton
            :landing="true"
            @click="scrollToSection('impacto')"
            :class="menuButtonClasses"
          >
            Impacto
          </MenuButton>
          <MenuButton
            :landing="true"
            @click="scrollToSection('testemunhos')"
            :class="menuButtonClasses"
          >
            Testemunhos
          </MenuButton>
        </template>

        <template v-else>
          <MenuButton :landing="false" :class="menuButtonClasses">Estatísticas</MenuButton>
          <MenuButton :landing="false" :class="menuButtonClasses">Consumos</MenuButton>
          <MenuButton :landing="false" :class="menuButtonClasses">Tarefas</MenuButton>
          <MenuButton :landing="false" :class="menuButtonClasses">Ferramentas</MenuButton>

          <!-- Icons Menu -->
          <div
            :class="['flex items-center', 'gap-2 xl:gap-3 2xl:gap-4', 'text-(--text-body-titles)']"
          >
            <!-- Dark Mode Toggle -->
            <span @click="toggleDarkMode" :class="iconClasses">
              {{ isDark ? 'dark_mode' : 'light_mode' }}
            </span>

            <!-- Grid Icon -->
            <span :class="iconClasses"> grid_on </span>

            <!-- User Menu -->
            <div class="relative">
              <span @click="toggleDropdown" :class="iconClasses"> account_circle </span>

              <!-- Dropdown Menu -->
              <div
                v-if="dropdownOpen"
                @click.stop
                :class="[
                  'absolute right-0 mt-2',
                  'w-48 xl:w-56 2xl:w-64',
                  'bg-(--system-background,white)',
                  'border-2 border-(--system-border,#e7e5e4)',
                  'rounded-(--border-radius-lg,10px)',
                  'shadow-lg z-50',
                  'overflow-hidden',
                ]"
              >
                <div class="py-1 xl:py-2 2xl:py-3">
                  <button @click="navigateTo('profile')" :class="dropdownItemClasses">
                    <span :class="dropdownIconClasses">person</span>
                    <span>Perfil</span>
                  </button>

                  <button v-if="isAdmin" @click="navigateTo('admin')" :class="dropdownItemClasses">
                    <span :class="dropdownIconClasses">admin_panel_settings</span>
                    <span>Dashboard Admin</span>
                  </button>

                  <button @click="switchProfile" :class="dropdownItemClasses">
                    <span :class="dropdownIconClasses">swap_horiz</span>
                    <span>Mudar Perfil</span>
                  </button>

                  <div class="border-t border-(--system-border,#e7e5e4) my-1"></div>

                  <button
                    @click="logout"
                    :class="[
                      'w-full text-left',
                      'px-3 py-2 xl:px-4 xl:py-2.5 2xl:px-5 2xl:py-3',
                      'text-sm xl:text-base 2xl:text-lg',
                      'text-(--semantic-error-default,#dc2626)',
                      'hover:bg-(--system-input-background,#f5f5f4)',
                      'transition-colors',
                      'flex items-center',
                      'gap-2 xl:gap-3 2xl:gap-4',
                    ]"
                  >
                    <span :class="dropdownIconClasses">logout</span>
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- AOD -->
      <div class="flex items-center gap-2 sm:gap-3 md:gap-4">
        <MenuButton
          @click="$router.push({ name: 'login' })"
          :landing="true"
          :class="menuButtonClasses"
        >
          Entrar
        </MenuButton>
        <ActionButton @click="$router.push({ name: 'register' })" :class="actionButtonClasses">
          Registar
        </ActionButton>
        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          :class="[
            'lg:hidden',
            'p-1.5 sm:p-2 rounded-lg',
            'text-(--text-body-titles)',
            'hover:bg-opacity-10 hover:bg-gray-500',
            'transition-colors',
            'text-white',
            'ml-1 sm:ml-2',
          ]"
        >
          <span class="material-symbols-outlined text-xl sm:text-2xl md:text-3xl">
            {{ mobileMenuOpen ? 'close' : 'drag_handle' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        :class="[
          'lg:hidden',
          'absolute top-full left-0 right-0',
          'bg-(--system-foreground)',
          'border-t border-(--system-border,#e7e5e4)',
          'shadow-lg',
          'py-4 sm:py-5 md:py-6',
          'px-3 sm:px-4 md:px-6',
          'max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-4.5rem)] md:max-h-[calc(100vh-5rem)]',
          'overflow-y-auto',
        ]"
      >
        <div class="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
          <template v-if="landing">
            <button
              @click="handleMobileClick(() => scrollToSection('carrosel'))"
              :class="[mobileMenuItemClasses, 'text-white']"
            >
              Funcionalidades
            </button>
            <button
              @click="handleMobileClick(() => scrollToSection('impacto'))"
              :class="[mobileMenuItemClasses, 'text-white']"
            >
              Impacto
            </button>
            <button
              @click="handleMobileClick(() => scrollToSection('testemunhos'))"
              :class="[mobileMenuItemClasses, 'text-white']"
            >
              Testemunhos
            </button>
          </template>

          <template v-else>
            <button :class="mobileMenuItemClasses">Estatísticas</button>
            <button :class="mobileMenuItemClasses">Consumos</button>
            <button :class="mobileMenuItemClasses">Tarefas</button>
            <button :class="mobileMenuItemClasses">Ferramentas</button>

            <div class="border-t border-(--system-border,#e7e5e4) my-1 sm:my-1.5 md:my-2"></div>

            <button
              @click="toggleDarkMode"
              :class="[mobileMenuItemClasses, 'flex items-center gap-2.5 sm:gap-3']"
            >
              <span class="material-symbols-outlined text-xl sm:text-2xl">
                {{ isDark ? 'dark_mode' : 'light_mode' }}
              </span>
              <span>{{ isDark ? 'Modo Escuro' : 'Modo Claro' }}</span>
            </button>

            <button
              @click="handleMobileClick(() => navigateTo('profile'))"
              :class="[mobileMenuItemClasses, 'flex items-center gap-2.5 sm:gap-3']"
            >
              <span class="material-symbols-outlined text-xl sm:text-2xl">person</span>
              <span>Perfil</span>
            </button>

            <button
              v-if="isAdmin"
              @click="handleMobileClick(() => navigateTo('admin'))"
              :class="[mobileMenuItemClasses, 'flex items-center gap-2.5 sm:gap-3']"
            >
              <span class="material-symbols-outlined text-xl sm:text-2xl"
                >admin_panel_settings</span
              >
              <span>Dashboard Admin</span>
            </button>

            <button
              @click="handleMobileClick(switchProfile)"
              :class="[mobileMenuItemClasses, 'flex items-center gap-2.5 sm:gap-3']"
            >
              <span class="material-symbols-outlined text-xl sm:text-2xl">swap_horiz</span>
              <span>Mudar Perfil</span>
            </button>

            <button
              @click="handleMobileClick(logout)"
              :class="[
                mobileMenuItemClasses,
                'flex items-center gap-2.5 sm:gap-3',
                'text-(--semantic-error-default,#dc2626)',
              ]"
            >
              <span class="material-symbols-outlined text-xl sm:text-2xl">logout</span>
              <span>Sair</span>
            </button>
          </template>
        </div>
      </div>
    </transition>
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
      dropdownOpen: false,
      mobileMenuOpen: false,
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
    // Responsive classes for menu buttons
    menuButtonClasses() {
      return 'text-xs sm:text-sm lg:text-sm xl:text-base 2xl:text-lg'
    },
    actionButtonClasses() {
      return 'text-sm xl:text-base 2xl:text-lg px-4 py-2 xl:px-6 xl:py-2.5 2xl:px-8 2xl:py-3'
    },
    iconClasses() {
      return [
        'material-symbols-outlined',
        'cursor-pointer',
        'hover:opacity-80',
        'transition-opacity',
        'text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl',
      ]
    },
    dropdownItemClasses() {
      return [
        'w-full text-left',
        'px-3 py-2 xl:px-4 xl:py-2.5 2xl:px-5 2xl:py-3',
        'text-sm xl:text-base 2xl:text-lg',
        'text-(--text-headings,#1c1917)',
        'hover:bg-(--system-input-background,#f5f5f4)',
        'transition-colors',
        'flex items-center',
        'gap-2 xl:gap-3 2xl:gap-4',
      ]
    },
    dropdownIconClasses() {
      return 'material-symbols-outlined text-xl xl:text-2xl 2xl:text-3xl'
    },
    mobileMenuItemClasses() {
      return [
        'w-full text-left',
        'px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3',
        'text-sm sm:text-base md:text-lg',
        'text-(--text-headings)',
        'hover:bg-(--system-input-background,#f5f5f4)',
        'rounded-lg',
        'transition-colors',
      ]
    },
  },
  mounted() {
    // Load dark mode preference from localStorage
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
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    handleClickOutside(event) {
      const dropdown = event.target.closest('.relative')
      if (!dropdown) {
        this.dropdownOpen = false
      }

      // Close mobile menu when clicking outside
      if (this.mobileMenuOpen && !event.target.closest('nav')) {
        this.mobileMenuOpen = false
      }
    },
    handleMobileClick(callback) {
      this.mobileMenuOpen = false
      callback()
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
