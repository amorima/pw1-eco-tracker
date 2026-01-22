<template>
  <div
    class="h-auto lg:h-[442px] w-full max-w-[912px] mx-auto relative overflow-visible bg-(--system-background) flex flex-col justify-center"
  >
    <!-- Carousel Container: inner wrapper stays clipped so slides don't overflow -->
    <div
      class="overflow-hidden h-full w-full"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      style="touch-action: pan-y"
    >
      <div
        class="flex transition-transform duration-500 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          class="min-w-full flex items-center justify-center px-4 sm:px-6 lg:px-[99px] py-20 lg:py-[29px]"
        >
          <div
            class="flex flex-col lg:flex-row gap-2 lg:gap-[61px] items-center w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[714px]"
          >
            <div
              class="scale-[0.6] sm:scale-75 -my-12 sm:-my-10 lg:my-0 lg:scale-100 bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative shrink-0"
            >
              <div
                class="absolute w-[336px] h-[505px] left-1/2 -translate-x-1/2 -top-[77px] lg:translate-x-0 lg:-left-[71px]"
              >
                <img
                  src="@/assets/img/phone.svg"
                  alt="Chart and statistics on phone"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-3 max-w-full lg:max-w-[367px] text-center lg:text-left pb-6 lg:pb-0"
            >
              <div class="space-y-0">
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  Estatísticas
                </h2>
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  Detalhadas
                </h2>
              </div>
              <p
                class="text-lg lg:text-xl font-semibold text-(--text-body-sub-titles) leading-relaxed"
              >
                Visualize padrões de consumo com gráficos intuitivos
              </p>
            </div>
          </div>
        </div>

        <!-- Slide 2: Sustainable Tasks -->
        <div
          class="min-w-full flex items-center justify-center px-4 sm:px-6 lg:px-[99px] py-20 lg:py-[29px]"
        >
          <div
            class="flex flex-col lg:flex-row gap-2 lg:gap-[61px] items-center w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[714px]"
          >
            <div
              class="scale-[0.6] sm:scale-75 -my-12 sm:-my-10 lg:my-0 lg:scale-100 bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative shrink-0"
            >
              <div class="absolute w-[388px] h-[388px] left-1/2 top-0 -translate-x-1/2">
                <img
                  src="@/assets/img/recycling-earth.svg"
                  alt="Recycling earth"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-3 max-w-full lg:max-w-[367px] text-center lg:text-left pb-6 lg:pb-0"
            >
              <div class="space-y-0">
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  Tarefas
                </h2>
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  sustentáveis
                </h2>
              </div>
              <p
                class="text-lg lg:text-xl font-semibold text-(--text-body-sub-titles) leading-relaxed"
              >
                Calendário de atividades eco-friendly para toda a família
              </p>
            </div>
          </div>
        </div>

        <!-- Slide 3: Device Management -->
        <div
          class="min-w-full flex items-center justify-center px-4 sm:px-6 lg:px-[99px] py-20 lg:py-[29px]"
        >
          <div
            class="flex flex-col lg:flex-row gap-2 lg:gap-[61px] items-center w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[714px]"
          >
            <div
              class="scale-[0.6] sm:scale-75 -my-12 sm:-my-10 lg:my-0 lg:scale-100 bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative shrink-0"
            >
              <div
                class="absolute w-[239px] h-[316px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src="@/assets/img/fridge.svg"
                  alt="Fridge"
                  class="w-[144%] h-[109%] object-contain -top-[4%] absolute"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-3 max-w-full lg:max-w-[367px] text-center lg:text-left pb-6 lg:pb-0"
            >
              <div class="space-y-0">
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  Gestão de
                </h2>
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  aparelhos
                </h2>
              </div>
              <p
                class="text-lg lg:text-xl font-semibold text-(--text-body-sub-titles) leading-relaxed"
              >
                Monitorize cada eletrodoméstico individualmente
              </p>
            </div>
          </div>
        </div>

        <!-- Slide 4: Impact Calculator -->
        <div
          class="min-w-full flex items-center justify-center px-4 sm:px-6 lg:px-[99px] py-20 lg:py-[29px]"
        >
          <div
            class="flex flex-col lg:flex-row gap-2 lg:gap-[61px] items-center w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[714px]"
          >
            <div
              class="scale-[0.6] sm:scale-75 -my-12 sm:-my-10 lg:my-0 lg:scale-100 bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative shrink-0"
            >
              <div
                class="absolute w-[404px] h-[404px] left-1/2 -translate-x-1/2 top-0 lg:translate-x-0 lg:-left-[100px]"
              >
                <img
                  src="@/assets/img/calculator.svg"
                  alt="Finance growth with calculator and coins"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-3 max-w-full lg:max-w-[367px] text-center lg:text-left pb-6 lg:pb-0"
            >
              <div class="space-y-0">
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  Calculadora
                </h2>
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  de impacto
                </h2>
              </div>
              <p
                class="text-lg lg:text-xl font-semibold text-(--text-body-sub-titles) leading-relaxed"
              >
                Estime pegada de CO₂, energia e consumo de água
              </p>
            </div>
          </div>
        </div>

        <!-- Slide 5: Gamification -->
        <div
          class="min-w-full flex items-center justify-center px-4 sm:px-6 lg:px-[99px] py-20 lg:py-[29px]"
        >
          <div
            class="flex flex-col lg:flex-row gap-2 lg:gap-[61px] items-center w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[714px]"
          >
            <div
              class="scale-[0.6] sm:scale-75 -my-12 sm:-my-10 lg:my-0 lg:scale-100 bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative shrink-0"
            >
              <div
                class="absolute w-[355px] h-[455px] -top-9 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-0"
              >
                <img
                  src="@/assets/img/prize.svg"
                  alt="Gaming prize"
                  class="w-[80%] h-[80%] object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-3 max-w-full lg:max-w-[367px] text-center lg:text-left pb-6 lg:pb-0"
            >
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
              >
                Divertido
              </h2>
              <p
                class="text-lg lg:text-xl font-semibold text-(--text-body-sub-titles) leading-relaxed"
              >
                Emblemas, níveis e desafios para motivar hábitos sustentáveis
              </p>
            </div>
          </div>
        </div>

        <!-- Slide 6: Family Profiles -->
        <div
          class="min-w-full flex items-center justify-center px-4 sm:px-6 lg:px-[99px] py-20 lg:py-[29px]"
        >
          <div
            class="flex flex-col lg:flex-row gap-2 lg:gap-[61px] items-center w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[714px]"
          >
            <div
              class="scale-[0.6] sm:scale-75 -my-12 sm:-my-10 lg:my-0 lg:scale-100 bg-(--system-ring) h-[385px] w-[265px] rounded-(--border-radius-xl) flex items-center justify-center relative shrink-0"
            >
              <div
                class="absolute w-[324px] h-[324px] top-[31px] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-0"
              >
                <img
                  src="@/assets/img/person.svg"
                  alt="Profile picture of person in glasses"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-3 max-w-full lg:max-w-[367px] text-center lg:text-left pb-6 lg:pb-0"
            >
              <div class="space-y-0">
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  Perfis
                </h2>
                <h2
                  class="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-body-titles) leading-none"
                >
                  familiares
                </h2>
              </div>
              <p
                class="text-lg lg:text-xl font-semibold text-(--text-body-sub-titles) leading-relaxed"
              >
                Acompanhe o progresso de cada membro da família
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows (outside clipped inner wrapper) -->
    <div
      class="hidden lg:flex absolute inset-0 items-center justify-between pointer-events-none z-20"
    >
      <button
        @click="previousSlide"
        class="pointer-events-auto lg:-ml-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-(--system-ring) bg-(--system-background) flex items-center justify-center text-(--system-ring) hover:bg-(--system-ring) hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-xl">arrow_back</span>
      </button>

      <button
        @click="nextSlide"
        class="pointer-events-auto lg:-mr-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-(--system-ring) bg-(--system-background) flex items-center justify-center text-(--system-ring) hover:bg-(--system-ring) hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </div>

    <!-- Dots Indicator -->
    <div class="absolute bottom-0 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      <button
        v-for="(slide, index) in totalSlides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-2 h-2 rounded-full transition-colors',
          currentSlide === index ? 'bg-(--system-ring)' : 'bg-gray-300 hover:bg-gray-400',
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
      autoplayInterval: null,
      touchStartX: 0,
      touchEndX: 0,
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
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX
    },
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX
      if (this.touchEndX < this.touchStartX - 50) {
        this.nextSlide()
      } else if (this.touchEndX > this.touchStartX + 50) {
        this.previousSlide()
      }
    },
  },
}
</script>

<style scoped></style>
