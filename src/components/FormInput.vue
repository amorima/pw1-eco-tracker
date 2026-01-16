<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      class="relative bg-(--system-background) border-2 border-(--system-border) rounded-(--border-radius-md) h-[50px] w-full flex items-center hover:border-(--system-ring) focus-within:border-(--system-ring) transition-colors"
    >
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full h-full bg-transparent border-none outline-none px-4 text-body-base text-(--text-headings) placeholder:text-(--accent-muted-foreground) font-normal"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
}
</script>
