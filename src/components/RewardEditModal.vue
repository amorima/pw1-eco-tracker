<template>
  <ModalComponent :isOpen="isOpen" :title="title" size="md" @close="$emit('close')">
    <div class="space-y-4">
      <FormInput v-model="formData.title" label="Título" placeholder="Nome da recompensa" />
      <FormInput
        v-model="formData.points"
        label="Pontos"
        placeholder="Custo em pontos"
        type="number"
        min="1"
      />
      <FormInput v-model="formData.image" label="Imagem URL" placeholder="URL da imagem" />
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Pré-visualização
        </label>
        <div v-if="formData.image" class="w-full h-32 rounded-lg overflow-hidden bg-(--system-border)">
          <img :src="formData.image" alt="Preview" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-(--system-border) text-(--text-body-titles) rounded-lg font-semibold hover:opacity-80 transition-opacity"
      >
        Cancelar
      </button>
      <button
        @click="handleSave"
        :disabled="!isValid"
        class="px-4 py-2 bg-(--system-ring) text-white rounded-lg font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {{ reward?.id ? 'Guardar' : 'Criar' }}
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'
import FormInput from './FormInput.vue'

export default {
  name: 'RewardEditModal',
  components: {
    ModalComponent,
    FormInput,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    reward: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        id: null,
        title: '',
        points: '',
        image: '',
      },
    }
  },
  computed: {
    title() {
      return this.reward?.id ? 'Editar Recompensa' : 'Criar Recompensa'
    },
    isValid() {
      return this.formData.title.trim() && this.formData.points > 0 && this.formData.image.trim()
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.initForm()
      }
    },
    reward: {
      handler() {
        if (this.isOpen) {
          this.initForm()
        }
      },
      deep: true,
    },
  },
  methods: {
    initForm() {
      if (this.reward) {
        this.formData = {
          id: this.reward.id,
          title: this.reward.title || '',
          points: this.reward.points || '',
          image: this.reward.image || '',
        }
      } else {
        this.formData = {
          id: null,
          title: '',
          points: '',
          image: '',
        }
      }
    },
    handleSave() {
      if (!this.isValid) return
      this.$emit('save', {
        ...this.formData,
        points: parseInt(this.formData.points),
      })
      this.$emit('close')
    },
  },
}
</script>
