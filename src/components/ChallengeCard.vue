<template>
  <div
    @click="openDetails"
    :class="[
      'flex flex-col gap-3 p-4 relative rounded-[14px] transition-all duration-200 cursor-pointer group h-full min-h-[140px]',
      active
        ? 'bg-(--system-ring) shadow-md text-white'
        : 'bg-(--system-card) border-2 border-(--system-border) hover:border-(--system-ring) hover:shadow-sm',
    ]"
  >
    <!-- Admin buttons -->
    <div v-if="adminMode" class="absolute top-2 right-2 flex gap-1 z-10">
      <button
        @click.stop="$emit('edit')"
        class="p-1 rounded-md bg-(--system-input-background) hover:bg-(--system-border) transition-colors"
        title="Editar"
      >
        <span class="material-symbols-outlined text-[18px] text-(--text-body-sub-titles)"
          >edit</span
        >
      </button>
      <button
        @click.stop="$emit('delete')"
        class="p-1 rounded-md bg-(--system-input-background) hover:bg-(--semantic-danger-hover) transition-colors"
        title="Eliminar"
      >
        <span class="material-symbols-outlined text-[18px] text-(--semantic-danger-default)"
          >delete</span
        >
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1 w-full flex-grow">
      <h3
        :class="[
          'font-[\'Noto_Sans\'] font-bold text-lg leading-tight line-clamp-1',
          active ? 'text-white' : 'text-(--text-body-titles)',
        ]"
        :title="title"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'font-[\'Noto_Sans\'] text-sm leading-relaxed line-clamp-2',
          active ? 'text-white/90' : 'text-(--text-body-sub-titles)',
        ]"
      >
        {{ description }}
      </p>
    </div>

    <!-- Footer: Progress & XP -->
    <div class="mt-auto w-full flex items-center justify-between gap-3 pt-2">
      <!-- Progress Bar (if not active) -->
      <div v-if="!active" class="flex-1 h-2 bg-(--system-popover) rounded-full overflow-hidden">
        <div
          class="h-full bg-(--system-ring) rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <div v-else class="flex-1 flex items-center gap-1 text-white/90 text-xs font-medium">
        <span class="material-symbols-outlined text-sm">check_circle</span>
        <span>Concluído</span>
      </div>

      <!-- XP Badge -->
      <div
        :class="[
          'text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap',
          active ? 'bg-white/20 text-white' : 'bg-(--system-ring)/10 text-(--system-ring)',
        ]"
      >
        {{ xp }} xp
      </div>
    </div>

    <!-- Details Modal -->
    <Teleport to="body">
      <ModalComponent
        v-if="showModal"
        :isOpen="showModal"
        :title="title"
        @close="showModal = false"
      >
        <div class="flex flex-col gap-6">
          <div
            class="p-4 rounded-xl bg-(--system-input-background) border border-(--system-border)"
          >
            <p class="text-(--text-body) text-base leading-relaxed">{{ description }}</p>
          </div>

          <div class="space-y-2">
            <div
              class="flex items-center justify-between text-sm font-medium text-(--text-body-sub-titles)"
            >
              <span>Progresso</span>
              <span>{{ Math.round(progress) }}%</span>
            </div>
            <div class="w-full h-4 bg-(--system-border) rounded-full overflow-hidden">
              <div
                class="h-full bg-(--system-ring) transition-all duration-500"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </ModalComponent>
    </Teleport>
  </div>
</template>

<script>
import ModalComponent from '@/components/ModalComponent.vue'

export default {
  name: 'ChallengeCard',
  components: {
    ModalComponent,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 50,
    },
    active: {
      type: Boolean,
      default: false,
    },
    adminMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete'],
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    openDetails() {
      this.showModal = true
    },
  },
}
</script>
