<template>
  <MenuNav />

  <!-- Toast Notification -->
  <Transition name="slide-fade">
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <ToastNotification :variant="toastVariant" :message="toastMessage" />
    </div>
  </Transition>

  <div
    class="py-12 lg:py-24 flex flex-col items-center justify-center bg-(--system-background) min-h-[calc(100vh-80px)]"
  >
    <div
      class="flex flex-col lg:flex-row gap-4 items-center justify-center w-full max-w-[1200px] px-6 lg:px-0"
    >
      <!-- Left Form Section -->
      <div class="flex items-center justify-center w-full lg:flex-1">
        <div
          class="flex flex-col gap-8 items-start justify-center w-full max-w-[400px] lg:max-w-none lg:w-fit"
        >
          <!-- Form Container -->
          <div class="flex flex-col gap-4 items-start justify-center w-full">
            <!-- Title and Fields -->
            <div class="flex flex-col gap-2 items-start w-full">
              <h1
                class="text-4xl lg:text-[48px] font-bold leading-tight text-(--text-body-titles) text-center w-full"
                style="font-family: 'Clash Grotesk', sans-serif"
              >
                Registo
              </h1>

              <FormInput v-model="formData.name" placeholder="Nome" type="text" />

              <FormInput v-model="formData.email" placeholder="Email" type="email" />

              <FormInput v-model="formData.password" placeholder="Password" type="password" />

              <FormInput
                v-model="formData.confirmPassword"
                placeholder="Confirmar Password"
                type="password"
              />
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-center gap-1.5">
              <CheckboxInput v-model="formData.acceptTerms" />
              <div class="flex gap-1 items-center text-[10px] font-medium text-[#78716c]">
                <span>Aceito</span>
                <a
                  @click.prevent="$router.push({ name: 'terms' })"
                  class="underline hover:text-(--system-ring)"
                  >termos e condições</a
                >
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 items-center w-full">
              <ActionButton @click="$router.push({ name: 'login' })" :variant="'secondary'">
                Já tem conta?
              </ActionButton>
              <ActionButton
                @click="handleRegister"
                :disabled="isLoading"
                class="bg-(--system-ring) rounded-lg px-6 py-2.5 text-[10px] font-bold text-(--text-body-titles) hover:bg-(--system-popover-foreground) transition-colors"
              >
                {{ isLoading ? 'A criar conta...' : 'Criar Conta' }}
              </ActionButton>
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
      <div class="hidden lg:flex flex-1 items-start justify-center">
        <div class="relative w-[430px] h-[567px]">
          <img
            src="@/assets/img/register-art.jpg"
            alt="Aurora background"
            class="absolute inset-0 w-full h-full object-cover rounded-[13px]"
          />
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <p
              class="text-[48px] font-bold leading-tight text-white m-0"
              style="
                font-family: 'Clash Grotesk', sans-serif;
                text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.51);
              "
            >
              COMECE HOJE
            </p>
            <p
              class="text-[48px] font-bold leading-tight text-white m-0"
              style="
                font-family: 'Clash Grotesk', sans-serif;
                text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.51);
              "
            >
              A SALVAR
            </p>
            <p
              class="text-[48px] font-bold leading-tight text-white m-0"
              style="
                font-family: 'Clash Grotesk', sans-serif;
                text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.51);
              "
            >
              O PLANETA
            </p>
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
import CheckboxInput from '@/components/CheckboxInput.vue'
import ActionButton from '@/components/ActionButton.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'RegisterView',
  components: {
    MenuNav,
    FooterSection,
    FormInput,
    CheckboxInput,
    ActionButton,
    ToastNotification,
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      },
      store: useUserStore(),
      // Toast State
      showToast: false,
      toastMessage: '',
      toastVariant: 'success',
      isLoading: false,
    }
  },
  methods: {
    showNotification(message, variant = 'error') {
      this.toastMessage = message
      this.toastVariant = variant
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },
    async handleRegister() {
      // Validate terms acceptance
      if (!this.formData.acceptTerms) {
        this.showNotification('Deve aceitar os termos e condições', 'error')
        return
      }

      // Validate all fields are filled
      if (
        !this.formData.name ||
        !this.formData.email ||
        !this.formData.password ||
        !this.formData.confirmPassword
      ) {
        this.showNotification('Preencha todos os campos', 'error')
        return
      }

      this.isLoading = true

      // Attempt registration
      const result = await this.store.register(this.formData)

      this.isLoading = false

      if (result.success) {
        this.showNotification('Conta criada com sucesso!', 'success')
        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 1500)
      } else {
        this.showNotification(result.message || 'Erro ao criar conta', 'error')
      }
    },
  },
}
</script>
