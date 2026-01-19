<template>
  <div class="bg-(--system-card) border border-(--system-border) flex gap-[16px] items-start overflow-hidden p-[10px] relative rounded-[10px] shrink-0 w-full mb-2">
    <div class="h-[100px] relative rounded-[8px] shrink-0 w-[190px]">
      <img 
        :src="image" 
        :alt="title"
        class="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] w-full h-full"
      />
    </div>
    
    <div class="basis-0 flex flex-col gap-0 grow items-start justify-between min-h-px min-w-px relative h-[100px] shrink-0">
      <div class="font-['Noto_Sans'] font-normal h-[52px] relative shrink-0 w-full">
        <p class="absolute leading-[1.75] left-0 text-[18px] text-(--text-headings) top-0">
          {{ title }}
        </p>
        <p class="absolute leading-[1.5] left-0 text-[16px] text-(--text-disabled) text-nowrap top-[28px]">
          {{ date || `${points} pontos` }}
        </p>
      </div>
      
      <p 
        v-if="status"
        :class="[
          'font-[\'Noto_Sans\'] font-normal leading-[1.5] relative shrink-0 text-[16px] text-nowrap',
          statusClass
        ]"
      >
        Estado: {{ statusText }}
      </p>
    </div>
    
    <div v-if="showAction" class="flex flex-col h-[100px] items-start justify-between relative shrink-0">
      <CardButton 
        :variant="actionVariant"
        @click="$emit('action')"
      />
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue'

export default {
  name: 'RewardListItem',
  components: {
    CardButton
  },
  props: {
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    date: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: '',
      validator: (value) => ['', 'pending', 'pendente', 'complete', 'completo', 'cancelado', 'cancelled'].includes(value)
    }
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
        'pending': 'text-(--semantic-warning-default)',
        'pendente': 'text-(--semantic-warning-default)',
        'complete': 'text-(--semantic-success-default)',
        'completo': 'text-(--semantic-success-default)',
        'cancelado': 'text-(--semantic-error-default)',
        'cancelled': 'text-(--semantic-error-default)'
      }
      return classes[this.status] || ''
    },
    statusText() {
      const texts = {
        'pending': 'pendente',
        'pendente': 'pendente',
        'complete': 'completo',
        'completo': 'completo',
        'cancelado': 'cancelado',
        'cancelled': 'cancelado'
      }
      return texts[this.status] || this.status
    }
  }
}
</script>
