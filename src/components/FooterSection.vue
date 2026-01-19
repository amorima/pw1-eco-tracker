<template>
  <footer class="relative h-[800px] w-full overflow-hidden">
    <!-- Background with diagonal cut -->
    <div class="absolute inset-0 rotate-180">
      <div class="w-full h-full bg-(--system-foreground)"></div>
    </div>

    <!-- Content Container -->
    <div class="relative max-w-7xl mx-auto h-full px-6">
      <!-- Logo -->
      <div class="absolute left-[184px] top-[90px]">
        <img src="@/assets/img/Logo.svg" alt="b.green logo" class="h-[71px] w-[216px]" />
      </div>

      <!-- Navigation Links -->
      <div class="absolute left-[186px] top-[272px] flex gap-12 items-start">
        <!-- Auth Links -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[74px]">
          <a
            @click.prevent="$router.push({ name: 'login' })"
            class="hover:text-(--system-ring) transition-colors"
            >Login</a
          >
          <a
            @click.prevent="$router.push({ name: 'register' })"
            class="hover:text-(--system-ring) transition-colors"
            >Registar</a
          >
        </div>

        <!-- Funcionalidades -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[140px]">
          <h3 class="font-bold">Funcionalidades</h3>
          <a href="#como-funciona" class="hover:text-(--system-ring) transition-colors"
            >Como funciona</a
          >
          <a href="#impacto" class="hover:text-(--system-ring) transition-colors">Impacto</a>
          <a href="#testemunhos" class="hover:text-(--system-ring) transition-colors"
            >Testemunhos</a
          >
        </div>

        <!-- Ajuda -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[85px]">
          <h3 class="font-bold">Ajuda</h3>
          <a href="#faqs" class="hover:text-(--system-ring) transition-colors">FAQ</a>
          <a
            @click.prevent="$router.push({ name: 'about' })"
            class="hover:text-(--system-ring) transition-colors"
            >Sobre nós</a
          >
          <a
            @click.prevent="$router.push({ name: 'contacts' })"
            class="hover:text-(--system-ring) transition-colors"
            >Contactos</a
          >
        </div>

        <!-- Legal -->
        <div class="flex flex-col gap-6 text-body-base text-white w-[169px]">
          <a
            @click.prevent="$router.push({ name: 'terms' })"
            class="hover:text-(--system-ring) transition-colors"
            >Termos e condições</a
          >
          <a
            @click.prevent="$router.push({ name: 'privacy' })"
            class="hover:text-(--system-ring) transition-colors"
            >Política de privacidade</a
          >
          <a href="/cookies" class="hover:text-(--system-ring) transition-colors"
            >Política de cookies</a
          >
          <a href="/complaints" class="hover:text-(--system-ring) transition-colors"
            >Livro de reclamações</a
          >
          <a href="/payments" class="hover:text-(--system-ring) transition-colors"
            >Meios de pagamento</a
          >
        </div>
      </div>

      <!-- Social Media -->
      <div class="absolute left-[186px] top-[550px] flex flex-col gap-4">
        <h3 class="text-body-base font-bold text-white">Redes Sociais</h3>
        <div class="flex gap-4 items-center">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-[38px] h-[38px] hover:opacity-80 transition-opacity"
          >
            <img src="@/assets/img/icons/face.svg" alt="Facebook" class="w-full h-full" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-[38px] h-[38px] hover:opacity-80 transition-opacity"
          >
            <img src="@/assets/img/icons/insta.svg" alt="Instagram" class="w-full h-full" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-[38px] h-[38px] hover:opacity-80 transition-opacity"
          >
            <img src="@/assets/img/icons/youtube.svg" alt="YouTube" class="w-full h-full" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-[38px] h-[38px] hover:opacity-80 transition-opacity"
          >
            <img src="@/assets/img/icons/in.svg" alt="LinkedIn" class="w-full h-full" />
          </a>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="absolute left-[492px] top-[549px] flex flex-col gap-4 w-[140px]">
        <h3 class="text-body-base font-bold text-white">Pagamentos</h3>
        <div class="flex gap-4 items-center">
          <img src="@/assets/img/icons/mbway.svg" alt="MB Way" class="w-8 h-8" />
          <img src="@/assets/img/icons/googlepay.svg" alt="Google Pay" class="w-8 h-8" />
          <img src="@/assets/img/icons/applepay.svg" alt="Apple Pay" class="w-8 h-8" />
        </div>
      </div>

      <!-- Copyright -->
      <p class="absolute left-[186px] top-[718px] text-body-small text-(--system-ring)">
        All rights reserved © 2026 b.green
      </p>

      <!-- Footer Boy Image -->
      <div class="absolute -right-[50px] top-[224px] w-[544px] h-[544px]">
        <img
          src="@/assets/img/footer-boy.svg"
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
}
</script>
