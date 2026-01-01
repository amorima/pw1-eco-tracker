<template>
  <button
    :class="[
      landing ? 'text-white' : 'text-(--text-body-titles)',
      'border-b-3 border-transparent hover:border-(--system-ring) h-fit transition-colors duration-200',
    ]"
  >
    <span class="text-button"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'MenuButton',
  props: {
    landing: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
