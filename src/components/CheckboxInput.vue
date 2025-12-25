<template>
  <button 
    @click="toggle"
    class="relative w-[18px] h-[18px] rounded"
    :class="[
      checked 
        ? 'bg-(--system-popover-foreground) border-2 border-(--system-ring)' 
        : 'border-2 border-(--system-ring)'
    ]"
    type="button"
  >

  </button>
</template>

<script>
export default {
  name: 'CheckboxInput',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checked() {
      return this.modelValue
    }
  },
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
