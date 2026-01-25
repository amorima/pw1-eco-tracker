<template>
  <MenuNav :landing="false" :showGridSelector="true" @layout-change="updateLayout" />

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
          <span
            class="flex items-center px-4 bg-(--system-border) rounded-lg text-(--text-body-sub-titles) font-medium"
          >
            horas
          </span>
        </div>
      </div>

      <div
        v-if="calculatedEmissions !== null"
        class="bg-(--system-card) border border-(--system-border) rounded-lg p-4"
      >
        <p class="text-sm text-(--text-body-sub-titles)">Emissão estimada:</p>
        <p class="text-2xl font-bold text-(--system-ring)">
          {{ calculatedEmissions.toFixed(2) }} kg CO2
        </p>
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

  <div class="min-h-fit py-8 flex flex-col items-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-[930px] space-y-6">
      <draggable
        v-model="cardOrder"
        @end="saveCardOrder"
        item-key="id"
        :class="[
          'grid gap-6',
          gridColumns === 1 ? 'grid-cols-1' : '',
          gridColumns === 2 ? 'grid-cols-1 md:grid-cols-2' : '',
          gridColumns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : '',
        ]"
        handle=".drag-handle"
        :animation="200"
        ghost-class="ghost-card"
      >
        <template #item="{ element }">
          <div :class="{ 'col-span-full': element === 'statistics' && gridColumns > 1 }">
            <!-- Wrapper div to handle col-span logic if needed, e.g. Statistics always full width -->
            <CollapsibleCard
              v-if="element === 'statistics'"
              title="ESTATÍSTICAS"
              v-model="cardOpenStates.statistics"
              class="h-full"
            >
              <div v-if="statistics" class="flex flex-col gap-6">
                <!-- Summary Grid -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- CO2 Efetivo Card -->
                  <div
                    class="bg-(--system-card) border border-(--system-border) rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:border-(--system-ring)"
                  >
                    <div
                      :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        statistics.totalEffectiveCo2 <= 0
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
                      ]"
                    >
                      <span class="material-symbols-outlined">
                        {{ statistics.totalEffectiveCo2 <= 0 ? 'eco' : 'cloud' }}
                      </span>
                    </div>
                    <div class="text-center">
                      <p
                        :class="[
                          'text-2xl font-bold',
                          statistics.totalEffectiveCo2 <= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400',
                        ]"
                      >
                        {{ statistics.totalEffectiveCo2 <= 0 ? '+' : ''
                        }}{{ Math.abs(statistics.totalEffectiveCo2).toFixed(1) }}
                      </p>
                      <p class="text-xs text-(--text-body-sub-titles) uppercase font-semibold">
                        kg CO₂ efetivo
                      </p>
                    </div>
                  </div>

                  <!-- Points Card -->
                  <div
                    class="bg-(--system-card) border border-(--system-border) rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:border-(--system-ring)"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400"
                    >
                      <span class="material-symbols-outlined">emoji_events</span>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-(--text-body-titles)">
                        {{ statistics.totalPoints }}
                      </p>
                      <p class="text-xs text-(--text-body-sub-titles) uppercase font-semibold">
                        Pontos
                      </p>
                    </div>
                  </div>

                  <!-- Tasks Card -->
                  <div
                    class="bg-(--system-card) border border-(--system-border) rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:border-(--system-ring)"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
                    >
                      <span class="material-symbols-outlined">task_alt</span>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-(--text-body-titles)">
                        {{ statistics.totalTasks }}
                      </p>
                      <p class="text-xs text-(--text-body-sub-titles) uppercase font-semibold">
                        Tarefas
                      </p>
                    </div>
                  </div>

                  <!-- Streak Card -->
                  <div
                    class="bg-(--system-card) border border-(--system-border) rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:border-(--system-ring)"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400"
                    >
                      <span class="material-symbols-outlined">local_fire_department</span>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-(--text-body-titles)">
                        {{ statistics.streak }}
                      </p>
                      <p class="text-xs text-(--text-body-sub-titles) uppercase font-semibold">
                        Dias Streak
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Chart Container -->
                <StatisticsChart
                  :data="statistics.last7Days"
                  :showCo2="true"
                  :showEffectiveCo2="true"
                  :showPoints="true"
                  co2Label="CO₂ Efetivo (kg)"
                  pointsColor="var(--semantic-warning-default)"
                />
              </div>
              <div
                v-else
                class="w-full h-[260px] flex items-center justify-center text-(--text-body-sub-titles)"
              >
                <div class="text-center">
                  <span class="material-symbols-outlined text-6xl mb-4 text-(--system-border)">
                    show_chart
                  </span>
                  <p>A carregar estatísticas...</p>
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              v-else-if="element === 'consumptions'"
              title="CONSUMOS"
              v-model="cardOpenStates.consumptions"
              class="h-full"
            >
              <div class="space-y-2.5">
                <div
                  :class="[
                    'grid gap-2.5',
                    gridColumns === 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
                  ]"
                >
                  <ConsumptionCard
                    v-for="usage in recentApplianceUsages"
                    :key="usage.id"
                    :label="usage.appliance.name"
                    :image="usage.appliance.image || getApplianceImage(usage.appliance)"
                    :energyConsumed="usage.energy_consumed"
                    :powerWatts="usage.device_power_watts || usage.appliance.powerWatts"
                    unit="hr"
                    @submit="(value) => submitApplianceUsage(usage.appliance, value)"
                  />
                  <AddCard @click="openAddConsumptionModal" />
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              v-else-if="element === 'tasks'"
              title="TAREFAS"
              v-model="cardOpenStates.tasks"
              class="h-full"
            >
              <div class="space-y-2.5">
                <div
                  :class="[
                    'grid gap-2.5',
                    gridColumns === 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
                  ]"
                >
                  <TaskCard
                    v-for="activity in recentTaskCompletions"
                    :key="activity.id"
                    :label="activity.task.title"
                    :image="activity.task.image || getTaskImage(activity.task)"
                    @click="completeTask(activity.task)"
                  />
                  <AddCard @click="openAddTaskModal" />
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              v-else-if="element === 'tools'"
              title="FERRAMENTAS"
              v-model="cardOpenStates.tools"
              class="h-full"
            >
              <div
                :class="[
                  'flex gap-4 overflow-x-auto pb-2',
                  gridColumns === 1 ? 'flex-col lg:flex-row' : 'flex-col',
                ]"
              >
                <!-- Emission Calculator Tool -->
                <div
                  :class="[
                    'bg-(--system-background) border-2 border-(--system-border) rounded-[14px] shrink-0 p-6 flex flex-col gap-6',
                    gridColumns === 1 ? 'w-full lg:w-[280px]' : 'w-full',
                  ]"
                >
                  <h3 class="font-bold text-base text-(--text-body-titles) text-center">
                    Transporte Pessoal
                  </h3>

                  <div class="space-y-6">
                    <!-- Distance Input -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-medium text-(--text-disabled)">
                        Distância percorrida (Km)
                      </label>
                      <FormInput v-model="tools.car.amount" placeholder="50" type="number" />
                    </div>

                    <!-- Fuel Type Radio Buttons -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-medium text-(--text-disabled)">
                        Tipo de Combustível
                      </label>
                      <div class="flex flex-col gap-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            v-model="tools.car.type"
                            value="car_gasoline"
                            class="accent-(--system-ring) w-4 h-4"
                          />
                          <span class="text-sm text-(--text-body)">Gasolina</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            v-model="tools.car.type"
                            value="car_diesel"
                            class="accent-(--system-ring) w-4 h-4"
                          />
                          <span class="text-sm text-(--text-body)">Gasóleo</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            v-model="tools.car.type"
                            value="car_electric"
                            class="accent-(--system-ring) w-4 h-4"
                          />
                          <span class="text-sm text-(--text-body)">Elétrico</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Calculate Button -->
                  <ActionButton @click="calculateTool('car')" :disabled="tools.car.loading">
                    {{ tools.car.loading ? 'A calcular...' : 'Calcular' }}
                  </ActionButton>

                  <!-- Result -->
                  <div class="flex items-center gap-2 justify-center font-semibold text-[20px]">
                    <span
                      :class="
                        tools.car.result !== null
                          ? 'text-(--system-ring)'
                          : 'text-(--text-disabled)'
                      "
                    >
                      {{ tools.car.result !== null ? tools.car.result : '0.00' }}
                    </span>
                    <span
                      :class="
                        tools.car.result !== null
                          ? 'text-(--system-ring)'
                          : 'text-(--text-disabled)'
                      "
                    >
                      Kg CO2
                    </span>
                  </div>
                </div>

                <!-- Food Impact Tool -->
                <div
                  :class="[
                    'bg-(--system-background) border-2 border-(--system-border) rounded-[14px] shrink-0 p-6 flex flex-col gap-6',
                    gridColumns === 1 ? 'w-full lg:w-[280px]' : 'w-full',
                  ]"
                >
                  <h3 class="font-bold text-base text-(--text-body-titles) text-center">
                    Impacto Alimentar
                  </h3>

                  <div class="space-y-6">
                    <!-- Meals Input -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-medium text-(--text-disabled)">
                        Número de refeições
                      </label>
                      <FormInput v-model="tools.food.amount" placeholder="1" type="number" />
                    </div>

                    <!-- Diet Type Radio Buttons -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-medium text-(--text-disabled)">
                        Tipo de Refeição
                      </label>
                      <div class="flex flex-col gap-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            v-model="tools.food.type"
                            value="meal_meat"
                            class="accent-(--system-ring) w-4 h-4"
                          />
                          <span class="text-sm text-(--text-body)">Com Carne</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            v-model="tools.food.type"
                            value="meal_vegetarian"
                            class="accent-(--system-ring) w-4 h-4"
                          />
                          <span class="text-sm text-(--text-body)">Vegetariana</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            v-model="tools.food.type"
                            value="meal_vegan"
                            class="accent-(--system-ring) w-4 h-4"
                          />
                          <span class="text-sm text-(--text-body)">Vegan</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Calculate Button -->
                  <ActionButton @click="calculateTool('food')" :disabled="tools.food.loading">
                    {{ tools.food.loading ? 'A calcular...' : 'Calcular' }}
                  </ActionButton>

                  <!-- Result -->
                  <div class="flex items-center gap-2 justify-center font-semibold text-[20px]">
                    <span
                      :class="
                        tools.food.result !== null
                          ? 'text-(--system-ring)'
                          : 'text-(--text-disabled)'
                      "
                    >
                      {{ tools.food.result !== null ? tools.food.result : '0.00' }}
                    </span>
                    <span
                      :class="
                        tools.food.result !== null
                          ? 'text-(--system-ring)'
                          : 'text-(--text-disabled)'
                      "
                    >
                      Kg CO2
                    </span>
                  </div>
                </div>

                <!-- General Calculator Tool -->
                <div
                  :class="[
                    'bg-(--system-background) border-2 border-(--system-border) rounded-[14px] shrink-0 p-6 flex flex-col gap-6',
                    gridColumns === 1 ? 'w-full lg:w-[280px]' : 'w-full',
                  ]"
                >
                  <h3 class="font-bold text-base text-(--text-body-titles) text-center">
                    Calculadora Geral
                  </h3>

                  <div class="space-y-6">
                    <!-- Type Select -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-medium text-(--text-disabled)">
                        Tipo de Emissão
                      </label>
                      <select
                        v-model="tools.general.type"
                        class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring)"
                      >
                        <option v-for="opt in generalOptions" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                        </option>
                      </select>
                    </div>

                    <!-- Amount Input -->
                    <div class="space-y-2">
                      <label class="block text-[10px] font-medium text-(--text-disabled)">
                        Quantidade ({{ currentGeneralUnit }})
                      </label>
                      <FormInput
                        v-model="tools.general.amount"
                        :placeholder="currentGeneralUnit"
                        type="number"
                      />
                    </div>
                  </div>

                  <!-- Calculate Button -->
                  <ActionButton @click="calculateTool('general')" :disabled="tools.general.loading">
                    {{ tools.general.loading ? 'A calcular...' : 'Calcular' }}
                  </ActionButton>

                  <!-- Result -->
                  <div class="flex items-center gap-2 justify-center font-semibold text-[20px]">
                    <span
                      :class="
                        tools.general.result !== null
                          ? 'text-(--system-ring)'
                          : 'text-(--text-disabled)'
                      "
                    >
                      {{ tools.general.result !== null ? tools.general.result : '0.00' }}
                    </span>
                    <span
                      :class="
                        tools.general.result !== null
                          ? 'text-(--system-ring)'
                          : 'text-(--text-disabled)'
                      "
                    >
                      Kg CO2
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleCard>
          </div>
        </template>
      </draggable>
    </div>
  </div>
  <ChatBot context="general" />
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { calculateApplianceEmissions, calculateEmissions } from '@/services/carbonApiService'
import draggable from 'vuedraggable'
import MenuNav from '@/components/MenuNav.vue'
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
    draggable,
    MenuNav,
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

      // Tools Data
      tools: {
        car: {
          amount: '',
          type: 'car_gasoline',
          result: null,
          loading: false,
        },
        food: {
          amount: '',
          type: 'meal_meat',
          result: null,
          loading: false,
        },
        general: {
          amount: '',
          type: 'electricity',
          result: null,
          loading: false,
        },
      },
      generalOptions: [
        { value: 'bus', label: 'Autocarro', unit: 'Km' },
        { value: 'train', label: 'Comboio', unit: 'Km' },
        { value: 'plane_short', label: 'Avião (Curta Dist.)', unit: 'Km' },
        { value: 'plane_long', label: 'Avião (Longa Dist.)', unit: 'Km' },
        { value: 'electricity', label: 'Eletricidade', unit: 'kWh' },
        { value: 'natural_gas', label: 'Gás Natural', unit: 'kWh' },
        { value: 'waste_general', label: 'Lixo Indiferenciado', unit: 'Kg' },
        { value: 'waste_recycled', label: 'Lixo Reciclado', unit: 'Kg' },
        { value: 'water', label: 'Água', unit: 'm³' },
      ],

      // Appliance images mapping
      applianceImages: {
        Frigorífico:
          'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop',
        'Máquina de lavar roupa':
          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=200&fit=crop',
        'Máquina de lavar loiça':
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop',
        Forno: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop',
        'Micro-ondas':
          'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=200&fit=crop',
        Televisão:
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop',
        'Ar condicionado':
          'https://images.unsplash.com/photo-1631567091586-3eb8a9c46dc9?w=300&h=200&fit=crop',
        Aspirador: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=200&fit=crop',
        Computador:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop',
        Cafeteira:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
      },

      // Task images mapping
      taskImages: {
        Energia:
          'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=250&fit=crop',
        Mobilidade:
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=250&fit=crop',
        Reciclagem:
          'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=250&fit=crop',
        Água: 'https://images.unsplash.com/photo-1527100673774-cce25eafaf7f?w=300&h=250&fit=crop',
        Alimentação:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=250&fit=crop',
        Consumo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=250&fit=crop',
        Ambiente:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=250&fit=crop',
        Limpeza:
          'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=300&h=250&fit=crop',
      },

      // Card order
      cardOrder: ['statistics', 'consumptions', 'tasks', 'tools'],

      // Card open states
      cardOpenStates: {
        statistics: true,
        consumptions: true,
        tasks: true,
        tools: true,
      },

      // Dashboard Layout State
      gridColumns: 1,
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
      return this.userStore.recentApplianceUsages(5) || []
    },
    recentTaskCompletions() {
      return this.userStore.recentTaskCompletions(5) || []
    },
    quickTasks() {
      // Return first 5 household tasks for quick access
      return this.householdTasks.slice(0, 5)
    },
    statistics() {
      return this.userStore.getProfileStatistics()
    },
    orderedCards() {
      const cards = {
        statistics: { id: 'statistics', title: 'ESTATÍSTICAS', component: 'statistics' },
        consumptions: { id: 'consumptions', title: 'CONSUMOS', component: 'consumptions' },
        tasks: { id: 'tasks', title: 'TAREFAS', component: 'tasks' },
        tools: { id: 'tools', title: 'FERRAMENTAS', component: 'tools' },
      }
      return this.cardOrder.map((id) => cards[id])
    },
    currentGeneralUnit() {
      const option = this.generalOptions.find((o) => o.value === this.tools.general.type)
      return option ? option.unit : 'Unidades'
    },
  },
  watch: {
    consumptionHours: {
      handler(value) {
        if (value && this.selectedAppliance) {
          const hours = parseFloat(value)
          if (hours > 0) {
            const energyKwh = (this.selectedAppliance.powerWatts * hours) / 1000
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
    // Load saved card order from localStorage
    const savedOrder = localStorage.getItem('homeCardOrder')
    if (savedOrder) {
      try {
        this.cardOrder = JSON.parse(savedOrder)
      } catch (e) {
        console.error('Error loading card order:', e)
      }
    }

    // Load saved grid layout preference
    const savedGrid = localStorage.getItem('homeGridColumns')
    if (savedGrid) {
      this.gridColumns = parseInt(savedGrid)
    }
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
      return (
        this.applianceImages[appliance.name] ||
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
      )
    },

    getTaskImage(task) {
      return (
        this.taskImages[task.category] ||
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=250&fit=crop'
      )
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

    updateLayout(columns) {
      this.gridColumns = columns
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

      // Calculate emissions using API first
      try {
        const apiResult = await calculateApplianceEmissions(appliance, hoursValue)

        // Pass the API data to the store function
        const result = await this.userStore.trackApplianceUsage(
          appliance.id,
          hoursValue,
          apiResult.success ? apiResult.data : null,
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

    saveCardOrder() {
      localStorage.setItem('homeCardOrder', JSON.stringify(this.cardOrder))
    },

    // Watch for grid changes to save preference
    saveGridPreference() {
      localStorage.setItem('homeGridColumns', this.gridColumns.toString())
    },

    async calculateTool(toolName) {
      const tool = this.tools[toolName]
      const amount = parseFloat(tool.amount)

      if (!amount || amount <= 0) {
        this.showNotification('Introduza um valor válido', 'error')
        return
      }

      tool.loading = true
      try {
        const result = await calculateEmissions(tool.type, amount)

        if (result.success) {
          tool.result = result.data.carbon_kg_co2
        } else {
          this.showNotification(result.message || 'Erro ao calcular', 'error')
        }
      } catch (error) {
        console.error('Erro no cálculo:', error)
        this.showNotification('Erro de conexão', 'error')
      } finally {
        tool.loading = false
      }
    },
  },
  watch: {
    gridColumns() {
      this.saveGridPreference()
    },
    // ... existing watchers
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

.ghost-card {
  opacity: 0.5;
}
</style>
