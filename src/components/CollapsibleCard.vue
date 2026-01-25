<template>
  <div class="bg-(--system-background) border-2 border-(--system-border) rounded-[14px] p-6 w-full">
    <!-- Header Button -->
    <button @click="toggleCollapse" class="w-full flex items-center justify-between cursor-pointer">
      <!-- Title Section -->
      <div class="flex items-center gap-2">
        <!-- Icon Slot - Drag Handle -->
        <div class="w-8 h-8 flex items-center justify-center drag-handle cursor-move hover:text-(--system-ring) transition-colors">
          <i class="fa-solid fa-grip-vertical text-(--text-body-titles)"></i>
        </div>
        <!-- Title -->
        <p class="font-bold text-base text-(--text-body-titles) whitespace-nowrap">
          {{ title }}
        </p>
      </div>

      <!-- Toggle Icon -->
      <div class="w-8 h-8 flex items-center justify-center">
        <i :class="[isOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down', 'text-(--text-body-titles)']"></i>
      </div>
    </button>

    <!-- Collapsible Content -->
    <transition
      name="collapse"
      :css="false"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div class="mt-4 h-fit">
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
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  methods: {
    toggleCollapse() {
      this.isOpen = !this.isOpen
    },
    enter(element, done) {
      element.style.height = '0'
      element.style.opacity = '0'
      requestAnimationFrame(() => {
        element.style.transition = 'height 0.3s ease-in-out, opacity 0.3s ease-in-out'
        element.style.height = element.scrollHeight + 'px'
        element.style.opacity = '1'
      })
      element.addEventListener('transitionend', done, { once: true })
    },
    afterEnter(element) {
      element.style.height = 'auto'
      element.style.transition = ''
    },
    leave(element, done) {
      element.style.height = element.scrollHeight + 'px'
      // Force reflow to ensure the browser registers the starting height
       
      element.offsetHeight
      requestAnimationFrame(() => {
        element.style.transition = 'height 0.3s ease-in-out, opacity 0.3s ease-in-out'
        element.style.height = '0'
        element.style.opacity = '0'
      })
      element.addEventListener('transitionend', done, { once: true })
    },
    afterLeave(element) {
      element.style.height = ''
      element.style.opacity = ''
      element.style.transition = ''
    },
  },
}
</script>

<style scoped>
button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
}
</style>
