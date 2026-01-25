<template>
  <button
    class="group h-[210px] rounded-[21px] w-full overflow-hidden flex items-center justify-center transition-all bg-(--system-border) hover:bg-(--system-ring)"
    @click="$emit('click')"
  >
    <i
      class="fa-solid fa-plus w-full flex items-center justify-center transition-colors text-(--system-ring) group-hover:text-white"
      style="font-size: 56px"
    ></i>
  </button>
</template>

<script>
export default {
  name: 'AddCard',
  emits: ['click'],
}
</script>
