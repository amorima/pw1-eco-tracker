<template>
  <div class="flex flex-col gap-[4px] items-center relative shrink-0">
    <div 
      :class="[
        'rounded-[4px] shrink-0 w-[24px] h-[24px] border border-(--system-ring)',
        completed ? 'bg-(--system-popover-foreground)' : 'bg-transparent'
      ]"
    />
    <p class="font-['Noto_Sans'] font-medium leading-[1.5] relative shrink-0 text-[10px] text-(--text-headings) text-center text-nowrap">
      {{ day }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'StreakButton',
  props: {
    day: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }
}
</script>
