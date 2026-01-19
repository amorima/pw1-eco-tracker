<template>
  <div 
    :class="[
      'flex items-center justify-center px-2 py-2 rounded-full w-fit',
      variant === 'success' ? 'bg-(--primary-secondary)' : 'bg-(--semantic-error-light)'
    ]"
  >
    <div class="flex items-center gap-1 flex-1">
      <span 
        :class="[
          'material-symbols-outlined text-2xl shrink-0',
          variant === 'success' ? 'text-(--text-body-sub-titles)' : 'text-(--semantic-error-default)'
        ]"
      >
        {{ iconName }}
      </span>
      <p class="font-['Noto_Sans'] text-[10px] font-medium leading-normal text-(--text-body-titles) m-0 whitespace-nowrap" style="font-variation-settings: 'CTGR' 0, 'wdth' 100">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: {
    variant: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    },
    message: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return this.variant === 'error' ? 'error' : 'check_circle';
    }
  }
}
</script>
