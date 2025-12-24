<template>
  <div 
    class="bg-white border-[1.6px] border-(--system-foreground) rounded-(--border-radius-xl) w-full overflow-hidden cursor-pointer"
    @click="toggleOpen"
  >
    <!-- Question Button -->
    <div class="flex items-center justify-between px-6 py-6 h-[72px]">
      <div class="flex-1">
        <div class="text-heading-h4 text-(--text-body-titles) text-left">
          <slot name="question">
            <h4 class="text-heading-h4 text-(--text-body-titles) text-left">
              Como funciona o sistema de monitorização?
            </h4>
          </slot>
        </div>
      </div>
      <div class="flex items-center justify-center w-5 h-5 shrink-0 ml-4">
        <span 
          class="material-symbols-outlined text-[20px] text-(--system-foreground) transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        >
          keyboard_arrow_down
        </span>
      </div>
    </div>

    <!-- Answer Content -->
    <transition
      name="expand"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div class="px-6 pb-6">
          <div class="text-body-base text-(--text-body-sub-titles) leading-relaxed">
            <slot name="answer">
              <p>
                Registe manualmente os consumos ou conecte dispositivos compatíveis para monitorização automática.
              </p>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FAQItem',
  props: {
    defaultOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.defaultOpen
    }
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    enter(element) {
      element.style.height = 'auto'
      const height = getComputedStyle(element).height
      element.style.height = '0'
      // Force reflow
      getComputedStyle(element).height
      requestAnimationFrame(() => {
        element.style.height = height
      })
    },
    afterEnter(element) {
      element.style.height = 'auto'
    },
    leave(element) {
      element.style.height = getComputedStyle(element).height
      // Force reflow
      getComputedStyle(element).height
      requestAnimationFrame(() => {
        element.style.height = '0'
      })
    }
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
}
</style>
