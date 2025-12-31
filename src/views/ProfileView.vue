<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="false"/>
    
    <div class="max-w-[912px] mx-auto px-4 py-8 flex flex-col gap-8">
      
      <!-- Profile Header -->
      <div class="bg-(--system-card) border-2 border-(--system-border) flex gap-[16px] items-center p-[16px] relative rounded-[14px] shrink-0 w-full">
        <div class="border-2 border-(--system-border) overflow-hidden relative rounded-[999px] shrink-0 w-[100px] h-[100px]">
          <div class="absolute h-full left-[-51px] top-[10px] w-[278px]">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jose"
              alt="User avatar"
              class="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full"
            />
          </div>
        </div>
        
        <div class="basis-0 bg-(--system-card) gap-[16px] grid grid-cols-[fit-content(100%)_fit-content(100%)_minmax(0px,_1fr)] grid-rows-[repeat(2,_fit-content(100%))] grow min-h-px min-w-px overflow-hidden p-[16px] relative rounded-[14px] shrink-0">
          <div class="[grid-area:1/1] flex font-['Noto_Sans'] font-normal gap-[8px] items-center justify-center relative shrink-0 text-nowrap">
            <p class="leading-normal relative shrink-0 text-[16px] text-(--text-body-sub-titles)">Nome:</p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">{{ userInfo.name }}</p>
          </div>
          <div class="[grid-area:1/2] flex font-['Noto_Sans'] font-normal gap-[8px] items-center relative shrink-0 text-nowrap">
            <p class="leading-normal relative shrink-0 text-[16px] text-(--text-body-sub-titles)">País:</p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">{{ userInfo.country }}</p>
          </div>
          <div class="[grid-area:1_/_3] flex font-['Noto_Sans'] font-normal gap-[8px] items-center place-self-stretch relative shrink-0 text-nowrap">
            <p class="leading-[1.5] relative shrink-0 text-[16px] text-(--text-body-sub-titles)">Contacto:</p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">{{ userInfo.contact }}</p>
          </div>
          <div class="[grid-area:2_/_1] flex font-['Noto_Sans'] font-normal gap-[8px] items-center place-self-stretch relative shrink-0 text-nowrap">
            <p class="leading-[1.5] relative shrink-0 text-[16px] text-(--text-body-sub-titles)">Idade:</p>
            <p class="leading-[1.75] relative shrink-0 text-[18px] text-(--text-body)">{{ userInfo.age }}</p>
          </div>
        </div>
      </div>
      
      <!-- Level & Streak Cards -->
      <div class="flex gap-[16px] items-center relative shrink-0 w-full">
        <!-- Level Card -->
        <div class="basis-0 bg-(--system-card) border-2 border-(--system-border) gap-[16px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(2,_fit-content(100%))] grow min-h-px min-w-px overflow-hidden p-[16px] relative rounded-[14px] shrink-0">
          <div class="[grid-area:1_/_1] flex flex-col font-['Noto_Sans'] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-(--text-body-sub-titles) text-nowrap">
            <p class="leading-[1.5]">Nível: {{ level }}</p>
          </div>
          <div class="[grid-area:2_/_1_/_auto_/_span_2] flex flex-col gap-[8px] h-[47px] items-start justify-end justify-self-stretch relative shrink-0">
            <p class="font-['Noto_Sans'] font-normal leading-[1.5] min-w-full relative shrink-0 text-[14px] text-(--text-body) w-[min-content]">
              {{ xp }}/{{ maxXp }}xp
            </p>
            <div class="bg-(--system-popover) flex h-[8px] items-center overflow-hidden relative rounded-[999px] shrink-0 w-full">
              <div 
                class="bg-(--system-ring) h-full rounded-[999px] shrink-0"
                :style="{ width: `${xpPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Streak Card -->
        <div class="basis-0 bg-(--system-card) border-2 border-(--system-border) gap-[24px] grid grid-cols-[repeat(2,_fit-content(100%))] grid-rows-[repeat(2,_fit-content(100%))] grow min-h-px min-w-px overflow-hidden p-[16px] relative rounded-[14px] shrink-0">
          <p class="[grid-area:1_/_1] font-['Noto_Sans'] font-normal leading-[1.5] relative self-start shrink-0 text-[16px] text-(--text-body-sub-titles) w-[200px]">
            Streak
          </p>
          <div class="[grid-area:2_/_1] flex items-start justify-between relative shrink-0">
            <StreakButton v-for="(day, index) in weekDays" :key="index" :day="day.label" :completed="day.completed" />
          </div>
          <div class="[grid-area:1_/_2_/_span_2] justify-self-end">
            <StreakCard :days="streak" />
          </div>
        </div>
      </div>
      
      <!-- Badges Section -->
      <CollapsibleCard title="Badges" icon="apps" :isOpen="sections.badges">
        <div class="grid grid-cols-3 gap-[8px] w-full items-start overflow-hidden px-0 py-[16px] relative shrink-0 w-full">
          <BadgeCard
            v-for="badge in badges"
            :key="badge.id"
            :icon="badge.icon"
            :title="badge.title"
            :locked="badge.locked"
          />
        </div>
      </CollapsibleCard>
      
      <!-- Ranking Section -->
      <CollapsibleCard title="Ranking" icon="apps" :isOpen="sections.ranking">
        <div class="flex flex-col gap-[8px] items-start overflow-hidden px-0 py-[8px] relative shrink-0 w-full">
          <RankingRow
            v-for="rank in rankings"
            :key="rank.position"
            :position="rank.position"
            :name="rank.name"
            :highlight="rank.highlight"
          />
        </div>
      </CollapsibleCard>
      
      <!-- Challenges Section -->
      <CollapsibleCard title="Desafios" icon="apps" :isOpen="sections.challenges">
        <div class="gap-[8px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(3,_fit-content(100%))] relative shrink-0 w-full">
          <ChallengeCard
            v-for="challenge in challenges"
            :key="challenge.id"
            :title="challenge.title"
            :description="challenge.description"
            :progress="challenge.progress"
            :xp="challenge.xp"
            :active="challenge.active"
          />
        </div>
      </CollapsibleCard>
      
      <!-- Rewards Section -->
      <CollapsibleCard title="Recompensas" icon="apps" :isOpen="sections.rewards">
        <!-- Tab Navigation -->
        <div class="flex items-center justify-between px-0 py-[8px] relative shrink-0 w-full">
          <button
            @click="rewardTab = 'redeem'"
            :class="[
              'flex flex-col items-center justify-center px-0 py-[8px] relative shrink-0',
              rewardTab === 'redeem' ? 'border-b-2 border-(--text-body-sub-titles)' : 'border-b border-(--system-border)'
            ]"
          >
            <p 
              :class="[
                'font-[\'Noto_Sans\'] font-bold leading-[1.5] relative shrink-0 text-[16px] text-center w-[440px]',
                rewardTab === 'redeem' ? 'text-(--text-body-sub-titles)' : 'text-(--text-disabled)'
              ]"
            >
              Resgatar pontos
            </p>
          </button>
          <button
            @click="rewardTab = 'redeemed'"
            :class="[
              'basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px px-0 py-[8px] relative shrink-0',
              rewardTab === 'redeemed' ? 'border-b-2 border-(--text-body-sub-titles)' : 'border-b border-(--system-border)'
            ]"
          >
            <p 
              :class="[
                'font-[\'Noto_Sans\'] font-bold leading-[1.5] relative shrink-0 text-[16px] text-center w-full',
                rewardTab === 'redeemed' ? 'text-(--text-body-sub-titles)' : 'text-(--text-disabled)'
              ]"
            >
              Pontos resgatados ({{ redeemedRewards.length }})
            </p>
          </button>
        </div>
        
        <!-- Search -->
        <div class="flex gap-[10px] items-start relative shrink-0 w-full mb-4">
          <div class="basis-0 flex flex-col gap-[4px] grow h-[40px] items-start min-h-px min-w-px relative shrink-0">
            <div class="basis-0 bg-(--system-card) border-2 border-(--system-border) grow min-h-px min-w-px overflow-hidden relative rounded-[8px] shrink-0 w-full">
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
          <button class="text-(--system-ring) flex items-center gap-1 mx-auto mt-4">
            <p class="font-['Noto_Sans'] font-normal leading-[1.75] text-[18px]">Ver mais</p>
            <span class="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
          </button>
        </div>
        
        <div v-else>
          <p class="font-['Noto_Sans'] font-bold leading-[1.5] text-[16px] text-(--text-body-sub-titles) mb-4">Histórico:</p>
          <RewardListItem
            v-for="reward in redeemedRewards"
            :key="reward.id"
            :image="reward.image"
            :title="reward.title"
            :points="reward.points"
            :date="reward.date"
            :status="reward.status"
            @action="cancelReward(reward)"
          />
          <button class="text-(--system-ring) flex items-center gap-1 mx-auto mt-4">
            <p class="font-['Noto_Sans'] font-normal leading-[1.75] text-[18px]">Ver mais</p>
            <span class="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
          </button>
        </div>
        
        <p class="font-['Noto_Sans'] font-semibold leading-[1.5] relative shrink-0 text-[20px] text-(--text-body-titles) text-right w-full mt-4">
          {{ totalPoints }} pontos
        </p>
      </CollapsibleCard>
      
      <!-- Settings Section -->
      <CollapsibleCard title="Configurações" icon="apps" :isOpen="sections.settings">
        <div class="flex flex-col gap-[4px] items-start overflow-hidden relative shrink-0 w-full">
          <div 
            v-for="setting in settingsList"
            :key="setting.key"
            class="bg-(--system-card) flex items-center justify-between overflow-hidden px-[24px] py-[16px] relative rounded-[10px] shrink-0 w-full"
          >
            <div class="flex flex-col gap-[8px] items-start leading-[0] relative shrink-0 text-(--text-body) text-nowrap">
              <div class="flex flex-col font-['Noto_Sans'] font-semibold justify-center relative shrink-0 text-[20px]">
                <p class="leading-[1.5] text-nowrap">{{ setting.title }}</p>
              </div>
              <div class="flex flex-col font-['Noto_Sans'] font-normal justify-center relative shrink-0 text-[16px]">
                <p class="leading-[1.5] text-nowrap">{{ setting.description }}</p>
              </div>
            </div>
            <ToggleSwitch v-model="settings[setting.key]" />
          </div>
        </div>
      </CollapsibleCard>
      
    </div>
    
    <FooterSection />
  </div>
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import StreakCard from '@/components/StreakCard.vue'
import StreakButton from '@/components/StreakButton.vue'
import BadgeCard from '@/components/BadgeCard.vue'
import RankingRow from '@/components/RankingRow.vue'
import ChallengeCard from '@/components/ChallengeCard.vue'
import RewardListItem from '@/components/RewardListItem.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
  name: 'ProfileView',
  components: {
    MenuNav,
    FooterSection,
    CollapsibleCard,
    StreakCard,
    StreakButton,
    BadgeCard,
    RankingRow,
    ChallengeCard,
    RewardListItem,
    ToggleSwitch
  },
  data() {
    return {
      userInfo: {
        name: 'José Maria',
        age: 12,
        country: 'Portugal',
        contact: 'jose_maria@gmail.com'
      },
      level: 15,
      xp: 750,
      maxXp: 1000,
      streak: 5,
      weekDays: [
        { label: 'S', completed: true },
        { label: 'T', completed: true },
        { label: 'Q', completed: true },
        { label: 'Q', completed: true },
        { label: 'S', completed: true },
        { label: 'S', completed: false },
        { label: 'D', completed: false }
      ],
      sections: {
        badges: true,
        ranking: true,
        challenges: true,
        rewards: true,
        settings: true
      },
      badges: [
        { id: 1, icon: 'emoji_events', title: 'Nível 10', locked: false },
        { id: 2, icon: 'recycling', title: 'Reciclagem nível 5', locked: false },
        { id: 3, icon: 'recycling', title: 'Reutilizador nível 2', locked: false },
        { id: 4, icon: 'bolt', title: 'Luzes apagadas nível 1', locked: true },
        { id: 5, icon: 'train', title: 'Transportes coletivos 1', locked: true },
        { id: 6, icon: 'eco', title: 'Sustentável 1', locked: true },
        { id: 7, icon: 'water_drop', title: 'Abaixo de zero', locked: true },
        { id: 8, icon: 'recycling', title: 'Separador 1', locked: true }
      ],
      rankings: [
        { position: 1, name: 'Mário Pires', highlight: false },
        { position: 2, name: 'José Maria', highlight: true },
        { position: 3, name: 'Manuel Sá', highlight: false }
      ],
      challenges: [
        { id: 1, title: 'Transportes verdes', description: 'Use "transportes públicos" ou "bicicleta" 5 vezes', progress: 0, xp: 50, active: true },
        { id: 2, title: 'Reciclar 10 dias seguidos', description: 'Contribua para a tarefa "Reciclar Resíduos"', progress: 25, xp: 50, active: false },
        { id: 3, title: 'Casa verde', description: 'Contribua para a tareda "Desligar Equipamentos"', progress: 50, xp: 50, active: false },
        { id: 4, title: 'Reduzir 2kg de emissão de CO2', description: 'Contribua para tarefas que reduzam emissões', progress: 0, xp: 50, active: false },
        { id: 5, title: 'Contribuir para a Limpeza', description: 'Contribua para a tarefa "Limpezas"', progress: 0, xp: 50, active: false },
        { id: 6, title: 'Tomar banhos rápidos', description: 'Duração máxima: 10 minutos', progress: 0, xp: 50, active: false }
      ],
      availableRewards: [
        { id: 1, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', title: 'Ida ao parque', points: 400 },
        { id: 2, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', title: 'Jantar fora', points: 120 },
        { id: 3, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', title: 'Ida ao cinema', points: 100 },
        { id: 4, image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400', title: 'Escolher a música no carro', points: 20 },
        { id: 5, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', title: 'Tempo extra de lazer', points: 60 },
        { id: 6, image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=400', title: 'Doces e salgados', points: 10 }
      ],
      redeemedRewards: [
        { id: 1, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', title: 'Jantar fora', points: 120, date: '14/09/2025', status: 'pendente' },
        { id: 2, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', title: 'Jantar fora', points: 120, date: '08/07/2025', status: 'cancelado' },
        { id: 3, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', title: 'Tempo extra de lazer', points: 60, date: '08/07/2025', status: 'completo' },
        { id: 4, image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=400', title: 'Doces e salgados', points: 10, date: '27/06/2025', status: 'cancelado' }
      ],
      rewardTab: 'redeem',
      rewardSearch: '',
      settings: {
        privateProfile: false,
        notifications: false,
        keepSession: false
      },
      settingsList: [
        { key: 'privateProfile', title: 'Perfil privado', description: 'Defina um PIN para aceder ao seu perfil' },
        { key: 'notifications', title: 'Receber notificações', description: 'Receba notificações de troca de pontos aprovadas pelo admistrador' },
        { key: 'keepSession', title: 'Manter sessão', description: 'Torna este o perfil padrão do dispositivo' }
      ],
      totalPoints: 278
    }
  },
  computed: {
    xpPercentage() {
      return (this.xp / this.maxXp) * 100
    },
    filteredAvailableRewards() {
      if (!this.rewardSearch) return this.availableRewards
      return this.availableRewards.filter(r => 
        r.title.toLowerCase().includes(this.rewardSearch.toLowerCase())
      )
    }
  },
  methods: {
    redeemReward(reward) {
      console.log('Redeeming reward:', reward)
      // Handle reward redemption
    },
    cancelReward(reward) {
      console.log('Canceling reward:', reward)
      // Handle reward cancellation
    }
  }
}
</script>
