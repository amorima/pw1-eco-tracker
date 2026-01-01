<template>
  <MenuNav :landing="false" />
  <div class="p-8 flex justify-center w-full">
    <div class="space-y-4 w-[930px]">
      <!-- Analise rápida mensal -->
      <CollapsibleCard title="Analise rápida mensal">
        <div class="flex gap-4 items-center w-full">
          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">CO2 Evitado</p>
            <p class="font-semibold text-4xl">22.8 kg</p>
          </div>

          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">Consumo mensal total</p>
            <p class="font-semibold text-4xl">275 kWh</p>
          </div>

          <div
            class="bg-(--system-background) border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 flex-1 text-(--text-body-sub-titles)"
          >
            <p class="font-normal text-base">Consumo médio por membro</p>
            <p class="font-semibold text-4xl">68.75 kWh/membro</p>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Consumos de energia diários -->
      <CollapsibleCard title="Consumos de energia diários">
        <div
          class="h-[259px] w-full flex items-center justify-center bg-(--system-input-background) rounded-lg"
        >
          <p class="text-(--accent-muted-foreground)">Gráfico de consumo diário</p>
        </div>
      </CollapsibleCard>

      <!-- Gestão de utilizadores -->
      <CollapsibleCard title="Gestão de utilizadores">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <UserCard
            v-for="user in users"
            :key="user.id"
            :name="user.name"
            :rank="user.rank"
            :points="user.points"
            :avatar="user.avatar"
            @edit="editUser(user.id)"
            @delete="deleteUser(user.id)"
          />
          <UserCard :isEmpty="true" @edit="addUser" />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2 text-base text-(--text-body-titles)">
            <p>Nº membros: {{ users.length }}</p>
            <p>Nº vagas: {{ maxUsers - users.length }}</p>
          </div>
          <div class="flex gap-2.5">
            <button
              @click="decreaseMaxUsers"
              class="w-14 h-14 rounded-lg bg-(--system-border) flex items-center justify-center hover:bg-(--system-ring) transition-colors"
              :disabled="maxUsers <= users.length"
            >
              <span class="material-symbols-outlined text-[30px] text-(--text-body-titles)"
                >remove</span
              >
            </button>
            <button
              @click="increaseMaxUsers"
              class="w-14 h-14 rounded-lg bg-(--system-border) flex items-center justify-center hover:bg-(--system-ring) transition-colors"
            >
              <span class="material-symbols-outlined text-[30px] text-(--text-body-titles)"
                >add</span
              >
            </button>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Gestão de recompensas -->
      <CollapsibleCard title="Gestão de recompensas">
        <!-- Search and Add -->
        <div class="flex gap-2.5 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="rewardSearch"
              type="text"
              placeholder="Pesquisar . . ."
              class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
            />
            <span
              class="material-symbols-outlined absolute left-3 top-2 text-(--accent-muted-foreground)"
              >search</span
            >
          </div>
          <button
            class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center gap-1 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <!-- Recompensas Disponíveis -->
        <h3 class="text-lg text-(--text-headings) mb-4">Recompensas Disponiveis</h3>
        <div class="space-y-4 mb-4">
          <div class="flex gap-2.5">
            <RewardCard
              v-for="reward in availableRewards.slice(0, 2)"
              :key="reward.id"
              :title="reward.title"
              :points="reward.points"
              :image="reward.image"
              @edit="editReward(reward.id)"
              @delete="deleteReward(reward.id)"
            />
          </div>
          <div class="flex gap-2.5">
            <RewardCard
              v-for="reward in availableRewards.slice(2, 4)"
              :key="reward.id"
              :title="reward.title"
              :points="reward.points"
              :image="reward.image"
              @edit="editReward(reward.id)"
              @delete="deleteReward(reward.id)"
            />
          </div>
          <div class="flex gap-2.5">
            <RewardCard
              v-for="reward in availableRewards.slice(4, 6)"
              :key="reward.id"
              :title="reward.title"
              :points="reward.points"
              :image="reward.image"
              @edit="editReward(reward.id)"
              @delete="deleteReward(reward.id)"
            />
          </div>
        </div>

        <button class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg">
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>

        <!-- Recompensas Resgatadas -->
        <h3 class="text-lg text-(--text-headings) mt-6 mb-4">Recompensas Resgatadas</h3>
        <div class="space-y-2">
          <RewardRedeemedCard
            v-for="redeemed in redeemedRewards"
            :key="redeemed.id"
            :userName="redeemed.userName"
            :title="redeemed.title"
            :points="redeemed.points"
            :status="redeemed.status"
            :image="redeemed.image"
            @confirm="confirmReward(redeemed.id)"
            @delete="deleteRedeemedReward(redeemed.id)"
          />
        </div>
      </CollapsibleCard>

      <!-- Gestão de consumos -->
      <CollapsibleCard title="Gestão de consumos">
        <!-- Search and Add -->
        <div class="flex gap-2.5 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="consumptionSearch"
              type="text"
              placeholder="Pesquisar . . ."
              class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
            />
            <span
              class="material-symbols-outlined absolute left-3 top-2 text-(--accent-muted-foreground)"
              >search</span
            >
          </div>
          <button
            class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center gap-1 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <div class="space-y-2">
          <ItemCard
            v-for="consumption in consumptions"
            :key="consumption.id"
            :title="consumption.title"
            :subtitle="consumption.subtitle"
            :image="consumption.image"
            :type="consumption.type"
            @edit="editConsumption(consumption.id)"
            @delete="deleteConsumption(consumption.id)"
          />
        </div>

        <button class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4">
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </CollapsibleCard>

      <!-- Gestão de tarefas -->
      <CollapsibleCard title="Gestão de tarefas">
        <!-- Search and Add -->
        <div class="flex gap-2.5 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="taskSearch"
              type="text"
              placeholder="Pesquisar . . ."
              class="w-full h-10 px-3 pl-10 bg-(--system-background) border-2 border-(--system-border) rounded-lg text-(--text-headings) placeholder:text-(--accent-muted-foreground)"
            />
            <span
              class="material-symbols-outlined absolute left-3 top-2 text-(--accent-muted-foreground)"
              >search</span
            >
          </div>
          <button
            class="px-4 h-10 bg-(--system-ring) rounded-lg flex items-center gap-1 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-[23px]">add</span>
            <span>Adicionar</span>
          </button>
        </div>

        <div class="space-y-2">
          <ItemCard
            v-for="task in tasks"
            :key="task.id"
            :title="task.title"
            :subtitle="task.subtitle"
            :image="task.image"
            :type="task.type"
            @edit="editTask(task.id)"
            @delete="deleteTask(task.id)"
          />
        </div>

        <button class="flex items-center gap-1 mx-auto text-(--system-ring) text-lg mt-4">
          <span>Ver mais</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </CollapsibleCard>
    </div>
  </div>
  <ChatBot context="general" />
