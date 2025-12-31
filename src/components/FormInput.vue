<template>
  <div class="flex flex-col gap-0 h-[35px] items-start w-full">
    <div class="relative bg-(--system-background) border-2 border-(--system-border) rounded-lg p-3 w-full h-full flex items-center">
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="absolute inset-0 w-full h-full bg-transparent border-none outline-none px-3 text-[10px] font-bold placeholder-[#a8a29e]"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue']
}
</script>
