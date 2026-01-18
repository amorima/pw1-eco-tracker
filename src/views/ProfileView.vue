
<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="false" />

    <!-- Toast Notification -->
    <Transition name="slide-fade">
      <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <ToastNotification :variant="toastVariant" :message="toastMessage" />
      </div>
    </Transition>

    <!-- Badge Modal -->
    <BadgeModal
      :isOpen="showBadgeModal"
      :badge="selectedBadge"
      @close="showBadgeModal = false"
    />

    <!-- PIN Setup Modal -->
    <ModalComponent
      :isOpen="showPinModal"
      title="Definir PIN"
      size="sm"
      @close="cancelPinSetup"
    >
      <div class="flex flex-col gap-4">
        <p class="text-(--text-body-sub-titles) text-sm">
          Defina um PIN de 4 dígitos para proteger o seu perfil.
        </p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
              PIN
            </label>
            <input
              v-model="pinInput"
              type="password"
              maxlength="4"
              pattern="[0-9]*"
              inputmode="numeric"
              placeholder="****"
              class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring) text-center text-2xl tracking-widest"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
              Confirmar PIN
            </label>
            <input
              v-model="pinConfirmInput"
              type="password"
              maxlength="4"
              pattern="[0-9]*"
              inputmode="numeric"
              placeholder="****"
              class="w-full px-4 py-3 bg-(--system-card) border-2 border-(--system-border) rounded-lg text-(--text-body) outline-none focus:border-(--system-ring) text-center text-2xl tracking-widest"
            />
          </div>
          <p v-if="pinError" class="text-(--semantic-error-default) text-sm text-center">
            {{ pinError }}
          </p>
        </div>
      </div>
      <template #footer>
        <button
          @click="cancelPinSetup"
          class="px-4 py-2 bg-(--system-border) text-(--text-body-titles) rounded-lg font-semibold"
        >
          Cancelar
        </button>
        <button
          @click="confirmPinSetup"
          :disabled="!isPinValid"
          class="px-4 py-2 bg-(--system-ring) text-white rounded-lg font-semibold disabled:opacity-50"
        >
          Confirmar
        </button>
      </template>
    </ModalComponent>

    <div class="max-w-[912px] mx-auto px-4 py-8 flex flex-col gap-8">
      <!-- Profile Header -->
      <div
        class="bg-(--system-card) border-2 border-(--system-border) flex gap-[16px] items-center p-[16px] relative rounded-[14px] shrink-0 w-full"
      >
        <div
          class="border-2 border-(--system-border) overflow-hidden relative rounded-[999px] shrink-0 w-[100px] h-[100px]"
        >
          <img
            :src="currentProfile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'"
            alt="User avatar"
            class="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full"
          />
        </div>

        <div
          class="basis-0 bg-(--system-card) gap-[16px] grid grid-cols-[fit-content(100%)_fit-content(100%)_minmax(0px,_1fr)] grid-rows-[repeat(2,_fit-content(100%))] grow min-h-px min-w-px overflow-hidden p-[16px] relative rounded-[14px] shrink-0"
        >
          <div
            class="[grid-area:1/1] flex font-['Noto_Sans'] font-normal gap-[8px] items-center justify-center relative shrink-0 text-nowrap"
          >
            <p class="leading-normal relative shrink-0 text-[16px] text-(--text-body-sub-titles)">
              Nome:
            </p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">
              {{ currentProfile?.name || 'Utilizador' }}
            </p>
          </div>
          <div
            class="[grid-area:1/2] flex font-['Noto_Sans'] font-normal gap-[8px] items-center relative shrink-0 text-nowrap"
          >
            <p class="leading-normal relative shrink-0 text-[16px] text-(--text-body-sub-titles)">
              País:
            </p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">
              Portugal
            </p>
          </div>
          <div
            class="[grid-area:1_/_3] flex font-['Noto_Sans'] font-normal gap-[8px] items-center place-self-stretch relative shrink-0 text-nowrap"
          >
            <p class="leading-[1.5] relative shrink-0 text-[16px] text-(--text-body-sub-titles)">
              Contacto:
            </p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">
              {{ userStore.currentUser?.email || 'email@example.com' }}
            </p>
          </div>
          <div
            class="[grid-area:2_/_1] flex font-['Noto_Sans'] font-normal gap-[8px] items-center place-self-stretch relative shrink-0 text-nowrap"
          >
            <p class="leading-[1.5] relative shrink-0 text-[16px] text-(--text-body-sub-titles)">
              Idade:
            </p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">
              {{ currentProfile?.age || '-' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Level & Streak Cards -->
      <div class="flex gap-[16px] items-center relative shrink-0 w-full">
        <!-- Level Card -->
        <div
          class="basis-0 bg-(--system-card) border-2 border-(--system-border) gap-[16px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(2,_fit-content(100%))] grow min-h-px min-w-px overflow-hidden p-[16px] relative rounded-[14px] shrink-0"
        >
          <div
            class="[grid-area:1_/_1] flex flex-col font-['Noto_Sans'] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-(--text-body-sub-titles) text-nowrap"
          >
            <p class="leading-[1.5]">Nível: {{ currentProfile?.level || 1 }}</p>
          </div>
          <div
            class="[grid-area:2_/_1_/_auto_/_span_2] flex flex-col gap-[8px] h-[47px] items-start justify-end justify-self-stretch relative shrink-0"
          >
            <p
              class="font-['Noto_Sans'] font-normal leading-[1.5] min-w-full relative shrink-0 text-[14px] text-(--text-body) w-[min-content]"
            >
              {{ xpInCurrentLevel }}/{{ xpForNextLevel }}xp
            </p>
            <div
              class="bg-(--system-popover) flex h-[8px] items-center overflow-hidden relative rounded-[999px] shrink-0 w-full"
            >
              <div
                class="bg-(--system-ring) h-full rounded-[999px] shrink-0 transition-all duration-500"
                :style="{ width: `${xpPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Streak Card -->
        <div
          class="basis-0 bg-(--system-card) border-2 border-(--system-border) gap-[24px] grid grid-cols-[repeat(2,_fit-content(100%))] grid-rows-[repeat(2,_fit-content(100%))] grow min-h-px min-w-px overflow-hidden p-[16px] relative rounded-[14px] shrink-0"
        >
          <p
            class="[grid-area:1_/_1] font-['Noto_Sans'] font-normal leading-[1.5] relative self-start shrink-0 text-[16px] text-(--text-body-sub-titles) w-[200px]"
          >
            Streak
          </p>
          <div class="[grid-area:2_/_1] flex items-start justify-between relative shrink-0">
            <StreakButton
              v-for="(day, index) in weekDaysStreak"
              :key="index"
              :day="day.label"
              :completed="day.completed"
            />
          </div>
          <div class="[grid-area:1_/_2_/_span_2] justify-self-end">
            <StreakCard :days="currentProfile?.streak || 0" />
          </div>
        </div>
      </div>

      <!-- Badges Section -->
      <CollapsibleCard title="Badges" icon="apps">
        <div
          class="grid grid-cols-3 gap-[8px] w-full items-start overflow-hidden px-0 py-[16px] relative shrink-0 w-full"
        >
          <BadgeCard
            v-for="badge in allBadgesWithStatus"
            :key="badge.id"
            :icon="badge.icon"
            :title="badge.title"
            :locked="!badge.earned"
            @click="openBadgeModal(badge)"
          />
        </div>
      </CollapsibleCard>

      <!-- Ranking Section -->
      <CollapsibleCard title="Ranking" icon="apps">
        <div
          class="flex flex-col gap-[8px] items-start overflow-hidden px-0 py-[8px] relative shrink-0 w-full"
        >
          <RankingRow
            v-for="profile in householdLeaderboard"
            :key="profile.id"
            :position="profile.rank"
            :name="profile.name"
            :highlight="profile.id === currentProfile?.id"
          />
        </div>
      </CollapsibleCard>

      <!-- Challenges Section -->
      <CollapsibleCard title="Desafios" icon="apps">
        <div
          v-if="profileChallenges.length > 0"
          class="gap-[8px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(3,_fit-content(100%))] relative shrink-0 w-full"
        >
          <ChallengeCard
            v-for="challenge in profileChallenges"
            :key="challenge.id"
            :title="challenge.title"
            :description="challenge.description"
            :progress="challenge.progress"
            :xp="challenge.xp"
            :active="challenge.completed"
          />
        </div>
        <div v-else class="text-center py-8 text-(--text-disabled)">
          <span class="material-symbols-outlined text-4xl mb-2">emoji_events</span>
          <p>Nenhum desafio ativo no momento.</p>
          <p class="text-sm">O administrador pode criar desafios para a família.</p>
        </div>
      </CollapsibleCard>

      <!-- Rewards Section -->
      <CollapsibleCard title="Recompensas" icon="apps">
        <!-- Tab Navigation -->
        <div class="flex items-center justify-between px-0 py-[8px] relative shrink-0 w-full">
          <button
            @click="rewardTab = 'redeem'"
            :class="[
              'flex flex-col items-center justify-center px-0 py-[8px] relative shrink-0',
              rewardTab === 'redeem'
                ? 'border-b-2 border-(--text-body-sub-titles)'
                : 'border-b border-(--system-border)',
            ]"
          >
            <p
              :class="[
                'font-[\'Noto_Sans\'] font-bold leading-[1.5] relative shrink-0 text-[16px] text-center w-[440px]',
                rewardTab === 'redeem' ? 'text-(--text-body-sub-titles)' : 'text-(--text-disabled)',
              ]"
            >
              Resgatar pontos
            </p>
          </button>
          <button
            @click="rewardTab = 'redeemed'"
            :class="[
              'basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px px-0 py-[8px] relative shrink-0',
              rewardTab === 'redeemed'
                ? 'border-b-2 border-(--text-body-sub-titles)'
                : 'border-b border-(--system-border)',
            ]"
          >
            <p
              :class="[
                'font-[\'Noto_Sans\'] font-bold leading-[1.5] relative shrink-0 text-[16px] text-center w-full',
                rewardTab === 'redeemed'
                  ? 'text-(--text-body-sub-titles)'
                  : 'text-(--text-disabled)',
              ]"
            >
              Pontos resgatados ({{ redeemedRewards.length }})
            </p>
          </button>
        </div>

        <!-- Search -->
        <div class="flex gap-[10px] items-start relative shrink-0 w-full mb-4">
          <div
            class="basis-0 flex flex-col gap-[4px] grow h-[40px] items-start min-h-px min-w-px relative shrink-0"
          >
            <div
              class="basis-0 bg-(--system-card) border-2 border-(--system-border) grow min-h-px min-w-px overflow-hidden relative rounded-[8px] shrink-0 w-full"
            >
              <input
                v-model="rewardSearch"
                type="text"
                placeholder="Pesquisar . . ."
                class="absolute font-['Noto_Sans'] font-normal leading-[1.5] left-[10px] text-[16px] text-(--text-disabled) top-[6px] bg-transparent border-none outline-none w-[calc(100%-20px)]"
              />
            </div>
          </div>
          <div class="absolute right-[10px] top-[10px] w-[20px] h-[20px]">
            <span class="material-symbols-outlined text-[20px] text-(--text-disabled)">search</span>
          </div>
        </div>

        <!-- Rewards List -->
        <div v-if="rewardTab === 'redeem'">
          <RewardListItem
            v-for="reward in filteredAvailableRewards"
            :key="reward.id"
            :image="reward.image"
            :title="reward.title"
            :points="reward.points"
            @action="redeemReward(reward)"
          />
          <p v-if="filteredAvailableRewards.length === 0" class="text-center py-4 text-(--text-disabled)">
            Nenhuma recompensa disponível
          </p>
        </div>

        <div v-else>
          <p
            class="font-['Noto_Sans'] font-bold leading-[1.5] text-[16px] text-(--text-body-sub-titles) mb-4"
          >
            Histórico:
          </p>
          <RewardListItem
            v-for="reward in redeemedRewards"
            :key="reward.id"
            :image="getRewardImage(reward.rewardId)"
            :title="reward.title"
            :points="reward.pointsCost"
            :date="formatDate(reward.redeemedAt)"
            :status="reward.status"
            @action="cancelReward(reward)"
          />
          <p v-if="redeemedRewards.length === 0" class="text-center py-4 text-(--text-disabled)">
            Nenhuma recompensa resgatada
          </p>
        </div>

        <p
          class="font-['Noto_Sans'] font-semibold leading-[1.5] relative shrink-0 text-[20px] text-(--text-body-titles) text-right w-full mt-4"
        >
          {{ currentProfile?.points || 0 }} pontos
        </p>
      </CollapsibleCard>

      <!-- Settings Section -->
      <CollapsibleCard title="Configurações" icon="apps">
        <div class="flex flex-col gap-[4px] items-start overflow-hidden relative shrink-0 w-full">
          <div
            v-for="setting in settingsList"
            :key="setting.key"
            class="bg-(--system-card) flex items-center justify-between overflow-hidden px-[24px] py-[16px] relative rounded-[10px] shrink-0 w-full"
          >
            <div
              class="flex flex-col gap-[8px] items-start leading-[0] relative shrink-0 text-(--text-body) text-nowrap"
            >
              <div
                class="flex flex-col font-['Noto_Sans'] font-semibold justify-center relative shrink-0 text-[20px]"
              >
                <p class="leading-[1.5] text-nowrap">{{ setting.title }}</p>
              </div>
              <div
                class="flex flex-col font-['Noto_Sans'] font-normal justify-center relative shrink-0 text-[16px]"
              >
                <p class="leading-[1.5] text-nowrap">{{ setting.description }}</p>
              </div>
            </div>
            <ToggleSwitch v-model="localSettings[setting.key]" @update:modelValue="saveSettings" />
          </div>
        </div>
      </CollapsibleCard>
    </div>


    <!-- ChatBot -->
    <ChatBot context="profile" />
  </div>
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import StreakCard from '@/components/StreakCard.vue'
import StreakButton from '@/components/StreakButton.vue'
import BadgeCard from '@/components/BadgeCard.vue'
import BadgeModal from '@/components/BadgeModal.vue'
import RankingRow from '@/components/RankingRow.vue'
import ChallengeCard from '@/components/ChallengeCard.vue'
import RewardListItem from '@/components/RewardListItem.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ChatBot from '@/components/ChatBot.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'ProfileView',
  components: {
    MenuNav,
    FooterSection,
    CollapsibleCard,
    StreakCard,
    StreakButton,
    BadgeCard,
    BadgeModal,
    RankingRow,
    ChallengeCard,
    RewardListItem,
    ToggleSwitch,
    ModalComponent,
    ChatBot,
    ToastNotification,
  },
  data() {
    return {
      // Toast State
      showToast: false,
      toastMessage: '',
      toastVariant: 'success',

      // Badge Modal
      showBadgeModal: false,
      selectedBadge: null,

      // PIN Setup Modal
      showPinModal: false,
      pinInput: '',
      pinConfirmInput: '',
      pinError: '',

      // Rewards
      rewardTab: 'redeem',
      rewardSearch: '',
      // Track rewards currently being redeemed to avoid duplicate requests
      redeemingRewards: [],

      // Local settings (to prevent direct mutation)
      localSettings: {
        privateProfile: false,
        notifications: true,
        keepSession: false,
      },

      // Settings list
      settingsList: [
        {
          key: 'privateProfile',
          title: 'Perfil privado',
          description: 'Defina um PIN para aceder ao seu perfil',
        },
        {
          key: 'notifications',
          title: 'Receber notificações',
          description: 'Receba notificações de troca de pontos aprovadas pelo admistrador',
        },
        {
          key: 'keepSession',
          title: 'Manter sessão',
          description: 'Torna este o perfil padrão do dispositivo',
        },
      ],

      // Default challenges (used when admin hasn't set any)
      defaultChallenges: [
        {
          id: 1,
          title: 'Transportes verdes',
          description: 'Use "transportes públicos" ou "bicicleta" 5 vezes',
          target: 5,
          xp: 50,
        },
        {
          id: 2,
          title: 'Reciclar 10 dias seguidos',
          description: 'Contribua para a tarefa "Reciclar Resíduos"',
          target: 10,
          xp: 50,
        },
        {
          id: 3,
          title: 'Casa verde',
          description: 'Contribua para a tarefa "Desligar Equipamentos"',
          target: 20,
          xp: 50,
        },
        {
          id: 4,
          title: 'Reduzir 2kg de emissão de CO2',
          description: 'Contribua para tarefas que reduzam emissões',
          target: 2,
          xp: 50,
        },
        {
          id: 5,
          title: 'Contribuir para a Limpeza',
          description: 'Contribua para a tarefa "Limpezas"',
          target: 5,
          xp: 50,
        },
        {
          id: 6,
          title: 'Tomar banhos rápidos',
          description: 'Complete a tarefa "Duche de 5 minutos" 10 vezes',
          target: 10,
          xp: 50,
        },
      ],
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    currentProfile() {
      return this.userStore.currentProfile
    },
    allBadgesWithStatus() {
      return this.userStore.allBadgesWithStatus
    },
    householdLeaderboard() {
      return this.userStore.householdLeaderboard
    },
    weekDaysStreak() {
      return this.userStore.weekDaysStreak
    },
    xpForNextLevel() {
      return 100 // Each level is 100 XP
    },
    xpInCurrentLevel() {
      const xp = this.currentProfile?.xp || 0
      return xp % 100
    },
    xpPercentage() {
      return (this.xpInCurrentLevel / this.xpForNextLevel) * 100
    },
    availableRewards() {
      return this.userStore.householdRewards || []
    },
    redeemedRewards() {
      return this.currentProfile?.rewardsRedeemed || []
    },
    filteredAvailableRewards() {
      if (!this.rewardSearch) return this.availableRewards
      return this.availableRewards.filter((r) =>
        r.title.toLowerCase().includes(this.rewardSearch.toLowerCase()),
      )
    },
    profileChallenges() {
      const storeChallenges = this.userStore.currentProfileChallenges
      if (storeChallenges && storeChallenges.length > 0) {
        return storeChallenges
      }
      
      // Use default challenges with calculated progress
      const activities = this.currentProfile?.activityHistory || []
      
      return this.defaultChallenges.map(challenge => {
        let progress = 0
        
        // Calculate progress based on challenge type
        switch (challenge.id) {
          case 1: // Transportes verdes
            progress = activities.filter(a => {
              const task = this.userStore.availableTasks.find(t => String(t.id) === String(a.taskId))
              return task?.category === 'Mobilidade'
            }).length
            break
          case 2: // Reciclar
            progress = activities.filter(a => {
              const task = this.userStore.availableTasks.find(t => String(t.id) === String(a.taskId))
              return task?.category === 'Reciclagem'
            }).length
            break
          case 3: // Casa verde (energia)
            progress = activities.filter(a => {
              const task = this.userStore.availableTasks.find(t => String(t.id) === String(a.taskId))
              return task?.category === 'Energia'
            }).length
            break
          case 4: // CO2 saved
            progress = Math.min(this.currentProfile?.co2Saved || 0, challenge.target)
            break
          case 5: // Limpeza
            progress = activities.filter(a => {
              const task = this.userStore.availableTasks.find(t => String(t.id) === String(a.taskId))
              return task?.title?.toLowerCase().includes('limp')
            }).length
            break
          case 6: // Banhos rápidos
            progress = activities.filter(a => {
              const task = this.userStore.availableTasks.find(t => String(t.id) === String(a.taskId))
              return task?.category === 'Água'
            }).length
            break
        }
        
        return {
          ...challenge,
          currentProgress: progress,
          progress: Math.min((progress / challenge.target) * 100, 100),
          completed: progress >= challenge.target,
        }
      })
    },
    isPinValid() {
      return this.pinInput.length === 4 && this.pinInput === this.pinConfirmInput
    },
  },
  watch: {
    currentProfile: {
      handler(profile) {
        if (profile?.settings) {
          this.localSettings = {
            privateProfile: !!profile.settings.pin,
            notifications: profile.settings.notifications ?? true,
            keepSession: profile.settings.defaultDevice ?? false,
          }
        }
      },
      immediate: true,
    },
  },
  async created() {
    // Fetch resources if not loaded
    if (!this.userStore.availableBadges.length) {
      await this.userStore.fetchResources()
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
    openBadgeModal(badge) {
      this.selectedBadge = badge
      this.showBadgeModal = true
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },
    getRewardImage(rewardId) {
      const reward = this.availableRewards.find(r => String(r.id) === String(rewardId))
      return reward?.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
    },
    async saveSettings() {
      if (!this.currentProfile) return

      // If enabling private profile and no PIN is set, open PIN modal
      if (this.localSettings.privateProfile && !this.currentProfile.settings?.pin) {
        this.showPinModal = true
        return
      }

      const settings = {
        pin: this.localSettings.privateProfile ? this.currentProfile.settings?.pin || null : null,
        notifications: this.localSettings.notifications,
        defaultDevice: this.localSettings.keepSession,
      }

      const result = await this.userStore.updateProfileSettings(this.currentProfile.id, settings)
      if (!result.success) {
        this.showNotification('Erro ao guardar configurações', 'error')
      }
    },
    cancelPinSetup() {
      this.pinInput = ''
      this.pinConfirmInput = ''
      this.pinError = ''
      this.showPinModal = false
      // Revert the private profile toggle
      this.localSettings.privateProfile = false
    },
    async confirmPinSetup() {
      if (this.pinInput.length !== 4) {
        this.pinError = 'O PIN deve ter exatamente 4 dígitos'
        return
      }
      if (this.pinInput !== this.pinConfirmInput) {
        this.pinError = 'Os PINs não coincidem'
        return
      }

      const settings = {
        pin: this.pinInput,
        notifications: this.localSettings.notifications,
        defaultDevice: this.localSettings.keepSession,
      }

      const result = await this.userStore.updateProfileSettings(this.currentProfile.id, settings)
      if (result.success) {
        this.showNotification('PIN definido com sucesso', 'success')
        this.showPinModal = false
        this.pinInput = ''
        this.pinConfirmInput = ''
        this.pinError = ''
      } else {
        this.showNotification('Erro ao definir PIN', 'error')
      }
    },
    async redeemReward(reward) {
      // Prevent duplicate submissions for the same reward
      if (this.redeemingRewards.includes(reward.id)) return
      this.redeemingRewards.push(reward.id)

      try {
        if (!this.currentProfile) {
          this.showNotification('Perfil não selecionado', 'error')
          return
        }

        if ((this.currentProfile.points || 0) < reward.points) {
          this.showNotification('Pontos insuficientes!', 'error')
          return
        }

        const result = await this.userStore.redeemReward(reward)
        if (result.success) {
          this.showNotification(`Recompensa "${reward.title}" resgatada! Aguarde aprovação do administrador.`, 'success')
        } else {
          this.showNotification(result.message || 'Erro ao resgatar recompensa', 'error')
        }
      } finally {
        // Ensure we always remove the id from the in-progress list
        this.redeemingRewards = this.redeemingRewards.filter(id => id !== reward.id)
      }
    },
    async cancelReward(reward) {
      if (reward.status !== 'pendente' && reward.status !== 'pending') {
        this.showNotification('Apenas recompensas pendentes podem ser canceladas', 'error')
        return
      }

      const result = await this.userStore.cancelReward(reward.id)
      if (result.success) {
        this.showNotification(`Recompensa cancelada. ${result.pointsReturned} pontos devolvidos!`, 'success')
      } else {
        this.showNotification(result.message || 'Erro ao cancelar recompensa', 'error')
      }
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
