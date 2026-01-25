<template>
  <transition name="modal-fade">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Modal Content -->
      <div 
        class="relative bg-(--system-background) rounded-[14px] shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden z-10 transform transition-all"
        :class="modalSizeClass"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b-2 border-(--system-border)">
          <h2 class="text-2xl font-bold text-(--text-body-titles)">
            {{ title }}
          </h2>
          <button
            @click="handleClose"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-(--system-input-background) transition-colors"
          >
            <i class="fa-solid fa-xmark text-(--text-body-titles) text-xl"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto" :style="{ maxHeight: maxBodyHeight }">
          <slot></slot>
        </div>

        <!-- Footer (optional) -->
        <div 
          v-if="$slots.footer"
          class="flex items-center justify-end gap-3 p-6 border-t-2 border-(--system-border)"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalComponent',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  computed: {
    modalSizeClass() {
      const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
      }
      return sizes[this.size]
    },
    maxBodyHeight() {
      // Calculate max body height to prevent modal from being too tall
      return 'calc(90vh - 200px)'
    }
  },
  methods: {
    handleClose() {
      if (this.closeOnBackdrop) {
        this.$emit('close')
      }
    },
    handleEscape(event) {
      if (this.isOpen && this.closeOnEscape && event.key === 'Escape') {
        this.$emit('close')
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleEscape)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape)
  },
  watch: {
    isOpen(newVal) {
      // Prevent body scroll when modal is open
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
}
</script>

<style scoped>
/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>
