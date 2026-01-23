<template>
  <ModalComponent :isOpen="isOpen" :title="title" size="md" @close="$emit('close')">
    <div class="space-y-4">
      <FormInput v-model="formData.name" label="Nome" placeholder="Nome do perfil" />
      <FormInput
        v-model="formData.age"
        label="Idade"
        placeholder="Idade"
        type="number"
        min="1"
        max="120"
      />
      
      <!-- Image Upload Section -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Avatar
        </label>
        <div class="flex items-center gap-4">
          <!-- Preview -->
          <div class="w-20 h-20 rounded-full overflow-hidden bg-(--system-border) flex items-center justify-center">
            <img 
              v-if="formData.avatar" 
              :src="formData.avatar" 
              alt="Avatar" 
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-3xl text-(--text-disabled)">person</span>
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
          v-model="formData.avatar" 
          placeholder="ou insira o URL da imagem" 
          class="mt-2"
        />
      </div>
      
      <div v-if="formData.id" class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Permissões
        </label>
        <CheckboxInput v-model="formData.isAdmin" label="Administrador" />
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
        {{ profile?.id ? 'Guardar' : 'Criar' }}
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'
import FormInput from './FormInput.vue'
import CheckboxInput from './CheckboxInput.vue'
import { uploadImage } from '@/services/cloudinaryService'

export default {
  name: 'ProfileEditModal',
  components: {
    ModalComponent,
    FormInput,
    CheckboxInput,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    profile: {
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
        name: '',
        age: '',
        avatar: '',
        isAdmin: false,
      },
    }
  },
  computed: {
    title() {
      return this.profile?.id ? 'Editar Perfil' : 'Criar Perfil'
    },
    isValid() {
      return this.formData.name.trim()
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.initForm()
      }
    },
    profile: {
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
      if (this.profile) {
        this.formData = {
          id: this.profile.id,
          name: this.profile.name || '',
          age: this.profile.age || '',
          avatar: this.profile.avatarUrl || this.profile.avatar || '',
          isAdmin: this.profile.isAdmin || false,
        }
      } else {
        this.formData = {
          id: null,
          name: '',
          age: '',
          avatar: '',
          isAdmin: false,
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
        const result = await uploadImage(file, { folder: 'bgreen/profiles' })
        
        if (result.success) {
          this.formData.avatar = result.url
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
        age: parseInt(this.formData.age) || null,
        avatar: this.formData.avatar || null,
      })
      this.$emit('close')
    },
  },
}
</script>
