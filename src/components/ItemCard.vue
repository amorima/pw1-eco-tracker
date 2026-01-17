<template>
  <div class="flex gap-[8px] items-start p-[8px] bg-(--system-card) border-2 border-(--system-border) rounded-(--border-radius-lg) w-full">
    <div class="shrink-0">
      <div class="w-[190.385px] h-[100px] border-[0.724px] border-(--system-border) rounded-[7.692px] overflow-hidden bg-(--system-card) flex items-center justify-center">
        <img 
          v-if="image" 
          :src="image" 
          :alt="title"
          class="w-full h-full object-cover"
        />
        <span v-else class="material-symbols-outlined text-5xl text-(--accent-muted-foreground)">
          {{ icon || placeholderIcon }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-0 flex-1 min-w-0 self-stretch">
      <h3 class="font-['Noto_Sans'] text-lg font-normal leading-[1.75] text-(--text-headings) m-0" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ title }}
      </h3>
      <p class="font-['Noto_Sans'] text-base font-normal leading-[1.5] text-(--text-disabled) m-0 mt-[3px] whitespace-nowrap" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex flex-col gap-2.5 items-center justify-between self-stretch">
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
  name: 'ItemCard',
  components: {
    CardButton
  },
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 0
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
