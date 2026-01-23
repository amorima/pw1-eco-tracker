<template>
  <div class="flex flex-col gap-4" ref="chartContainer">
    <div class="flex justify-end">
      <div class="flex bg-(--system-border) rounded-lg p-1 gap-1">
        <button
          @click="setChartType('bar')"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            currentChartType === 'bar'
              ? 'bg-(--system-background) text-(--system-ring) shadow-sm'
              : 'text-(--text-body-sub-titles) hover:text-(--text-body)',
          ]"
        >
          Barras
        </button>
        <button
          @click="setChartType('line')"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            currentChartType === 'line'
              ? 'bg-(--system-background) text-(--system-ring) shadow-sm'
              : 'text-(--text-body-sub-titles) hover:text-(--text-body)',
          ]"
        >
          Linha
        </button>
      </div>
    </div>
    <div class="w-full h-[300px] relative">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'StatisticsChart',
  props: {
    data: {
      type: Array,
      required: true,
    },
    showCo2: {
      type: Boolean,
      default: true,
    },
    showPoints: {
      type: Boolean,
      default: true,
    },
    pointsColor: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      chartInstance: null,
      currentChartType: 'bar',
      observer: null,
      resizeObserver: null,
      renderTimeout: null,
      isRendering: false,
      lastRenderTime: 0,
    }
  },
  mounted() {
    this.renderChart()
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', this.handleThemeChange)
    this.observer = new MutationObserver(this.handleThemeChange)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (this.chartInstance) {
            this.chartInstance.resize()
          }
        }
      }
    })
    if (this.$refs.chartContainer) {
      this.resizeObserver.observe(this.$refs.chartContainer)
    }
  },
  beforeUnmount() {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout)
    }
    if (this.chartInstance) {
      this.chartInstance.destroy()
      this.chartInstance = null
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', this.handleThemeChange)
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },
  watch: {
    data: {
      handler() {
        this.renderChart()
      },
      deep: true,
    },
  },
  methods: {
    handleThemeChange() {
      if (this.renderTimeout) {
        clearTimeout(this.renderTimeout)
      }
      this.renderTimeout = setTimeout(() => {
        this.renderChart()
      }, 100)
    },
    resolveColor(colorInput) {
      if (!colorInput) return null
      let color = colorInput.trim()
      if (color.startsWith('var(')) {
        const varName = color.match(/var\(([^)]+)\)/)[1]
        color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
      }
      return color
    },
    hexToRgba(hex, alpha) {
      if (!hex || !hex.startsWith('#')) return hex
      let c = hex.substring(1).split('')
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')'
    },
    setChartType(type) {
      if (this.currentChartType === type) return
      this.currentChartType = type

      if (this.renderTimeout) {
        clearTimeout(this.renderTimeout)
      }

      this.renderTimeout = setTimeout(() => {
        this.renderChart()
      }, 150)
    },
    renderChart() {
      if (!this.$refs.chartCanvas || this.isRendering) return

      const container = this.$refs.chartContainer
      if (!container || container.clientWidth === 0) return

      this.isRendering = true
      const now = Date.now()
      const timeSinceLastRender = now - this.lastRenderTime
      const shouldAnimate = timeSinceLastRender > 300

      try {
        if (this.chartInstance) {
          this.chartInstance.destroy()
          this.chartInstance = null
        }

        const canvas = this.$refs.chartCanvas
        if (!canvas) {
          this.isRendering = false
          return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          this.isRendering = false
          return
        }

        const isDark = document.documentElement.classList.contains('dark')

        const defaultPrimary = '#8cb161'
        const defaultSecondary = '#e89454'

        let primaryColor = this.resolveColor('var(--system-ring)') || defaultPrimary
        let secondaryColor =
          this.resolveColor('var(--semantic-warning-default)') || defaultSecondary

        if (this.pointsColor) {
          secondaryColor = this.resolveColor(this.pointsColor) || secondaryColor
        }

        if (!primaryColor.startsWith('#')) primaryColor = defaultPrimary
        if (!secondaryColor.startsWith('#')) secondaryColor = defaultSecondary

        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        const textColor = isDark ? '#e7e5e4' : '#57534e'

        const datasets = []

        if (this.showCo2) {
          datasets.push({
            label: 'CO2 Poupado (kg)',
            data: this.data.map((d) => d.co2Saved),
            backgroundColor:
              this.currentChartType === 'line' ? this.hexToRgba(primaryColor, 0.2) : primaryColor,
            borderColor: primaryColor,
            borderWidth: 2,
            borderRadius: 4,
            tension: 0.4,
            fill: this.currentChartType === 'line',
            pointBackgroundColor: isDark ? '#1c1917' : '#fff',
            yAxisID: 'y',
          })
        }

        if (this.showPoints) {
          datasets.push({
            label: 'Pontos',
            data: this.data.map((d) => d.points),
            backgroundColor:
              this.currentChartType === 'line'
                ? this.hexToRgba(secondaryColor, 0.2)
                : secondaryColor,
            borderColor: secondaryColor,
            borderWidth: 2,
            borderRadius: 4,
            tension: 0.4,
            fill: this.currentChartType === 'line',
            pointBackgroundColor: isDark ? '#1c1917' : '#fff',
            yAxisID: this.showCo2 ? 'y1' : 'y',
          })
        }

        const chartData = {
          labels: this.data.map((d) => d.label),
          datasets,
        }

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          animation: shouldAnimate
            ? {
                duration: 300,
              }
            : false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: isDark ? '#292524' : '#fff',
              titleColor: isDark ? '#fff' : '#1c1917',
              bodyColor: isDark ? '#d6d3d1' : '#57534e',
              borderColor: isDark ? '#44403c' : '#e7e5e4',
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: { color: textColor },
              position: 'left',
              display: true,
            },
            y1: {
              beginAtZero: true,
              grid: { display: false },
              ticks: { color: textColor },
              position: 'right',
              display: this.showCo2 && this.showPoints,
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor },
            },
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
          },
        }

        this.chartInstance = new Chart(ctx, {
          type: this.currentChartType,
          data: chartData,
          options: chartOptions,
        })

        this.lastRenderTime = now
      } catch (error) {
        console.error('Erro ao renderizar gráfico:', error)
      } finally {
        this.isRendering = false
      }
    },
  },
}
</script>
