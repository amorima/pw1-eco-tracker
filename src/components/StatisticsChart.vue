<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <div class="flex bg-(--system-border) rounded-lg p-1 gap-1">
        <button
          @click="setChartType('radar')"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            currentChartType === 'radar'
              ? 'bg-(--system-background) text-(--system-ring) shadow-sm'
              : 'text-(--text-body-sub-titles) hover:text-(--text-body)',
          ]"
        >
          Radar
        </button>
        <button
          @click="setChartType('area')"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            currentChartType === 'area'
              ? 'bg-(--system-background) text-(--system-ring) shadow-sm'
              : 'text-(--text-body-sub-titles) hover:text-(--text-body)',
          ]"
        >
          Área
        </button>
      </div>
    </div>
    <div class="w-full h-[300px]">
      <apexchart
        v-if="chartSeries.length > 0"
        :key="currentChartType"
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
      currentChartType: 'area',
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
      const isRadar = this.currentChartType === 'radar'

      // Calcular máximos para normalização no Radar (para que todos fiquem visíveis)
      let maxEmitted = 1
      let maxSaved = 1
      let maxPoints = 1

      if (isRadar) {
        maxEmitted = Math.max(...this.data.map((d) => d.co2Emitted || 0)) || 1
        maxSaved = Math.max(...this.data.map((d) => d.co2Saved || 0)) || 1
        maxPoints = Math.max(...this.data.map((d) => d.points || 0)) || 1
      }

      // Standardize logic: Show Emitted vs Saved for both Area and Radar
      // This avoids confusing "Effective" (negative) values and matches summary cards
      if (this.showCo2) {
        const rawData = this.data.map((d) => Number((d.co2Emitted || 0).toFixed(2)))
        series.push({
          name: 'CO₂ Emitido',
          data: isRadar ? rawData.map((v) => (v / maxEmitted) * 100) : rawData,
          originalData: rawData, // Guardar valor real para tooltip
        })
      }

      if (this.showSavedCo2) {
        const rawData = this.data.map((d) => Number((d.co2Saved || 0).toFixed(2)))
        series.push({
          name: 'CO₂ Poupado (kg)',
          data: isRadar ? rawData.map((v) => (v / maxSaved) * 100) : rawData,
          originalData: rawData,
        })
      }

      if (this.showPoints) {
        const rawData = this.data.map((d) => d.points || 0)
        series.push({
          name: 'Pontos',
          data: isRadar ? rawData.map((v) => (v / maxPoints) * 100) : rawData,
          originalData: rawData,
        })
      }

      return series
    },
    chartOptions() {
      const textColor = this.isDark ? '#e7e5e4' : '#57534e'
      const gridColor = this.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
      const tooltipBg = this.isDark ? '#292524' : '#ffffff'
      const borderColor = this.isDark ? '#44403c' : '#e7e5e4'
      const isRadar = this.currentChartType === 'radar'

      const colors = []
      // Order matches chartSeries: Emitted (Orange), Saved (Green), Points (Blue/Primary)
      if (this.showCo2) colors.push(this.secondaryColor) // Emitted
      if (this.showSavedCo2) colors.push(this.savedCo2Color) // Saved
      if (this.showPoints) colors.push(this.primaryColor) // Points (changed to primary for contrast)

      return {
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
            borderRadiusApplication: 'end',
            columnWidth: '60%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: isRadar ? 2 : 3,
        },
        fill: {
          opacity: this.currentChartType === 'area' || isRadar ? 0.5 : 1,
          type: this.currentChartType === 'area' ? 'gradient' : 'solid', // Radar uses solid fill
          gradient: {
            shade: this.isDark ? 'dark' : 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        markers: {
          size: 4,
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
        yaxis: isRadar ? { show: false } : this.getDynamicYAxis(textColor),
        grid: {
          borderColor: gridColor,
          strokeDashArray: 0,
          xaxis: {
            lines: { show: !isRadar },
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
          custom: ({ series, _seriesIndex, dataPointIndex, w }) => {
            const label = w.globals.labels[dataPointIndex]
            let content = `<div class="apex-tooltip" style="background: ${tooltipBg}; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px;">`
            content += `<div style="color: ${textColor}; font-weight: 600; margin-bottom: 4px;">${label}</div>`

            w.config.series.forEach((s, i) => {
              const name = s.name
              const color = w.globals.colors[i]

              // Usar dados originais se existirem (Radar), caso contrário usar o valor plotado
              let value = s.originalData
                ? s.originalData[dataPointIndex]
                : series[i][dataPointIndex]

              let formattedValue = value
              if (typeof value === 'number') {
                formattedValue = name.toLowerCase().includes('pontos')
                  ? Math.round(value)
                  : value.toFixed(2)
              }

              content += `<div style="color: ${textColor}; display: flex; align-items: center; gap: 6px;">`
              content += `<span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%; display: inline-block;"></span>`
              content += `<span>${name}: ${formattedValue}</span>`
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

          if (this.showCo2) maxCo2 = Math.max(maxCo2, emitted)
          if (this.showSavedCo2) {
            maxCo2 = Math.max(maxCo2, saved)
          }
        })

        // Adicionar margem (10%) e garantir que não é zero
        maxCo2 = maxCo2 > 0 ? maxCo2 * 1.1 : 1
        minCo2 = 0 // Always start at 0 for absolute values
      }

      // 1. CO2 Axis (Left) - Shared for Emitted and Saved
      if (this.showCo2 || this.showSavedCo2) {
        yaxis.push({
          seriesName: this.showCo2 ? 'CO₂ Emitido' : 'CO₂ Poupado (kg)',
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

        // Se mostrarmos ambos, precisamos de um segundo eixo para o Poupado
        // para garantir que partilha a mesma escala (min/max) e não salta para o eixo dos Pontos
        if (this.showCo2 && this.showSavedCo2) {
          yaxis.push({
            seriesName: 'CO₂ Poupado (kg)',
            min: minCo2,
            max: maxCo2,
            show: false, // Ocultar para não duplicar etiquetas
          })
        }
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
