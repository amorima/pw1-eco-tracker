<template>
  <div
    class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-3 bg-(--system-card) border-2 border-(--system-border) rounded-(--border-radius-lg) w-full transition-all hover:shadow-sm"
  >
    <div
      class="w-full sm:w-[190px] h-[140px] sm:h-[100px] border-[0.724px] border-(--system-border) rounded-[7.692px] overflow-hidden bg-(--system-input-background) flex items-center justify-center shrink-0"
    >
      <img v-if="image" :src="image" :alt="title" class="w-full h-full object-cover" />
      <i v-else :class="[icon || placeholderIcon, 'text-5xl text-(--text-disabled)']"></i>
    </div>

    <div class="flex flex-col gap-1 flex-1 min-w-0 w-full">
      <h3
        class="font-['Noto_Sans'] text-lg font-semibold leading-tight text-(--text-headings) line-clamp-2"
        :title="title"
      >
        {{ title }}
      </h3>
      <p class="font-['Noto_Sans'] text-sm font-medium text-(--text-disabled)">
        {{ subtitle }}
      </p>
    </div>

    <div
      class="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end sm:justify-between sm:h-[100px]"
    >
      <CardButton v-if="showEdit" variant="edit" @click="$emit('edit')" />
      <CardButton v-if="showDelete" variant="delete" @click="$emit('delete')" />
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue'

export default {
  name: 'ItemCard',
  components: {
    CardButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'consumption',
      validator: (value) => ['consumption', 'task'].includes(value),
    },
    showEdit: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    placeholderIcon() {
      return this.type === 'task' ? 'fa-solid fa-circle-check' : 'fa-solid fa-plug'
    },
  },
}
</script>
