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
    chartSeries() {
      const series = []

      if (this.showCo2) {
        series.push({
          name: 'CO2 Poupado (kg)',
          data: this.data.map((d) => Math.round(d.co2Saved)),
        })
      }

      if (this.showPoints) {
        series.push({
          name: 'Pontos',
          data: this.data.map((d) => d.points),
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
          width: this.currentChartType === 'line' ? 3 : 0,
        },
        fill: {
          opacity: this.currentChartType === 'line' ? 0.3 : 1,
          type: this.currentChartType === 'line' ? 'gradient' : 'solid',
          gradient: {
            shade: this.isDark ? 'dark' : 'light',
            type: 'vertical',
            opacityFrom: 0.6,
            opacityTo: 0.2,
            stops: [0, 90, 100],
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
        yaxis:
          this.showCo2 && this.showPoints
            ? [
                {
                  title: {
                    text: 'CO2 Poupado (kg)',
                    style: {
                      color: textColor,
                    },
                  },
                  labels: {
                    style: {
                      colors: textColor,
                    },
                  },
                },
                {
                  opposite: true,
                  title: {
                    text: 'Pontos',
                    style: {
                      color: textColor,
                    },
                  },
                  labels: {
                    style: {
                      colors: textColor,
                    },
                  },
                },
              ]
            : {
                labels: {
                  style: {
                    colors: textColor,
                  },
                },
              },
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
  },
}
</script>
