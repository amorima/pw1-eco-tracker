<template>
  <MenuNav />
  <div class="pt-24 pb-24 flex flex-col items-center justify-center bg-white">
    <div class="flex gap-4 items-center justify-center w-full max-w-[1200px]">
      <!-- Left Form Section -->
      <div class="flex items-center justify-center flex-1">
        <div class="flex flex-col gap-8 items-start justify-center w-fit">
          <!-- Form Container -->
          <div class="flex flex-col gap-4 items-start justify-center w-full">
            <!-- Title and Fields -->
            <div class="flex flex-col gap-2 items-start w-full">
              <h1 class="text-[48px] font-bold leading-tight text-(--text-body-titles) text-center w-full" style="font-family: 'Clash Grotesk', sans-serif;">
                Login
              </h1>
              
              <FormInput
                v-model="formData.email"
                placeholder="Email"
                type="email"
              />
              
              <FormInput
                v-model="formData.password"
                placeholder="Password"
                type="password"
              />
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-center gap-1.5">
              <CheckboxInput v-model="formData.acceptTerms" />
              <div class="flex gap-1 items-center text-[10px] font-medium text-[#78716c]">
                <span>Aceito</span>
                <a @click.prevent="$router.push({name:'terms'})" class="underline hover:text-(--system-ring)">termos e condições</a>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 items-center w-full">
              <ActionButton 
                @click="$router.push({name:'register'})"
                :variant="'secondary'"
              >
                Não tem conta?
            </ActionButton>
              <ActionButton 
                @click="handleLogin"
              >
                Começar agora
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
            <button class="bg-white border border-(--system-border) rounded-lg flex gap-3 items-center justify-center px-1.5 py-2 w-full hover:bg-gray-50 transition-colors">
              <span class="material-symbols-outlined text-[19px]">account_circle</span>
              <span class="text-[11px] text-(--system-foreground)">Entrar com Google</span>
            </button>

            <!-- Facebook Button -->
            <button class="bg-white border border-(--system-border) rounded-lg flex gap-3 items-center justify-center px-1.5 py-2 w-full hover:bg-gray-50 transition-colors">
              <span class="material-symbols-outlined text-[19px] text-[#1877f2]">group</span>
              <span class="text-[11px] text-(--system-foreground)">Entrar com Facebook</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Image Section -->
      <div class="flex-1 flex items-start justify-center">
        <div class="relative w-[430px] h-[567px]">
          <img 
            src="../assets/login-art.jpg" 
            alt="Aurora background" 
            class="absolute inset-0 w-full h-full object-cover rounded-[13px]"
          />
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center text-center">
            <p class="text-[48px] font-bold leading-tight text-white m-0" style="font-family: 'Clash Grotesk', sans-serif; text-shadow: 0px 0px 25px rgba(0,0,0,0.51);">
              BE THE CHANGE,
            </p>
            <p class="text-[48px] font-bold leading-tight text-white m-0" style="font-family: 'Clash Grotesk', sans-serif; text-shadow: 0px 0px 25px rgba(0,0,0,0.51);">
              BE AWARE,
            </p>
            <img src="../assets/W_Logo.svg"/>
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
import CheckboxInput from '@/components/CheckboxInput.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LoginView',
  components: {
    MenuNav,
    FooterSection,
    FormInput,
    ActionButton,
    CheckboxInput,
  },
  data() {
    return {
      formData: {
        email: '',
        password: '',
        acceptTerms: false
      },
      error: '',
      store: useUserStore(),
    }
  },
  methods: {
    handleLogin() {
      if(this.store.logIn(this.formData)){
        this.$router.push({name:'profile-selection'})
      } else {
        this.error = 'Invalid Login' 
      }
    }
  }
}
</script>