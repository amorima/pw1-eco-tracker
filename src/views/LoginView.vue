<template>
  <MenuNav />

  <!-- Toast Notification -->
  <Transition name="slide-fade">
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <ToastNotification :variant="toastVariant" :message="toastMessage" />
    </div>
  </Transition>

  <div class="pt-24 pb-24 flex flex-col items-center justify-center bg-(--system-background)">
    <div class="flex gap-4 items-center justify-center w-full max-w-[1200px]">
      <!-- Left Form Section -->
      <div class="flex items-center justify-center flex-1">
        <div class="flex flex-col gap-8 items-start justify-center w-fit">
          <!-- Form Container -->
          <div class="flex flex-col gap-4 items-start justify-center w-full">
            <!-- Title and Fields -->
            <div class="flex flex-col gap-2 items-start w-full">
              <h1
                class="text-[48px] font-bold leading-tight text-(--text-body-titles) text-center w-full"
                style="font-family: 'Clash Grotesk', sans-serif"
              >
                Login
              </h1>

              <FormInput v-model="formData.email" placeholder="Email" type="email" />

              <FormInput v-model="formData.password" placeholder="Password" type="password" />
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 items-center w-full">
              <ActionButton @click="$router.push({ name: 'register' })" :variant="'secondary'">
                Não tem conta?
              </ActionButton>
              <ActionButton @click="handleLogin"> Começar agora </ActionButton>
            </div>
          </div>

          <!-- Social Sign In -->
          <div class="flex flex-col gap-4 items-start w-full">
            <!-- Divider -->
            <div class="flex gap-3 items-center justify-center px-0 py-1.5 w-full">
              <div class="flex-1 h-px bg-[#cfdfe2]"></div>
              <span class="text-[11px] text-[#294957]">ou</span>
              <div class="flex-1 h-px bg-[#cfdfe2]"></div>
            </div>

            <!-- Google Button -->
            <button
              class="bg-(--system-background) border border-(--system-border) rounded-lg flex gap-3 items-center justify-center px-1.5 py-2 w-full hover:bg-gray-50 transition-colors"
            >
              <img src="@/assets/img/icons/google.svg" alt="Google" class="w-[19px] h-[19px]" />
              <span class="text-[11px] text-(--system-foreground)">Entrar com Google</span>
            </button>

            <!-- Facebook Button -->
            <button
              class="bg-(--system-background) border border-(--system-border) rounded-lg flex gap-3 items-center justify-center px-1.5 py-2 w-full hover:bg-gray-50 transition-colors"
            >
              <img src="@/assets/img/icons/facebook.svg" alt="Facebook" class="w-[19px] h-[19px]" />
              <span class="text-[11px] text-(--system-foreground)">Entrar com Facebook</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Image Section -->
      <div class="flex-1 flex items-start justify-center">
        <div class="relative w-[430px] h-[567px]">
          <img
            src="../assets/img/login-art.jpg"
            alt="Aurora background"
            class="absolute inset-0 w-full h-full object-cover rounded-[13px]"
          />
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center text-center"
          >
            <p
              class="text-[48px] font-bold leading-tight text-white m-0"
              style="
                font-family: 'Clash Grotesk', sans-serif;
                text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.51);
              "
            >
              BE THE CHANGE,
            </p>
            <p
              class="text-[48px] font-bold leading-tight text-white m-0"
              style="
                font-family: 'Clash Grotesk', sans-serif;
                text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.51);
              "
            >
              BE AWARE,
            </p>
            <img src="../assets/img/W_Logo.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterSection />
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'
import FormInput from '@/components/FormInput.vue'
import ActionButton from '@/components/ActionButton.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LoginView',
  components: {
    MenuNav,
    FooterSection,
    FormInput,
    ActionButton,
    ToastNotification,
  },
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      showToast: false,
      toastMessage: '',
      toastVariant: 'error',
      store: useUserStore(),
    }
  },
  methods: {
    showToastMessage(message, variant = 'error') {
      this.toastMessage = message
      this.toastVariant = variant
      this.showToast = true

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },

    handleLogin() {
      // Validate fields
      if (!this.formData.email || !this.formData.password) {
        this.showToastMessage('Preencha todos os campos', 'error')
        return
      }

      // Attempt login
      const result = this.store.login({
        email: this.formData.email,
        password: this.formData.password,
      })

      if (result.success) {
        this.showToastMessage(result.message, 'success')

        // Redirect after short delay to show success message
        setTimeout(() => {
          if (result.requiresSetup) {
            this.$router.push({ name: 'quick-start' })
          } else if (result.autoSelectedProfile) {
            // Profile was auto-selected, go to home
            this.$router.push({ name: 'home' })
          } else {
            // User needs to select a profile
            this.$router.push({ name: 'profile-selection' })
          }
        }, 1000)
      } else {
        this.showToastMessage(result.message || 'Email ou password incorretos', 'error')
      }
    },
  },
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
