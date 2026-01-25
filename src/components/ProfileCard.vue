<template>
  <div 
    class="flex flex-col gap-2.5 items-center justify-center p-2.5 w-[169px] cursor-pointer group"
    @click="handleClick"
  >
    <!-- Profile Image Card -->
    <div 
      class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] size-[149px] overflow-hidden relative transition-all group-hover:border-(--system-ring)"
      :class="{ 'hover:scale-105': !isAddButton }"
    >
      <!-- Add Button Variant -->
      <div 
        v-if="isAddButton"
        class="w-full h-full flex items-center justify-center"
      >
        <i class="fa-solid fa-circle-plus text-6xl text-(--system-border) group-hover:text-(--system-ring) transition-colors"></i>
      </div>

      <!-- Profile Image -->
      <div v-else-if="avatar" class="w-full h-full">
        <img 
          :src="avatar" 
          :alt="name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Placeholder for no avatar -->
      <div 
        v-else
        class="w-full h-full flex items-center justify-center bg-(--system-input-background)"
      >
        <i class="fa-solid fa-user text-6xl text-(--text-body-sub-titles)"></i>
      </div>
    </div>

    <!-- Profile Name -->
    <p 
      class="font-semibold text-[20px] text-(--text-headings) text-center w-[137px] truncate"
      v-if="!isAddButton"
    >
      {{ name }}
    </p>
    
    <!-- Add Button Text -->
    <p 
      class="font-semibold text-[20px] text-(--text-body-sub-titles) group-hover:text-(--system-ring) text-center w-[137px] transition-colors"
      v-else
    >
      Adicionar
    </p>
  </div>
</template>

<script>
export default {
  name: 'ProfileCard',
  props: {
    name: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: null
    },
    isAddButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
