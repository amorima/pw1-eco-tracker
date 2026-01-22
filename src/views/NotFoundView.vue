<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="true" />

    <div class="max-w-[1280px] mx-auto px-6 lg:px-[186px] py-8">
      <!-- 404 Image -->
      <div class="flex justify-center mt-8 lg:mt-[48px]">
        <img
          src="@/assets/img/404.png"
          alt="404 Error"
          class="w-full max-w-[400px] lg:max-w-[600px] h-auto object-contain"
        />
      </div>

      <!-- Error Message -->
      <div class="text-center mt-12 lg:mt-[112px] mb-12 lg:mb-0">
        <h1
          class="font-['Clash_Grotesk'] font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[1.25] uppercase text-(--system-ring)"
        >
          OOPS! ACONTECEU UM PROBLEMA!
        </h1>

        <!-- Action Buttons -->
        <div class="flex gap-4 items-center justify-center mt-8 lg:mt-[40px]">
          <button
            @click="goBack"
            class="border-2 border-(--system-ring) flex items-center justify-center px-[11px] py-0 h-[50px] w-[110px] rounded-[14px] cursor-pointer hover:opacity-90"
          >
            <p class="font-['Noto_Sans'] font-bold text-[16px] leading-[1.5] text-(--system-ring)">
              Voltar
            </p>
          </button>

          <button
            @click="goHome"
            class="bg-(--system-ring) flex items-center justify-center px-[29px] py-[13px] h-[50px] w-[110px] rounded-[14px] cursor-pointer hover:opacity-90"
          >
            <p
              class="font-['Noto_Sans'] font-bold text-[16px] leading-[1.5] text-(--system-foreground)"
            >
              Home
            </p>
          </button>
        </div>
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'

export default {
  name: 'NotFoundView',
  components: {
    MenuNav,
    FooterSection,
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>
