<template>
  <div class="flex gap-[10px] h-[60px] items-center relative shrink-0 w-full">
    <div class="flex h-full items-center justify-center overflow-hidden relative shrink-0 w-[60px]">
      <div 
        :class="[
          'flex flex-col font-[\'Clash_Grotesk\'] font-bold justify-center leading-[0] relative shrink-0 text-[48px] text-nowrap',
          highlight ? 'text-(--primary-primary)' : 'text-(--accent-muted-foreground)'
        ]"
      >
        <p class="leading-[1.25]">{{ position }}º</p>
      </div>
    </div>
    <div 
      :class="[
        'basis-0 flex grow items-center justify-center min-h-px min-w-px overflow-hidden px-[24px] py-[12px] relative rounded-[10px] shrink-0',
        highlight ? 'bg-(--system-ring)' : 'border border-(--system-ring)'
      ]"
    >
      <div class="flex flex-col font-['Noto_Sans'] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-(--text-body) text-nowrap">
        <p class="leading-[1.5]">{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingRow',
  props: {
    position: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    highlight: {
      type: Boolean,
      default: false
    }
  }
}
</script>
