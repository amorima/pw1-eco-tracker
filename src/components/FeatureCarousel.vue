<template>
  <div class="h-[442px] w-full max-w-[912px] mx-auto relative overflow-visible bg-white">
    <!-- Carousel Container: inner wrapper stays clipped so slides don't overflow -->
    <div class="overflow-hidden h-full w-full">
      <div class="flex transition-transform duration-500 ease-in-out h-full" 
           :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      
      <div class="min-w-full h-full flex items-center justify-center px-6 lg:px-[99px] py-[29px]">
        <div class="flex gap-[61px] items-center w-full max-w-[714px]">
          <div class="bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative">
            <div class="absolute w-[336px] h-[505px] -left-[71px] -top-[77px]">
              <img 
                src="@/assets/phone.svg"
                alt="Chart and statistics on phone" 
                class="w-full h-full object-contain"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 max-w-[367px]">
            <div class="space-y-0">
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">Estatísticas</h2>
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">Detalhadas</h2>
            </div>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Visualize padrões de consumo com gráficos intuitivos
            </p>
          </div>
        </div>
      </div>

      <!-- Slide 2: Sustainable Tasks -->
      <div class="min-w-full h-full flex items-center justify-center px-6 lg:px-[99px] py-[29px]">
        <div class="flex gap-[61px] items-center w-full max-w-[714px]">
          <div class="bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative">
            <div class="absolute w-[388px] h-[388px] left-1/2 top-0 -translate-x-1/2">
              <img 
                src="@/assets/recycling-earth.svg"
                alt="Recycling earth" 
                class="w-full h-full object-contain"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 max-w-[367px]">
            <div class="space-y-0">
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">Tarefas</h2>
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">sustentáveis</h2>
            </div>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Calendário de atividades eco-friendly para toda a família
            </p>
          </div>
        </div>
      </div>

      <!-- Slide 3: Device Management -->
      <div class="min-w-full h-full flex items-center justify-center px-6 lg:px-[99px] py-[29px]">
        <div class="flex gap-[61px] items-center w-full max-w-[714px]">
          <div class="bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative">
            <div class="absolute w-[239px] h-[316px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img 
                src="@/assets/fridge.svg"
                alt="Fridge" 
                class="w-[144%] h-[109%] object-contain -top-[4%] absolute"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 max-w-[367px]">
            <div class="space-y-0">
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">Gestão de</h2>
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">aparelhos</h2>
            </div>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Monitorize cada eletrodoméstico individualmente
            </p>
          </div>
        </div>
      </div>

      <!-- Slide 4: Impact Calculator -->
      <div class="min-w-full h-full flex items-center justify-center px-6 lg:px-[99px] py-[29px]">
        <div class="flex gap-[61px] items-center w-full max-w-[714px]">
          <div class="bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative">
            <div class="absolute w-[404px] h-[404px] -left-[100px] top-0">
              <img 
                src="@/assets/calculator.svg"
                alt="Finance growth with calculator and coins" 
                class="w-full h-full object-contain"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 max-w-[367px]">
            <div class="space-y-0">
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">Calculadora</h2>
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">de impacto</h2>
            </div>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Estime pegada de CO₂, energia e consumo de água
            </p>
          </div>
        </div>
      </div>

      <!-- Slide 5: Gamification -->
      <div class="min-w-full h-full flex items-center justify-center px-6 lg:px-[99px] py-[29px]">
        <div class="flex gap-[61px] items-center w-full max-w-[714px]">
          <div class="bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative">
            <div class="absolute w-[355px] h-[455px] -top-9">
              <img 
                src="@/assets/prize.svg"
                alt="Gaming prize" 
                class="w-[80%] h-[80%] object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 max-w-[367px]">
            <h2 class="text-display-xl text-(--text-body-titles) leading-none">Divertido</h2>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Emblemas, níveis e desafios para motivar hábitos sustentáveis
            </p>
          </div>
        </div>
      </div>

      <!-- Slide 6: Family Profiles -->
      <div class="min-w-full h-full flex items-center justify-center px-6 lg:px-[99px] py-[29px]">
        <div class="flex gap-[61px] items-center w-full max-w-[714px]">
          <div class="bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative">
            <div class="absolute w-[324px] h-[324px] top-[31px]">
              <img 
                src="@/assets/person.svg"
                alt="Profile picture of person in glasses" 
                class="w-full h-full object-contain"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 max-w-[367px]">
            <div class="space-y-0">
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">Perfis</h2>
              <h2 class="text-display-xl text-(--text-body-titles) leading-none">familiares</h2>
            </div>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Acompanhe o progresso de cada membro da família
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Navigation Arrows (outside clipped inner wrapper) -->
    <div class="absolute inset-0 flex items-center justify-between pointer-events-none">
      <button
        @click="previousSlide"
        class="pointer-events-auto -ml-10 w-12 h-12 rounded-full border-2 border-(--system-ring) bg-white flex items-center justify-center text-(--system-ring) hover:bg-(--system-ring) hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="material-symbols-outlined text-xl">arrow_back</span>
      </button>

      <button
        @click="nextSlide"

        class="pointer-events-auto -mr-10 w-12 h-12 rounded-full border-2 border-(--system-ring) bg-white flex items-center justify-center text-(--system-ring) hover:bg-(--system-ring) hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </div>

    <!-- Dots Indicator -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(slide, index) in totalSlides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-2 h-2 rounded-full transition-colors',
          currentSlide === index 
            ? 'bg-(--system-ring)' 
            : 'bg-gray-300 hover:bg-gray-400'
        ]"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureCarousel',
  data() {
    return {
      currentSlide: 0,
      totalSlides: 6,
      autoplayInterval: null
    }
  },

  methods: {
    nextSlide() {
      if (this.currentSlide < this.totalSlides - 1) {
        this.currentSlide++
      } else {
        this.currentSlide = 0 // Loop back to first slide
      }
    },
    previousSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--
      } else {
        this.currentSlide = this.totalSlides - 1 // Loop to last slide
      }
    },
    goToSlide(index) {
      this.currentSlide = index
    },
  }
}
</script>

<style scoped>
</style>