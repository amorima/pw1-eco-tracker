<template>
  <MenuNav :landing="false" />
  <div class="min-h-screen py-8 flex justify-center">
    <div class="w-[930px] space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1
          class="text-[48px] font-bold text-(--text-body-titles)"
          style="font-family: 'Clash Grotesk', sans-serif"
        >
          Bem-vindo ao b.green!
        </h1>
        <p class="text-lg text-(--text-body-sub-titles)">Configure sua conta em 4 passos</p>
      </div>

      <!-- Progress Indicator -->
      <!-- <div class="flex items-center justify-center gap-2">
        <div
            v-for="step in 4"
            :key="step"
            class="h-2 w-24 rounded-full transition-all"
            :class="currentStep >= step ? 'bg-(--system-ring)' : 'bg-(--system-border)'"
        ></div>
      </div> -->

      <!-- Step 1: Admin Profile Setup -->
      <CollapsibleCard title="1. Configure o seu perfil">
        <div class="space-y-4">
          <p class="text-(--text-body-sub-titles) mb-4">
            Como administrador, você precisa criar seu perfil primeiro.
          </p>

          <FormInput v-model="adminProfile.name" placeholder="Seu nome *" type="text" />

          <div class="flex">
            <FormInput v-model="adminProfile.age" placeholder="Idade (opcional)" type="number" />
          </div>
        </div>
      </CollapsibleCard>

      <!-- Step 2: Account Settings -->
      <CollapsibleCard title="2. Configurações da conta">
        <div class="space-y-4">
          <p class="text-(--text-body-sub-titles) mb-4">
            Defina o número máximo de usuários para sua conta.
          </p>

          <div>
            <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
              Número máximo de usuários *
            </label>
            <FormInput
              v-model="accountSettings.maxUsers"
              placeholder="Numero de Utilizadores"
              type="number"
            />
          </div>

          <div class="bg-[#f0f9ff] border-2 border-(--semantic-info-default) rounded-lg p-4 mt-4">
            <div class="flex gap-2">
              <span class="material-symbols-outlined text-(--semantic-info-default)">info</span>
              <p class="text-sm text-(--semantic-info-default)">
                Você pode alterar este número posteriormente nas configurações da conta.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Step 3: Add Appliances -->
      <CollapsibleCard title="3. Adicione seus eletrodomésticos">
        <div class="space-y-4">
          <p class="text-(--text-body-sub-titles) mb-4">
            Adicione os eletrodomésticos que você deseja monitorar (opcional).
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="appliance in availableAppliances"
              :key="appliance.id"
              @click="toggleAppliance(appliance.id)"
              class="border-2 rounded-lg p-4 cursor-pointer transition-all"
              :class="
                selectedAppliances.includes(appliance.id)
                  ? 'border-(--system-ring) bg-[#f7fee7]'
                  : 'border-(--system-border) bg-white hover:border-(--system-ring)'
              "
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-(--text-body-titles)">
                  {{ appliance.icon }}
                </span>
                <div>
                  <p class="font-semibold text-(--text-body-titles)">{{ appliance.name }}</p>
                  <p class="text-xs text-(--text-body-sub-titles)">{{ appliance.power }}</p>
                </div>
                <span
                  v-if="selectedAppliances.includes(appliance.id)"
                  class="material-symbols-outlined text-(--system-ring) ml-auto"
                >
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Step 4: Add Tasks -->
      <CollapsibleCard title="4. Configure atividades favoritas">
        <div class="space-y-4">
          <p class="text-(--text-body-sub-titles) mb-4">
            Selecione as atividades ecológicas que você mais pratica (opcional).
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="activity in availableTasks"
              :key="activity.id"
              @click="toggleActivity(activity.id)"
              class="border-2 rounded-lg p-4 cursor-pointer transition-all"
              :class="
                selectedTasks.includes(activity.id)
                  ? 'border-(--system-ring) bg-[#f7fee7]'
                  : 'border-(--system-border) bg-white hover:border-(--system-ring)'
              "
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-(--text-body-titles)">
                  {{ activity.icon }}
                </span>
                <div>
                  <p class="font-semibold text-(--text-body-titles)">{{ activity.name }}</p>
                  <p class="text-xs text-(--text-body-sub-titles)">+{{ activity.points }} pontos</p>
                </div>
                <span
                  v-if="selectedTasks.includes(activity.id)"
                  class="material-symbols-outlined text-(--system-ring) ml-auto"
                >
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>
      <div class="flex justify-end mt-4">
        <ActionButton @click="completeSetup"> Finalizar configuração </ActionButton>
      </div>
      <!-- Success Message -->
      <div
        v-if="showSuccess"
        class="bg-[#f0fdf4] border-2 border-[#8cb161] rounded-lg p-6 text-center"
      >
        <span class="material-symbols-outlined text-5xl text-[#8cb161] mb-2">check_circle</span>
        <h2 class="text-2xl font-bold text-(--text-body-titles) mb-2">Configuração concluída!</h2>
        <p class="text-(--text-body-sub-titles) mb-4">Redirecionando para o painel...</p>
      </div>
    </div>
  </div>
  <FooterSection />
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import FormInput from '@/components/FormInput.vue'
import ActionButton from '@/components/ActionButton.vue'
import { useUserStore } from '@/stores/userStore'
import { useTasksStore } from '@/stores/tasksStore'

