<template>
  <div 
    class="bg-(--system-background) border border-(--system-border) rounded-[21px] w-[284px] p-[11px] flex flex-col gap-[11px] hover:shadow-lg transition-shadow"
  >
    <!-- Image Section with Label -->
    <div class="relative h-[138px] rounded-[11px] border border-(--system-border) overflow-hidden group">
      <img 
        v-if="image"
        :src="image" 
        :alt="label"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-(--system-input-background)"></div>
      
      <!-- Label Badge -->
      <div 
        class="absolute top-3 left-[7px] bg-(--system-background) border border-(--system-border) rounded-full px-4 py-0 flex items-center justify-center"
      >
        <p class="font-medium text-[13px] text-(--text-headings) whitespace-nowrap">
          {{ label }}
        </p>
      </div>
    </div>

    <!-- Input Section -->
    <div class="flex gap-[11px] items-center">
      <!-- Input with Unit -->
      <div class="flex-1 bg-(--system-input-background) border border-(--system-border) rounded-[11px] h-10 relative">
        <input
          v-model="inputValue"
          type="number"
          :placeholder="placeholder"
          class="w-full h-full px-3 bg-transparent text-[13px] text-(--system-foreground) outline-none placeholder:text-(--text-disabled)"
          @input="$emit('input-change', inputValue)"
        />
        
        <!-- Unit Badge -->
        <div class="absolute right-[3px] top-[3px] w-8 h-8 bg-(--system-border) rounded-[7px] flex items-center justify-center">
          <span class="text-[13px] font-bold text-(--accent-muted-foreground)">
            {{ unit }}
          </span>
        </div>
      </div>

      <!-- Arrow Button -->
      <button 
        @click="$emit('submit', inputValue)"
        class="bg-(--system-input-background) border border-(--system-border) rounded-[11px] w-10 h-10 flex items-center justify-center hover:bg-(--system-ring) hover:border-(--system-ring) transition-colors group"
        :disabled="!inputValue"
      >
        <span class="material-symbols-outlined text-[21px] text-(--text-body-titles) group-hover:text-white transition-colors">
          arrow_forward_ios
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsumptionCard',
  props: {
    label: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    unit: {
      type: String,
      default: 'hr'
    },
    placeholder: {
      type: String,
      default: 'Introduza o valor...'
    }
  },
  emits: ['input-change', 'submit'],
  data() {
    return {
      inputValue: ''
    }
  }
}
</script>

<style scoped>
/* Remove number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
