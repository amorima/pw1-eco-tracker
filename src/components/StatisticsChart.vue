<template>
  <div class="w-full">
    <!-- Chart Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-(--system-ring)"></div>
          <span class="text-sm text-(--text-body-sub-titles)">CO2 Poupado (kg)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-(--semantic-warning-default)"></div>
          <span class="text-sm text-(--text-body-sub-titles)">Pontos</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="chartType = 'bar'"
          :class="[
            'p-2 rounded-lg transition-colors',
            chartType === 'bar' ? 'bg-(--system-ring) text-white' : 'bg-(--system-border) text-(--text-body-sub-titles)'
          ]"
        >
          <span class="material-symbols-outlined text-lg">bar_chart</span>
        </button>
        <button 
          @click="chartType = 'line'"
          :class="[
            'p-2 rounded-lg transition-colors',
            chartType === 'line' ? 'bg-(--system-ring) text-white' : 'bg-(--system-border) text-(--text-body-sub-titles)'
          ]"
        >
          <span class="material-symbols-outlined text-lg">show_chart</span>
        </button>
      </div>
    </div>
    
    <!-- Bar Chart -->
    <div v-if="chartType === 'bar'" class="flex items-end justify-between gap-2 h-[180px] px-2">
      <div 
        v-for="(day, index) in data" 
        :key="index"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <!-- Bars Container -->
        <div class="w-full flex items-end justify-center gap-1 h-[150px]">
          <!-- CO2 Bar -->
          <div 
            class="w-1/3 bg-(--system-ring) rounded-t-md transition-all duration-500"
            :style="{ height: `${getBarHeight(day.co2Saved, maxCo2)}%` }"
            :title="`${day.co2Saved.toFixed(2)} kg CO2`"
          ></div>
          <!-- Points Bar -->
          <div 
            class="w-1/3 bg-(--semantic-warning-default) rounded-t-md transition-all duration-500"
            :style="{ height: `${getBarHeight(day.points, maxPoints)}%` }"
            :title="`${day.points} pontos`"
          ></div>
        </div>
        <!-- Day Label -->
        <span class="text-xs text-(--text-body-sub-titles) capitalize">{{ day.label }}</span>
      </div>
    </div>
    
    <!-- Line Chart -->
    <div v-else class="relative h-[180px] px-2">
      <svg class="w-full h-[150px]" viewBox="0 0 100 50" preserveAspectRatio="none">
        <!-- Grid Lines -->
        <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="var(--system-border)" stroke-width="0.2" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="var(--system-border)" stroke-width="0.2" />
        <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="var(--system-border)" stroke-width="0.2" />
        
        <!-- CO2 Line -->
        <polyline
          :points="co2LinePoints"
          fill="none"
          stroke="var(--system-ring)"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Points Line -->
        <polyline
          :points="pointsLinePoints"
          fill="none"
          stroke="var(--semantic-warning-default)"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- CO2 Dots -->
        <circle
          v-for="(point, index) in co2Points"
          :key="`co2-${index}`"
          :cx="point.x"
          :cy="point.y"
          r="1"
          fill="var(--system-ring)"
        />
        
        <!-- Points Dots -->
        <circle
          v-for="(point, index) in pointsPoints"
          :key="`points-${index}`"
          :cx="point.x"
          :cy="point.y"
          r="1"
          fill="var(--semantic-warning-default)"
        />
      </svg>
      
      <!-- Day Labels -->
      <div class="flex justify-between px-0 mt-1">
        <span 
          v-for="(day, index) in data" 
          :key="index"
          class="text-xs text-(--text-body-sub-titles) capitalize flex-1 text-center"
        >
          {{ day.label }}
        </span>
      </div>
    </div>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-4 gap-3 mt-6">
      <div class="bg-(--system-card) border border-(--system-border) rounded-lg p-3 text-center">
        <p class="text-2xl font-bold text-(--system-ring)">{{ totalCo2.toFixed(1) }}</p>
        <p class="text-xs text-(--text-body-sub-titles)">kg CO2 poupado</p>
      </div>
      <div class="bg-(--system-card) border border-(--system-border) rounded-lg p-3 text-center">
        <p class="text-2xl font-bold text-(--semantic-warning-default)">{{ totalPoints }}</p>
        <p class="text-xs text-(--text-body-sub-titles)">Pontos</p>
      </div>
      <div class="bg-(--system-card) border border-(--system-border) rounded-lg p-3 text-center">
        <p class="text-2xl font-bold text-(--text-body-titles)">{{ totalTasks }}</p>
        <p class="text-xs text-(--text-body-sub-titles)">Tarefas</p>
      </div>
      <div class="bg-(--system-card) border border-(--system-border) rounded-lg p-3 text-center">
        <p class="text-2xl font-bold text-(--primary-primary)">{{ streak }} 🔥</p>
        <p class="text-xs text-(--text-body-sub-titles)">Streak</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsChart',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    totalCo2: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    totalTasks: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      chartType: 'bar',
    }
  },
  computed: {
    maxCo2() {
      const max = Math.max(...this.data.map(d => d.co2Saved), 0.1)
      return max * 1.2 // Add 20% padding
    },
    maxPoints() {
      const max = Math.max(...this.data.map(d => d.points), 1)
      return max * 1.2
    },
    co2Points() {
      if (!this.data.length) return []
      const step = 100 / (this.data.length - 1 || 1)
      return this.data.map((day, index) => ({
        x: index * step,
        y: 50 - (day.co2Saved / this.maxCo2) * 45,
      }))
    },
    pointsPoints() {
      if (!this.data.length) return []
      const step = 100 / (this.data.length - 1 || 1)
      return this.data.map((day, index) => ({
        x: index * step,
        y: 50 - (day.points / this.maxPoints) * 45,
      }))
    },
    co2LinePoints() {
      return this.co2Points.map(p => `${p.x},${p.y}`).join(' ')
    },
    pointsLinePoints() {
      return this.pointsPoints.map(p => `${p.x},${p.y}`).join(' ')
    },
  },
  methods: {
    getBarHeight(value, max) {
      if (!max || max === 0) return 5
      return Math.max((value / max) * 100, 5)
    },
  },
}
</script>
