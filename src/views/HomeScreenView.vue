<template>
  <MenuNav :landing="false" />
  
  <!-- Toast Notification -->
  <Transition name="slide-fade">
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <ToastNotification :variant="toastVariant" :message="toastMessage" />
    </div>
  </Transition>

  <!-- Appliance Selection Modal -->
  <SelectionModal
    :isOpen="showApplianceModal"
    title="Selecionar Consumo"
    :items="householdAppliances"
    searchPlaceholder="Pesquisar aparelhos..."
    @close="showApplianceModal = false"
    @select="selectAppliance"
  />

  <!-- Task Selection Modal -->
  <SelectionModal
    :isOpen="showTaskModal"
    title="Selecionar Tarefa"
    :items="householdTasks"
    searchPlaceholder="Pesquisar tarefas..."
    @close="showTaskModal = false"
    @select="selectTask"
  />

  <!-- Consumption Input Modal -->
  <ModalComponent
    :isOpen="showConsumptionInputModal"
    :title="selectedAppliance?.name || 'Registar Consumo'"
    size="sm"
    @close="showConsumptionInputModal = false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-(--system-ring) rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-3xl">
            {{ selectedAppliance?.icon || 'electrical_services' }}
          </span>
        </div>
        <div>
          <h4 class="font-semibold text-(--text-body-titles)">{{ selectedAppliance?.name }}</h4>
          <p class="text-sm text-(--text-body-sub-titles)">{{ selectedAppliance?.category }}</p>
        </div>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-(--text-body-sub-titles)">
          Tempo de utilização
        </label>
        <div class="flex gap-2">
          <input
            v-model="consumptionHours"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            class="flex-1 px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
          />
          <span class="flex items-center px-4 bg-(--system-border) rounded-lg text-(--text-body-sub-titles) font-medium">
            horas
          </span>
        </div>
      </div>
      
      <div v-if="calculatedEmissions !== null" class="bg-(--system-card) border border-(--system-border) rounded-lg p-4">
        <p class="text-sm text-(--text-body-sub-titles)">Emissão estimada:</p>
        <p class="text-2xl font-bold text-(--system-ring)">{{ calculatedEmissions.toFixed(2) }} kg CO2</p>
      </div>
    </div>
    
    <template #footer>
      <button
        @click="showConsumptionInputModal = false"
        class="px-4 py-2 bg-(--system-border) text-(--text-body-titles) rounded-lg font-semibold"
      >
        Cancelar
      </button>
      <button
        @click="submitConsumption"
        :disabled="!consumptionHours || consumptionHours <= 0"
        class="px-4 py-2 bg-(--system-ring) text-white rounded-lg font-semibold disabled:opacity-50"
      >
        Registar
      </button>
    </template>
  </ModalComponent>

  <div class="min-h-fit py-8 flex justify-center">
    <div class="w-[930px] space-y-4">
      <!-- Statistics Section -->
      <CollapsibleCard title="ESTATÍSTICAS">
        <StatisticsChart
          v-if="statistics"
          :data="statistics.last7Days"
          :totalCo2="statistics.totalCo2Saved"
          :totalPoints="statistics.totalPoints"
          :totalTasks="statistics.totalTasks"
          :streak="statistics.streak"
        />
        <div v-else class="w-full h-[260px] flex items-center justify-center text-(--text-body-sub-titles)">
          <div class="text-center">
            <span class="material-symbols-outlined text-6xl mb-4 text-(--system-border)">
              show_chart
            </span>
            <p>A carregar estatísticas...</p>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Consumptions Section -->
      <CollapsibleCard title="CONSUMOS">
        <div class="space-y-2.5">
          <div class="grid grid-cols-3 gap-2.5 flex-wrap">
            <ConsumptionCard
              v-for="usage in recentApplianceUsages"
              :key="usage.id"
              :label="usage.appliance.name"
              :image="getApplianceImage(usage.appliance)"
              unit="hr"
              @submit="(value) => submitApplianceUsage(usage.appliance, value)"
            />
            <AddCard @click="openAddConsumptionModal" />
          </div>
        </div>
      </CollapsibleCard>

      <!-- Tasks Section -->
      <CollapsibleCard title="TAREFAS">
        <div class="space-y-2.5">
          <div class="grid grid-cols-3 gap-2.5 flex-wrap">
            <TaskCard
              v-for="activity in recentTaskCompletions"
              :key="activity.id"
              :label="activity.task.title"
              :image="getTaskImage(activity.task)"
              @click="completeTask(activity.task)"
            />
            <AddCard @click="openAddTaskModal" />
          </div>
        </div>
      </CollapsibleCard>

      <!-- Tools Section -->
      <CollapsibleCard title="FERRAMENTAS">
        <div class="flex gap-2.5">
          <!-- Emission Calculator Tool -->
          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[14px] w-[280px] p-6 flex flex-col gap-6"
          >
            <h3 class="font-bold text-base text-(--text-body-titles) text-center">
              Estimativa de emissão
            </h3>

            <div class="space-y-6">
              <!-- Distance Input -->
              <div class="space-y-2">
                <label class="block text-[10px] font-medium text-(--text-disabled)">
                  Distância percorrida (Km)
                </label>
                <FormInput v-model="calculator.distance" placeholder="50km" type="number" />
              </div>

              <!-- Fuel Consumption Slider -->
              <div class="space-y-2">
                <label class="block text-[10px] font-medium text-(--text-disabled)">
                  Consumo médio (L/100Km) :
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-(--text-disabled)">0</span>
                  <input
                    v-model="calculator.consumption"
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    class="flex-1 h-2 bg-[#e3e3e3] rounded-full appearance-none cursor-pointer accent-(--system-ring)"
                  />
                  <span class="text-[10px] text-(--text-disabled)">10</span>
                </div>
              </div>

              <!-- Fuel Type Checkboxes -->
              <div class="space-y-2">
                <label class="block text-[10px] font-medium text-(--text-disabled)">
                  Tipo de Combustível
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <CheckboxInput v-model="calculator.fuelTypes.gasoline" label="Gasolina" />
                  <CheckboxInput v-model="calculator.fuelTypes.diesel" label="Gasóleo" />
                  <CheckboxInput v-model="calculator.fuelTypes.electric" label="Elétrico" />
                  <CheckboxInput v-model="calculator.fuelTypes.gas" label="Gás" />
                </div>
              </div>
            </div>

            <!-- Calculate Button -->
            <ActionButton @click="calculateEmissions"> Calcular </ActionButton>

            <!-- Result -->
            <div class="flex items-center gap-2 justify-center font-semibold text-[20px]">
              <span
                :class="calculator.result > 0 ? 'text-(--system-ring)' : 'text-(--text-disabled)'"
              >
                {{ calculator.result }}
              </span>
              <span
                :class="calculator.result > 0 ? 'text-(--system-ring)' : 'text-(--text-disabled)'"
              >
                Kg CO2
              </span>
            </div>
          </div>

          <!-- Quick Task Complete Tool -->
          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[14px] w-[280px] p-6 flex flex-col gap-4"
          >
            <h3 class="font-bold text-base text-(--text-body-titles) text-center">
              Tarefa Rápida
            </h3>
            
            <div class="flex-1 space-y-3 max-h-[300px] overflow-y-auto">
              <button
                v-for="task in quickTasks"
                :key="task.id"
                @click="completeTask(task)"
                class="w-full flex items-center gap-3 p-3 bg-(--system-card) border border-(--system-border) rounded-lg hover:border-(--system-ring) transition-colors"
              >
                <span class="material-symbols-outlined text-(--system-ring)">{{ task.icon }}</span>
                <div class="flex-1 text-left">
                  <p class="text-sm font-medium text-(--text-body-titles)">{{ task.title }}</p>
                  <p class="text-xs text-(--semantic-success-default)">+{{ task.points }} pts</p>
                </div>
                <span class="material-symbols-outlined text-(--text-disabled)">add_circle</span>
              </button>
            </div>
          </div>

          <!-- Placeholder Card -->
          <div
            class="border-2 border-(--system-border) rounded-[14px] w-[280px] h-[431px] flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-(--system-ring)" style="font-size: 56px">add</span>
          </div>
        </div>
      </CollapsibleCard>
    </div>
  </div>
  <FooterSection />
  <ChatBot context="general" />
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { calculateApplianceEmissions } from '@/services/carbonApiService'
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import ConsumptionCard from '@/components/ConsumptionCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import AddCard from '@/components/AddCard.vue'
import FormInput from '@/components/FormInput.vue'
import CheckboxInput from '@/components/CheckboxInput.vue'
import ActionButton from '@/components/ActionButton.vue'
import ChatBot from '@/components/ChatBot.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import SelectionModal from '@/components/SelectionModal.vue'
import StatisticsChart from '@/components/StatisticsChart.vue'

