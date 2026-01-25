<template>
  <div
    class="bg-(--system-card) border border-(--system-border) flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center overflow-hidden p-3 relative rounded-[10px] shrink-0 w-full mb-2 transition-all hover:shadow-sm"
  >
    <!-- Image -->
    <div
      class="w-full sm:w-[140px] md:w-[190px] h-[120px] sm:h-[100px] relative rounded-[8px] shrink-0 overflow-hidden flex items-center justify-center bg-(--system-input-background)"
    >
      <img v-if="image" :src="image" :alt="title" class="w-full h-full object-cover" />
      <i v-else class="fa-solid fa-gift text-5xl text-(--accent-muted-foreground)"></i>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-grow min-w-0 gap-1 w-full sm:w-auto h-full justify-center">
      <div class="flex items-start justify-between w-full gap-2">
        <div class="flex flex-col gap-0.5 min-w-0">
          <h3
            class="font-['Noto_Sans'] font-semibold text-base sm:text-lg text-(--text-headings) leading-tight line-clamp-1"
            :title="title"
          >
            {{ title }}
          </h3>
          <p class="text-sm text-(--text-disabled)">
            {{ date || `${points} pontos` }}
          </p>
        </div>

        <!-- Action Button -->
        <div v-if="showAction" class="shrink-0">
          <CardButton :variant="actionVariant" @click="$emit('action')" />
        </div>
      </div>

      <p
        v-if="status"
        :class="['font-[\'Noto_Sans\'] font-medium text-sm sm:text-base mt-1', statusClass]"
      >
        Estado: {{ statusText }}
      </p>
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue'

export default {
  name: 'RewardListItem',
  components: {
    CardButton,
  },
  props: {
    image: {
      type: [String, null],
      required: false,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
      validator: (value) =>
        ['', 'pending', 'pendente', 'complete', 'completo', 'cancelado', 'cancelled'].includes(
          value,
        ),
    },
  },
  computed: {
    showAction() {
      const pendingStatuses = ['pending', 'pendente']
      return !this.status || pendingStatuses.includes(this.status)
    },
    actionVariant() {
      const pendingStatuses = ['pending', 'pendente']
      return pendingStatuses.includes(this.status) ? 'delete' : 'confirm'
    },
    statusClass() {
      const classes = {
        pending: 'text-(--semantic-warning-default)',
        pendente: 'text-(--semantic-warning-default)',
        complete: 'text-(--semantic-success-default)',
        completo: 'text-(--semantic-success-default)',
        cancelado: 'text-(--semantic-error-default)',
        cancelled: 'text-(--semantic-error-default)',
      }
      return classes[this.status] || ''
    },
    statusText() {
      const texts = {
        pending: 'pendente',
        pendente: 'pendente',
        complete: 'completo',
        completo: 'completo',
        cancelado: 'cancelado',
        cancelled: 'cancelado',
      }
      return texts[this.status] || this.status
    },
  },
}
</script>
