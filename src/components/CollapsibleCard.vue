<template>
  <div 
    class="bg-white border-2 border-(--system-border) rounded-[14px] p-6 w-full"
  >
    <!-- Header Button -->
    <button 
      @click="toggleCollapse"
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <!-- Title Section -->
      <div class="flex items-center gap-2">
        <!-- Icon Slot -->
        <div class="w-8 h-8 flex items-center justify-center">
          <span class="material-symbols-outlined text-(--text-body-titles)">drag_indicator</span>
        </div>
        <!-- Title -->
        <p class="font-bold text-base text-(--text-body-titles) whitespace-nowrap">
          {{ title }}
        </p>
      </div>

      <!-- Toggle Icon -->
      <div class="w-8 h-8 flex items-center justify-center">
        <span class="material-symbols-outlined text-(--text-body-titles)">{{isOpen ? 'collapse_all' : 'expand_all'}}</span>
      </div>
    </button>

    <!-- Collapsible Content -->
    <transition 
      name="collapse"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div class="mt-4">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CollapsibleCard',
  props: {
    title: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      isOpen: true
    }
  },
  methods: {
    toggleCollapse() {
      this.isOpen = !this.isOpen
    },
    enter(element) {
      element.style.height = '0'
      element.style.opacity = '0'
      requestAnimationFrame(() => {
        element.style.transition = 'height 0.3s ease, opacity 0.3s ease'
        element.style.height = element.scrollHeight + 'px'
        element.style.opacity = '1'
      })
    },
    afterEnter(element) {
      element.style.height = 'auto'
    },
    leave(element) {
      element.style.height = element.scrollHeight + 'px'
      requestAnimationFrame(() => {
        element.style.transition = 'height 0.3s ease, opacity 0.3s ease'
        element.style.height = '0'
        element.style.opacity = '0'
      })
    },
    afterLeave(element) {
      element.style.height = ''
      element.style.opacity = ''
      element.style.transition = ''
    }
  }
}
</script>

<style scoped>
button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
