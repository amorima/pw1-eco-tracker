<template>
  <button
    :class="[
      'rounded-(--border-radius-xl) flex items-center justify-center gap-2.5 border-[0.5px] transition-all duration-200',
      'h-[40px] px-4 py-2 text-sm',
      'sm:h-[45px] sm:px-5 sm:py-2.5 sm:text-base',
      'md:h-[50px] md:px-6 md:py-3 md:text-lg',
      variant === 'secondary'
        ? 'bg-transparent border-(--system-ring) text-(--system-ring) hover:shadow-[0_0_20px_rgba(140,177,97,0.6)]'
        : 'bg-(--system-ring) border-(--system-ring) text-(--system-foreground) hover:bg-(--system-popover-foreground)',
    ]"
  >
    <span class="text-button flex justify-center"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
  },
}
</script>
