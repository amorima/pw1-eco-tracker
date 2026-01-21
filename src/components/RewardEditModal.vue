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
      
      <!-- Image Upload Section -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Imagem
        </label>
        <div class="flex items-start gap-4">
          <!-- Preview -->
          <div class="w-32 h-24 rounded-lg overflow-hidden bg-(--system-border) flex items-center justify-center">
            <img 
              v-if="formData.image" 
              :src="formData.image" 
              alt="Reward" 
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-3xl text-(--text-disabled)">card_giftcard</span>
          </div>
          
          <!-- Upload Button -->
          <div class="flex-1">
            <label 
              class="flex items-center gap-2 px-4 py-2 bg-(--system-border) rounded-lg cursor-pointer hover:bg-(--system-ring) hover:text-white transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
            >
              <span class="material-symbols-outlined">{{ isUploading ? 'hourglass_empty' : 'cloud_upload' }}</span>
              <span>{{ isUploading ? 'A carregar...' : 'Carregar imagem' }}</span>
              <input 
                type="file" 
                accept="image/*" 
                class="hidden"
                :disabled="isUploading"
                @change="handleImageUpload"
              />
            </label>
            <p class="text-xs text-(--text-disabled) mt-1">PNG, JPG até 5MB</p>
          </div>
        </div>
        
        <!-- URL Input as alternative -->
        <FormInput 
          v-model="formData.image" 
          placeholder="ou insira o URL da imagem" 
          class="mt-2"
        />
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
        :disabled="!isValid || isUploading"
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
import { uploadImage } from '@/services/cloudinaryService'

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
      isUploading: false,
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
      return this.formData.title.trim() && this.formData.points > 0
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
    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        return
      }
      
      this.isUploading = true
      
      try {
        const result = await uploadImage(file, { folder: 'bgreen/rewards' })
        
        if (result.success) {
          this.formData.image = result.url
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        this.isUploading = false
      }
    },
    handleSave() {
      if (!this.isValid) return
      this.$emit('save', {
        ...this.formData,
        points: parseInt(this.formData.points),
        image: this.formData.image || null,
      })
      this.$emit('close')
    },
  },
}
</script>