export default {
  name: 'QuickStartView',
  components: {
    MenuNav,
    FooterSection,
    CollapsibleCard,
    FormInput,
    ActionButton,
  },
  data() {
    return {
      currentStep: 1,
      showSuccess: false,
      adminProfile: {
        name: '',
        email: '',
        age: '',
        avatar: '',
      },
      accountSettings: {
        maxUsers: 4,
      },
      selectedAppliances: [],
      selectedTasks: [],
      availableAppliances: [
        { id: 'fridge', name: 'Frigorífico', icon: 'kitchen', power: '150W' },
        { id: 'washer', name: 'Máquina de Lavar', icon: 'local_laundry_service', power: '500W' },
        { id: 'tv', name: 'Televisão', icon: 'tv', power: '100W' },
        { id: 'ac', name: 'Ar Condicionado', icon: 'ac_unit', power: '1000W' },
        { id: 'oven', name: 'Forno', icon: 'oven', power: '2000W' },
        { id: 'dishwasher', name: 'Máquina de Lavar Louça', icon: 'countertops', power: '1200W' },
        { id: 'heater', name: 'Aquecedor', icon: 'heat', power: '1500W' },
        { id: 'computer', name: 'Computador', icon: 'computer', power: '300W' },
      ],
      availableTasks: [],
    }
  },
  mounted() {
    const TasksStore = useTasksStore()
    this.availableTasks = TasksStore.activityTypes
  },
  methods: {
    toggleAppliance(id) {
      const index = this.selectedAppliances.indexOf(id)
      if (index > -1) {
        this.selectedAppliances.splice(index, 1)
      } else {
        this.selectedAppliances.push(id)
      }
    },
    toggleActivity(id) {
      const index = this.selectedTasks.indexOf(id)
      if (index > -1) {
        this.selectedTasks.splice(index, 1)
      } else {
        this.selectedTasks.push(id)
      }
    },
    completeSetup() {
      const userStore = useUserStore()

      userStore.completeQuickStart({
        adminProfile: this.adminProfile,
        maxProfiles: this.accountSettings.maxUsers,
        appliances: this.selectedAppliances,
        activities: this.selectedTasks,
      })

      this.showSuccess = true

      // Redirect after 2 seconds
      setTimeout(() => {
        this.$router.push({ name: 'admin' })
      }, 2000)
    },
  },
}
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--system-border);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--system-ring);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-body-sub-titles);
}
</style>