</template>

<script>
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import MenuNav from '@/components/MenuNav.vue'
import UserCard from '@/components/UserCard.vue'
import RewardCard from '@/components/RewardCard.vue'
import RewardRedeemedCard from '@/components/RewardRedeemedCard.vue'
import ItemCard from '@/components/ItemCard.vue'
import ChatBot from '@/components/ChatBot.vue'

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
  },
  data() {
    return {
      maxUsers: 4,
      rewardSearch: '',
      consumptionSearch: '',
      taskSearch: '',
      users: [
        {
          id: 1,
          name: 'Mário Pires',
          rank: '1º',
          points: 243,
          avatar: 'https://i.pravatar.cc/150?img=12',
        },
        {
          id: 2,
          name: 'José Maria',
          rank: '2º',
          points: 238,
          avatar: 'https://i.pravatar.cc/150?img=13',
        },
        {
          id: 3,
          name: 'Manuel Sá',
          rank: '3º',
          points: 186,
          avatar: 'https://i.pravatar.cc/150?img=14',
        },
      ],
      availableRewards: [
        {
          id: 1,
          title: 'Jantar fora',
          points: 120,
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100',
        },
        {
          id: 2,
          title: 'Ida ao cinema',
          points: 100,
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100',
        },
        {
          id: 3,
          title: 'Escolher a música no carro',
          points: 20,
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100',
        },
        {
          id: 4,
          title: 'Tempo extra de lazer',
          points: 60,
          image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=100',
        },
        {
          id: 5,
          title: 'Doces e salgados',
          points: 10,
          image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=100',
        },
        {
          id: 6,
          title: 'Ida ao parque',
          points: 400,
          image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=100',
        },
      ],
      redeemedRewards: [
        {
          id: 1,
          userName: 'José Maria',
          title: 'Escolher a música no carro',
          points: -20,
          status: 'complete',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=190',
        },
        {
          id: 2,
          userName: 'Manuel Sá',
          title: 'Jantar fora',
          points: -20,
          status: 'pending',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=190',
        },
        {
          id: 3,
          userName: 'José Maria',
          title: 'Tempo extra de lazer',
          points: -20,
          status: 'complete',
          image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=190',
        },
        {
          id: 4,
          userName: 'Mário Pires',
          title: 'Ida ao cinema',
          points: -20,
          status: 'complete',
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=190',
        },
        {
          id: 5,
          userName: 'José Maria',
          title: 'Doces e salgados',
          points: -20,
          status: 'cancelled',
          image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=190',
        },
      ],
      consumptions: [
        {
          id: 1,
          title: 'Forno',
          subtitle: '23 KWh/h',
          image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=190',
          type: 'consumption',
        },
        {
          id: 2,
          title: 'Maquina de lavar',
          subtitle: '23 KWh/h',
          image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=190',
          type: 'consumption',
        },
        {
          id: 3,
          title: 'Televisão',
          subtitle: '23 KWh/h',
          image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=190',
          type: 'consumption',
        },
        {
          id: 4,
          title: 'Aquecedor',
          subtitle: '23 KWh/h',
          image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=190',
          type: 'consumption',
        },
        {
          id: 5,
          title: 'Viagem de carro',
          subtitle: '0.1Kg/Km de CO2',
          image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=190',
          type: 'consumption',
        },
      ],
      tasks: [
        {
          id: 1,
          title: 'Levar o lixo',
          subtitle: '-0.32 Kg de CO2',
          image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=190',
          type: 'task',
        },
        {
          id: 2,
          title: 'Usar transportes públicos',
          subtitle: '-1.3 Kg de CO2',
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=190',
          type: 'task',
        },
        {
          id: 3,
          title: 'Reutilizar materiais',
          subtitle: '-0.8 Kg de CO2',
          image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=190',
          type: 'task',
        },
        {
          id: 4,
          title: 'Comprar em segunda mão',
          subtitle: '-1.1Kg de CO2',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=190',
          type: 'task',
        },
        {
          id: 5,
          title: 'Banho de agua fria',
          subtitle: '-0.01 Kg/min de CO2',
          image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=190',
          type: 'task',
        },
      ],
    }
  },
  methods: {
    increaseMaxUsers() {
      this.maxUsers++
    },
    decreaseMaxUsers() {
      if (this.maxUsers > this.users.length) {
        this.maxUsers--
      }
    },
    addUser() {
      console.log('Add user')
    },
    editUser(id) {
      console.log('Edit user', id)
    },
    deleteUser(id) {
      console.log('Delete user', id)
    },
    editReward(id) {
      console.log('Edit reward', id)
    },
    deleteReward(id) {
      console.log('Delete reward', id)
    },
    confirmReward(id) {
      console.log('Confirm reward', id)
    },
    deleteRedeemedReward(id) {
      console.log('Delete redeemed reward', id)
    },
    editConsumption(id) {
      console.log('Edit consumption', id)
    },
    deleteConsumption(id) {
      console.log('Delete consumption', id)
    },
    editTask(id) {
      console.log('Edit task', id)
    },
    deleteTask(id) {
      console.log('Delete task', id)
    },
  },
}
</script>

<style scoped></style>
