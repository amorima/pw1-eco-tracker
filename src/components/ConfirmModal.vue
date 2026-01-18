<template>
  <ModalComponent :isOpen="isOpen" :title="title" size="sm" @close="$emit('close')">
    <div class="space-y-4">
      <p class="text-(--text-body)">{{ message }}</p>
    </div>
    
    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-(--system-border) text-(--text-body-titles) rounded-lg font-semibold hover:opacity-80 transition-opacity"
      >
        {{ cancelText }}
      </button>
      <button
        @click="handleConfirm"
        :class="[
          'px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity',
          variant === 'danger' ? 'bg-(--semantic-error-default) text-white' : 'bg-(--system-ring) text-white'
        ]"
      >
        {{ confirmText }}
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'

export default {
  name: 'ConfirmModal',
  components: {
    ModalComponent,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Confirmar',
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirmar',
    },
    cancelText: {
      type: String,
      default: 'Cancelar',
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'danger'].includes(value),
    },
  },
  emits: ['close', 'confirm'],
  methods: {
    handleConfirm() {
      this.$emit('confirm')
      this.$emit('close')
    },
  },
}
</script>
