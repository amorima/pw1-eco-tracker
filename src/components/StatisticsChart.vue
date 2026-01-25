<template>
  <div class="flex flex-col gap-4">
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
    <div class="w-full h-[300px]">
      <apexchart
        v-if="chartOptions.series.length > 0"
        :type="currentChartType"
        :options="chartOptions"
        :series="chartSeries"
        height="100%"
      />
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'StatisticsChart',
  components: {
    apexchart: VueApexCharts,
  },
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
    /**
     * When true, shows "Effective CO2" which is CO2 Emitted - CO2 Saved.
     * The data should include co2Emitted and co2Saved properties.
     * Positive values mean net emissions, negative values mean net savings.
     */
    showEffectiveCo2: {
      type: Boolean,
      default: true,
    },
    showSavedCo2: {
      type: Boolean,
      default: true,
    },
    /**
     * Custom label for CO2 series
     */
    co2Label: {
      type: String,
      default: 'CO₂ (kg)',
    },
  },
  data() {
    return {
      currentChartType: 'bar',
      observer: null,
    }
  },
  computed: {
    isDark() {
      return document.documentElement.classList.contains('dark')
    },
    primaryColor() {
      const color = this.resolveColor('var(--system-ring)')
      return color && color.startsWith('#') ? color : '#8cb161'
    },
    secondaryColor() {
      if (this.pointsColor) {
        const color = this.resolveColor(this.pointsColor)
        if (color && color.startsWith('#')) return color
      }
      const color = this.resolveColor('var(--semantic-warning-default)')
      return color && color.startsWith('#') ? color : '#e89454'
    },
    savedCo2Color() {
      // Darker Green color for saved CO2 for better contrast
      return '#15803d'
    },
    chartSeries() {
      const series = []

      if (this.showSavedCo2) {
        series.push({
          name: 'CO₂ Poupado (kg)',
          data: this.data.map((d) => Number((d.co2Saved || 0).toFixed(2))),
        })
      }

      if (this.showCo2) {
        if (this.showEffectiveCo2) {
          // Effective CO2: Emitted - Saved (positive = net emissions, negative = net savings)
          series.push({
            name: this.co2Label || 'CO₂ (kg)',
            data: this.data.map((d) => {
              const emitted = d.co2Emitted || 0
              const saved = d.co2Saved || 0
              // Negative means net savings (good), positive means net emissions (bad)
              return Math.round((emitted - saved) * 100) / 100
            }),
          })
        } else if (!this.showSavedCo2) {
          series.push({
            name: this.co2Label || 'CO₂ (kg)',
            data: this.data.map((d) => Math.round(d.co2Saved || 0)),
          })
        }
      }

      if (this.showPoints) {
        series.push({
          name: 'Pontos',
          data: this.data.map((d) => d.points || 0),
        })
      }

      return series
    },
    chartOptions() {
      const textColor = this.isDark ? '#e7e5e4' : '#57534e'
      const gridColor = this.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
      const tooltipBg = this.isDark ? '#292524' : '#ffffff'
      const borderColor = this.isDark ? '#44403c' : '#e7e5e4'

      const colors = []
      if (this.showSavedCo2) colors.push(this.savedCo2Color)
      if (this.showCo2) colors.push(this.primaryColor)
      if (this.showPoints) colors.push(this.secondaryColor)

      return {
        series: this.chartSeries,
        chart: {
          type: this.currentChartType,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
            speed: 300,
          },
          background: 'transparent',
        },
        colors: colors,
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: this.currentChartType === 'line' ? 4 : 0,
        },
        fill: {
          opacity: 1,
          type: 'solid',
        },
        markers: {
          size: this.currentChartType === 'line' ? 5 : 0,
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        xaxis: {
          categories: this.data.map((d) => d.label),
          labels: {
            style: {
              colors: textColor,
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: this.getDynamicYAxis(textColor),
        grid: {
          borderColor: gridColor,
          strokeDashArray: 0,
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontSize: '14px',
          fontWeight: 500,
          markers: {
            width: 12,
            height: 12,
            radius: 12,
          },
          itemMargin: {
            horizontal: 15,
            vertical: 5,
          },
          labels: {
            colors: textColor,
          },
        },
        tooltip: {
          theme: this.isDark ? 'dark' : 'light',
          style: {
            fontSize: '12px',
          },
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const label = w.globals.labels[dataPointIndex]
            let content = `<div class="apex-tooltip" style="background: ${tooltipBg}; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px;">`
            content += `<div style="color: ${textColor}; font-weight: 600; margin-bottom: 4px;">${label}</div>`

            series.forEach((s, i) => {
              const name = w.globals.seriesNames[i]
              const value = s[dataPointIndex]
              const color = w.globals.colors[i]
              content += `<div style="color: ${textColor}; display: flex; align-items: center; gap: 6px;">`
              content += `<span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%; display: inline-block;"></span>`
              content += `<span>${name}: ${value}</span>`
              content += `</div>`
            })

            content += `</div>`
            return content
          },
        },
      }
    },
  },
  mounted() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', this.handleThemeChange)
    this.observer = new MutationObserver(this.handleThemeChange)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  },
  beforeUnmount() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', this.handleThemeChange)
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },
  methods: {
    resolveColor(colorInput) {
      if (!colorInput) return null
      let color = colorInput.trim()
      if (color.startsWith('var(')) {
        const varName = color.match(/var\(([^)]+)\)/)[1]
        color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
      }
      return color
    },
    setChartType(type) {
      if (this.currentChartType === type) return
      this.currentChartType = type
    },
    handleThemeChange() {
      this.$forceUpdate()
    },
    getDynamicYAxis(textColor) {
      const yaxis = []

      // Calcular min/max global para CO2 para sincronizar os eixos
      let minCo2 = 0
      let maxCo2 = 0

      if (this.data.length > 0 && (this.showCo2 || this.showSavedCo2)) {
        this.data.forEach((d) => {
          const saved = d.co2Saved || 0
          const emitted = d.co2Emitted || 0
          const effective = emitted - saved

          if (this.showEffectiveCo2) {
            maxCo2 = Math.max(maxCo2, effective)
            minCo2 = Math.min(minCo2, effective)
          }
          if (this.showSavedCo2) {
            maxCo2 = Math.max(maxCo2, saved)
          }
        })

        // Adicionar margem (10%) e garantir que não é zero
        maxCo2 = maxCo2 > 0 ? maxCo2 * 1.1 : 1
        minCo2 = minCo2 < 0 ? minCo2 * 1.1 : 0
      }

      // 1. Effective CO2 Axis (Left)
      if (this.showCo2) {
        yaxis.push({
          seriesName: this.co2Label || 'CO₂ (kg)',
          min: minCo2,
          max: maxCo2,
          title: {
            text: 'CO₂ (kg)',
            style: { color: textColor },
          },
          labels: {
            style: { colors: textColor },
            formatter: (val) => val.toFixed(1),
          },
        })
      }

      // 2. Saved CO2 Axis (Left, hidden but synced)
      if (this.showSavedCo2) {
        yaxis.push({
          seriesName: 'CO₂ Poupado (kg)',
          min: minCo2,
          max: maxCo2,
          show: false, // Esconder etiquetas para não duplicar, mas manter escala
          labels: { style: { colors: textColor } },
        })
      }

      // 3. Points Axis (Right)
      if (this.showPoints) {
        yaxis.push({
          seriesName: 'Pontos',
          opposite: true,
          title: {
            text: 'Pontos',
            style: { color: textColor },
          },
          labels: {
            style: { colors: textColor },
            formatter: (val) => val.toFixed(0),
          },
        })
      }

      return yaxis.length > 0 ? yaxis : { labels: { style: { colors: textColor } } }
    },
  },
}
</script>
