<template>
  <button 
    :class="[
      'relative w-[45px] h-[45px] border-none cursor-pointer transition-all duration-200 shrink-0',
      'hover:opacity-90 hover:scale-105 active:scale-95',
      variant === 'edit' && 'bg-(--semantic-info-light) border-[1.125px] border-(--semantic-info-default) rounded-[4.5px]',
      variant === 'delete' && 'bg-(--semantic-error-light) border-2 border-(--semantic-error-default) rounded-(--spacing-xs)',
      variant === 'confirm' && 'bg-(--primary-secondary) border-2 border-(--semantic-success-light) rounded-(--border-radius-sm)'
    ]"
    @click="$emit('click', $event)"
    :type="type"
  >
    <span 
      :class="[
        'material-symbols-outlined text-2xl flex items-center justify-center',
        variant === 'edit' && 'text-(--semantic-info-default)',
        variant === 'delete' && 'text-(--semantic-error-default)',
        variant === 'confirm' && 'text-(--semantic-success-light)'
      ]"
    >
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
      validator: (value) => ['confirm', 'delete', 'edit'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    iconName() {
      const icons = {
        confirm: 'check',
        delete: 'delete',
        edit: 'edit'
      };
      return icons[this.variant] || icons.edit;
    }
  }
}
</script>
