<template>
  <div class="min-h-screen bg-(--system-background) relative">
    <!-- Back Arrow -->
    <button 
      @click="$router.back()"
      class="absolute left-[73px] top-[70px] w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform"
    >
      <span class="material-symbols-outlined text-[48px] text-(--system-ring)">
        arrow_circle_left
      </span>
    </button>

    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center min-h-screen py-20">
      <!-- Title -->
      <h1 
        class="text-[48px] font-bold text-(--primary-primary) text-center mb-16"
        style="font-family: 'Clash Grotesk', sans-serif;"
      >
        Selecione o seu perfil
      </h1>

      <!-- Profiles Grid -->
      <div class="flex flex-wrap gap-6 items-center justify-center mb-12 max-w-4xl">
        <!-- Existing Profiles -->
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :name="profile.name"
          :avatar="profile.avatar"
          @click="selectProfile(profile.id)"
        />

        <!-- Add Profile Button (only if under max users) -->
        <ProfileCard
          v-if="canAddProfile"
          :isAddButton="true"
          @click="showAddProfileModal = true"
        />
      </div>

      <!-- Admin Button -->
      <ActionButton 
        v-if="isAdmin"
        @click="goToAdmin"
        class="mb-8"
      >
        Admin
      </ActionButton>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 h-[122px] bg-(--system-card-foreground)"></div>

    <!-- Add Profile Modal -->
    <ModalComponent
      :isOpen="showAddProfileModal"
      title="Criar Novo Perfil"
      @close="closeModal"
    >
      <form @submit.prevent="handleCreateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
            Nome *
          </label>
          <FormInput
            v-model="newProfile.name"
            placeholder="Nome do perfil"
            type="text"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
            Idade (opcional)
          </label>
          <FormInput
            v-model.number="newProfile.age"
            placeholder="Idade"
            type="number"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
            Avatar (opcional)
          </label>
          <div class="relative">
            <input
              type="file"
              @change="handleAvatarUpload"
              accept="image/*"
              class="hidden"
              ref="avatarInput"
            />
            <button
              type="button"
              @click="$refs.avatarInput.click()"
              class="w-full px-4 py-3 bg-(--system-input-background) border-2 border-(--system-border) rounded-lg text-(--system-foreground) hover:border-(--system-ring) transition-colors flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined">add_photo_alternate</span>
              <span>{{ newProfile.avatarPreview ? 'Alterar imagem' : 'Escolher imagem' }}</span>
            </button>
            
            <!-- Avatar Preview -->
            <div v-if="newProfile.avatarPreview" class="mt-4 flex justify-center">
              <div class="w-32 h-32 rounded-lg border-2 border-(--system-border) overflow-hidden">
                <img 
                  :src="newProfile.avatarPreview" 
                  alt="Avatar preview"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <ActionButton 
          @click="closeModal"
          :variant="'secondary'"
        >
          Cancelar
        </ActionButton>
        <ActionButton 
          @click="handleCreateProfile"
          :disabled="!newProfile.name"
        >
          Criar Perfil
        </ActionButton>
      </template>
    </ModalComponent>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import ProfileCard from '@/components/ProfileCard.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import FormInput from '@/components/FormInput.vue'
import ActionButton from '@/components/ActionButton.vue'

export default {
  name: 'ProfileSelectionView',
  components: {
    ProfileCard,
    ModalComponent,
    FormInput,
    ActionButton
  },
  data() {
    return {
      showAddProfileModal: false,
      newProfile: {
        name: '',
        age: null,
        avatar: null,
        avatarPreview: null
      }
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    profiles() {
      return this.userStore.currentUser?.profiles || []
    },
    maxUsers() {
      return this.userStore.currentUser?.maxUsers || 4
    },
    canAddProfile() {
      return this.profiles.length < this.maxUsers
    },
    isAdmin() {
      return this.userStore.isAdmin
    }
  },
  methods: {
    selectProfile(profileId) {
      this.userStore.selectProfile(profileId)
      this.$router.push({ name: 'home' })
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.newProfile.avatar = e.target.result
          this.newProfile.avatarPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    handleCreateProfile() {
      if (!this.newProfile.name) {
        alert('Por favor, insira um nome para o perfil.')
        return
      }

      const result = this.userStore.createProfile({
        name: this.newProfile.name,
        age: this.newProfile.age,
        avatar: this.newProfile.avatar
      })

      if (result.success) {
        this.closeModal()
      } else {
        alert(result.message || 'Erro ao criar perfil.')
      }
    },
    closeModal() {
      this.showAddProfileModal = false
      this.newProfile = {
        name: '',
        age: null,
        avatar: null,
        avatarPreview: null
      }
    },
    goToAdmin() {
      this.$router.push({ name: 'admin' })
    }
  }
}
</script>
