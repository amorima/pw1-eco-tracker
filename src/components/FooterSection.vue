<template>
  <footer
    class="relative w-full min-h-screen lg:h-screen flex flex-col bg-(--system-foreground) overflow-hidden"
  >
    <!-- Background -->
    <div class="absolute inset-0 rotate-180 pointer-events-none">
      <div class="w-full h-full bg-(--system-foreground)"></div>
    </div>

    <!-- Content Container -->
    <div
      class="relative z-10 w-full max-w-[1440px] mx-auto h-full px-6 py-16 lg:py-0 flex flex-col justify-center flex-grow"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">
        <!-- Left Content (Span 7) -->
        <div class="lg:col-span-7 flex flex-col h-full justify-center pl-0 lg:pl-[120px]">
          <!-- Logo -->
          <div class="mb-12 lg:mb-16">
            <img
              src="@/assets/img/Logo.svg"
              alt="b.green logo"
              class="h-[50px] lg:h-[71px] w-auto"
            />
          </div>

          <!-- Navigation Links -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 mb-12 lg:mb-20 text-white">
            <!-- Auth -->
            <div class="flex flex-col gap-4">
              <a
                @click.prevent="$router.push({ name: 'login' })"
                class="hover:text-(--system-ring) transition-colors cursor-pointer"
                >Login</a
              >
              <a
                @click.prevent="$router.push({ name: 'register' })"
                class="hover:text-(--system-ring) transition-colors cursor-pointer"
                >Registar</a
              >
            </div>

            <!-- Funcionalidades -->
            <div class="flex flex-col gap-4">
              <h3 class="font-bold text-lg">Funcionalidades</h3>
              <a href="#como-funciona" class="hover:text-(--system-ring) transition-colors"
                >Como funciona</a
              >
              <a href="#impacto" class="hover:text-(--system-ring) transition-colors">Impacto</a>
              <a href="#testemunhos" class="hover:text-(--system-ring) transition-colors"
                >Testemunhos</a
              >
            </div>

            <!-- Ajuda -->
            <div class="flex flex-col gap-4">
              <h3 class="font-bold text-lg">Ajuda</h3>
              <a href="#faqs" class="hover:text-(--system-ring) transition-colors">FAQ</a>
              <a
                @click.prevent="$router.push({ name: 'about' })"
                class="hover:text-(--system-ring) transition-colors cursor-pointer"
                >Sobre nós</a
              >
              <a
                @click.prevent="$router.push({ name: 'contacts' })"
                class="hover:text-(--system-ring) transition-colors cursor-pointer"
                >Contactos</a
              >
            </div>

            <!-- Legal -->
            <div class="flex flex-col gap-4">
              <a
                @click.prevent="$router.push({ name: 'terms' })"
                class="hover:text-(--system-ring) transition-colors cursor-pointer"
                >Termos e condições</a
              >
              <a
                @click.prevent="$router.push({ name: 'privacy' })"
                class="hover:text-(--system-ring) transition-colors cursor-pointer"
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

          <!-- Social & Payments -->
          <div class="flex flex-col sm:flex-row gap-10 sm:gap-20 mb-12 lg:mb-24">
            <!-- Social -->
            <div class="flex flex-col gap-4">
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

            <!-- Payments -->
            <div class="flex flex-col gap-4">
              <h3 class="text-body-base font-bold text-white">Pagamentos</h3>
              <div class="flex gap-4 items-center">
                <img src="@/assets/img/icons/mbway.svg" alt="MB Way" class="w-8 h-8" />
                <img src="@/assets/img/icons/googlepay.svg" alt="Google Pay" class="w-8 h-8" />
                <img src="@/assets/img/icons/applepay.svg" alt="Apple Pay" class="w-8 h-8" />
              </div>
            </div>
          </div>

          <!-- Copyright -->
          <p class="text-body-small text-(--system-ring)">All rights reserved © 2026 b.green</p>
        </div>

        <!-- Right Image (Span 5) -->
        <div class="hidden lg:block lg:col-span-5 relative h-full">
          <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-full max-w-[600px]">
            <img
              src="@/assets/img/footer-boy.svg"
              alt="Young man recycling"
              class="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
}
</script>
