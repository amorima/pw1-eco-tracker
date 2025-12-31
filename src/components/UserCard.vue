<template>
  <div class="flex gap-2.5 items-start p-2 bg-(--system-background) border-2 border-(--system-border) rounded-(--border-radius-lg) w-full">
    <div class="w-[100px] h-[100px] border-2 border-(--system-border) rounded-(--border-radius-md) overflow-hidden shrink-0 flex items-center justify-center bg-(--system-input-background)">
      <template v-if="!isEmpty">
        <img 
          v-if="user.avatar" 
          :src="user.avatar" 
          :alt="user.name"
          class="w-full h-full object-cover"
        />
        <span v-else class="material-symbols-outlined text-5xl text-(--accent-muted-foreground)">
          person
        </span>
      </template>
      <span v-else class="material-symbols-outlined text-5xl text-(--accent-muted-foreground)">
        person_add
      </span>
    </div>

    <div class="flex flex-col gap-0 flex-1 min-w-0 w-60">
      <p 
        :class="[
          'font-[\'Noto_Sans\'] text-lg font-normal leading-[1.75] m-0',
          isEmpty ? 'text-(--accent-muted-foreground)' : 'text-(--text-headings)'
        ]"
        style="font-variation-settings: 'CTGR' 0, 'wdth' 100"
      >
        {{ isEmpty ? 'Vazio' : user.name }}
      </p>
      <p 
        v-if="!isEmpty && user.ranking"
        class="font-['Noto_Sans'] text-base font-normal leading-normal text-(--accent-muted-foreground) m-0 whitespace-nowrap"
        style="font-variation-settings: 'CTGR' 0, 'wdth' 100"
      >
        {{ user.ranking }}
      </p>
      <p 
        v-else-if="isEmpty"
        class="font-['Noto_Sans'] text-base font-normal leading-normal text-(--accent-muted-foreground) m-0 whitespace-nowrap"
        style="font-variation-settings: 'CTGR' 0, 'wdth' 100"
      >
        Vazio
      </p>
    </div>

    <div class="flex flex-col gap-2.5 items-center justify-between h-[100px]">
      <CardButton 
        v-if="!isEmpty"
        variant="edit" 
        @click="$emit('edit', user)"
      />
      <CardButton 
        v-if="!isEmpty"
        variant="delete" 
        @click="$emit('delete', user)"
      />
    </div>
  </div>
</template>

<script>
import CardButton from './CardButton.vue';

export default {
  name: 'UserCard',
  components: {
    CardButton
  },
  props: {
    user: {
      type: Object,
      default: () => ({
        name: '',
        avatar: '',
        ranking: ''
      })
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  }
}
</script>
