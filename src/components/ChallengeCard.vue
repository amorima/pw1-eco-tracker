<template>
  <div
    @click="openDetails"
    :class="[
      'flex flex-col gap-3 p-4 relative rounded-[14px] transition-all duration-200 cursor-pointer group h-full min-h-[140px] border-2',
      active
        ? 'bg-(--system-ring) border-(--system-ring) shadow-md text-white'
        : 'bg-(--system-card) border-(--system-border) hover:border-(--system-ring) hover:shadow-sm',
    ]"
  >
    <!-- Admin buttons -->
    <div v-if="adminMode" class="absolute top-2 right-2 flex gap-1 z-10">
      <button
        @click.stop="$emit('edit')"
        class="p-1 rounded-md bg-(--system-input-background) hover:bg-(--system-border) transition-colors"
        title="Editar"
      >
        <span class="material-symbols-outlined text-[18px] text-(--text-body-sub-titles)"
          >edit</span
        >
      </button>
      <button
        @click.stop="$emit('delete')"
        class="p-1 rounded-md bg-(--system-input-background) hover:bg-(--semantic-danger-hover) transition-colors"
        title="Eliminar"
      >
        <span class="material-symbols-outlined text-[18px] text-(--semantic-danger-default)"
          >delete</span
        >
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1 w-full flex-grow">
      <h3
        :class="[
          'font-[\'Noto_Sans\'] font-bold text-lg leading-tight line-clamp-1',
          active ? 'text-white' : 'text-(--text-body-titles)',
        ]"
        :title="title"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'font-[\'Noto_Sans\'] text-sm leading-relaxed line-clamp-2',
          active ? 'text-white/90' : 'text-(--text-body-sub-titles)',
        ]"
      >
        {{ description }}
      </p>
    </div>

    <!-- Footer: Progress & XP -->
    <div class="mt-auto w-full flex items-center justify-between gap-3 pt-2">
      <!-- Progress Bar (if not active) -->
      <div v-if="!active" class="flex-1 h-4 relative">
        <apexchart
          :key="themeKey"
          type="bar"
          :options="chartOptions"
          :series="chartSeries"
          height="100%"
          width="100%"
        />
      </div>
      <div v-else class="flex-1 flex items-center gap-1 text-white/90 text-xs font-medium">
        <span class="material-symbols-outlined text-sm">check_circle</span>
        <span>Concluído</span>
      </div>

      <!-- XP Badge -->
      <div
        :class="[
          'text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap',
          active ? 'bg-white/20 text-white' : 'bg-(--system-ring)/10 text-(--system-ring)',
        ]"
      >
        {{ xp }} xp
      </div>
    </div>

    <!-- Details Modal -->
    <Teleport to="body">
      <ModalComponent
        v-if="showModal"
        :isOpen="showModal"
        :title="title"
        @close="showModal = false"
      >
        <div class="flex flex-col gap-6">
          <div
            class="p-4 rounded-xl bg-(--system-input-background) border border-(--system-border)"
          >
            <p class="text-(--text-body) text-base leading-relaxed">{{ description }}</p>
          </div>

          <div class="space-y-2">
            <div
              class="flex items-center justify-between text-sm font-medium text-(--text-body-sub-titles)"
            >
              <span>Progresso</span>
              <span>{{ Math.round(progress) }}%</span>
            </div>
            <div class="w-full h-4 relative">
              <apexchart
                :key="themeKey"
                type="bar"
                :options="chartOptions"
                :series="chartSeries"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script>
import ModalComponent from '@/components/ModalComponent.vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'ChallengeCard',
  components: {
    ModalComponent,
    apexchart: VueApexCharts,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 50,
    },
    active: {
      type: Boolean,
      default: false,
    },
    adminMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete'],
  data() {
    return {
      showModal: false,
      themeKey: 0,
      observer: null,
    }
  },
  computed: {
    chartSeries() {
      // Single series for progress, background handled by plotOptions
      return [
        {
          name: 'Progresso',
          data: [this.progress > 100 ? 100 : this.progress],
        },
      ]
    },
    chartOptions() {
      const isDark = document.documentElement.classList.contains('dark')
      const primaryColor = '#8cb161' // --system-ring
      const backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

      return {
        chart: {
          type: 'bar',
          stacked: false, // Desativa empilhamento para usar o backgroundBar
          sparkline: {
            enabled: true,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 5,
            barHeight: '100%',
            colors: {
              backgroundBarColors: [backgroundColor],
              backgroundBarRadius: 5,
            },
          },
        },
        colors: [primaryColor],
        xaxis: {
          min: 0,
          max: 100, // Escala fixa 0-100
        },
        tooltip: {
          enabled: false,
        },
        states: {
          hover: {
            filter: { type: 'none' },
          },
          active: {
            filter: { type: 'none' },
          },
        },
        stroke: {
          width: 0,
        },
      }
    },
  },
  mounted() {
    this.updateTheme()
    // Observar mudanças de tema (classe dark no html)
    this.observer = new MutationObserver(this.updateTheme)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
  methods: {
    updateTheme() {
      this.themeKey += 1
    },
    openDetails() {
      this.showModal = true
    },
  },
}
</script>
