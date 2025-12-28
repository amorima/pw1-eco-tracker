<template>
  <button
    class="h-[210px] rounded-[21px] w-[284px] overflow-hidden flex items-center justify-center transition-all hover:scale-105"
    :class="variant === 'primary' ? 'bg-(--system-ring)' : 'bg-(--system-border)'"
    @click="$emit('click')"
  >
    <span 
      class="material-symbols-outlined transition-transform group-hover:rotate-90"
      :class="variant === 'primary' ? 'text-white' : 'text-(--accent-muted-foreground)'"
      style="font-size: 56px;"
    >
      add
    </span>
  </button>
</template>

<script>
export default {
  name: 'AddCard',
  props: {
    variant: {
      type: String,
      default: 'default', // 'default' or 'primary'
      validator: (value) => ['default', 'primary'].includes(value)
    }
  },
  emits: ['click']
}
</script>
