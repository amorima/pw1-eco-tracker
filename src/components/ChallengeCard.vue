<template>
  <div 
    :class="[
      'flex flex-col gap-[16px] items-start justify-center overflow-hidden px-[16px] py-[8px] relative rounded-[10px]',
      active ? 'bg-(--system-ring)' : 'bg-(--system-card) border border-(--system-border)'
    ]"
  >
    <div 
      :class="[
        'flex flex-col items-start leading-[0] relative shrink-0 text-nowrap',
        active ? 'text-(--system-card)' : 'text-(--text-disabled)'
      ]"
    >
      <div class="flex flex-col font-['Noto_Sans'] font-semibold justify-end relative shrink-0 text-[20px]">
        <p class="leading-[1.5] text-nowrap">{{ title }}</p>
      </div>
      <div class="flex flex-col font-['Noto_Sans'] font-normal justify-center relative shrink-0 text-[16px]">
        <p class="leading-[1.5] text-nowrap">{{ description }}</p>
      </div>
    </div>
    
    <div v-if="!active" class="bg-(--system-popover) flex h-[8px] items-center overflow-hidden relative rounded-[999px] shrink-0 w-full">
      <div 
        class="bg-(--system-ring) h-full rounded-[999px] shrink-0"
        :style="{ width: `${progress}%` }"
      />
    </div>
    
    <div 
      v-if="!active"
      class="absolute flex flex-col font-['Noto_Sans'] font-medium justify-center leading-[0] right-[32px] text-[10px] text-(--system-ring) text-nowrap top-[14.5px] translate-x-[100%] -translate-y-1/2"
    >
      <p class="leading-[1.5]">{{ xp }}xp</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChallengeCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 0
    },
    xp: {
      type: Number,
      default: 50
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
