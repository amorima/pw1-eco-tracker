<template>
  <div
    class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-3 bg-(--system-card) border border-(--system-border) rounded-(--border-radius-lg) w-full transition-all hover:shadow-sm"
  >
    <div
      class="w-full sm:w-[100px] h-[140px] sm:h-[100px] rounded-(--border-radius-md) overflow-hidden shrink-0 flex items-center justify-center bg-(--system-input-background)"
    >
      <img v-if="image" :src="image" :alt="title" class="w-full h-full object-cover" />
      <i v-else class="fa-solid fa-gift text-5xl text-(--accent-muted-foreground)"></i>
    </div>

    <div class="flex flex-col gap-1 flex-1 min-w-0 w-full">
      <h3
        class="font-['Noto_Sans'] text-lg font-semibold leading-tight text-(--text-headings) line-clamp-2"
        :title="title"
      >
        {{ title }}
      </h3>
      <p class="font-['Noto_Sans'] text-sm font-medium text-(--text-disabled)">
        {{ points }} pontos
      </p>
    </div>

    <div
      class="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end sm:justify-between sm:h-[100px]"
    >
      <CardButton variant="edit" @click="$emit('edit')" />
      <CardButton variant="delete" @click="$emit('delete')" />
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue'

export default {
  name: 'RewardCard',
  components: {
    CardButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
  },
}
</script>
