<template>
  <ModalComponent
    :isOpen="isOpen"
    :title="badge?.title || 'Badge'"
    size="sm"
    @close="$emit('close')"
  >
    <div class="flex flex-col items-center gap-6">
      <!-- Badge Icon -->
      <div
        :class="[
          'w-24 h-24 rounded-full flex items-center justify-center',
          badge?.earned ? 'bg-(--system-ring)' : 'bg-(--system-border)',
        ]"
      >
        <span
          :class="[
            'material-symbols-outlined',
            badge?.earned ? 'text-white' : 'text-(--text-disabled)',
          ]"
          style="font-size: 48px"
        >
          {{ badge?.icon || 'emoji_events' }}
        </span>
      </div>

      <!-- Badge Title -->
      <h3
        :class="[
          'font-bold text-2xl text-center',
          badge?.earned ? 'text-(--text-body-titles)' : 'text-(--text-disabled)',
        ]"
      >
        {{ badge?.title }}
      </h3>

      <!-- Badge Description -->
      <p class="text-(--text-body-sub-titles) text-center text-base">
        {{ badge?.description }}
      </p>

      <!-- Earned Status -->
      <div v-if="badge?.earned" class="flex flex-col items-center gap-2">
        <div class="flex items-center gap-2 text-(--semantic-success-default)">
          <span class="material-symbols-outlined text-xl">verified</span>
          <span class="font-semibold">Conquistado!</span>
        </div>
        <p class="text-(--text-disabled) text-sm">
          {{ formatDate(badge.earnedAt) }}
        </p>
      </div>

      <!-- Locked Status -->
      <div v-else class="flex flex-col items-center gap-2">
        <div class="flex items-center gap-2 text-(--text-disabled)">
          <span class="material-symbols-outlined text-xl">lock</span>
          <span class="font-semibold">Por conquistar</span>
        </div>
        <p class="text-(--text-disabled) text-sm text-center">
          {{ getRequirementText(badge?.requirement) }}
        </p>
      </div>
    </div>

    <template #footer>
      <button
        @click="$emit('close')"
        class="px-6 py-2 bg-(--system-ring) text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Fechar
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'

export default {
  name: 'BadgeModal',
  components: {
    ModalComponent,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    badge: {
      type: Object,
      default: null,
    },
  },
  emits: ['close'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    },
    getRequirementText(requirement) {
      if (!requirement) return 'Continue a usar a aplicação para desbloquear!'

      switch (requirement.type) {
        case 'streak':
          return `Mantenha uma streak de ${requirement.value} dias`
        case 'co2_saved':
          return `Poupe ${requirement.value}kg de CO2`
        case 'level':
          return `Alcance o nível ${requirement.value}`
        case 'rewards_redeemed':
          return `Resgate ${requirement.value} recompensa(s)`
        case 'task_category_count':
          return `Complete ${requirement.value} tarefas de ${requirement.category}`
        default:
          return 'Continue a usar a aplicação para desbloquear!'
      }
    },
  },
}
</script>
