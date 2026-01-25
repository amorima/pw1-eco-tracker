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
    <BadgeModal :isOpen="showBadgeModal" :badge="selectedBadge" @close="showBadgeModal = false" />

    <!-- Profile Edit Modal -->
    <ProfileEditModal
      :isOpen="showEditProfileModal"
      :profile="editProfileData"
      @close="closeEditProfileModal"
      @save="handleSaveProfile"
    />

    <!-- PIN Confirmation Modal (for disabling) -->
    <ModalComponent
      :isOpen="showPinConfirmModal"
      title="Confirmar PIN"
      size="sm"
      @close="cancelPinDisable"
    >
      <div class="flex flex-col gap-4">
        <p class="text-(--text-body-sub-titles) text-sm">
          Introduza o seu PIN atual para desativar a proteção do perfil.
        </p>
        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
            PIN Atual
          </label>
          <FormInput
            v-model="pinConfirmInput"
            type="password"
            placeholder="****"
            maxlength="4"
            @keyup.enter="confirmPinDisable"
          />
        </div>
        <p v-if="pinError" class="text-(--semantic-error-default) text-sm text-center">
          {{ pinError }}
        </p>
      </div>
      <template #footer>
        <button
          @click="cancelPinDisable"
          class="px-4 py-2 bg-(--system-border) text-(--text-body-titles) rounded-lg font-semibold"
        >
          Cancelar
        </button>
        <button
          @click="confirmPinDisable"
          :disabled="pinConfirmInput.length !== 4"
          class="px-4 py-2 bg-(--system-ring) text-white rounded-lg font-semibold disabled:opacity-50"
        >
          Confirmar
        </button>
      </template>
    </ModalComponent>

    <!-- PIN Setup Modal -->
    <ModalComponent :isOpen="showPinModal" title="Definir PIN" size="sm" @close="cancelPinSetup">
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

    <div class="min-h-fit py-8 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-[930px] space-y-6">
        <!-- Profile Header -->
        <div
          class="relative w-full overflow-hidden bg-(--system-card) border border-(--system-border) rounded-3xl shadow-sm"
        >
          <!-- Decorative Background Pattern -->
          <div
            :class="[
              'absolute top-0 left-0 w-full h-32 transition-colors duration-500',
              currentBackgroundClass,
            ]"
          >
            <div
              class="absolute inset-0 opacity-10"
              style="
                background-image: radial-gradient(var(--system-ring) 1px, transparent 1px);
                background-size: 20px 20px;
              "
            ></div>
          </div>

          <div
            class="relative px-6 pb-8 pt-16 md:px-10 md:pt-20 flex flex-col md:flex-row items-center md:items-center gap-6"
          >
            <!-- Avatar Section -->
            <div class="relative shrink-0 group cursor-pointer" @click="openEditProfileModal">
              <div
                class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-(--system-ring) shadow-xl overflow-hidden bg-(--system-background) ring-4 ring-(--system-ring) ring-opacity-20 transition-all duration-300 group-hover:ring-opacity-40 group-hover:shadow-2xl"
              >
                <img
                  :src="
                    currentProfile?.avatarUrl ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
                  "
                  alt="User avatar"
                  class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                />
              </div>
              <!-- Edit Icon Overlay -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div
                  class="w-12 h-12 bg-(--system-ring) rounded-full shadow-lg flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300"
                >
                  <span class="material-symbols-outlined text-white text-xl">edit</span>
                </div>
              </div>
            </div>

            <!-- User Info Section -->
            <div class="flex-1 text-center md:text-left pb-2 w-full">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2
                    class="text-3xl md:text-4xl font-bold text-(--text-body-titles) mb-4 tracking-tight"
                  >
                    {{ currentProfile?.name || 'Utilizador' }}
                  </h2>
                  <p
                    class="text-(--system-ring) font-medium mb-4 flex items-center justify-center md:justify-start gap-2"
                  >
                    <span class="material-symbols-outlined text-xl">verified</span>
                    {{ getProfileTitle(currentProfile?.level || 1) }}
                  </p>
                </div>

                <!-- Gamification Stats (Mini) -->
                <div class="flex gap-4 justify-center md:justify-end">
                  <div
                    class="flex flex-col items-center justify-center bg-(--system-background) border border-(--system-border) rounded-2xl px-5 py-2 shadow-sm min-w-[90px]"
                  >
                    <span
                      class="text-[10px] text-(--text-body-sub-titles) uppercase font-bold tracking-wider"
                      >Rank</span
                    >
                    <div class="flex items-center gap-1 text-(--text-body-titles)">
                      <span class="material-symbols-outlined text-base text-yellow-500"
                        >trophy</span
                      >
                      <span class="text-xl font-black">#{{ getUserRank(currentProfile?.id) }}</span>
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center justify-center bg-(--system-background) border border-(--system-border) rounded-2xl px-5 py-2 shadow-sm min-w-[90px]"
                  >
                    <span
                      class="text-[10px] text-(--text-body-sub-titles) uppercase font-bold tracking-wider"
                      >Pontos</span
                    >
                    <div class="flex items-center gap- text-(--text-body-titles)">
                      <span class="material-symbols-outlined text-base text-orange-500">bolt</span>
                      <span class="text-xl font-black">{{ currentProfile?.points || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Details Chips -->
              <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <div
                  class="relative group flex items-center gap-2 bg-(--system-background) px-4 py-2 rounded-xl border border-(--system-border) text-sm font-medium text-(--text-body-sub-titles) cursor-help"
                >
                  <span class="material-symbols-outlined text-lg text-green-500">eco</span>
                  {{ (userStore.currentProfileCo2Saved || 0).toFixed(2) }} kg CO₂
                  <!-- Custom Tooltip -->
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50"
                  >
                    Total de CO₂ poupado
                    <!-- Arrow -->
                    <div
                      class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"
                    ></div>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 bg-(--system-background) px-4 py-2 rounded-xl border border-(--system-border) text-sm font-medium text-(--text-body-sub-titles)"
                >
                  <span class="material-symbols-outlined text-lg text-orange-500">mail</span>
                  {{ displayEmail }}
                </div>
                <div
                  class="flex items-center gap-2 bg-(--system-background) px-4 py-2 rounded-xl border border-(--system-border) text-sm font-medium text-(--text-body-sub-titles)"
                >
                  <span class="material-symbols-outlined text-lg text-purple-500">cake</span>
                  {{ displayAge }} anos
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Button (Absolute) -->
          <button
            @click="scrollToSettings"
            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-(--text-body-sub-titles) hover:text-(--system-ring) hover:bg-(--system-background) rounded-full transition-all z-10"
            title="Configurações"
          >
            <span class="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        <!-- Level & Streak Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
          <!-- Level Card -->
          <div
            class="bg-(--system-card) border border-(--system-border) p-6 rounded-2xl shadow-sm flex items-center gap-6 relative overflow-hidden transition-all"
          >
            <!-- Chart Container -->
            <div class="relative w-40 h-40 shrink-0">
              <apexchart
                v-if="chartReady"
                :key="themeKey"
                type="radialBar"
                :options="levelChartOptions"
                :series="levelChartSeries"
                width="100%"
                height="100%"
              ></apexchart>
              <!-- Center Text -->
              <div
                class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <span class="text-xs text-(--text-body-sub-titles) font-medium uppercase"
                  >Nível</span
                >
                <span class="text-2xl font-bold text-(--text-body-titles) leading-none">{{
                  currentProfile?.level || 1
                }}</span>
              </div>
            </div>

            <!-- Text Info -->
            <div class="flex flex-col gap-1 z-10">
              <h3 class="text-lg font-bold text-(--text-body-titles)">Progresso</h3>
              <p class="text-sm text-(--text-body-sub-titles)">
                <span class="font-semibold text-(--system-ring)">{{ xpInCurrentLevel }} XP</span>
                ganhos de {{ xpForNextLevel }} XP
              </p>
              <p class="text-xs text-(--text-disabled) mt-1">
                Complete mais tarefas para subir de nível!
              </p>
            </div>
          </div>

          <!-- Streak Card -->
          <div
            class="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <!-- Background Decoration -->
            <div class="absolute -right-4 -top-4 text-orange-500/10 dark:text-orange-500/5">
              <span class="material-symbols-outlined text-[120px]">local_fire_department</span>
            </div>

            <div class="flex items-start justify-between z-10">
              <div>
                <h3 class="text-lg font-bold text-orange-950 dark:text-orange-50">Sequência</h3>
                <div class="flex items-baseline gap-1">
                  <span
                    class="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-orange-600"
                  >
                    {{ currentProfile?.streak || 0 }}
                  </span>
                  <span class="text-sm font-medium text-orange-800 dark:text-orange-200">dias</span>
                </div>
              </div>
              <div
                class="w-10 h-10 rounded-full bg-orange-600 dark:bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/30 animate-pulse"
              >
                <span class="material-symbols-outlined text-white text-xl"
                  >local_fire_department</span
                >
              </div>
            </div>

            <!-- Week Visualizer -->
            <div class="flex items-center justify-between gap-2 z-10 mt-2">
              <div
                v-for="(day, index) in weekDaysStreak"
                :key="index"
                class="flex flex-col items-center gap-1.5"
              >
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2',
                    day.completed
                      ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/20 dark:bg-orange-500 dark:border-orange-500'
                      : 'bg-orange-100/50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300',
                  ]"
                >
                  <span v-if="day.completed" class="material-symbols-outlined text-base"
                    >check</span
                  >
                  <span v-else class="text-[10px]">{{ day.label.charAt(0) }}</span>
                </div>
                <span
                  class="text-[10px] font-bold text-orange-900/80 dark:text-orange-100/80 uppercase"
                  >{{ day.label }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Draggable Collapsible Cards -->
      <div class="w-full max-w-[930px]">
        <draggable
          v-model="cardOrder"
          @end="saveCardOrder"
          item-key="id"
          class="grid gap-6 grid-cols-1"
          handle=".drag-handle"
          :animation="200"
          ghost-class="ghost-card"
        >
          <template #item="{ element }">
            <div>
              <CollapsibleCard
                v-if="element === 'badges'"
                title="Badges"
                icon="apps"
                v-model="cardOpenStates.badges"
                class="h-full"
              >
                <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full py-4">
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

              <CollapsibleCard
                v-else-if="element === 'ranking'"
                title="Ranking"
                icon="apps"
                v-model="cardOpenStates.ranking"
                class="h-full"
              >
                <div class="flex flex-col gap-2 w-full py-2">
                  <RankingRow
                    v-for="profile in householdLeaderboard"
                    :key="profile.id"
                    :position="profile.rank"
                    :name="profile.name"
                    :highlight="profile.id === currentProfile?.id"
                  />
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                v-else-if="element === 'challenges'"
                title="Desafios"
                icon="apps"
                v-model="cardOpenStates.challenges"
                class="h-full"
              >
                <!-- Sort Toggle -->
                <div v-if="profileChallenges.length > 0" class="flex items-center justify-end mb-4">
                  <button
                    @click="sortCompletedFirst = !sortCompletedFirst"
                    :class="[
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      sortCompletedFirst
                        ? 'bg-(--system-ring) border-2 border-(--system-ring) text-white'
                        : 'bg-(--system-card) border-2 border-(--system-border) text-(--text-body-sub-titles)',
                    ]"
                  >
                    <span class="material-symbols-outlined text-[20px]">
                      {{ sortCompletedFirst ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                    <span class="text-sm font-medium">Completados primeiro</span>
                  </button>
                </div>

                <div
                  v-if="paginatedChallenges.length > 0"
                  class="gap-4 grid grid-cols-1 md:grid-cols-2 w-full"
                >
                  <ChallengeCard
                    v-for="challenge in paginatedChallenges"
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

                <!-- Ver Mais Button -->
                <button
                  v-if="sortedChallenges.length > displayedChallengesCount"
                  @click="displayedChallengesCount += 6"
                  class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4 hover:opacity-80 transition-opacity"
                >
                  <span class="material-symbols-outlined">expand_more</span>
                  <span>Ver mais</span>
                </button>
              </CollapsibleCard>

              <CollapsibleCard
                v-else-if="element === 'rewards'"
                title="Recompensas"
                icon="apps"
                v-model="cardOpenStates.rewards"
                class="h-full"
              >
                <!-- Tab Navigation -->
                <div class="flex items-center w-full border-b border-(--system-border) mb-4">
                  <button
                    @click="rewardTab = 'redeem'"
                    :class="[
                      'flex-1 py-3 text-center font-bold text-base transition-colors relative',
                      rewardTab === 'redeem'
                        ? 'text-(--text-body-sub-titles)'
                        : 'text-(--text-disabled) hover:text-(--text-body)',
                    ]"
                  >
                    Resgatar pontos
                    <div
                      v-if="rewardTab === 'redeem'"
                      class="absolute bottom-0 left-0 w-full h-0.5 bg-(--text-body-sub-titles)"
                    ></div>
                  </button>
                  <button
                    @click="rewardTab = 'redeemed'"
                    :class="[
                      'flex-1 py-3 text-center font-bold text-base transition-colors relative',
                      rewardTab === 'redeemed'
                        ? 'text-(--text-body-sub-titles)'
                        : 'text-(--text-disabled) hover:text-(--text-body)',
                    ]"
                  >
                    Histórico ({{ redeemedRewards.length }})
                    <div
                      v-if="rewardTab === 'redeemed'"
                      class="absolute bottom-0 left-0 w-full h-0.5 bg-(--text-body-sub-titles)"
                    ></div>
                  </button>
                </div>

                <!-- Search -->
                <div class="relative w-full mb-6">
                  <input
                    v-model="rewardSearch"
                    type="text"
                    placeholder="Pesquisar recompensas..."
                    class="w-full pl-10 pr-4 py-2 bg-(--system-card) border-2 border-(--system-border) rounded-lg outline-none focus:border-(--system-ring) transition-colors"
                  />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2">
                    <span class="material-symbols-outlined text-[20px] text-(--text-disabled)"
                      >search</span
                    >
                  </div>
                </div>

                <!-- Rewards List -->
                <div v-if="rewardTab === 'redeem'" class="space-y-2">
                  <RewardListItem
                    v-for="reward in filteredAvailableRewards"
                    :key="reward.id"
                    :image="reward.imgUrl"
                    :title="reward.title"
                    :points="reward.points_cost"
                    @action="redeemReward(reward)"
                  />
                  <p
                    v-if="filteredAvailableRewards.length === 0"
                    class="text-center py-4 text-(--text-disabled)"
                  >
                    Nenhuma recompensa disponível
                  </p>
                </div>

                <div v-else class="space-y-2">
                  <p
                    class="font-['Noto_Sans'] font-bold leading-[1.5] text-[16px] text-(--text-body-sub-titles) mb-4"
                  >
                    Histórico:
                  </p>
                  <RewardListItem
                    v-for="reward in redeemedRewards"
                    :key="reward.id"
                    :image="getRewardImage(reward.id_reward)"
                    :title="reward.title"
                    :points="reward.points_cost"
                    :date="formatDate(reward.redemedAt)"
                    :status="reward.status"
                    @action="cancelReward(reward)"
                  />
                  <p
                    v-if="redeemedRewards.length === 0"
                    class="text-center py-4 text-(--text-disabled)"
                  >
                    Nenhuma recompensa resgatada
                  </p>
                </div>

                <p
                  class="font-['Noto_Sans'] font-semibold text-xl text-(--text-body-titles) text-right w-full mt-6"
                >
                  {{ currentProfile?.points || 0 }} pontos
                </p>
              </CollapsibleCard>

              <CollapsibleCard
                v-else-if="element === 'settings'"
                id="card-settings"
                title="Configurações"
                icon="apps"
                v-model="cardOpenStates.settings"
                class="h-full"
              >
                <div class="flex flex-col gap-3 w-full">
                  <div
                    v-for="setting in settingsList"
                    :key="setting.key"
                    class="bg-(--system-card) border border-(--system-border) flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg w-full gap-4 transition-all hover:border-(--system-ring)"
                  >
                    <div class="flex flex-col gap-1">
                      <span class="font-semibold text-base sm:text-lg text-(--text-body)">{{
                        setting.title
                      }}</span>
                      <span class="text-sm text-(--text-body-sub-titles) leading-relaxed">{{
                        setting.description
                      }}</span>
                    </div>
                    <div class="flex justify-end shrink-0">
                      <ToggleSwitch
                        v-model="localSettings[setting.key]"
                        @update:modelValue="saveSettings"
                      />
                    </div>
                  </div>
                </div>

                <!-- Background Customization -->
                <div class="mt-6 border-t border-(--system-border) pt-6">
                  <h3 class="font-semibold text-base text-(--text-body) mb-4">
                    Personalização do Fundo
                  </h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      v-for="bg in availableBackgrounds"
                      :key="bg.id"
                      @click="selectBackground(bg)"
                      :class="[
                        'h-16 rounded-xl border-2 transition-all relative overflow-hidden group',
                        currentProfile?.settings?.headerBackground === bg.id
                          ? 'border-(--system-ring) ring-2 ring-(--system-ring) ring-offset-2'
                          : 'border-transparent hover:border-(--system-border)',
                        bg.isLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
                      ]"
                      :title="bg.isLocked ? bg.hint : bg.name"
                    >
                      <div :class="['absolute inset-0', bg.class]"></div>
                      <div
                        v-if="bg.isLocked"
                        class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
                      >
                        <span class="material-symbols-outlined text-white drop-shadow-md"
                          >lock</span
                        >
                      </div>
                      <span
                        class="absolute bottom-1 left-2 text-[10px] font-bold text-(--text-body-titles) bg-white/80 px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm"
                      >
                        {{ bg.name }}
                      </span>
                    </button>
                  </div>
                </div>
              </CollapsibleCard>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>

  <!-- ChatBot -->
  <ChatBot context="profile" />
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import draggable from 'vuedraggable'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import BadgeCard from '@/components/BadgeCard.vue'
import BadgeModal from '@/components/BadgeModal.vue'
import ProfileEditModal from '@/components/ProfileEditModal.vue'
import RankingRow from '@/components/RankingRow.vue'
import ChallengeCard from '@/components/ChallengeCard.vue'
import RewardListItem from '@/components/RewardListItem.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ChatBot from '@/components/ChatBot.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import FormInput from '@/components/FormInput.vue'
import { useUserStore } from '@/stores/userStore'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'ProfileView',
  components: {
    draggable,
    MenuNav,
    CollapsibleCard,
    BadgeCard,
    BadgeModal,
    ProfileEditModal,
    RankingRow,
    ChallengeCard,
    RewardListItem,
    ToggleSwitch,
    ModalComponent,
    FormInput,
    apexchart: VueApexCharts,
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

      // Profile Edit Modal
      showEditProfileModal: false,
      editProfileData: null,

      // PIN Setup Modal
      showPinModal: false,
      showPinConfirmModal: false,
      pinInput: '',
      pinConfirmInput: '',
      pinError: '',

      chartReady: false,
      // Rewards
      rewardTab: 'redeem',
      rewardSearch: '',
      // Track rewards currently being redeemed to avoid duplicate requests
      redeemingRewards: [],

      // Challenges
      displayedChallengesCount: 12,
      sortCompletedFirst: false,

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

      // Card order
      cardOrder: ['badges', 'ranking', 'challenges', 'rewards', 'settings'],

      // Card open states
      cardOpenStates: {
        badges: true,
        ranking: true,
        challenges: true,
        rewards: true,
        settings: true,
      },

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

      // Header Backgrounds
      headerBackgrounds: [
        {
          id: 'default',
          name: 'Aurora',
          class:
            'bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20',
          locked: false,
        },
        {
          id: 'sunset',
          name: 'Sunset',
          class:
            'bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/20 dark:to-rose-900/20',
          locked: false,
        },
        {
          id: 'ocean',
          name: 'Ocean',
          class:
            'bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20',
          locked: false,
        },
        {
          id: 'lavender',
          name: 'Lavender',
          class:
            'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20',
          locked: false,
        },
        {
          id: 'gold',
          name: 'Gold',
          class:
            'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20',
          badgeId: 'early_adopter',
          hint: 'Desbloqueie o badge "Early Adopter"',
        },
        {
          id: 'fire',
          name: 'Fire',
          class:
            'bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20',
          badgeId: 'eco_warrior',
          hint: 'Desbloqueie o badge "Eco Warrior"',
        },
      ],

      themeKey: 0,
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    currentProfile() {
      return this.userStore.currentProfile
    },
    displayEmail() {
      if (this.currentProfile?.isAdmin) {
        return this.userStore.currentUser?.email || 'Sem email'
      }
      return this.currentProfile?.email || 'Sem email'
    },
    displayAge() {
      if (this.currentProfile?.birthDate) {
        const birthDate = new Date(this.currentProfile.birthDate)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
      }
      return this.currentProfile?.age || '-'
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
    levelChartSeries() {
      return [this.xpPercentage]
    },
    levelChartOptions() {
      const isDark = document.documentElement.classList.contains('dark')
      const primaryColor = '#22c55e' // Green-500 (Mais visível)
      const secondaryColor = '#16a34a' // Green-600 (Mais contraste)

      return {
        chart: {
          type: 'radialBar',
          animations: {
            enabled: true,
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: false,
          },
        },
        colors: [primaryColor],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.3,
            gradientToColors: [secondaryColor],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: '45%',
              background: 'transparent',
            },
            track: {
              show: true,
              background: isDark ? '#333333' : '#f3f4f6',
              strokeWidth: '100%',
              margin: 0,
            },
            dataLabels: {
              show: false,
            },
          },
        },
        stroke: {
          lineCap: 'round',
        },
        tooltip: { enabled: false },
        states: {
          hover: {
            filter: {
              type: 'none',
            },
          },
          active: {
            filter: {
              type: 'none',
            },
          },
        },
      }
    },
    currentBackgroundClass() {
      const bgId = this.currentProfile?.settings?.headerBackground || 'default'
      const bg = this.headerBackgrounds.find((b) => b.id === bgId)
      return bg ? bg.class : this.headerBackgrounds[0].class
    },
    availableBackgrounds() {
      return this.headerBackgrounds.map((bg) => {
        const isLocked = bg.badgeId ? !this.hasBadge(bg.badgeId) : false
        return { ...bg, isLocked }
      })
    },
    availableRewards() {
      return this.userStore.householdRewards || []
    },
    redeemedRewards() {
      return this.currentProfile?.rewards_history || []
    },
    filteredAvailableRewards() {
      if (!this.rewardSearch) return this.availableRewards
      return this.availableRewards.filter((r) =>
        r.title.toLowerCase().includes(this.rewardSearch.toLowerCase()),
      )
    },
    profileChallenges() {
      const storeChallenges = this.userStore.householdChallenges || []
      const activities = this.currentProfile?.activity_history || []
      const allChallenges = []

      // Process household challenges (both old and new format)
      storeChallenges.forEach((challenge) => {
        let progress = 0
        let title = challenge.title || ''
        let description = challenge.description || ''

        // NEW FORMAT: Task-based challenges with task_id
        if (challenge.task_id) {
          const task = this.userStore.availableTasks.find(
            (t) => String(t.id) === String(challenge.task_id),
          )

          if (task) {
            title = task.title
            description =
              challenge.type === 'streak'
                ? `Complete ${challenge.target} dias consecutivos`
                : `Complete ${challenge.target} vezes`

            // Calculate progress based on challenge type
            if (challenge.type === 'streak') {
              // Streak-based: count consecutive days with this task completed
              const taskActivities = activities
                .filter((a) => String(a.task_id) === String(challenge.task_id))
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

              let currentStreak = 0
              let lastDate = null

              for (const activity of taskActivities) {
                const activityDate = new Date(activity.completedAt).toDateString()

                if (!lastDate) {
                  currentStreak = 1
                  lastDate = new Date(activity.completedAt)
                } else {
                  const dayDiff = Math.floor(
                    (lastDate - new Date(activity.completedAt)) / (1000 * 60 * 60 * 24),
                  )
                  if (dayDiff === 1) {
                    currentStreak++
                    lastDate = new Date(activity.completedAt)
                  } else {
                    break
                  }
                }
              }

              progress = currentStreak
            } else {
              // Completion-based: count total completions of this task
              progress = activities.filter(
                (a) => String(a.task_id) === String(challenge.task_id),
              ).length
            }
          }
        }
        // OLD FORMAT: Category/Title-based challenges (backward compatibility)
        else {
          // Use existing title and description from the challenge
          title = challenge.title || ''
          description = challenge.description || ''

          // Calculate progress based on category if present
          if (challenge.category) {
            if (challenge.category === 'Mobilidade') {
              progress = activities.filter((a) => {
                const task = this.userStore.availableTasks.find(
                  (t) => String(t.id) === String(a.task_id),
                )
                return task?.category === 'Mobilidade'
              }).length
            } else if (challenge.category === 'Reciclagem') {
              progress = activities.filter((a) => {
                const task = this.userStore.availableTasks.find(
                  (t) => String(t.id) === String(a.task_id),
                )
                return task?.category === 'Reciclagem'
              }).length
            } else if (challenge.category === 'Energia') {
              progress = activities.filter((a) => {
                const task = this.userStore.availableTasks.find(
                  (t) => String(t.id) === String(a.task_id),
                )
                return task?.category === 'Energia'
              }).length
            } else if (challenge.category === 'Água') {
              progress = activities.filter((a) => {
                const task = this.userStore.availableTasks.find(
                  (t) => String(t.id) === String(a.task_id),
                )
                return task?.category === 'Água'
              }).length
            } else if (challenge.category === 'Alimentação') {
              progress = activities.filter((a) => {
                const task = this.userStore.availableTasks.find(
                  (t) => String(t.id) === String(a.task_id),
                )
                return task?.category === 'Alimentação'
              }).length
            } else if (challenge.category === 'Ambiente') {
              progress = activities.filter((a) => {
                const task = this.userStore.availableTasks.find(
                  (t) => String(t.id) === String(a.task_id),
                )
                return task?.category === 'Ambiente'
              }).length
            }
          }
        }

        // Add to unified array with consistent structure
        allChallenges.push({
          id: challenge.id,
          title,
          description,
          currentProgress: progress,
          progress: Math.min((progress / (challenge.target || 1)) * 100, 100),
          completed: progress >= (challenge.target || 1),
          xp: challenge.xp_awarded || challenge.xp || 0,
          target: challenge.target || 1,
        })
      })

      // Process and add default challenges to the same array
      this.defaultChallenges.forEach((challenge) => {
        let progress = 0

        // Calculate progress based on challenge type
        switch (challenge.id) {
          case 1: // Transportes verdes
            progress = activities.filter((a) => {
              const task = this.userStore.availableTasks.find(
                (t) => String(t.id) === String(a.task_id),
              )
              return task?.category === 'Mobilidade'
            }).length
            break
          case 2: // Reciclar
            progress = activities.filter((a) => {
              const task = this.userStore.availableTasks.find(
                (t) => String(t.id) === String(a.task_id),
              )
              return task?.category === 'Reciclagem'
            }).length
            break
          case 3: // Casa verde (energia)
            progress = activities.filter((a) => {
              const task = this.userStore.availableTasks.find(
                (t) => String(t.id) === String(a.task_id),
              )
              return task?.category === 'Energia'
            }).length
            break
          case 4: // CO2 saved
            progress = Math.min(this.userStore.currentProfileCo2Saved || 0, challenge.target)
            break
          case 5: // Limpeza
            progress = activities.filter((a) => {
              const task = this.userStore.availableTasks.find(
                (t) => String(t.id) === String(a.task_id),
              )
              return task?.title?.toLowerCase().includes('limp')
            }).length
            break
          case 6: // Banhos rápidos
            progress = activities.filter((a) => {
              const task = this.userStore.availableTasks.find(
                (t) => String(t.id) === String(a.task_id),
              )
              return task?.category === 'Água'
            }).length
            break
        }

        // Add to unified array with consistent structure
        allChallenges.push({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          currentProgress: progress,
          progress: Math.min((progress / challenge.target) * 100, 100),
          completed: progress >= challenge.target,
          xp: challenge.xp || 0,
          target: challenge.target || 1,
        })
      })

      return allChallenges
    },
    sortedChallenges() {
      const challenges = [...this.profileChallenges]
      if (this.sortCompletedFirst) {
        return challenges.sort((a, b) => {
          if (a.completed === b.completed) return 0
          return a.completed ? -1 : 1
        })
      }
      return challenges
    },
    paginatedChallenges() {
      return this.sortedChallenges.slice(0, this.displayedChallengesCount)
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
    // Load saved card order from localStorage
    const savedOrder = localStorage.getItem('profileCardOrder')
    if (savedOrder) {
      try {
        this.cardOrder = JSON.parse(savedOrder)
      } catch (e) {
        console.error('Error loading card order:', e)
      }
    }
  },
  mounted() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', this.updateThemeKey)
    this.themeObserver = new MutationObserver(this.updateThemeKey)
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    // Pequeno delay para garantir que o elemento DOM existe antes de renderizar o gráfico
    setTimeout(() => {
      this.chartReady = true
    }, 100)
  },
  beforeUnmount() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', this.updateThemeKey)
    if (this.themeObserver) {
      this.themeObserver.disconnect()
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
    saveCardOrder() {
      localStorage.setItem('profileCardOrder', JSON.stringify(this.cardOrder))
    },
    openBadgeModal(badge) {
      this.selectedBadge = badge
      this.showBadgeModal = true
    },
    openEditProfileModal() {
      this.editProfileData = {
        id: this.currentProfile?.id,
        name: this.currentProfile?.name || '',
        age: this.currentProfile?.age || '',
        avatarUrl: this.currentProfile?.avatarUrl || '',
        email: this.currentProfile?.email || '',
        birthDate: this.currentProfile?.birthDate || '',
      }
      this.showEditProfileModal = true
    },
    closeEditProfileModal() {
      this.showEditProfileModal = false
      this.editProfileData = null
    },
    async handleSaveProfile(profileData) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      if (!profileData?.id) {
        this.showNotification('Perfil inválido', 'error')
        return
      }

      const updateData = {
        name: profileData.name,
        age: profileData.age,
        avatarUrl: profileData.avatarUrl || profileData.avatar,
        birthDate: profileData.birthDate,
        email: profileData.email || null,
      }

      const result = await this.userStore.updateProfile(profileData.id, updateData)

      if (result.success) {
        this.showNotification('Perfil atualizado com sucesso!', 'success')
      } else {
        this.showNotification('Erro ao atualizar perfil', 'error')
      }
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
      const reward = this.availableRewards.find((r) => String(r.id) === String(rewardId))
      return reward?.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
    },
    hasBadge(badgeId) {
      const badge = this.allBadgesWithStatus.find((b) => b.id === badgeId)
      return badge ? badge.earned : false
    },
    async saveSettings() {
      if (!this.currentProfile) return

      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      // If enabling private profile and no PIN is set, open PIN modal
      if (this.localSettings.privateProfile && !this.currentProfile.settings?.pin) {
        this.showPinModal = true
        return
      }

      // If disabling private profile and PIN is set, require confirmation
      if (!this.localSettings.privateProfile && this.currentProfile.settings?.pin) {
        this.showPinConfirmModal = true
        return
      }

      const settings = {
        pin: this.localSettings.privateProfile ? this.currentProfile.settings?.pin || null : null,
        notifications: this.localSettings.notifications,
        defaultDevice: this.localSettings.keepSession,
        headerBackground: this.currentProfile.settings?.headerBackground || 'default',
      }

      const result = await this.userStore.updateProfileSettings(this.currentProfile.id, settings)
      if (!result.success) {
        this.showNotification('Erro ao guardar configurações', 'error')
      }
    },
    async selectBackground(bg) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      if (bg.isLocked) {
        this.showNotification(bg.hint || 'Fundo bloqueado', 'error')
        return
      }

      const settings = {
        ...this.currentProfile.settings,
        headerBackground: bg.id,
      }

      await this.userStore.updateProfileSettings(this.currentProfile.id, settings)
      this.showNotification(`Fundo "${bg.name}" aplicado!`)
    },
    cancelPinSetup() {
      this.pinInput = ''
      this.pinConfirmInput = ''
      this.pinError = ''
      this.showPinModal = false
      // Revert the private profile toggle
      this.localSettings.privateProfile = false
    },
    cancelPinDisable() {
      this.pinConfirmInput = ''
      this.pinError = ''
      this.showPinConfirmModal = false
      // Revert the private profile toggle back to true
      this.localSettings.privateProfile = true
    },
    async confirmPinDisable() {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      if (!this.currentProfile?.settings?.pin) return

      if (this.pinConfirmInput !== this.currentProfile.settings.pin) {
        this.pinError = 'PIN incorreto. Tente novamente.'
        this.pinConfirmInput = ''
        return
      }

      // PIN correct, disable private profile
      const settings = {
        pin: null,
        notifications: this.localSettings.notifications,
        defaultDevice: this.localSettings.keepSession,
        headerBackground: this.currentProfile.settings?.headerBackground || 'default',
      }

      const result = await this.userStore.updateProfileSettings(this.currentProfile.id, settings)
      if (result.success) {
        this.showNotification('Proteção por PIN desativada com sucesso', 'success')
        this.showPinConfirmModal = false
        this.pinConfirmInput = ''
        this.pinError = ''
      } else {
        this.showNotification('Erro ao desativar PIN', 'error')
      }
    },
    async confirmPinSetup() {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

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
        headerBackground: this.currentProfile.settings?.headerBackground || 'default',
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

      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      try {
        if (!this.currentProfile) {
          this.showNotification('Perfil não selecionado', 'error')
          return
        }

        if (this.userStore.currentProfilePoints < reward.points_cost) {
          this.showNotification('Pontos insuficientes!', 'error')
          return
        }

        const result = await this.userStore.redeemReward(reward)
        if (result.success) {
          this.showNotification(
            `Recompensa "${reward.title}" resgatada! Aguarde aprovação do administrador.`,
            'success',
          )
        } else {
          this.showNotification(result.message || 'Erro ao resgatar recompensa', 'error')
        }
      } finally {
        // Ensure we always remove the id from the in-progress list
        this.redeemingRewards = this.redeemingRewards.filter((id) => id !== reward.id)
      }
    },
    async cancelReward(reward) {
      if (this.userStore.currentUser?.email === 'demo@bgreen.pt') {
        this.showNotification('Modo Demo: Ação não permitida', 'warning')
        return
      }

      if (reward.status !== 'pendente' && reward.status !== 'pending') {
        this.showNotification('Apenas recompensas pendentes podem ser canceladas', 'error')
        return
      }

      const result = await this.userStore.cancelReward(this.currentProfile.id, reward.id)
      if (result.success) {
        this.showNotification(
          `Recompensa cancelada. ${result.pointsReturned} pontos devolvidos!`,
          'success',
        )
      } else {
        this.showNotification(result.message || 'Erro ao cancelar recompensa', 'error')
      }
    },
    loadMoreChallenges() {
      this.displayedChallengesCount += 6
    },

    getUserRank(profileId) {
      const profile = this.householdLeaderboard.find((p) => p.id === profileId)
      return profile ? profile.rank : '-'
    },
    getProfileTitle(level) {
      if (level >= 50) return 'Lenda Ecológica'
      if (level >= 30) return 'Guardião do Planeta'
      if (level >= 20) return 'Mestre da Sustentabilidade'
      if (level >= 10) return 'Eco Warrior'
      if (level >= 5) return 'Explorador Verde'
      return 'Iniciado'
    },

    scrollToSettings() {
      this.cardOpenStates.settings = true
      this.$nextTick(() => {
        const el = document.getElementById('card-settings')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      })
    },
    updateThemeKey() {
      this.themeKey++
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
