<template>
  <div class="flex gap-(--spacing-xs) items-start p-(--spacing-xs) bg-(--system-background) border-2 border-(--system-border) rounded-(--border-radius-lg) w-full">
    <div class="shrink-0">
      <div class="w-[190.385px] h-[100px] border-[0.724px] border-(--system-border) rounded-[7.692px] overflow-hidden bg-(--system-background) flex items-center justify-center">
        <img 
          v-if="item.image" 
          :src="item.image" 
          :alt="item.title"
          class="w-full h-full object-cover"
        />
        <span v-else class="material-symbols-outlined text-5xl text-(--accent-muted-foreground)">
          {{ placeholderIcon }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-0 flex-1 min-w-0 self-stretch">
      <h3 class="font-['Noto_Sans'] text-lg font-normal leading-[1.75] text-(--text-headings) m-0" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ item.title }}
      </h3>
      <p class="font-['Noto_Sans'] text-base font-normal leading-normal text-(--accent-muted-foreground) m-0 whitespace-nowrap" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ item.metric }}
      </p>
    </div>

    <div class="flex flex-col gap-2.5 items-center justify-between self-stretch">
      <CardButton 
        variant="edit" 
        @click="$emit('edit', item)"
      />
      <CardButton 
        variant="delete" 
        @click="$emit('delete', item)"
      />
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue';

export default {
  name: 'ItemCard',
  components: {
    CardButton
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        metric: '',
        image: '',
        type: 'consumption' // 'consumption' or 'task'
      })
    },
    type: {
      type: String,
      default: 'consumption',
      validator: (value) => ['consumption', 'task'].includes(value)
    }
  },
  computed: {
    placeholderIcon() {
      return this.type === 'task' ? 'task_alt' : 'power';
    }
  }
}
</script>
