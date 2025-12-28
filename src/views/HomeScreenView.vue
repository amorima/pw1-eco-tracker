<template>
  <MenuNav :landing="false" />
  <div class="min-h-screen py-8 flex justify-center">
    <div class="w-[930px] space-y-4">
      
      <!-- Statistics Section -->
      <CollapsibleCard title="ESTATÍSTICAS">
        <div class="w-full h-[260px] flex items-center justify-center text-(--text-body-sub-titles)">
          <div class="text-center">
            <span class="material-symbols-outlined text-6xl mb-4 text-(--system-border)">
              show_chart
            </span>
            <p>Gráfico de estatísticas em breve</p>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Consumptions Section -->
      <CollapsibleCard title="CONSUMOS">
        <div class="space-y-2.5">
          <!-- First Row -->
          <div class="flex gap-2.5 flex-wrap">
            <ConsumptionCard
              label="Forno"
              image="https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop"
              unit="hr"
              @submit="handleConsumptionSubmit"
            />
            <ConsumptionCard
              label="Máquina de Lavar Roupa"
              image="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=200&fit=crop"
              unit="hr"
              @submit="handleConsumptionSubmit"
            />
            <ConsumptionCard
              label="Televisão"
              image="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop"
              unit="hr"
              @submit="handleConsumptionSubmit"
            />
          </div>

          <!-- Second Row -->
          <div class="flex gap-2.5 flex-wrap">
            <ConsumptionCard
              label="Aquecedor"
              image="https://images.unsplash.com/photo-1585338107529-13afc5F0b198?w=300&h=200&fit=crop"
              unit="hr"
              @submit="handleConsumptionSubmit"
            />
            <ConsumptionCard
              label="Viagem carro"
              image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop"
              unit="km"
              @submit="handleConsumptionSubmit"
            />
            <AddCard @click="openAddConsumptionModal" />
          </div>
        </div>
      </CollapsibleCard>

      <!-- Tasks Section -->
      <CollapsibleCard title="TAREFAS">
        <div class="space-y-2.5">
          <!-- First Row -->
          <div class="flex gap-2.5 flex-wrap">
            <TaskCard
              label="Limpezas"
              image="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=300&h=250&fit=crop"
              @click="handleTaskClick('Limpezas')"
            />
            <TaskCard
              label="Separar resíduos"
              image="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=250&fit=crop"
              @click="handleTaskClick('Separar resíduos')"
            />
            <TaskCard
              label="Usar transportes públicos"
              image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=250&fit=crop"
              @click="handleTaskClick('Transportes públicos')"
            />
          </div>

          <!-- Second Row -->
          <div class="flex gap-2.5 flex-wrap">
            <TaskCard
              label="Desligar Dispositivos"
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=250&fit=crop"
              @click="handleTaskClick('Desligar dispositivos')"
            />
            <TaskCard
              label="Compostagem"
              image="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=250&fit=crop"
              @click="handleTaskClick('Compostagem')"
            />
            <AddCard @click="openAddTaskModal" />
          </div>
        </div>
      </CollapsibleCard>

      <!-- Tools Section -->
      <CollapsibleCard title="FERRAMENTAS">
        <div class="flex gap-2.5">
          <!-- Emission Calculator Tool -->
          <div class="bg-(--system-background) border-2 border-(--system-border) rounded-[14px] w-[280px] p-6 flex flex-col gap-6">
            <h3 class="font-bold text-base text-(--text-body-titles) text-center">
              Estimativa de emissão
            </h3>

            <div class="space-y-6">
              <!-- Distance Input -->
              <div class="space-y-2">
                <label class="block text-[10px] font-medium text-(--text-disabled)">
                  Distância percorrida (Km)
                </label>
                <FormInput
                  v-model="calculator.distance"
                  placeholder="50km"
                  type="number"
                />
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
            <ActionButton @click="calculateEmissions">
              Calcular
            </ActionButton>

            <!-- Result -->
            <div class="flex items-center gap-2 justify-center font-semibold text-[20px]">
              <span :class="calculator.result > 0 ? 'text-(--system-ring)' : 'text-(--text-disabled)'">
                {{ calculator.result }}
              </span>
              <span :class="calculator.result > 0 ? 'text-(--system-ring)' : 'text-(--text-disabled)'">
                Kg CO2
              </span>
            </div>
          </div>

          <!-- Placeholder Cards -->
          <div class="border-2 border-(--system-border) rounded-[14px] w-[280px] h-[431px] flex items-center justify-center">
            <AddCard variant="primary" @click="openToolModal" />
          </div>
          <div class="border-2 border-(--system-border) rounded-[14px] w-[280px] h-[431px] flex items-center justify-center">
            <AddCard variant="primary" @click="openToolModal" />
          </div>
        </div>
      </CollapsibleCard>

    </div>
  </div>
  <FooterSection />
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import ConsumptionCard from '@/components/ConsumptionCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import AddCard from '@/components/AddCard.vue'
import FormInput from '@/components/FormInput.vue'
import CheckboxInput from '@/components/CheckboxInput.vue'
import ActionButton from '@/components/ActionButton.vue'

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
    ActionButton
  },
  data() {
    return {
      calculator: {
        distance: '',
        consumption: 5,
        fuelTypes: {
          gasoline: false,
          diesel: false,
          electric: false,
          gas: false
        },
        result: 0
      }
    }
  },
  methods: {
    handleConsumptionSubmit(data) {
      console.log('Consumption submitted:', data)
      // TODO: Add consumption logging logic
    },
    handleTaskClick(taskName) {
      console.log('Task clicked:', taskName)
      // TODO: Add task completion logic
    },
    openAddConsumptionModal() {
      console.log('Add consumption modal')
      // TODO: Add modal logic
    },
    openAddTaskModal() {
      console.log('Add task modal')
      // TODO: Add modal logic
    },
    openToolModal() {
      console.log('Add tool modal')
      // TODO: Add modal logic
    },
    calculateEmissions() {
      const distance = parseFloat(this.calculator.distance) || 0
      const consumption = parseFloat(this.calculator.consumption) || 0
      
      // Simple calculation: (distance * consumption / 100) * 2.3 kg CO2 per liter
      // This is a simplified calculation
      const fuelUsed = (distance * consumption) / 100
      this.calculator.result = (fuelUsed * 2.3).toFixed(2)
    }
  }
}
</script>
