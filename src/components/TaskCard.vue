<template>
  <div
    class="relative h-[210px] rounded-[21px] w-full overflow-hidden cursor-pointer transition-transform group"
    @click="$emit('click')"
  >
    <!-- Background Image -->
    <img
      v-if="image"
      :src="image"
      :alt="label"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div v-else class="absolute inset-0 bg-(--system-border) flex items-center justify-center">
      <i :class="[displayIcon, 'text-6xl text-(--text-disabled)']" aria-hidden="true"></i>
    </div>

    <!--Overlay on hover -->
    <div
      class="absolute inset-0 bg-black opacity-0 group-hover:opacity-45 transition-opacity"
    ></div>

    <!-- Label Badge -->
    <div
      class="absolute top-[24px] left-[27px] bg-(--system-background) border border-(--system-border) rounded-full px-4 py-0 flex items-center justify-center z-10"
    >
      <p class="font-medium text-[13px] text-(--text-headings) whitespace-nowrap">
        {{ label }}
      </p>
    </div>
  </div>
</template>

<script>
import { getTaskIcon } from '@/data/categoryIcons'

export default {
  name: 'TaskCard',
  props: {
    label: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
  },
  emits: ['click'],
  computed: {
    displayIcon() {
      // If icon starts with 'fa-', use it directly
      if (this.icon && this.icon.startsWith('fa-')) {
        return this.icon
      }
      // Otherwise get category icon
      return getTaskIcon(null, null, this.category)
    },
  },
}
</script>
