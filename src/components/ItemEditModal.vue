<template>
  <ModalComponent :isOpen="isOpen" :title="title" size="md" @close="$emit('close')">
    <div class="space-y-4">
      <!-- Name/Title -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          {{ isTask ? 'Título da Tarefa *' : 'Nome do Aparelho *' }}
        </label>
        <input
          v-model="formData.name"
          type="text"
          :placeholder="isTask ? 'Ex: Reciclar papel e cartão' : 'Ex: Frigorífico da cozinha'"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        />
      </div>
      
      <!-- API Type Selection (for appliances) -->
      <div v-if="!isTask" class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Tipo de Aparelho *
        </label>
        <select
          v-model="formData.apiType"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        >
          <option value="">Escolha o tipo de aparelho</option>
          <optgroup label="Eletrodomésticos">
            <option value="refrigerator">Frigorífico</option>
            <option value="washing_machine">Máquina de lavar roupa</option>
            <option value="dishwasher">Máquina de lavar loiça</option>
            <option value="air_conditioner">Ar condicionado</option>
          </optgroup>
          <optgroup label="Entretenimento e Tecnologia">
            <option value="television">Televisão</option>
            <option value="desktop">Computador de secretária</option>
            <option value="laptop">Computador portátil</option>
          </optgroup>
        </select>
        <p class="text-xs text-(--text-disabled)">
          Escolha o tipo mais próximo do seu aparelho para cálculos precisos
        </p>
      </div>

      <!-- Power Consumption (for appliances) -->
      <div v-if="!isTask" class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Potência do Aparelho (Watts) - Opcional
        </label>
        <input
          v-model.number="formData.avgPowerConsumption"
          type="number"
          min="1"
          placeholder="Ex: 150 - Deixe vazio para usar valor padrão"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        />
        <p class="text-xs text-(--text-disabled)">
          Se não souber, deixe vazio para usar valores médios
        </p>
      </div>
      
      <!-- Category -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Categoria *
        </label>
        <select
          v-model="formData.category"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        >
          <option value="">Escolha uma categoria</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      
      <!-- Points and CO2 Saved (for tasks) -->
      <div v-if="isTask" class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-(--text-body-sub-titles)">
            Pontos a Ganhar *
          </label>
          <input
            v-model.number="formData.points"
            type="number"
            min="1"
            placeholder="Ex: 20"
            class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
          />
          <p class="text-xs text-(--text-disabled)">Pontos ganhos ao completar</p>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-(--text-body-sub-titles)">
            CO₂ Poupado (kg) - Opcional
          </label>
          <input
            v-model.number="formData.co2Saved"
            type="number"
            min="0"
            step="0.1"
            placeholder="Ex: 0.5 - Deixe vazio para valor automático"
            class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
          />
          <p class="text-xs text-(--text-disabled)">Deixe vazio para calcular automaticamente</p>
        </div>
      </div>

      <!-- Frequency (for tasks) -->
      <div v-if="isTask" class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Com que Frequência? *
        </label>
        <select
          v-model="formData.frequency"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        >
          <option value="daily">Todos os dias</option>
          <option value="weekly">Todas as semanas</option>
          <option value="monthly">Todos os meses</option>
          <option value="once">Apenas uma vez</option>
        </select>
      </div>

      <!-- Difficulty (for tasks) -->
      <div v-if="isTask" class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Nível de Dificuldade *
        </label>
        <select
          v-model="formData.difficulty"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
        >
          <option value="easy"> Fácil</option>
          <option value="medium"> Médio</option>
          <option value="hard"> Difícil</option>
        </select>
      </div>
      
      <!-- Description -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Descrição (Opcional)
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          :placeholder="isTask ? 'Ex: Esta tarefa ajuda a reduzir o desperdício e promove a reciclagem' : 'Ex: Aparelho essencial que funciona 24 horas por dia'"
          class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring) resize-none"
        ></textarea>
      </div>
      
      <!-- Image Upload Section -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Imagem (Opcional)
        </label>
        <div class="flex items-start gap-4">
          <!-- Preview -->
          <div class="w-24 h-20 rounded-lg overflow-hidden bg-(--system-border) flex items-center justify-center">
            <img 
              v-if="formData.image" 
              :src="formData.image" 
              alt="Preview" 
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-3xl text-(--text-disabled)">
              {{ isTask ? 'task_alt' : 'electrical_services' }}
            </span>
          </div>
          
          <!-- Upload Button -->
          <div class="flex-1">
            <label 
              class="flex items-center gap-2 px-4 py-2 bg-(--system-border) rounded-lg cursor-pointer hover:bg-(--system-ring) hover:text-white transition-colors text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
            >
              <span class="material-symbols-outlined text-lg">{{ isUploading ? 'hourglass_empty' : 'cloud_upload' }}</span>
              <span>{{ isUploading ? 'A carregar...' : 'Carregar' }}</span>
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
        <input
          v-model="formData.image"
          type="text"
          placeholder="ou insira o URL da imagem"
          class="w-full px-4 py-2 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring) text-sm"
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
        {{ item?.id ? 'Guardar' : 'Criar' }}
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'
import { uploadImage } from '@/services/cloudinaryService'

