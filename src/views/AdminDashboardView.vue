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
    :showPasswordFields="selectedProfile?.isAdmin"
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

  <div class="p-4 md:p-8 flex justify-center w-full">
    <draggable
      v-model="cardOrder"
      @end="saveCardOrder"
      item-key="id"
      class="space-y-4 w-full max-w-[930px]"
      handle=".drag-handle"
      :animation="200"
      ghost-class="ghost-card"
    >
      <template #item="{ element }">
        <CollapsibleCard
          v-if="element === 'analysis'"
          title="Análise rápida mensal"
          v-model="cardOpenStates.analysis"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <!-- CO2 Efetivo Card -->
            <div
              class="bg-(--system-card) border border-(--system-border) rounded-xl p-6 flex items-center gap-4 transition-all hover:border-(--system-ring)"
            >
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                  (householdStats.totalCo2Emitted - householdStats.totalCo2) <= 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
                ]"
              >
                <span class="material-symbols-outlined text-2xl">
                  {{ (householdStats.totalCo2Emitted - householdStats.totalCo2) <= 0 ? 'eco' : 'cloud' }}
                </span>
              </div>
              <div>
                <p class="text-sm text-(--text-body-sub-titles) font-medium">CO₂ Efetivo</p>
                <p
                  :class="[
                    'text-2xl font-bold',
                    (householdStats.totalCo2Emitted - householdStats.totalCo2) <= 0
                      ? 'text-(--system-ring)'
                      : 'text-red-600 dark:text-red-400',
                  ]"
                >
                  {{ (householdStats.totalCo2Emitted - householdStats.totalCo2) <= 0 ? '+' : '' }}{{ Math.abs(householdStats.totalCo2Emitted - householdStats.totalCo2).toFixed(1) }}
                  <span class="text-sm font-normal text-(--text-body-sub-titles)">kg</span>
                </p>
              </div>
            </div>

            <!-- Consumption Card -->
            <div
              class="bg-(--system-card) border border-(--system-border) rounded-xl p-6 flex items-center gap-4 transition-all hover:border-(--system-ring)"
            >
              <div
                class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0"
              >
                <i class="fa-solid fa-bolt text-2xl"></i>
              </div>
              <div>
                <p class="text-sm text-(--text-body-sub-titles) font-medium">Consumo Total</p>
                <p class="text-2xl font-bold text-(--text-body-titles)">
                  {{ householdStats.totalConsumption.toFixed(0) }}
                  <span class="text-sm font-normal text-(--text-body-sub-titles)">kWh</span>
                </p>
              </div>
            </div>

            <!-- Average Card -->
            <div
              class="bg-(--system-card) border border-(--system-border) rounded-xl p-6 flex items-center gap-4 transition-all hover:border-(--system-ring)"
            >
              <div
                class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"
              >
                <i class="fa-solid fa-users text-2xl"></i>
              </div>
              <div>
                <p class="text-sm text-(--text-body-sub-titles) font-medium">Média por Membro</p>
                <p class="text-2xl font-bold text-(--text-body-titles)">
                  {{ householdStats.avgConsumptionPerMember.toFixed(1) }}
                  <span class="text-sm font-normal text-(--text-body-sub-titles)">kWh</span>
                </p>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        <CollapsibleCard
          v-else-if="element === 'consumption'"
          title="Consumos de energia diários"
          v-model="cardOpenStates.consumption"
        >
          <StatisticsChart
            v-if="dailyStats"
            :data="dailyStats.last7Days"
            :showCo2="true"
            :showEffectiveCo2="true"
            :showPoints="true"
            co2Label="CO₂ Efetivo (kg)"
          />
          <div
            v-else
            class="h-[259px] w-full flex items-center justify-center bg-(--system-input-background) rounded-lg"
          >
            <p class="text-(--accent-muted-foreground)">Sem dados disponíveis</p>
          </div>
        </CollapsibleCard>

        <CollapsibleCard
          v-else-if="element === 'users'"
          title="Gestão de utilizadores"
          v-model="cardOpenStates.users"
        >
          <!-- Admin Section -->
          <div
            v-if="adminProfile"
            class="mb-6 p-4 bg-(--system-background) border border-(--system-border) rounded-xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <img
                    v-if="adminProfile.avatarUrl"
                    :src="adminProfile.avatarUrl"
                    class="w-16 h-16 rounded-full object-cover border-2 border-(--system-ring)"
                    alt="Admin Avatar"
                  />
                  <div
                    v-else
                    class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-(--system-ring) bg-(--system-foreground)/10"
                  >
                    <i class="fa-solid fa-user text-2xl text-(--system-ring)"></i>
                  </div>
                  <div
                    class="absolute -bottom-1 -right-1 bg-(--system-ring) text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <i class="fa-solid fa-shield-halved text-xs"></i>
                  </div>
                </div>
                <div>
                  <h4 class="font-bold text-lg text-(--text-body-titles)">
                    {{ adminProfile.name }} (Administrador)
                  </h4>
                  <p class="text-sm text-(--text-body-sub-titles)">
                    {{ userStore.currentUser?.email || 'Sem email definido' }}
                  </p>
                </div>
              </div>
              <button
                @click="editProfile(adminProfile)"
                class="px-4 py-2 text-sm font-medium text-(--system-ring) hover:bg-(--system-ring) hover:text-white border border-(--system-ring) rounded-lg transition-colors"
              >
                Editar Dados
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <UserCard
              v-for="profile in memberProfiles"
              :key="profile.id"
              :user="{
                name: profile.name,
                rank: getProfileRank(profile.id),
                points: profile.points,
                avatar: profile.avatarUrl,
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
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex flex-col gap-2 text-base text-(--text-body-titles)">
              <p>Nº membros: {{ memberProfiles.length }} (+1 Admin)</p>
              <p>Nº vagas: {{ maxProfiles - profiles.length }}</p>
            </div>
            <div class="flex gap-2.5">
              <button
                @click="decreaseMaxProfiles"
                :disabled="maxProfiles <= profiles.length"
                class="w-14 h-14 rounded-lg bg-(--system-border) flex items-center justify-center hover:bg-(--system-ring) transition-colors disabled:opacity-30"
              >
                <i class="fa-solid fa-minus text-[30px] text-(--text-body-titles)"></i>
              </button>
              <button
                @click="increaseMaxProfiles"
                class="w-14 h-14 rounded-lg bg-(--system-border) flex items-center justify-center hover:bg-(--system-ring) transition-colors"
              >
                <i class="fa-solid fa-plus text-[30px] text-(--text-body-titles)"></i>
              </button>
            </div>
          </div>
        </CollapsibleCard>

        <CollapsibleCard
          v-else-if="element === 'rewards'"
          title="Gestão de recompensas"
          v-model="cardOpenStates.rewards"
        >
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1 relative">
              <input
                v-model="rewardSearch"
                type="text"
                placeholder="Pesquisar . . ."
                class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
              />
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2 text-(--accent-muted-foreground)"></i>
            </div>
            <button
              @click="openCreateReward"
              class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center justify-center gap-1 text-white font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              <i class="fa-solid fa-plus text-[20px]"></i>
              <span>Adicionar</span>
            </button>
          </div>

          <h3 class="text-lg text-(--text-headings) mb-4">Recompensas Disponíveis</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <RewardCard
              v-for="reward in paginatedAvailableRewards"
              :key="reward.id"
              :title="reward.title"
              :points="reward.points_cost"
              :image="reward.imgUrl"
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
            <i class="fa-solid fa-chevron-down"></i>
          </button>

          <h3 class="text-lg text-(--text-headings) mt-6 mb-4">Recompensas Resgatadas</h3>
          <div class="space-y-2">
            <RewardRedeemedCard
              v-for="redeemed in paginatedRedeemedRewards"
              :key="redeemed.id"
              :reward="{
                ...redeemed,
                userName: getProfileName(redeemed.profileId),
                title: getRewardTitle(redeemed.id_reward),
                points: redeemed.points_cost,
                image: getRewardImage(redeemed.id_reward),
                status: redeemed.status,
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
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </CollapsibleCard>

        <CollapsibleCard
          v-else-if="element === 'appliances'"
          title="Gestão de consumos"
          v-model="cardOpenStates.appliances"
        >
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1 relative">
              <input
                v-model="applianceSearch"
                type="text"
                placeholder="Pesquisar . . ."
                class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
              />
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2 text-(--accent-muted-foreground)"></i>
            </div>
            <button
              @click="openCreateAppliance"
              class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center justify-center gap-1 text-white font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              <i class="fa-solid fa-plus text-[20px]"></i>
              <span>Adicionar</span>
            </button>
          </div>

          <div class="space-y-2">
            <ItemCard
              v-for="appliance in paginatedAppliances"
              :key="appliance.id"
              :title="appliance.name"
              :subtitle="`${appliance.powerWatts || 0}W`"
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
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </CollapsibleCard>

        <CollapsibleCard
          v-else-if="element === 'tasks'"
          title="Gestão de tarefas"
          v-model="cardOpenStates.tasks"
        >
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1 relative">
              <input
                v-model="taskSearch"
                type="text"
                placeholder="Pesquisar . . ."
                class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
              />
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2 text-(--accent-muted-foreground)"></i>
            </div>
            <button
              @click="openCreateTask"
              class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center justify-center gap-1 text-white font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              <i class="fa-solid fa-plus text-[20px]"></i>
              <span>Adicionar</span>
            </button>
          </div>

          <div class="space-y-2">
            <ItemCard
              v-for="task in paginatedTasks"
              :key="task.id"
              :title="task.title"
              :subtitle="`-${task.co2saved || 0} Kg de CO2`"
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
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </CollapsibleCard>

        <CollapsibleCard
          v-else-if="element === 'challenges'"
          title="Gestão de Desafios"
          v-model="cardOpenStates.challenges"
        >
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1 relative">
              <input
                v-model="challengeSearch"
                type="text"
                placeholder="Pesquisar desafios..."
                class="w-full px-4 py-2 pl-10 bg-(--system-input-background) border border-(--system-border) rounded-lg text-(--system-foreground) placeholder:text-(--text-disabled) outline-none focus:border-(--system-ring)"
              />
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-(--text-disabled)"></i>
            </div>
            <button
              @click="createChallenge"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-(--system-ring) text-white rounded-lg hover:opacity-90 transition-opacity shrink-0"
            >
              <i class="fa-solid fa-plus text-[20px]"></i>
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
            <i class="fa-solid fa-trophy text-4xl mb-2"></i>
            <p>Nenhum desafio definido</p>
            <p class="text-sm">Clique em "Adicionar" para criar um desafio</p>
          </div>

          <button
            v-if="filteredChallenges.length > displayedChallengesCount"
            @click="loadMoreChallenges"
            class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4 hover:opacity-80 transition-opacity"
          >
            <span>Ver mais</span>
            <i class="fa-solid fa-chevron-down"></i>
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
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1"
          >Título do Desafio</label
        >
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
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1"
          >Tipo de Desafio</label
        >
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
          <span v-else> O utilizador deve completar a tarefa por X dias consecutivos </span>
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
        <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-1"
          >Recompensa XP</label
        >
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
import ChallengeCard from '@/components/ChallengeCard.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import StatisticsChart from '@/components/StatisticsChart.vue'

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
    ChallengeCard,
    ModalComponent,
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

      // Image mappings for appliances and tasks
      applianceImages: {
        Frigorífico:
          'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop',
        'Máquina de lavar roupa':
          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=200&fit=crop',
        'Máquina de lavar loiça':
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=200&fit=crop',
        Forno: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
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
      cardOrder: [
        'analysis',
        'consumption',
        'users',
        'rewards',
        'appliances',
        'tasks',
        'challenges',
      ],

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
    adminProfile() {
      return this.profiles.find((p) => p.isAdmin)
    },
    memberProfiles() {
      return this.profiles.filter((p) => !p.isAdmin)
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

      this.profiles.forEach((profile) => {
        // Use appliance_history array (new data structure)
        ;(profile.appliance_history || []).forEach((usage) => {
          // energy_consumed is in kWh from userStore.trackApplianceUsage
          totalConsumption += usage.energy_consumed || 0
          totalCo2Emitted += usage.co2emited || 0
        })
      })

      const profileCount = this.profiles.length || 1
      // Calculate CO2 saved from activity_history
      const totalCo2Saved = this.profiles.reduce((sum, p) => {
        const activities = p.activity_history || []
        return sum + activities.reduce((actSum, a) => actSum + (a.co2saved || 0), 0)
      }, 0)

      return {
        totalCo2: totalCo2Saved,
        totalCo2Emitted,
        totalPoints: this.profiles.reduce((sum, p) => sum + (p.points || 0), 0),
        totalConsumption,
        avgConsumptionPerMember: totalConsumption / profileCount,
      }
    },
    dailyStats() {
      const stats = {
        last7Days: [],
        totalCo2Saved: 0,
        totalCo2Emitted: 0,
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

        let dayCo2Saved = 0
        let dayCo2Emitted = 0
        let dayPoints = 0

        this.profiles.forEach((profile) => {
          // Check activity_history for tasks completed (new data structure)
          const activities = profile.activity_history || []
          activities.forEach((activity) => {
            const activityDate = activity.completedAt ? activity.completedAt.split('T')[0] : null
            if (activityDate === dateString) {
              dayCo2Saved += activity.co2saved || 0
              dayPoints += activity.pointsEarned || 0
            }
          })

          // Check appliance_history for consumption CO2 (new data structure)
          const usages = profile.appliance_history || []
          usages.forEach((usage) => {
            const usageDate = usage.usedAt ? usage.usedAt.split('T')[0] : null
            if (usageDate === dateString) {
              // For consumption, we track CO2 emitted
              dayCo2Emitted += usage.co2emited || 0
            }
          })
        })

        stats.last7Days.push({
          label: dayLabel,
          co2Saved: dayCo2Saved,
          co2Emitted: dayCo2Emitted,
          points: dayPoints,
        })

        stats.totalCo2Saved += dayCo2Saved
        stats.totalCo2Emitted += dayCo2Emitted
        stats.totalPoints += dayPoints
      }

      this.profiles.forEach((profile) => {
        stats.totalTasks += (profile.activity_history || []).length
      })

      return stats
    },
    availableRewards() {
      return this.userStore.householdRewards || []
    },
    filteredAvailableRewards() {
      if (!this.rewardSearch.trim()) return this.availableRewards
      const search = this.rewardSearch.toLowerCase()
      return this.availableRewards.filter((r) => r.title.toLowerCase().includes(search))
    },
    paginatedAvailableRewards() {
      return this.filteredAvailableRewards.slice(0, this.displayedRewardsCount)
    },
    allRedeemedRewards() {
      const redeemed = []
      this.profiles.forEach((profile) => {
        ;(profile.rewards_history || []).forEach((reward) => {
          redeemed.push({ ...reward, profileId: profile.id })
        })
      })
      return redeemed.sort((a, b) => new Date(b.redemedAt) - new Date(a.redemedAt))
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
      return this.appliances.filter(
        (a) => a.name.toLowerCase().includes(search) || a.category.toLowerCase().includes(search),
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
      return this.tasks.filter(
        (t) => t.title.toLowerCase().includes(search) || t.category.toLowerCase().includes(search),
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
          isDefault: true,
        },
        {
          id: 'default-2',
          title: 'Mobilidade Verde',
          description: 'Complete 3 tarefas de mobilidade',
          category: 'Mobilidade',
          target: 3,
          xp: 40,
          isDefault: true,
        },
        {
          id: 'default-3',
          title: 'Mestre da Reciclagem',
          description: 'Complete 7 tarefas de reciclagem',
          category: 'Reciclagem',
          target: 7,
          xp: 60,
          isDefault: true,
        },
        {
          id: 'default-4',
          title: 'Guardião da Água',
          description: 'Complete 4 tarefas de água',
          category: 'Água',
          target: 4,
          xp: 45,
          isDefault: true,
        },
        {
          id: 'default-5',
          title: 'Alimentação Consciente',
          description: 'Complete 5 tarefas de alimentação',
          category: 'Alimentação',
          target: 5,
          xp: 50,
          isDefault: true,
        },
        {
          id: 'default-6',
          title: 'Protetor do Ambiente',
          description: 'Complete 3 tarefas de ambiente',
          category: 'Ambiente',
          target: 3,
          xp: 55,
          isDefault: true,
        },
      ]
      return [...household, ...defaults]
    },
    filteredChallenges() {
      if (!this.challengeSearch.trim()) return this.challenges
      const search = this.challengeSearch.toLowerCase()
      return this.challenges.filter(
        (c) =>
          c.title.toLowerCase().includes(search) ||
          (c.description || '').toLowerCase().includes(search),
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
      return (
        this.applianceImages[appliance.name] ||
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
      )
    },
    getTaskImage(task) {
      if (task.image) return task.image
      return (
        this.taskImages[task.category] ||
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=250&fit=crop'
      )
    },
    saveCardOrder() {
      localStorage.setItem('adminCardOrder', JSON.stringify(this.cardOrder))
    },
    showNotification(message, variant = 'success') {
      this.toastMessage = message
      this.toastVariant = variant
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },
    getProfileRank(profileId) {
      const leaderboard = this.userStore.householdLeaderboard
      const profile = leaderboard.find((p) => p.id === profileId)
      return profile ? `${profile.rank}º` : '-'
    },
    editProfile(profile) {
      if (profile.isAdmin) {
        // Se for admin, injeta o email da conta raiz para edição
        this.selectedProfile = {
          ...profile,
          email: this.userStore.currentUser?.email || '',
        }
      } else {
        this.selectedProfile = profile
      }
      this.showProfileModal = true
    },
    async saveProfile(profileData) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        // Se for admin, atualiza as credenciais na raiz do utilizador (db.json/users/ID)
        if (profileData.isAdmin) {
          const userId = this.userStore.currentUser?.id

          if (!userId) {
            this.showNotification('Erro: Utilizador não identificado', 'error')
            return
          }

          if (userId) {
            const rootUpdates = {}
            if (profileData.email) rootUpdates.email = profileData.email
            if (profileData.password) rootUpdates.password = profileData.password

            if (Object.keys(rootUpdates).length > 0) {
              // Atualização direta ao json-server para a raiz do user
              const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rootUpdates),
              })

              if (!response.ok) {
                throw new Error('Erro ao atualizar credenciais de administrador')
              }

              // Atualiza o estado local da store para refletir a mudança imediatamente
              if (this.userStore.currentUser && profileData.email) {
                this.userStore.currentUser.email = profileData.email
              }
              if (this.userStore.currentUser && profileData.password) {
                this.userStore.currentUser.password = profileData.password
              }
            }
          }
        }

        if (profileData.id) {
          // Remove email e password do payload do perfil para não sujar a estrutura do perfil no JSON
          // eslint-disable-next-line no-unused-vars
          const { email, password, confirmPassword, ...profilePayload } = profileData

          await this.userStore.updateProfile(profileData.id, profilePayload)
          this.showNotification('Perfil atualizado com sucesso')
        }
      } catch (error) {
        console.error('Error saving profile:', error)
        this.showNotification('Erro ao guardar perfil', 'error')
      }
    },
    confirmDeleteProfile(profileId) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        await this.userStore.updateMaxProfiles(this.maxProfiles + 1)
        this.showNotification('Limite de perfis aumentado')
      } catch (error) {
        console.error('Error updating max profiles:', error)
        this.showNotification('Erro ao atualizar limite', 'error')
      }
    },
    async decreaseMaxProfiles() {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
      // Deep clone the reward to avoid mutations
      this.selectedReward = {
        id: reward.id,
        title: reward.title,
        points: reward.points_cost,
        image: reward.imgUrl,
      }
      this.showRewardModal = true
    },
    async saveReward(rewardData) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        // Check if this is an update or create operation
        if (
          rewardData.id &&
          rewardData.id !== null &&
          rewardData.id !== 'null' &&
          rewardData.id !== undefined
        ) {
          await this.userStore.updateReward(rewardData.id, rewardData)
          this.showNotification('Recompensa atualizada')
        } else {
          // Remove any invalid ID before creating
          const { id, ...createData } = rewardData
          await this.userStore.createReward(createData)
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
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
      const profile = this.profiles.find((p) => p.id === profileId)
      return profile?.name || 'Desconhecido'
    },
    getRewardTitle(rewardId) {
      const reward = this.availableRewards.find((r) => String(r.id) === String(rewardId))
      return reward?.title || 'Recompensa'
    },
    getRewardImage(rewardId) {
      const reward = this.availableRewards.find((r) => String(r.id) === String(rewardId))
      return reward?.image || ''
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-PT')
    },
    async confirmRedeemedReward(redeemed) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        await this.userStore.completeReward(redeemed.profileId, redeemed.id)
        this.showNotification('Recompensa confirmada')
      } catch (error) {
        console.error('Error confirming reward:', error)
        this.showNotification('Erro ao confirmar recompensa', 'error')
      }
    },
    async rejectRedeemedReward(redeemed) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        console.log('AdminDashboard saveItem received:', itemData)
        if (this.itemModalType === 'appliance') {
          if (
            itemData.id &&
            itemData.id !== null &&
            itemData.id !== 'null' &&
            itemData.id !== undefined
          ) {
            await this.userStore.updateAppliance(itemData.id, itemData)
            this.showNotification('Consumo atualizado')
          } else {
            // Remove any invalid ID before creating
            const { id, ...createData } = itemData
            console.log('Creating appliance with data:', createData)
            await this.userStore.createAppliance(createData)
            this.showNotification('Consumo criado')
          }
        } else {
          if (
            itemData.id &&
            itemData.id !== null &&
            itemData.id !== 'null' &&
            itemData.id !== undefined
          ) {
            await this.userStore.updateTask(itemData.id, itemData)
            this.showNotification('Tarefa atualizada')
          } else {
            // Remove any invalid ID before creating
            const { id, ...createData } = itemData
            await this.userStore.createTask(createData)
            this.showNotification('Tarefa criada')
          }
        }
        // Refresh data from server
        await this.userStore.fetchResources()
      } catch (error) {
        console.error('Error saving item:', error)
        this.showNotification('Erro ao guardar', 'error')
      }
    },
    confirmDeleteAppliance(applianceId) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
      return this.tasks.find((t) => String(t.id) === String(taskId))
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
          Energia: 'fa-solid fa-bolt',
          Mobilidade: 'fa-solid fa-bicycle',
          Reciclagem: 'fa-solid fa-recycle',
          Água: 'fa-solid fa-droplet',
          Alimentação: 'fa-solid fa-utensils',
          Ambiente: 'fa-solid fa-leaf',
        }
        return iconMap[challenge.category] || 'fa-solid fa-trophy'
      }
      const task = this.getTaskById(challenge.taskId)
      return task?.icon || 'fa-solid fa-trophy'
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
      this.challengeFormData = {
        title: challenge.title,
        description: challenge.description,
        taskId: challenge.taskId || '',
        type: challenge.type || 'completion',
        target: challenge.target || 5,
        xp: challenge.xp || 50,
      }
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
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        // Get task to derive category
        const task = this.getTaskById(this.challengeFormData.taskId)
        if (!task) {
          this.showNotification('Por favor selecione uma tarefa válida', 'error')
          return
        }

        // Auto-generate description based on task and type
        const typeLabel = this.challengeFormData.type === 'streak' ? 'dias consecutivos' : 'vezes'
        const description = `Complete "${task.title}" ${this.challengeFormData.target} ${typeLabel}`

        const challengeData = {
          title: this.challengeFormData.title,
          description,
          type: this.challengeFormData.type,
          taskId: this.challengeFormData.taskId,
          target: this.challengeFormData.target,
          xp: this.challengeFormData.xp,
          category: task.category,
        }

        if (this.selectedChallenge?.id) {
          await this.userStore.updateChallenge(this.selectedChallenge.id, challengeData)
          this.showNotification('Desafio atualizado com sucesso')
        } else {
          await this.userStore.createChallenge(challengeData)
          this.showNotification('Desafio criado com sucesso')
        }
        await this.userStore.fetchResources()
        this.closeChallengeModal()
      } catch (error) {
        console.error('Error saving challenge:', error)
        this.showNotification('Erro ao guardar desafio', 'error')
      }
    },
    confirmDeleteChallenge(challengeId) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      // Don't allow deleting default challenges
      const challenge = this.challenges.find((c) => c.id === challengeId)
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
