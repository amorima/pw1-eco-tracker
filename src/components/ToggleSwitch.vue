<template>
  <button 
    @click="toggle"
    class="relative w-11 h-6 rounded-full overflow-hidden transition-colors"
    :class="[
      isOn 
        ? 'bg-(--system-ring)' 
        : 'bg-(--system-border)'
    ]"
    type="button"
  >
    <div 
      class="absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all"
      :class="[
        isOn 
          ? 'left-[22px]' 
          : 'left-0.5'
      ]"
    ></div>
  </button>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isOn() {
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
