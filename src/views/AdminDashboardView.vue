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
    <draggable
      v-model="cardOrder"
      @end="saveCardOrder"
      item-key="id"
      class="space-y-4 w-[930px]"
      handle=".drag-handle"
      :animation="200"
      ghost-class="ghost-card"
    >
      <template #item="{ element }">
        <CollapsibleCard v-if="element === 'analysis'" title="Análise rápida mensal" v-model="cardOpenStates.analysis">
        <div class="flex gap-4 items-center w-full">
          <div
            class="bg-(--system-card) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">CO2 Evitado</p>
            <p class="font-semibold text-4xl">{{ householdStats.totalCo2.toFixed(1) }} kg</p>
          </div>

          <div
            class="bg-(--system-card) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">Consumo mensal total</p>
            <p class="font-semibold text-4xl">{{ householdStats.totalConsumption.toFixed(0) }} kWh</p>
          </div>

          <div
            class="bg-(--system-card) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 flex-1 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">Consumo médio por membro</p>
            <p class="font-semibold text-4xl">{{ householdStats.avgConsumptionPerMember.toFixed(2) }} kWh/membro</p>
          </div>
        </div>
        </CollapsibleCard>

        <CollapsibleCard v-else-if="element === 'consumption'" title="Consumos de energia diários" v-model="cardOpenStates.consumption">
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

        <CollapsibleCard v-else-if="element === 'users'" title="Gestão de utilizadores" v-model="cardOpenStates.users">
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

        <CollapsibleCard v-else-if="element === 'rewards'" title="Gestão de recompensas" v-model="cardOpenStates.rewards">
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
        <div class="grid grid-cols-2 gap-[10px] mb-4">
          <RewardCard
            v-for="reward in paginatedAvailableRewards"
            :key="reward.id"
            :title="reward.title"
            :points="reward.points"
            :image="reward.image"
            @edit="editReward(reward)"
            @delete="confirmDeleteReward(reward.id)"
          />
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
            :reward="{
              ...redeemed,
              userName: getProfileName(redeemed.profileId),
              title: getRewardTitle(redeemed.rewardId),
              points: redeemed.pointsCost,
              image: getRewardImage(redeemed.rewardId),
              status: redeemed.status
            }"
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

        <CollapsibleCard v-else-if="element === 'appliances'" title="Gestão de consumos" v-model="cardOpenStates.appliances">
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
            :subtitle="`${appliance.avgPowerConsumption || 0} KWh/h`"
            :category="appliance.category"
            :icon="appliance.icon || 'electrical_services'"
            :image="getApplianceImage(appliance)"
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

        <CollapsibleCard v-else-if="element === 'tasks'" title="Gestão de tarefas" v-model="cardOpenStates.tasks">
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
            :subtitle="`-${task.co2Saved || 0} Kg de CO2`"
            :category="task.category"
            :icon="task.icon || 'task_alt'"
            :image="getTaskImage(task)"
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

        <CollapsibleCard v-else-if="element === 'challenges'" title="DESAFIOS" v-model="cardOpenStates.challenges">
        <div class="flex items-center gap-2 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="challengeSearch"
              type="text"
              placeholder="Pesquisar desafios..."
              class="w-full px-4 py-2 pl-10 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) placeholder:text-(--text-disabled) outline-none focus:border-(--system-ring)"
            />
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-(--text-disabled)">
              search
            </span>
          </div>
          <button
            @click="createChallenge"
            class="flex items-center gap-2 px-4 py-2 bg-(--system-ring) text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <div class="space-y-2">
          <ItemCard
            v-for="challenge in paginatedChallenges"
            :key="challenge.id"
            :title="getChallengeTitle(challenge)"
            :subtitle="getChallengeSubtitle(challenge)"
            :icon="getChallengeIcon(challenge)"
            type="task"
            :showEdit="!challenge.isDefault"
            :showDelete="!challenge.isDefault"
            @edit="editChallenge(challenge)"
            @delete="confirmDeleteChallenge(challenge.id)"
          />
        </div>

        <div v-if="challenges.length === 0" class="text-center py-8 text-(--text-disabled)">
          <span class="material-symbols-outlined text-4xl mb-2">emoji_events</span>
          <p>Nenhum desafio definido</p>
          <p class="text-sm">Clique em "Adicionar" para criar um desafio</p>
        </div>

        <button
          v-if="filteredChallenges.length > displayedChallengesCount"
          @click="loadMoreChallenges"
          class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4 hover:opacity-80 transition-opacity"
        >
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
        </CollapsibleCard>
      </template>
    </draggable>
  </div>
  
  <!-- Challenge Edit Modal -->
  <ModalComponent
    :isOpen="showChallengeModal"
    :title="selectedChallenge ? 'Editar Desafio' : 'Novo Desafio'"
    @close="closeChallengeModal"
  >
    <form @submit.prevent="saveChallenge" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1">Título do Desafio</label>
        <input
          v-model="challengeFormData.title"
          type="text"
          required
          class="w-full px-3 py-2 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) outline-none focus:border-(--system-ring)"
          placeholder="Ex: Mestre da Energia"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1">Tarefa</label>
        <select
          v-model="challengeFormData.taskId"
          required
          class="w-full px-3 py-2 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) outline-none focus:border-(--system-ring)"
        >
          <option value="" disabled>Selecione uma tarefa</option>
          <option v-for="task in tasks" :key="task.id" :value="task.id">
            {{ task.title }} ({{ task.category }})
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1">Tipo de Desafio</label>
        <select
          v-model="challengeFormData.type"
          required
          class="w-full px-3 py-2 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) outline-none focus:border-(--system-ring)"
        >
          <option value="completion">Baseado em Conclusões</option>
          <option value="streak">Baseado em Sequência de Dias</option>
        </select>
        <p class="text-xs text-(--text-disabled) mt-1">
          <span v-if="challengeFormData.type === 'completion'">
            O utilizador deve completar a tarefa X vezes
          </span>
          <span v-else>
            O utilizador deve completar a tarefa por X dias consecutivos
          </span>
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1">
          {{ challengeFormData.type === 'streak' ? 'Número de Dias' : 'Número de Conclusões' }}
        </label>
        <input
          v-model.number="challengeFormData.target"
          type="number"
          min="1"
          required
          class="w-full px-3 py-2 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) outline-none focus:border-(--system-ring)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1">Recompensa XP</label>
        <input
          v-model.number="challengeFormData.xp"
          type="number"
          min="0"
          required
          class="w-full px-3 py-2 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) outline-none focus:border-(--system-ring)"
        />
      </div>
    </form>
    <template #footer>
      <button
        @click="closeChallengeModal"
        class="px-4 py-2 bg-(--system-border) text-(--system-foreground) rounded-lg hover:opacity-80 transition-opacity"
      >
        Cancelar
      </button>
      <button
        @click="saveChallenge"
        class="px-4 py-2 bg-(--system-ring) text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        {{ selectedChallenge ? 'Guardar' : 'Criar' }}
      </button>
    </template>
  </ModalComponent>
  
  <ChatBot context="general" />
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import draggable from 'vuedraggable'
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
import ChallengeCard from '@/components/ChallengeCard.vue'
import ModalComponent from '@/components/ModalComponent.vue'

