<template>
  <MenuNav :landing="false" />

  <!-- Toast Notification -->
  <Transition name="slide-fade">
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <ToastNotification :variant="toastVariant" :message="toastMessage" />
    </div>
  </Transition>

  <div class="min-h-screen py-4 md:py-8 flex justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-[930px] space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1
          class="text-3xl sm:text-4xl lg:text-[48px] font-bold text-(--text-body-titles)"
          style="font-family: 'Clash Grotesk', sans-serif"
        >
          Bem-vindo ao b.green!
        </h1>
        <p class="text-base sm:text-lg text-(--text-body-sub-titles)">
          Configure sua conta em 4 passos
        </p>
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
            <FormInput
              v-model="adminProfile.birthDate"
              placeholder="Data de nascimento (opcional)"
              type="date"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
              PIN de Segurança *
            </label>
            <FormInput
              v-model="adminProfile.pin"
              placeholder="PIN de 4 dígitos"
              type="password"
              maxlength="4"
              pattern="[0-9]{4}"
            />
            <p class="text-xs text-(--text-body-sub-titles) mt-1">
              Este PIN protegerá o seu perfil e o acesso ao painel de administração.
            </p>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Step 2: Account Settings -->
      <CollapsibleCard title="2. Configurações da conta">
        <div class="space-y-4">
          <p class="text-(--text-body-sub-titles) mb-4">
            Defina o número máximo de utilizadores para sua conta.
          </p>

          <div>
            <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
              Número máximo de utilizadores *
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div
              v-for="appliance in appliancesWithIcons"
              :key="appliance.id"
              @click="toggleAppliance(appliance.id)"
              class="border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all"
              :class="
                selectedAppliances.includes(appliance.id)
                  ? 'border-(--system-ring) bg-[#f7fee7]'
                  : 'border-(--system-border) bg-white hover:border-(--system-ring)'
              "
            >
              <div class="flex items-center gap-2 md:gap-3">
                <span
                  class="material-symbols-outlined text-xl md:text-2xl text-(--text-body-titles)"
                >
                  {{ appliance.icon }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-(--text-body-titles) text-sm md:text-base truncate">
                    {{ appliance.name }}
                  </p>
                  <p class="text-xs text-(--text-body-sub-titles)">{{ appliance.powerWatts }}W</p>
                </div>
                <span
                  v-if="selectedAppliances.includes(appliance.id)"
                  class="material-symbols-outlined text-(--system-ring) flex-shrink-0 text-xl md:text-2xl"
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div
              v-for="activity in tasksWithIcons"
              :key="activity.id"
              @click="toggleActivity(activity.id)"
              class="border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all"
              :class="
                selectedTasks.includes(activity.id)
                  ? 'border-(--system-ring) bg-[#f7fee7]'
                  : 'border-(--system-border) bg-white hover:border-(--system-ring)'
              "
            >
              <div class="flex items-center gap-2 md:gap-3">
                <span
                  class="material-symbols-outlined text-xl md:text-2xl text-(--text-body-titles)"
                >
                  {{ activity.icon }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-(--text-body-titles) text-sm md:text-base truncate">
                    {{ activity.title }}
                  </p>
                  <p class="text-xs text-(--text-body-sub-titles)">+{{ activity.points }} pontos</p>
                </div>
                <span
                  v-if="selectedTasks.includes(activity.id)"
                  class="material-symbols-outlined text-(--system-ring) flex-shrink-0 text-xl md:text-2xl"
                >
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>
      <div class="flex justify-center sm:justify-end mt-4 md:mt-6">
        <ActionButton @click="completeSetup" class="w-full sm:w-auto">
          Finalizar configuração
        </ActionButton>
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
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import FormInput from '@/components/FormInput.vue'
import ActionButton from '@/components/ActionButton.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useUserStore } from '@/stores/userStore'
import { mapState } from 'pinia'
import { getApplianceIcon, getTaskIcon } from '@/data/categoryIcons'

export default {
  name: 'QuickStartView',
  components: {
    MenuNav,
    CollapsibleCard,
    FormInput,
    ActionButton,
    ToastNotification,
  },
  data() {
    return {
      currentStep: 1,
      showSuccess: false,
      adminProfile: {
        name: '',
        email: '',
        birthDate: '',
        avatar: '',
        pin: '',
      },
      accountSettings: {
        maxUsers: 4,
      },
      selectedAppliances: [],
      selectedTasks: [],
      // Toast State
      showToast: false,
      toastMessage: '',
      toastVariant: 'success',
      isLoading: false,
    }
  },
  computed: {
    ...mapState(useUserStore, ['availableAppliances', 'availableTasks']),
    appliancesWithIcons() {
      return this.availableAppliances.map((appliance) => ({
        ...appliance,
        icon: getApplianceIcon(appliance.category),
      }))
    },
    tasksWithIcons() {
      return this.availableTasks.map((task) => ({
        ...task,
        icon: getTaskIcon(task.category),
      }))
    },
  },
  async mounted() {
    const userStore = useUserStore()

    await userStore.fetchResources()

    if (
      userStore.currentUser &&
      userStore.currentUser.profiles &&
      userStore.currentUser.profiles.length > 0
    ) {
      const firstProfile = userStore.currentUser.profiles[0]
      this.adminProfile.name = firstProfile.name || ''
      this.adminProfile.birthDate = firstProfile.birthDate || ''
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
    async completeSetup() {
      if (!this.adminProfile.name) {
        this.showNotification('Por favor, defina o nome do administrador.', 'error')
        return
      }

      if (!this.adminProfile.pin || this.adminProfile.pin.length !== 4) {
        this.showNotification('Por favor, defina um PIN de 4 dígitos.', 'error')
        return
      }

      if (!/^[0-9]{4}$/.test(this.adminProfile.pin)) {
        this.showNotification('O PIN deve conter apenas números.', 'error')
        return
      }

      this.isLoading = true
      const userStore = useUserStore()

      try {
        const result = await userStore.completeQuickStart({
          adminProfile: this.adminProfile,
          maxProfiles: this.accountSettings.maxUsers,
          appliances: this.selectedAppliances,
          activities: this.selectedTasks,
        })

        if (result.success) {
          this.showSuccess = true
          // Redirect after 2 seconds
          setTimeout(() => {
            this.$router.push({ name: 'admin' })
          }, 2000)
        } else {
          this.showNotification(result.message || 'Erro ao guardar configurações.', 'error')
        }
      } catch (error) {
        this.showNotification('Erro inesperado.', 'error')
      } finally {
        this.isLoading = false
      }
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
