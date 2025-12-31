<template>
  <div class="flex gap-(--spacing-xs) items-start p-2.5 bg-(--system-background) border border-(--system-border) rounded-(--border-radius-lg) w-full">
    <div class="w-[100px] h-[100px] rounded-(--border-radius-md) overflow-hidden shrink-0 flex items-center justify-center bg-(--system-input-background)">
      <img 
        v-if="reward.image" 
        :src="reward.image" 
        :alt="reward.title"
        class="w-full h-full object-cover"
      />
      <span v-else class="material-symbols-outlined text-5xl text-(--accent-muted-foreground)">
        card_giftcard
      </span>
    </div>

    <div class="flex flex-col gap-0 flex-1 min-w-0">
      <h3 class="font-['Noto_Sans'] text-lg font-normal leading-[1.75] text-(--text-headings) m-0" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ reward.title }}
      </h3>
      <p class="font-['Noto_Sans'] text-base font-normal leading-normal text-(--accent-muted-foreground) m-0 whitespace-nowrap" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ reward.points }} pontos
      </p>
    </div>

    <div class="flex flex-col gap-2.5 items-center justify-between h-[100px]">
      <CardButton 
        variant="edit" 
        @click="$emit('edit', reward)"
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
  name: 'RewardCard',
  components: {
    CardButton
  },
  props: {
    reward: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        points: 0,
        image: ''
      })
    }
  }
}
</script>