export default {
  name: 'HomeScreenView',
  components: {
    MenuNav,
    FooterSection,
    CollapsibleCard,
    ConsumptionCard,
    TaskCard,
    AddCard,
    FormInput,
    CheckboxInput,
    ActionButton,
    ChatBot,
    ToastNotification,
    ModalComponent,
    SelectionModal,
    StatisticsChart,
  },
  data() {
    return {
      // Toast state
      showToast: false,
      toastMessage: '',
      toastVariant: 'success',
      
      // Modals
      showApplianceModal: false,
      showTaskModal: false,
      showConsumptionInputModal: false,
      
      // Selected items
      selectedAppliance: null,
      consumptionHours: '',
      calculatedEmissions: null,
      
      // Calculator
      calculator: {
        distance: '',
        consumption: 5,
        fuelTypes: {
          gasoline: false,
          diesel: false,
          electric: false,
          gas: false,
        },
        result: 0,
      },
      
      // Appliance images mapping
      applianceImages: {
        'Frigorífico': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop',
        'Máquina de lavar roupa': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=200&fit=crop',
        'Máquina de lavar loiça': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop',
        'Forno': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop',
        'Micro-ondas': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=200&fit=crop',
        'Televisão': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop',
        'Ar condicionado': 'https://images.unsplash.com/photo-1631567091586-3eb8a9c46dc9?w=300&h=200&fit=crop',
        'Aspirador': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=200&fit=crop',
        'Computador': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop',
        'Cafeteira': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
      },
      
      // Task images mapping
      taskImages: {
        'Energia': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=250&fit=crop',
        'Mobilidade': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=250&fit=crop',
        'Reciclagem': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=250&fit=crop',
        'Água': 'https://images.unsplash.com/photo-1527100673774-cce25eafaf7f?w=300&h=250&fit=crop',
        'Alimentação': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=250&fit=crop',
        'Consumo': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=250&fit=crop',
        'Ambiente': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=250&fit=crop',
        'Limpeza': 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=300&h=250&fit=crop',
      },
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    householdAppliances() {
      return this.userStore.householdAppliances || []
    },
    householdTasks() {
      return this.userStore.householdTasks || []
    },
    recentApplianceUsages() {
      return this.userStore.recentApplianceUsages(4) || []
    },
    recentTaskCompletions() {
      return this.userStore.recentTaskCompletions(4) || []
    },
    quickTasks() {
      // Return first 5 household tasks for quick access
      return this.householdTasks.slice(0, 5)
    },
    statistics() {
      return this.userStore.getProfileStatistics()
    },
  },
  watch: {
    consumptionHours: {
      handler(value) {
        if (value && this.selectedAppliance) {
          const hours = parseFloat(value)
          if (hours > 0) {
            const energyKwh = (this.selectedAppliance.avgPowerConsumption * hours) / 1000
            this.calculatedEmissions = energyKwh * (this.selectedAppliance.co2PerKwh || 0.233)
          } else {
            this.calculatedEmissions = null
          }
        } else {
          this.calculatedEmissions = null
        }
      },
    },
  },
  async created() {
    await this.userStore.fetchResources()
  },
  methods: {
    showNotification(message, variant = 'success') {
      this.toastMessage = message
      this.toastVariant = variant
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },
    
    getApplianceImage(appliance) {
      return this.applianceImages[appliance.name] || 
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
    },
    
    getTaskImage(task) {
      return this.taskImages[task.category] || 
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=250&fit=crop'
    },
    
    openAddConsumptionModal() {
      this.showApplianceModal = true
    },
    
    openAddTaskModal() {
      this.showTaskModal = true
    },
    
    selectAppliance(appliance) {
      this.selectedAppliance = appliance
      this.consumptionHours = ''
      this.calculatedEmissions = null
      this.showApplianceModal = false
      this.showConsumptionInputModal = true
    },
    
    async selectTask(task) {
      this.showTaskModal = false
      await this.completeTask(task)
    },
    
    async submitApplianceUsage(appliance, hours) {
      const hoursValue = parseFloat(hours)
      if (!hoursValue || hoursValue <= 0) {
        this.showNotification('Introduza um valor válido', 'error')
        return
      }
      
      // Calculate emissions using API
      try {
        const apiResult = await calculateApplianceEmissions(appliance.name, hoursValue)
        const co2Emitted = apiResult.success ? apiResult.data?.carbon_kg_co2 : null
        
        const result = await this.userStore.trackApplianceUsage(
          appliance.id, 
          hoursValue, 
          co2Emitted
        )
        
        if (result.success) {
          this.showNotification(result.message, 'success')
        } else {
          this.showNotification(result.message || 'Erro ao registar consumo', 'error')
        }
      } catch (error) {
        console.error('Error tracking usage:', error)
        this.showNotification('Erro ao registar consumo', 'error')
      }
    },
    
    async submitConsumption() {
      if (!this.selectedAppliance || !this.consumptionHours) return
      
      await this.submitApplianceUsage(this.selectedAppliance, this.consumptionHours)
      this.showConsumptionInputModal = false
      this.selectedAppliance = null
      this.consumptionHours = ''
      this.calculatedEmissions = null
    },
    
    async completeTask(task) {
      try {
        const result = await this.userStore.completeTaskWithApi(task.id)
        
        if (result.success) {
          let message = `${result.message}`
          if (result.leveledUp) {
            message += ` Subiu para o nível ${result.newLevel}! 🎉`
          }
          if (result.newBadges && result.newBadges.length > 0) {
            message += ` Novo badge: ${result.newBadges[0].title}! 🏆`
          }
          this.showNotification(message, 'success')
        } else {
          this.showNotification(result.message || 'Erro ao completar tarefa', 'error')
        }
      } catch (error) {
        console.error('Error completing task:', error)
        this.showNotification('Erro ao completar tarefa', 'error')
      }
    },
    
    async calculateEmissions() {
      const distance = parseFloat(this.calculator.distance) || 0
      const consumption = parseFloat(this.calculator.consumption) || 0

      if (distance <= 0) {
        this.showNotification('Introduza uma distância válida', 'error')
        return
      }

      // Determine fuel type
      let emissionFactor = 2.31 // Default gasoline kg CO2 per liter
      
      if (this.calculator.fuelTypes.diesel) {
        emissionFactor = 2.68 // Diesel
      } else if (this.calculator.fuelTypes.electric) {
        // For electric, use kWh consumption instead
        const kWhPer100km = 18 // Average electric car
        const kWhUsed = (distance * kWhPer100km) / 100
        this.calculator.result = (kWhUsed * 0.188).toFixed(2) // Portugal grid factor
        return
      } else if (this.calculator.fuelTypes.gas) {
        emissionFactor = 1.86 // LPG/Gas
      }

      // Calculate: (distance * consumption / 100) * emission factor
      const fuelUsed = (distance * consumption) / 100
      this.calculator.result = (fuelUsed * emissionFactor).toFixed(2)
    },
  },
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}
</style>
