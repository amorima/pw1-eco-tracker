<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex flex-col gap-[16px] items-center overflow-hidden px-[16px] py-[24px] relative rounded-[10px] w-full cursor-pointer transition-all',
      locked
        ? 'bg-(--system-card) border border-(--system-border) hover:border-(--system-ring)'
        : 'bg-(--system-ring) hover:opacity-90',
    ]"
  >
    <div class="overflow-hidden relative shrink-0 w-[24px] h-[24px]">
      <span
        :class="[
          'material-symbols-outlined text-[24px]',
          locked ? 'text-(--text-disabled)' : 'text-white',
        ]"
      >
        {{ icon }}
      </span>
    </div>
    <p
      :class="[
        'font-[\'Noto_Sans\'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[10px] text-center w-[min-content]',
        locked ? 'text-(--text-disabled)' : 'text-(--system-card)',
      ]"
    >
      {{ title }}
    </p>
  </button>
</template>

<script>
export default {
  name: 'BadgeCard',
  props: {
    icon: {
      type: String,
      default: 'emoji_events',
    },
    title: {
      type: String,
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
}
</script>
