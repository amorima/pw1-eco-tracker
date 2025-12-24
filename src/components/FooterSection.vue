<template>
  <footer class="relative h-[895px] w-full overflow-hidden">
    <!-- Background with diagonal cut -->
    <div class="absolute inset-0 rotate-180" style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 80px), 0 100%)">
      <div class="w-full h-full bg-(--system-foreground)"></div>
    </div>

    <!-- Content Container -->
    <div class="relative max-w-7xl mx-auto h-full px-6">
      <!-- Logo -->
      <div class="absolute left-[184px] top-[190px]">
        <img src="@/assets/logo.svg" alt="b.green logo" class="h-[71px] w-[216px]" />
      </div>

      <!-- Navigation Links -->
      <div class="absolute left-[186px] top-[372px] flex gap-12 items-start">
        <!-- Auth Links -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[74px]">
          <a href="/login" class="hover:text-(--system-ring) transition-colors">Login</a>
          <a href="/register" class="hover:text-(--system-ring) transition-colors">Registar</a>
        </div>

        <!-- Funcionalidades -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[140px]">
          <h3 class="font-bold">Funcionalidades</h3>
          <a href="#como-funciona" class="hover:text-(--system-ring) transition-colors">Como funciona</a>
          <a href="#impacto" class="hover:text-(--system-ring) transition-colors">Impacto</a>
          <a href="#testemunhos" class="hover:text-(--system-ring) transition-colors">Testemunhos</a>
        </div>

        <!-- Ajuda -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[85px]">
          <h3 class="font-bold">Ajuda</h3>
          <a href="/faq" class="hover:text-(--system-ring) transition-colors">FAQ</a>
          <a href="/about" class="hover:text-(--system-ring) transition-colors">Sobre nós</a>
          <a href="/contacts" class="hover:text-(--system-ring) transition-colors">Contactos</a>
        </div>

        <!-- Legal -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[169px]">
          <a href="/terms" class="hover:text-(--system-ring) transition-colors">Termos e condições</a>
          <a href="/privacy" class="hover:text-(--system-ring) transition-colors">Política de privacidade</a>
          <a href="/cookies" class="hover:text-(--system-ring) transition-colors">Política de cookies</a>
          <a href="/complaints" class="hover:text-(--system-ring) transition-colors">Livro de reclamações</a>
          <a href="/payments" class="hover:text-(--system-ring) transition-colors">Meios de pagamento</a>
        </div>
      </div>

      <!-- Social Media -->
      <div class="absolute left-[186px] top-[650px] flex flex-col gap-4">
        <h3 class="text-body-base font-bold text-white">Redes Sociais</h3>
        <div class="flex gap-4 items-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-[38px] h-[38px] hover:opacity-80 transition-opacity">
            facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-[38px] h-[38px] hover:opacity-80 transition-opacity">
            instagram
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-[38px] h-[38px] hover:opacity-80 transition-opacity">
            youtube
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="w-[38px] h-[38px] hover:opacity-80 transition-opacity">
            liunkdin
          </a>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="absolute left-[492px] top-[649px] flex flex-col gap-4 w-[140px]">
        <h3 class="text-body-base font-bold text-white">Pagamentos</h3>
        <div class="flex gap-4 items-center">
          <div class="w-8 h-8">
            moneyu
          </div>
          <div class="w-8 h-8">
            money
          </div>
          <div class="w-8 h-8">
            money
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <p class="absolute left-[186px] top-[818px] text-body-small text-(--system-ring)">
        All rights reserved © 2026 b.green
      </p>

      <!-- Scroll to Top Button -->
      <button
        @click="scrollToTop"
        :class="[
          'absolute left-[50px] top-[795px] w-[50px] h-[50px] rounded-(--border-radius-xl) flex items-center justify-center transition-all duration-200',
          isHovered ? 'bg-(--system-popover-foreground)' : 'bg-(--system-ring)'
        ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        aria-label="Scroll to top"
      >
        <span class="material-symbols-outlined text-[34px] text-(--system-foreground)">arrow_upward</span>
      </button>

      <!-- Footer Boy Image -->
      <div class="absolute -right-[180px] top-[324px] w-[544px] h-[544px]">
        <img 
          src="../assets/footer-boy.svg" 
          alt="Young man recycling" 
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
  data() {
    return {
      isHovered: false
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
