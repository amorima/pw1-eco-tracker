<template>
  <div class="flex gap-[8px] items-start p-2.5 bg-(--system-card) border border-(--system-border) rounded-(--border-radius-lg) w-full">
    <div class="w-[100px] h-[100px] rounded-(--border-radius-md) overflow-hidden shrink-0 flex items-center justify-center bg-(--system-card)">
      <img 
        v-if="image" 
        :src="image" 
        :alt="title"
        class="w-full h-full object-cover"
      />
      <span v-else class="material-symbols-outlined text-5xl text-(--accent-muted-foreground)">
        card_giftcard
      </span>
    </div>

    <div class="flex flex-col gap-0 flex-1 min-w-0 self-stretch">
      <h3 class="font-['Noto_Sans'] text-lg font-normal leading-[1.75] text-(--text-headings) m-0" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ title }}
      </h3>
      <p class="font-['Noto_Sans'] text-base font-normal leading-[1.5] text-(--text-disabled) m-0 mt-[3px] whitespace-nowrap" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ points }} pontos
      </p>
    </div>

    <div class="flex flex-col gap-2.5 items-center justify-between h-[100px]">
      <CardButton 
        variant="edit" 
        @click="$emit('edit')"
      />
      <CardButton 
        variant="delete" 
        @click="$emit('delete')"
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
    title: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  }
}
</script>
