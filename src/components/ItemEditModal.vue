<template>
  <ModalComponent :isOpen="isOpen" :title="title" size="md" @close="$emit('close')">
    <div class="space-y-4">
      <FormInput v-model="formData.title" label="Título" placeholder="Nome" />
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Categoria
        </label>
        <select
          v-model="formData.category"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        >
          <option value="">Selecionar categoria</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      
      <FormInput v-if="isTask" v-model="formData.points" label="Pontos" placeholder="Pontos" type="number" min="1" />
      
      <FormInput v-model="formData.icon" label="Ícone (Material Symbol)" placeholder="category" />
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Descrição
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          placeholder="Descrição breve"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring) resize-none"
        ></textarea>
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
        {{ item?.id ? 'Guardar' : 'Criar' }}
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'
import FormInput from './FormInput.vue'

export default {
  name: 'ItemEditModal',
  components: {
    ModalComponent,
    FormInput,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['appliance', 'task'].includes(value),
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        id: null,
        title: '',
        category: '',
        points: '',
        icon: '',
        description: '',
      },
    }
  },
  computed: {
    title() {
      const typeLabel = this.isTask ? 'Tarefa' : 'Consumo'
      return this.item?.id ? `Editar ${typeLabel}` : `Criar ${typeLabel}`
    },
    isTask() {
      return this.type === 'task'
    },
    categories() {
      if (this.isTask) {
        return ['Energia', 'Mobilidade', 'Reciclagem', 'Água', 'Alimentação', 'Consumo', 'Ambiente', 'Limpeza']
      }
      return ['Cozinha', 'Lavandaria', 'Climatização', 'Entretenimento', 'Limpeza', 'Outros']
    },
    isValid() {
      return (
        this.formData.title.trim() &&
        this.formData.category &&
        (!this.isTask || this.formData.points > 0)
      )
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.initForm()
      }
    },
    item: {
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
      if (this.item) {
        this.formData = {
          id: this.item.id,
          title: this.item.title || this.item.name || '',
          category: this.item.category || '',
          points: this.item.points || '',
          icon: this.item.icon || '',
          description: this.item.description || '',
        }
      } else {
        this.formData = {
          id: null,
          title: '',
          category: '',
          points: '',
          icon: '',
          description: '',
        }
      }
    },
    handleSave() {
      if (!this.isValid) return
      
      const data = {
        ...this.formData,
      }
      
      if (this.isTask) {
        data.points = parseInt(this.formData.points)
      }
      
      this.$emit('save', data)
      this.$emit('close')
    },
  },
}
</script>
