<template>
  <button
    class="group h-[210px] rounded-[21px] w-[284px] overflow-hidden flex items-center justify-center transition-all bg-(--system-border) hover:bg-(--system-ring)"
    @click="$emit('click')"
  >
    <span 
      class="material-symbols-outlined w-full flex items-center justify-center transition-colors text-(--system-ring) group-hover:text-white"
      style="font-size: 56px;"
    >
      add
    </span>
  </button>
</template>

<script>
export default {
  name: 'AddCard',
  emits: ['click']
}
</script>
