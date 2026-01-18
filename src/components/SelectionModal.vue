<template>
  <ModalComponent
    :isOpen="isOpen"
    :title="title"
    size="lg"
    @close="$emit('close')"
  >
    <!-- Search -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full px-4 py-3 pr-10 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) placeholder:text-(--text-disabled) outline-none focus:border-(--system-ring)"
        />
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-(--text-disabled)">
          search
        </span>
      </div>
    </div>
    
    <!-- Categories Filter -->
    <div v-if="categories.length > 0" class="flex flex-wrap gap-2 mb-4">
      <button
        @click="selectedCategory = null"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
          selectedCategory === null
            ? 'bg-(--system-ring) text-white'
            : 'bg-(--system-border) text-(--text-body-sub-titles) hover:bg-(--system-ring) hover:text-white'
        ]"
      >
        Todos
      </button>
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
          selectedCategory === category
            ? 'bg-(--system-ring) text-white'
            : 'bg-(--system-border) text-(--text-body-sub-titles) hover:bg-(--system-ring) hover:text-white'
        ]"
      >
        {{ category }}
      </button>
    </div>
    
    <!-- Items List -->
    <div class="max-h-[400px] overflow-y-auto space-y-2">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        @click="selectItem(item)"
        class="flex items-center gap-4 p-4 bg-(--system-card) border border-(--system-border) rounded-lg cursor-pointer hover:border-(--system-ring) transition-colors"
      >
        <!-- Icon -->
        <div class="w-12 h-12 bg-(--system-ring) rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-2xl">
            {{ item.icon || 'category' }}
          </span>
        </div>
        
        <!-- Info -->
        <div class="flex-1">
          <h4 class="font-semibold text-(--text-body-titles)">
            {{ item.name || item.title }}
          </h4>
          <p class="text-sm text-(--text-body-sub-titles)">
            {{ item.category }}
          </p>
          <p v-if="item.description" class="text-xs text-(--text-disabled) mt-1">
            {{ item.description }}
          </p>
        </div>
        
        <!-- Stats -->
        <div class="text-right">
          <p v-if="item.points" class="text-sm font-semibold text-(--system-ring)">
            +{{ item.points }} pts
          </p>
          <p v-if="item.co2Saved" class="text-xs text-(--semantic-success-default)">
            -{{ item.co2Saved }} kg CO2
          </p>
          <p v-if="item.avgPowerConsumption" class="text-xs text-(--text-disabled)">
            {{ item.avgPowerConsumption }}W
          </p>
        </div>
        
        <!-- Select Arrow -->
        <span class="material-symbols-outlined text-(--system-ring)">
          chevron_right
        </span>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="text-center py-8">
        <span class="material-symbols-outlined text-5xl text-(--text-disabled)">
          search_off
        </span>
        <p class="mt-2 text-(--text-disabled)">Nenhum item encontrado</p>
      </div>
    </div>
    
    <template #footer>
      <button
        @click="$emit('close')"
        class="px-6 py-2 bg-(--system-border) text-(--text-body-titles) rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Cancelar
      </button>
    </template>
  </ModalComponent>
</template>

<script>
import ModalComponent from './ModalComponent.vue'

export default {
  name: 'SelectionModal',
  components: {
    ModalComponent,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Selecionar',
    },
    items: {
      type: Array,
      default: () => [],
    },
    searchPlaceholder: {
      type: String,
      default: 'Pesquisar...',
    },
  },
  emits: ['close', 'select'],
  data() {
    return {
      searchQuery: '',
      selectedCategory: null,
    }
  },
  computed: {
    categories() {
      const cats = new Set()
      this.items.forEach(item => {
        if (item.category) cats.add(item.category)
      })
      return Array.from(cats).sort()
    },
    filteredItems() {
      let result = this.items
      
      if (this.selectedCategory) {
        result = result.filter(item => item.category === this.selectedCategory)
      }
      
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(item => {
          const name = (item.name || item.title || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          const description = (item.description || '').toLowerCase()
          return name.includes(query) || category.includes(query) || description.includes(query)
        })
      }
      
      return result
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.searchQuery = ''
        this.selectedCategory = null
      }
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
  },
}
</script>