export default {
  name: 'AdminDashboardView',
  components: {
    draggable,
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
    ChallengeCard,
    ModalComponent,
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
      
      // Image mappings for appliances and tasks
      applianceImages: {
        'Frigorífico': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop',
        'Máquina de lavar roupa': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=200&fit=crop',
        'Máquina de lavar loiça': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop',
        'Forno': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
        'Micro-ondas': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=200&fit=crop',
        'Televisão': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop',
        'Ar condicionado': 'https://images.unsplash.com/photo-1631567091586-3eb8a9c46dc9?w=300&h=200&fit=crop',
        'Aspirador': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=200&fit=crop',
        'Computador': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop',
        'Cafeteira': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
      },
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
      
      // Challenge modal state
      showChallengeModal: false,
      selectedChallenge: null,
      challengeSearch: '',
      displayedChallengesCount: 5,
      challengeFormData: {
        title: '',
        description: '',
        taskId: '',
        type: 'completion',
        target: 5,
        xp: 50,
      },
      
      // Card order
      cardOrder: ['analysis', 'consumption', 'users', 'rewards', 'appliances', 'tasks', 'challenges'],
      
      // Card open states
      cardOpenStates: {
        analysis: true,
        consumption: true,
        users: true,
        rewards: true,
        appliances: true,
        tasks: true,
        challenges: true,
      },
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
      // Calculate total energy consumption from all appliance usage
      let totalConsumption = 0
      let totalCo2Emitted = 0
      
      this.profiles.forEach(profile => {
        // Use applianceUsage array (the correct property name from db.json)
        (profile.applianceUsage || []).forEach(usage => {
          // energyConsumed is already in kWh from userStore.trackApplianceUsage
          totalConsumption += usage.energyConsumed || 0
          totalCo2Emitted += usage.co2Emitted || 0
        })
      })
      
      const profileCount = this.profiles.length || 1
      const totalCo2Saved = this.profiles.reduce((sum, p) => sum + (p.co2Saved || 0), 0)
      
      return {
        totalCo2: totalCo2Saved,
        totalCo2Emitted,
        totalPoints: this.profiles.reduce((sum, p) => sum + (p.points || 0), 0),
        totalConsumption,
        avgConsumptionPerMember: totalConsumption / profileCount
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
        const dateString = date.toISOString().split('T')[0]
        
        let dayCo2 = 0
        let dayPoints = 0
        
        this.profiles.forEach(profile => {
          // Check activityHistory for tasks completed
          const activities = profile.activityHistory || []
          activities.forEach(activity => {
            const activityDate = activity.completedAt ? activity.completedAt.split('T')[0] : null
            if (activityDate === dateString) {
              dayCo2 += activity.co2Saved || 0
              dayPoints += activity.pointsEarned || 0
            }
          })
          
          // Check applianceUsage for consumption CO2
          const usages = profile.applianceUsage || []
          usages.forEach(usage => {
            if (usage.date === dateString) {
              // For consumption, we track CO2 emitted (negative impact)
              dayCo2 -= usage.co2Emitted || 0
            }
          })
        })
        
        stats.last7Days.push({
          label: dayLabel,
          co2Saved: Math.max(0, dayCo2),
          points: dayPoints,
        })
        
        stats.totalCo2Saved += Math.max(0, dayCo2)
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
      return this.filteredAvailableRewards.slice(0, this.displayedRewardsCount)
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
    challenges() {
      const household = this.userStore.householdChallenges || []
      // Include default challenges from the profile view
      const defaults = [
        {
          id: 'default-1',
          title: 'Economizador de Energia',
          description: 'Complete 5 tarefas de energia',
          category: 'Energia',
          target: 5,
          xp: 50,
          isDefault: true
        },
        {
          id: 'default-2',
          title: 'Mobilidade Verde',
          description: 'Complete 3 tarefas de mobilidade',
          category: 'Mobilidade',
          target: 3,
          xp: 40,
          isDefault: true
        },
        {
          id: 'default-3',
          title: 'Mestre da Reciclagem',
          description: 'Complete 7 tarefas de reciclagem',
          category: 'Reciclagem',
          target: 7,
          xp: 60,
          isDefault: true
        },
        {
          id: 'default-4',
          title: 'Guardião da Água',
          description: 'Complete 4 tarefas de água',
          category: 'Água',
          target: 4,
          xp: 45,
          isDefault: true
        },
        {
          id: 'default-5',
          title: 'Alimentação Consciente',
          description: 'Complete 5 tarefas de alimentação',
          category: 'Alimentação',
          target: 5,
          xp: 50,
          isDefault: true
        },
        {
          id: 'default-6',
          title: 'Protetor do Ambiente',
          description: 'Complete 3 tarefas de ambiente',
          category: 'Ambiente',
          target: 3,
          xp: 55,
          isDefault: true
        }
      ]
      return [...household, ...defaults]
    },
    filteredChallenges() {
      if (!this.challengeSearch.trim()) return this.challenges
      const search = this.challengeSearch.toLowerCase()
      return this.challenges.filter(c =>
        c.title.toLowerCase().includes(search) || (c.description || '').toLowerCase().includes(search)
      )
    },
    paginatedChallenges() {
      return this.filteredChallenges.slice(0, this.displayedChallengesCount)
    },
  },
  async created() {
    await this.userStore.fetchResources()
    // Load saved card order from localStorage
    const savedOrder = localStorage.getItem('adminCardOrder')
    if (savedOrder) {
      try {
        this.cardOrder = JSON.parse(savedOrder)
      } catch (e) {
        console.error('Error loading card order:', e)
      }
    }
  },
  methods: {
    getApplianceImage(appliance) {
      if (appliance.image) return appliance.image
      return this.applianceImages[appliance.name] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
    },
    getTaskImage(task) {
      if (task.image) return task.image
      return this.taskImages[task.category] || 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=250&fit=crop'
    },
    saveCardOrder() {
      localStorage.setItem('adminCardOrder', JSON.stringify(this.cardOrder))
    },
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
      // If reward has null ID, treat it as creating a new reward
      if (!reward.id || reward.id === null || reward.id === 'null') {
        this.selectedReward = {
          title: reward.title,
          points: reward.points,
          image: reward.image
        }
      } else {
        this.selectedReward = reward
      }
      this.showRewardModal = true
    },
    async saveReward(rewardData) {
      try {
        // Treat null or undefined IDs as new rewards
        if (rewardData.id && rewardData.id !== null && rewardData.id !== 'null') {
          await this.userStore.updateReward(rewardData.id, rewardData)
          this.showNotification('Recompensa atualizada')
        } else {
          await this.userStore.createReward(rewardData)
          this.showNotification('Recompensa criada')
        }
        // Force refresh to update UI
        await this.userStore.fetchResources()
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
        // Prevent deletion of invalid rewards
        if (!rewardId || rewardId === null || rewardId === 'null') {
          this.showNotification('Não é possível eliminar recompensa inválida', 'error')
          return
        }
        
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
      const reward = this.availableRewards.find(r => String(r.id) === String(rewardId))
      return reward?.title || 'Recompensa'
    },
    getRewardImage(rewardId) {
      const reward = this.availableRewards.find(r => String(r.id) === String(rewardId))
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
    
    // Challenge helper methods
    getTaskById(taskId) {
      return this.tasks.find(t => String(t.id) === String(taskId))
    },
    getChallengeTitle(challenge) {
      return challenge.title || 'Desafio sem título'
    },
    getChallengeSubtitle(challenge) {
      return challenge.description || 'Sem descrição'
    },
    getChallengeIcon(challenge) {
      // Support old format (category) and new format (taskId)
      if (challenge.category) {
        const iconMap = {
          'Energia': 'bolt',
          'Mobilidade': 'directions_bike',
          'Reciclagem': 'recycling',
          'Água': 'water_drop',
          'Alimentação': 'restaurant',
          'Ambiente': 'eco'
        }
        return iconMap[challenge.category] || 'emoji_events'
      }
      const task = this.getTaskById(challenge.taskId)
      return task?.icon || 'emoji_events'
    },
    
    // Challenge CRUD methods
    createChallenge() {
      this.selectedChallenge = null
      this.challengeFormData = {
        title: '',
        description: '',
        taskId: '',
        type: 'completion',
        target: 5,
        xp: 50,
      }
      this.showChallengeModal = true
    },
    editChallenge(challenge) {
      // Don't allow editing default challenges
      if (challenge.isDefault) {
        this.showNotification('Não é possível editar desafios padrão', 'error')
        return
      }
      this.selectedChallenge = { ...challenge }
      this.challengeFormData = { ...challenge }
      this.showChallengeModal = true
    },
    closeChallengeModal() {
      this.showChallengeModal = false
      this.selectedChallenge = null
      this.challengeFormData = {
        title: '',
        description: '',
        taskId: '',
        type: 'completion',
        target: 5,
        xp: 50,
      }
    },
    async saveChallenge() {
      try {
        // Auto-generate description based on task and type
        const task = this.getTaskById(this.challengeFormData.taskId)
        const typeLabel = this.challengeFormData.type === 'streak' ? 'dias consecutivos' : 'vezes'
        const description = `Complete "${task?.title || 'a tarefa'}" ${this.challengeFormData.target} ${typeLabel}`
        
        const challengeData = {
          ...this.challengeFormData,
          description
        }
        
        if (challengeData.id) {
          await this.userStore.updateChallenge(challengeData.id, challengeData)
          this.showNotification('Desafio atualizado com sucesso')
        } else {
          await this.userStore.createChallenge(challengeData)
          this.showNotification('Desafio criado com sucesso')
        }
        this.closeChallengeModal()
      } catch (error) {
        console.error('Error saving challenge:', error)
        this.showNotification('Erro ao guardar desafio', 'error')
      }
    },
    confirmDeleteChallenge(challengeId) {
      // Don't allow deleting default challenges
      const challenge = this.challenges.find(c => c.id === challengeId)
      if (challenge?.isDefault) {
        this.showNotification('Não é possível eliminar desafios padrão', 'error')
        return
      }
      this.confirmData = {
        title: 'Eliminar Desafio',
        message: 'Tem a certeza que deseja eliminar este desafio?',
        variant: 'danger',
        confirmText: 'Eliminar',
        onConfirm: () => this.deleteChallenge(challengeId),
      }
      this.showConfirmModal = true
    },
    async deleteChallenge(challengeId) {
      try {
        await this.userStore.deleteChallenge(challengeId)
        this.showNotification('Desafio eliminado')
      } catch (error) {
        console.error('Error deleting challenge:', error)
        this.showNotification('Erro ao eliminar desafio', 'error')
      }
    },
    loadMoreChallenges() {
      this.displayedChallengesCount += 5
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

.ghost-card {
  opacity: 0.5;
}
</style>
