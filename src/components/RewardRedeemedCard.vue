<template>
  <div class="flex gap-(--spacing-xs) items-start p-(--spacing-xs) bg-(--system-background) border-2 border-(--system-border) rounded-(--border-radius-lg) w-full">
    <div class="shrink-0">
      <div class="w-[190.385px] h-[100px] border-[0.724px] border-(--system-border) rounded-[7.692px] overflow-hidden bg-(--system-background) flex items-center justify-center">
        <img 
          v-if="reward.image" 
          :src="reward.image" 
          :alt="reward.title"
          class="w-full h-full object-cover"
        />
        <i v-else class="fa-solid fa-gift text-5xl text-(--accent-muted-foreground)"></i>
      </div>
    </div>

    <div class="flex flex-col justify-between flex-1 min-w-0 self-stretch">
      <div class="flex flex-col gap-0">
        <h3 class="font-['Noto_Sans'] text-lg font-normal leading-[1.75] text-(--text-headings) m-0" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
          {{ reward.userName }} resgatou "{{ reward.title }}"
        </h3>
        <p class="font-['Noto_Sans'] text-base font-normal leading-normal text-(--accent-muted-foreground) m-0 whitespace-nowrap" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
          {{ reward.points }} pontos
        </p>
      </div>
      <p 
        :class="[
          'font-[\'Noto_Sans\'] text-base font-normal leading-normal m-0 whitespace-nowrap',
          (reward.status === 'complete' || reward.status === 'completo') && 'text-(--semantic-success-light)',
          reward.status === 'pending' && 'text-(--semantic-info-default)',
          (reward.status === 'cancelled' || reward.status === 'cancelado') && 'text-(--semantic-error-default)'
        ]"
        style="font-variation-settings: 'CTGR' 0, 'wdth' 100"
      >
        Estado: {{ statusText }}
      </p>
    </div>

    <div v-if="reward.status === 'pending' || reward.status === 'pendente'" class="flex flex-col gap-2.5 items-center justify-between self-stretch">
      <CardButton 
        variant="confirm" 
        @click="$emit('confirm', reward)"
      />
      <CardButton 
        variant="delete" 
        @click="$emit('delete', reward)"
      />
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue';

export default {
  name: 'RewardRedeemedCard',
  components: {
    CardButton
  },
  props: {
    reward: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        userName: '',
        points: 0,
        image: '',
        status: 'complete' // 'complete', 'pending', 'cancelled'
      })
    }
  },
  computed: {
    statusText() {
      const statusMap = {
        complete: 'completo',
        completo: 'completo',
        pending: 'pendente',
        pendente: 'pendente',
        cancelled: 'cancelado',
        cancelado: 'cancelado'
      };
      return statusMap[this.reward.status] || 'desconhecido';
    }
  }
}
</script>
