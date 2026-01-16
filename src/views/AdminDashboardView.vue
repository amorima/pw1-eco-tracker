<template>
  <MenuNav :landing="false" />
  
  <!-- Toast Notification -->
  <Transition name="slide-fade">
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <ToastNotification :variant="toastVariant" :message="toastMessage" />
    </div>
  </Transition>

  <!-- Confirm Modal -->
  <ConfirmModal
    :isOpen="showConfirmModal"
    :title="confirmData.title"
    :message="confirmData.message"
    :variant="confirmData.variant"
    :confirmText="confirmData.confirmText"
    @close="showConfirmModal = false"
    @confirm="confirmData.onConfirm"
  />

  <!-- Profile Edit Modal -->
  <ProfileEditModal
    :isOpen="showProfileModal"
    :profile="selectedProfile"
    @close="showProfileModal = false"
    @save="saveProfile"
  />

  <!-- Reward Edit Modal -->
  <RewardEditModal
    :isOpen="showRewardModal"
    :reward="selectedReward"
    @close="showRewardModal = false"
    @save="saveReward"
  />

  <!-- Item Edit Modal -->
  <ItemEditModal
    :isOpen="showItemModal"
    :item="selectedItem"
    :type="itemModalType"
    @close="showItemModal = false"
    @save="saveItem"
  />

  <div class="p-8 flex justify-center w-full">
    <div class="space-y-4 w-[930px]">
      <!-- Analise rápida mensal -->
      <CollapsibleCard title="Análise rápida mensal">
        <div class="flex gap-4 items-center w-full">
          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">CO2 Evitado</p>
            <p class="font-semibold text-4xl">{{ householdStats.totalCo2.toFixed(1) }} kg</p>
          </div>

          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">Pontos Totais</p>
            <p class="font-semibold text-4xl">{{ householdStats.totalPoints }}</p>
          </div>

          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 flex-1 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">Perfis Ativos</p>
            <p class="font-semibold text-4xl">{{ profiles.length }}</p>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Consumos de energia diários -->
      <CollapsibleCard title="Consumos de energia diários">
        <StatisticsChart
          v-if="dailyStats"
          :data="dailyStats.last7Days"
          :totalCo2="dailyStats.totalCo2Saved"
          :totalPoints="dailyStats.totalPoints"
          :totalTasks="dailyStats.totalTasks"
          :streak="dailyStats.streak"
        />
        <div v-else class="h-[259px] w-full flex items-center justify-center bg-(--system-input-background) rounded-lg">
          <p class="text-(--accent-muted-foreground)">Sem dados disponíveis</p>
        </div>
      </CollapsibleCard>

      <!-- Gestão de utilizadores -->
      <CollapsibleCard title="Gestão de utilizadores">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <UserCard
            v-for="profile in profiles"
            :key="profile.id"
            :user="{
              name: profile.name,
              rank: getProfileRank(profile.id),
              points: profile.points,
              avatar: profile.avatar,
            }"
            @edit="editProfile(profile)"
            @delete="confirmDeleteProfile(profile.id)"
          />
          <UserCard
            v-for="n in emptySlots"
            :key="`empty-${n}`"
            :isEmpty="true"
            @edit="() => {}"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2 text-base text-(--text-body-titles)">
            <p>Nº membros: {{ profiles.length }}</p>
            <p>Nº vagas: {{ maxProfiles - profiles.length }}</p>
          </div>
          <div class="flex gap-2.5">
            <button
              @click="decreaseMaxProfiles"
              :disabled="maxProfiles <= profiles.length"
              class="w-14 h-14 rounded-lg bg-(--system-border) flex items-center justify-center hover:bg-(--system-ring) transition-colors disabled:opacity-30"
            >
              <span class="material-symbols-outlined text-[30px] text-(--text-body-titles)">remove</span>
            </button>
            <button
              @click="increaseMaxProfiles"
              class="w-14 h-14 rounded-lg bg-(--system-border) flex items-center justify-center hover:bg-(--system-ring) transition-colors"
            >
              <span class="material-symbols-outlined text-[30px] text-(--text-body-titles)">add</span>
            </button>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Gestão de recompensas -->
      <CollapsibleCard title="Gestão de recompensas">
        <div class="flex gap-2.5 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="rewardSearch"
              type="text"
              placeholder="Pesquisar . . ."
              class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
            />
            <span class="material-symbols-outlined absolute left-3 top-2 text-(--accent-muted-foreground)">search</span>
          </div>
          <button
            @click="openCreateReward"
            class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center gap-1 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <h3 class="text-lg text-(--text-headings) mb-4">Recompensas Disponíveis</h3>
        <div class="space-y-4 mb-4">
          <div
            v-for="(row, index) in paginatedAvailableRewards"
            :key="`row-${index}`"
            class="flex gap-2.5"
          >
            <RewardCard
              v-for="reward in row"
              :key="reward.id"
              :title="reward.title"
              :points="reward.points"
              :image="reward.image"
              @edit="editReward(reward)"
              @delete="confirmDeleteReward(reward.id)"
            />
          </div>
        </div>

        <button
          v-if="filteredAvailableRewards.length > displayedRewardsCount"
          @click="loadMoreRewards"
          class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg hover:opacity-80 transition-opacity"
        >
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>

        <h3 class="text-lg text-(--text-headings) mt-6 mb-4">Recompensas Resgatadas</h3>
        <div class="space-y-2">
          <RewardRedeemedCard
            v-for="redeemed in paginatedRedeemedRewards"
            :key="redeemed.id"
            :profileName="getProfileName(redeemed.profileId)"
            :title="getRewardTitle(redeemed.rewardId)"
            :date="formatDate(redeemed.redeemedAt)"
            :status="redeemed.status"
            :image="getRewardImage(redeemed.rewardId)"
            @confirm="confirmRedeemedReward(redeemed)"
            @delete="rejectRedeemedReward(redeemed)"
          />
        </div>

        <button
          v-if="allRedeemedRewards.length > displayedRedeemedCount"
          @click="loadMoreRedeemed"
          class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4 hover:opacity-80 transition-opacity"
        >
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </CollapsibleCard>

      <!-- Gestão de consumos -->
      <CollapsibleCard title="Gestão de consumos">
        <div class="flex gap-2.5 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="applianceSearch"
              type="text"
              placeholder="Pesquisar . . ."
              class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
            />
            <span class="material-symbols-outlined absolute left-3 top-2 text-(--accent-muted-foreground)">search</span>
          </div>
          <button
            @click="openCreateAppliance"
            class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center gap-1 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <div class="space-y-2">
          <ItemCard
            v-for="appliance in paginatedAppliances"
            :key="appliance.id"
            :title="appliance.name"
            :category="appliance.category"
            :icon="appliance.icon || 'electrical_services'"
            :type="'consumption'"
            @edit="editAppliance(appliance)"
            @delete="confirmDeleteAppliance(appliance.id)"
          />
        </div>

        <button
          v-if="filteredAppliances.length > displayedAppliancesCount"
          @click="loadMoreAppliances"
          class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4 hover:opacity-80 transition-opacity"
        >
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </CollapsibleCard>

      <!-- Gestão de tarefas -->
      <CollapsibleCard title="Gestão de tarefas">
        <div class="flex gap-2.5 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="taskSearch"
              type="text"
              placeholder="Pesquisar . . ."
              class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
            />
            <span class="material-symbols-outlined absolute left-3 top-2 text-(--accent-muted-foreground)">search</span>
          </div>
          <button
            @click="openCreateTask"
            class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center gap-1 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <div class="space-y-2">
          <ItemCard
            v-for="task in paginatedTasks"
            :key="task.id"
            :title="task.title"
            :category="task.category"
            :icon="task.icon || 'task_alt'"
            :points="task.points"
            :type="'task'"
            @edit="editTask(task)"
            @delete="confirmDeleteTask(task.id)"
          />
        </div>

        <button
          v-if="filteredTasks.length > displayedTasksCount"
          @click="loadMoreTasks"
          class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4 hover:opacity-80 transition-opacity"
        >
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </CollapsibleCard>
    </div>
  </div>
  <ChatBot context="general" />
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import MenuNav from '@/components/MenuNav.vue'
import UserCard from '@/components/UserCard.vue'
import RewardCard from '@/components/RewardCard.vue'
import RewardRedeemedCard from '@/components/RewardRedeemedCard.vue'
import ItemCard from '@/components/ItemCard.vue'
import ChatBot from '@/components/ChatBot.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ProfileEditModal from '@/components/ProfileEditModal.vue'
import RewardEditModal from '@/components/RewardEditModal.vue'
import ItemEditModal from '@/components/ItemEditModal.vue'
import StatisticsChart from '@/components/StatisticsChart.vue'

