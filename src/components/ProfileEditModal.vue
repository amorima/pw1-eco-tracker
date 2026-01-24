<template>
  <ModalComponent :isOpen="isOpen" :title="title" size="md" @close="$emit('close')">
    <div class="space-y-4">
      <!-- Nome -->
      <FormInput
        v-model="formData.name"
        label="Nome"
        placeholder="Nome do perfil"
        :error="errors.name"
      />

      <!-- Email -->
      <FormInput
        v-model="formData.email"
        label="Email"
        placeholder="email@exemplo.com"
        type="email"
        :error="errors.email"
      />

      <!-- Data de Nascimento -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Data de Nascimento
        </label>
        <input
          v-model="formData.birthdate"
          type="date"
          :max="maxDate"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring) transition-colors"
        />
        <p v-if="calculatedAge" class="text-xs text-(--text-body-sub-titles)">
          Idade: {{ calculatedAge }} anos
        </p>
      </div>

      <!-- Image Upload Section -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Foto de Perfil
        </label>
        <div class="flex items-center gap-4">
          <!-- Preview -->
          <div
            class="w-20 h-20 rounded-full overflow-hidden bg-(--system-border) flex items-center justify-center ring-2 ring-(--system-ring) ring-opacity-20"
          >
            <img
              v-if="formData.avatarUrl"
              :src="formData.avatarUrl"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-3xl text-(--text-disabled)"
              >person</span
            >
          </div>

          <!-- Upload Button -->
          <div class="flex-1">
            <label
              class="flex items-center gap-2 px-4 py-2 bg-(--system-card) border-2 border-(--system-border) rounded-lg cursor-pointer hover:border-(--system-ring) hover:bg-(--system-ring) hover:text-white transition-all font-medium"
              :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
            >
              <span class="material-symbols-outlined text-xl">{{
                isUploading ? 'hourglass_empty' : 'cloud_upload'
              }}</span>
              <span class="text-sm">{{ isUploading ? 'A carregar...' : 'Carregar imagem' }}</span>
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
          v-model="formData.avatarUrl"
          placeholder="ou insira o URL da imagem"
          class="mt-2"
        />
      </div>

      <div v-if="formData.id && showAdminToggle" class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)"> Permissões </label>
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
        class="px-4 py-2 bg-(--system-ring) text-white rounded-lg font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
    showAdminToggle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      isUploading: false,
      formData: {
        id: null,
        name: '',
        email: '',
        birthdate: '',
        avatarUrl: '',
        isAdmin: false,
      },
      errors: {
        name: '',
        email: '',
      },
    }
  },
  computed: {
    title() {
      return this.profile?.id ? 'Editar Perfil' : 'Criar Perfil'
    },
    isValid() {
      return this.formData.name.trim() && this.isEmailValid && !this.errors.name
    },
    isEmailValid() {
      if (!this.formData.email) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.formData.email)
    },
    calculatedAge() {
      if (!this.formData.birthdate) return null
      const birthDate = new Date(this.formData.birthdate)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    maxDate() {
      return new Date().toISOString().split('T')[0]
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
    'formData.name'(newVal) {
      if (!newVal.trim()) {
        this.errors.name = 'Nome é obrigatório'
      } else {
        this.errors.name = ''
      }
    },
    'formData.email'(newVal) {
      if (newVal && !this.isEmailValid) {
        this.errors.email = 'Email inválido'
      } else {
        this.errors.email = ''
      }
    },
  },
  methods: {
    initForm() {
      if (this.profile) {
        this.formData = {
          id: this.profile.id,
          name: this.profile.name || '',
          email: this.profile.email || '',
          birthdate: this.profile.birthdate || '',
          avatarUrl: this.profile.avatarUrl || this.profile.avatar || '',
          isAdmin: this.profile.isAdmin || false,
        }
      } else {
        this.formData = {
          id: null,
          name: '',
          email: '',
          birthdate: '',
          avatarUrl: '',
          isAdmin: false,
        }
      }
      this.errors = { name: '', email: '' }
    },
    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.errors.avatar = 'Por favor selecione uma imagem válida'
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errors.avatar = 'A imagem não pode exceder 5MB'
        return
      }

      this.isUploading = true

      try {
        const result = await uploadImage(file, { folder: 'bgreen/profiles' })

        if (result.success) {
          this.formData.avatarUrl = result.url
        } else {
          this.errors.avatar = 'Erro ao carregar imagem'
        }
      } catch (error) {
        console.error('Erro ao carregar imagem:', error)
        this.errors.avatar = 'Erro ao carregar imagem'
      } finally {
        this.isUploading = false
      }
    },
    handleSave() {
      if (!this.isValid) return

      const dataToSave = {
        ...this.formData,
        age: this.calculatedAge,
      }

      this.$emit('save', dataToSave)
      this.$emit('close')
    },
  },
}
</script>
