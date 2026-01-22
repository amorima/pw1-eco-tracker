<template>
  <button
    :class="[
      'flex items-center justify-center w-11 h-11 border-2 border-solid cursor-pointer transition duration-200 shrink-0 rounded-xl focus:outline-none',
      'hover:shadow-sm active:opacity-80',
      variant === 'edit' &&
        'bg-(--semantic-info-light) border-(--semantic-info-default) text-(--semantic-info-default) hover:bg-(--semantic-info-default) hover:text-white',
      variant === 'delete' &&
        'bg-(--semantic-error-light) border-(--semantic-error-default) text-(--semantic-error-default) hover:bg-(--semantic-error-default) hover:text-white',
      variant === 'confirm' &&
        'bg-(--semantic-success-light) border-(--semantic-success-default) text-(--semantic-success-default) hover:bg-(--semantic-success-default) hover:text-white',
    ]"
    @click="$emit('click', $event)"
    :type="type"
  >
    <span class="material-symbols-outlined text-2xl">
      {{ iconName }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'CardButton',
  props: {
    variant: {
      type: String,
      default: 'edit',
      validator: (value) => ['confirm', 'delete', 'edit'].includes(value),
    },
    type: {
      type: String,
      default: 'button',
    },
  },
  computed: {
    iconName() {
      const icons = {
        confirm: 'check',
        delete: 'delete',
        edit: 'edit',
      }
      return icons[this.variant] || icons.edit
    },
  },
}
</script>