export default {
  name: 'AdminDashboardView',
  components: {
    CollapsibleCard,
    MenuNav,
    UserCard,
    RewardCard,
    RewardRedeemedCard,
    ItemCard,
    ChatBot,
    ToastNotification,
    ConfirmModal,
    ProfileEditModal,
    RewardEditModal,
    ItemEditModal,
    StatisticsChart,
  },
  data() {
    return {
      showToast: false,
      toastMessage: '',
      toastVariant: 'success',
      showConfirmModal: false,
      confirmData: {
        title: '',
        message: '',
        variant: 'primary',
        confirmText: 'Confirmar',
        onConfirm: () => {},
      },
      showProfileModal: false,
      selectedProfile: null,
      showRewardModal: false,
      selectedReward: null,
      showItemModal: false,
      selectedItem: null,
      itemModalType: 'appliance',
      rewardSearch: '',
      applianceSearch: '',
      taskSearch: '',
      displayedRewardsCount: 6,
      displayedRedeemedCount: 5,
      displayedAppliancesCount: 5,
      displayedTasksCount: 5,
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    profiles() {
      return this.userStore.profiles || []
    },
    maxProfiles() {
      return this.userStore.maxProfiles || 4
    },
    emptySlots() {
      return Math.max(0, this.maxProfiles - this.profiles.length)
    },
    householdStats() {
      return {
        totalCo2: this.profiles.reduce((sum, p) => sum + (p.co2Saved || 0), 0),
        totalPoints: this.profiles.reduce((sum, p) => sum + (p.points || 0), 0),
      }
    },
    dailyStats() {
      const stats = {
        last7Days: [],
        totalCo2Saved: 0,
        totalPoints: 0,
        totalTasks: 0,
        streak: 0,
      }
      
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      const today = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dayLabel = days[date.getDay()]
        
        let dayCo2 = 0
        let dayPoints = 0
        
        this.profiles.forEach(profile => {
          const activities = profile.activityHistory || []
          activities.forEach(activity => {
            const activityDate = new Date(activity.timestamp)
            if (activityDate.toDateString() === date.toDateString()) {
              dayCo2 += activity.co2Saved || 0
              dayPoints += activity.pointsEarned || 0
            }
          })
        })
        
        stats.last7Days.push({
          label: dayLabel,
          co2Saved: dayCo2,
          points: dayPoints,
        })
        
        stats.totalCo2Saved += dayCo2
        stats.totalPoints += dayPoints
      }
      
      this.profiles.forEach(profile => {
        stats.totalTasks += (profile.activityHistory || []).length
      })
      
      return stats
    },
    availableRewards() {
      return this.userStore.householdRewards || []
    },
    filteredAvailableRewards() {
      if (!this.rewardSearch.trim()) return this.availableRewards
      const search = this.rewardSearch.toLowerCase()
      return this.availableRewards.filter(r => r.title.toLowerCase().includes(search))
    },
    paginatedAvailableRewards() {
      const rewards = this.filteredAvailableRewards.slice(0, this.displayedRewardsCount)
      const rows = []
      for (let i = 0; i < rewards.length; i += 3) {
        rows.push(rewards.slice(i, i + 3))
      }
      return rows
    },
    allRedeemedRewards() {
      const redeemed = []
      this.profiles.forEach(profile => {
        (profile.rewardsRedeemed || []).forEach(reward => {
          redeemed.push({ ...reward, profileId: profile.id })
        })
      })
      return redeemed.sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt))
    },
    paginatedRedeemedRewards() {
      return this.allRedeemedRewards.slice(0, this.displayedRedeemedCount)
    },
    appliances() {
      return this.userStore.householdAppliances || []
    },
    filteredAppliances() {
      if (!this.applianceSearch.trim()) return this.appliances
      const search = this.applianceSearch.toLowerCase()
      return this.appliances.filter(a =>
        a.name.toLowerCase().includes(search) || a.category.toLowerCase().includes(search)
      )
    },
    paginatedAppliances() {
      return this.filteredAppliances.slice(0, this.displayedAppliancesCount)
    },
    tasks() {
      return this.userStore.householdTasks || []
    },
    filteredTasks() {
      if (!this.taskSearch.trim()) return this.tasks
      const search = this.taskSearch.toLowerCase()
      return this.tasks.filter(t =>
        t.title.toLowerCase().includes(search) || t.category.toLowerCase().includes(search)
      )
    },
    paginatedTasks() {
      return this.filteredTasks.slice(0, this.displayedTasksCount)
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
      setTimeout(() => { this.showToast = false }, 3000)
    },
    getProfileRank(profileId) {
      const leaderboard = this.userStore.householdLeaderboard
      const profile = leaderboard.find(p => p.id === profileId)
      return profile ? `${profile.rank}º` : '-'
    },
    editProfile(profile) {
      this.selectedProfile = profile
      this.showProfileModal = true
    },
    async saveProfile(profileData) {
      try {
        if (profileData.id) {
          await this.userStore.updateProfile(profileData.id, profileData)
          this.showNotification('Perfil atualizado com sucesso')
        }
      } catch (error) {
        console.error('Error saving profile:', error)
        this.showNotification('Erro ao guardar perfil', 'error')
      }
    },
    confirmDeleteProfile(profileId) {
      this.confirmData = {
        title: 'Eliminar Perfil',
        message: 'Tem a certeza que deseja eliminar este perfil? Esta ação não pode ser revertida.',
        variant: 'danger',
        confirmText: 'Eliminar',
        onConfirm: () => this.deleteProfile(profileId),
      }
      this.showConfirmModal = true
    },
    async deleteProfile(profileId) {
      try {
        await this.userStore.deleteProfile(profileId)
        this.showNotification('Perfil eliminado com sucesso')
      } catch (error) {
        console.error('Error deleting profile:', error)
        this.showNotification('Erro ao eliminar perfil', 'error')
      }
    },
    async increaseMaxProfiles() {
      try {
        await this.userStore.updateMaxProfiles(this.maxProfiles + 1)
        this.showNotification('Limite de perfis aumentado')
      } catch (error) {
        console.error('Error updating max profiles:', error)
        this.showNotification('Erro ao atualizar limite', 'error')
      }
    },
    async decreaseMaxProfiles() {
      if (this.maxProfiles <= this.profiles.length) return
      try {
        await this.userStore.updateMaxProfiles(this.maxProfiles - 1)
        this.showNotification('Limite de perfis reduzido')
      } catch (error) {
        console.error('Error updating max profiles:', error)
        this.showNotification('Erro ao atualizar limite', 'error')
      }
    },
    openCreateReward() {
      this.selectedReward = null
      this.showRewardModal = true
    },
    editReward(reward) {
      this.selectedReward = reward
      this.showRewardModal = true
    },
    async saveReward(rewardData) {
      try {
        if (rewardData.id) {
          await this.userStore.updateReward(rewardData.id, rewardData)
          this.showNotification('Recompensa atualizada')
        } else {
          await this.userStore.createReward(rewardData)
          this.showNotification('Recompensa criada')
        }
      } catch (error) {
        console.error('Error saving reward:', error)
        this.showNotification('Erro ao guardar recompensa', 'error')
      }
    },
    confirmDeleteReward(rewardId) {
      this.confirmData = {
        title: 'Eliminar Recompensa',
        message: 'Tem a certeza que deseja eliminar esta recompensa?',
        variant: 'danger',
        confirmText: 'Eliminar',
        onConfirm: () => this.deleteReward(rewardId),
      }
      this.showConfirmModal = true
    },
    async deleteReward(rewardId) {
      try {
        await this.userStore.deleteReward(rewardId)
        this.showNotification('Recompensa eliminada')
      } catch (error) {
        console.error('Error deleting reward:', error)
        this.showNotification('Erro ao eliminar recompensa', 'error')
      }
    },
    loadMoreRewards() {
      this.displayedRewardsCount += 6
    },
    getProfileName(profileId) {
      const profile = this.profiles.find(p => p.id === profileId)
      return profile?.name || 'Desconhecido'
    },
    getRewardTitle(rewardId) {
      const reward = this.availableRewards.find(r => r.id === rewardId)
      return reward?.title || 'Recompensa'
    },
    getRewardImage(rewardId) {
      const reward = this.availableRewards.find(r => r.id === rewardId)
      return reward?.image || ''
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-PT')
    },
    async confirmRedeemedReward(redeemed) {
      try {
        await this.userStore.completeReward(redeemed.profileId, redeemed.id)
        this.showNotification('Recompensa confirmada')
      } catch (error) {
        console.error('Error confirming reward:', error)
        this.showNotification('Erro ao confirmar recompensa', 'error')
      }
    },
    async rejectRedeemedReward(redeemed) {
      try {
        await this.userStore.cancelReward(redeemed.profileId, redeemed.id)
        this.showNotification('Recompensa rejeitada')
      } catch (error) {
        console.error('Error rejecting reward:', error)
        this.showNotification('Erro ao rejeitar recompensa', 'error')
      }
    },
    loadMoreRedeemed() {
      this.displayedRedeemedCount += 5
    },
    openCreateAppliance() {
      this.selectedItem = null
      this.itemModalType = 'appliance'
      this.showItemModal = true
    },
    editAppliance(appliance) {
      this.selectedItem = appliance
      this.itemModalType = 'appliance'
      this.showItemModal = true
    },
    async saveItem(itemData) {
      try {
        if (this.itemModalType === 'appliance') {
          if (itemData.id) {
            await this.userStore.updateAppliance(itemData.id, itemData)
            this.showNotification('Consumo atualizado')
          } else {
            await this.userStore.createAppliance(itemData)
            this.showNotification('Consumo criado')
          }
        } else {
          if (itemData.id) {
            await this.userStore.updateTask(itemData.id, itemData)
            this.showNotification('Tarefa atualizada')
          } else {
            await this.userStore.createTask(itemData)
            this.showNotification('Tarefa criada')
          }
        }
      } catch (error) {
        console.error('Error saving item:', error)
        this.showNotification('Erro ao guardar', 'error')
      }
    },
    confirmDeleteAppliance(applianceId) {
      this.confirmData = {
        title: 'Eliminar Consumo',
        message: 'Tem a certeza que deseja eliminar este consumo?',
        variant: 'danger',
        confirmText: 'Eliminar',
        onConfirm: () => this.deleteAppliance(applianceId),
      }
      this.showConfirmModal = true
    },
    async deleteAppliance(applianceId) {
      try {
        await this.userStore.deleteAppliance(applianceId)
        this.showNotification('Consumo eliminado')
      } catch (error) {
        console.error('Error deleting appliance:', error)
        this.showNotification('Erro ao eliminar consumo', 'error')
      }
    },
    loadMoreAppliances() {
      this.displayedAppliancesCount += 5
    },
    openCreateTask() {
      this.selectedItem = null
      this.itemModalType = 'task'
      this.showItemModal = true
    },
    editTask(task) {
      this.selectedItem = task
      this.itemModalType = 'task'
      this.showItemModal = true
    },
    confirmDeleteTask(taskId) {
      this.confirmData = {
        title: 'Eliminar Tarefa',
        message: 'Tem a certeza que deseja eliminar esta tarefa?',
        variant: 'danger',
        confirmText: 'Eliminar',
        onConfirm: () => this.deleteTask(taskId),
      }
      this.showConfirmModal = true
    },
    async deleteTask(taskId) {
      try {
        await this.userStore.deleteTask(taskId)
        this.showNotification('Tarefa eliminada')
      } catch (error) {
        console.error('Error deleting task:', error)
        this.showNotification('Erro ao eliminar tarefa', 'error')
      }
    },
    loadMoreTasks() {
      this.displayedTasksCount += 5
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