export default {
  name: 'ItemEditModal',
  components: {
    ModalComponent,
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
      isUploading: false,
      formData: {
        id: null,
        name: '',
        category: '',
        image: '',
        // Appliance fields
        apiType: '',
        avgPowerConsumption: null,
        // Task fields
        points: null,
        co2Saved: null,
        frequency: 'daily',
        difficulty: 'easy',
        // Common fields
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
      return ['Cozinha', 'Lavandaria', 'Climatização', 'Entretenimento', 'Limpeza', 'Tecnologia', 'Cuidados pessoais', 'Outros']
    },
    isValid() {
      const baseValid = this.formData.name.trim() && this.formData.category
      
      if (this.isTask) {
        return baseValid && 
               this.formData.points > 0 &&
               this.formData.frequency &&
               this.formData.difficulty
      }
      
      // For appliances, only require name, category, and API type
      return baseValid && this.formData.apiType
    },
    categoryIconMap() {
      if (this.isTask) {
        return {
          'Energia': 'bolt',
          'Mobilidade': 'directions_bus',
          'Reciclagem': 'recycling',
          'Água': 'water_drop',
          'Alimentação': 'restaurant',
          'Consumo': 'shopping_bag',
          'Ambiente': 'park',
          'Limpeza': 'cleaning_services'
        }
      } else {
        return {
          'Cozinha': 'kitchen',
          'Lavandaria': 'local_laundry_service',
          'Climatização': 'ac_unit',
          'Entretenimento': 'tv',
          'Limpeza': 'vacuum',
          'Tecnologia': 'computer',
          'Cuidados pessoais': 'styler',
          'Outros': 'devices'
        }
      }
    },
    defaultCO2Values() {
      return {
        'Energia': 0.2,
        'Mobilidade': 2.5,
        'Reciclagem': 0.5,
        'Água': 0.3,
        'Alimentação': 1.5,
        'Consumo': 0.8,
        'Ambiente': 1.0,
        'Limpeza': 0.4
      }
    },
    defaultPowerConsumption() {
      const typeMap = {
        'refrigerator': 150,
        'washing_machine': 2000,
        'dishwasher': 1800,
        'air_conditioner': 3500,
        'television': 100,
        'desktop': 200,
        'laptop': 50,
        'electricity': 100
      }
      return typeMap[this.formData.apiType] || 100
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
          name: this.item.title || this.item.name || '',
          category: this.item.category || '',
          image: this.item.image || '',
          // Appliance fields
          apiType: this.item.apiType || 'electricity', // Default to 'electricity' if not set
          avgPowerConsumption: this.item.avgPowerConsumption || null,
          // Task fields
          points: this.item.points || null,
          co2Saved: this.item.co2Saved || null,
          frequency: this.item.frequency || 'daily',
          difficulty: this.item.difficulty || 'easy',
          // Common fields
          icon: this.item.icon || '',
          description: this.item.description || '',
        }
      } else {
        this.formData = {
          id: null,
          name: '',
          category: '',
          image: '',
          // Appliance fields
          apiType: '',
          avgPowerConsumption: null,
          // Task fields
          points: null,
          co2Saved: null,
          frequency: 'daily',
          difficulty: 'easy',
          // Common fields
          icon: '',
          description: '',
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
        const folder = this.isTask ? 'bgreen/tasks' : 'bgreen/appliances'
        const result = await uploadImage(file, { folder })
        
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
      
      // Auto-assign icon based on category
      const autoIcon = this.categoryIconMap[this.formData.category] || (this.isTask ? 'check_circle' : 'device_unknown')
      
      const data = {
        id: this.formData.id,
        category: this.formData.category,
        icon: this.formData.icon || autoIcon,
        description: this.formData.description,
        image: this.formData.image || null,
      }
      
      if (this.isTask) {
        // Task-specific fields
        data.title = this.formData.name
        data.points = parseInt(this.formData.points)
        // Use provided CO2 or default based on category
        data.co2Saved = this.formData.co2Saved ? parseFloat(this.formData.co2Saved) : (this.defaultCO2Values[this.formData.category] || 0.5)
        data.frequency = this.formData.frequency
        data.difficulty = this.formData.difficulty
      } else {
        // Appliance-specific fields
        data.name = this.formData.name
        data.apiType = this.formData.apiType
        // Use provided power consumption or default based on API type
        data.avgPowerConsumption = this.formData.avgPowerConsumption ? parseInt(this.formData.avgPowerConsumption) : this.defaultPowerConsumption
        data.avgUsageHoursPerDay = 1 // Default 1 hour, will be specified during actual usage tracking
        data.co2PerKwh = 0.233 // Standard CO2 per kWh for Portugal
      }
      
      this.$emit('save', data)
      this.$emit('close')
    },
  },
}
</script>
