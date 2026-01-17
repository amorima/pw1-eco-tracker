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
      <FormInput v-model="formData.avatar" label="Avatar URL" placeholder="URL da imagem" />
      
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
        :disabled="!isValid"
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
          avatar: this.profile.avatar || 'https://i.pravatar.cc/150?img=1',
          isAdmin: this.profile.isAdmin || false,
        }
      } else {
        this.formData = {
          id: null,
          name: '',
          age: '',
          avatar: 'https://i.pravatar.cc/150?img=1',
          isAdmin: false,
        }
      }
    },
    handleSave() {
      if (!this.isValid) return
      this.$emit('save', {
        ...this.formData,
        age: parseInt(this.formData.age),
      })
      this.$emit('close')
    },
  },
}
</script>
