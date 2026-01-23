<template>
  <div class="min-h-screen bg-(--system-background) relative">
    <!-- Back Arrow -->
    <div
      class="absolute left-4 top-4 md:left-[73px] md:top-[70px] w-12 h-12 flex items-center justify-center transition-transform z-10"
    >
      <button
        @click="$router.push({ name: 'login' })"
        class="pointer-events-auto w-12 h-12 rounded-full border-2 border-(--system-ring) bg-(--system-background) flex items-center justify-center text-(--system-ring) hover:bg-(--system-ring) hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-xl">arrow_back</span>
      </button>
    </div>

    <!-- Toast Notification -->
    <Transition name="slide-fade">
      <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <ToastNotification :variant="toastVariant" :message="toastMessage" />
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center min-h-screen py-20 px-4 pb-40">
      <!-- Title -->
      <h1
        class="text-3xl md:text-5xl font-bold text-(--primary-primary) text-center mb-8 md:mb-16"
        style="font-family: 'Clash Grotesk', sans-serif"
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
        <ProfileCard v-if="canAddProfile" :isAddButton="true" @click="showAddProfileModal = true" />
      </div>

      <!-- Admin Button -->
      <ActionButton v-if="isAdmin" @click="goToAdmin" class="mb-8"> Admin </ActionButton>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 h-[122px] bg-(--system-card-foreground)"></div>

    <!-- PIN Entry Modal -->
    <ModalComponent :isOpen="showPinModal" title="Introduzir PIN" size="sm" @close="closePinModal">
      <div class="flex flex-col gap-4">
        <p class="text-(--text-body-sub-titles) text-sm">
          Este perfil está protegido por PIN. Introduza o PIN para continuar.
        </p>
        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2"> PIN </label>
          <FormInput
            v-model="pinInput"
            type="password"
            placeholder="****"
            maxlength="4"
            @keyup.enter="validateAndSelectProfile"
          />
        </div>
        <p v-if="pinError" class="text-(--semantic-error-default) text-sm text-center">
          {{ pinError }}
        </p>
      </div>
      <template #footer>
        <ActionButton @click="closePinModal" :variant="'secondary'"> Cancelar </ActionButton>
        <ActionButton @click="validateAndSelectProfile" :disabled="pinInput.length !== 4">
          Confirmar
        </ActionButton>
      </template>
    </ModalComponent>

    <!-- Add Profile Modal -->
    <ModalComponent :isOpen="showAddProfileModal" title="Criar Novo Perfil" @close="closeModal">
      <form @submit.prevent="handleCreateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
            Nome *
          </label>
          <FormInput v-model="newProfile.name" placeholder="Nome do perfil" type="text" />
        </div>

        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2">
            Idade (opcional)
          </label>
          <FormInput v-model.number="newProfile.age" placeholder="Idade" type="number" />
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
        <ActionButton @click="closeModal" :variant="'secondary'"> Cancelar </ActionButton>
        <ActionButton @click="handleCreateProfile" :disabled="!newProfile.name || isUploading">
          {{ isUploading ? 'A carregar imagem...' : 'Criar Perfil' }}
        </ActionButton>
      </template>
    </ModalComponent>

    <!-- Admin PIN Modal -->
    <ModalComponent
      :isOpen="showAdminPinModal"
      title="PIN de Administrador"
      size="sm"
      @close="closeAdminPinModal"
    >
      <div class="flex flex-col gap-4">
        <p class="text-(--text-body-sub-titles) text-sm">
          Para aceder ao painel de administração, introduza o PIN do administrador.
        </p>
        <div>
          <label class="block text-sm font-medium text-(--text-body-sub-titles) mb-2"> PIN </label>
          <FormInput
            v-model="adminPinInput"
            type="password"
            placeholder="****"
            maxlength="4"
            @keyup.enter="validateAndGoToAdmin"
          />
        </div>
        <p v-if="adminPinError" class="text-(--semantic-error-default) text-sm text-center">
          {{ adminPinError }}
        </p>
      </div>
      <template #footer>
        <ActionButton @click="closeAdminPinModal" :variant="'secondary'"> Cancelar </ActionButton>
        <ActionButton @click="validateAndGoToAdmin" :disabled="adminPinInput.length !== 4">
          Confirmar
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
import ToastNotification from '@/components/ToastNotification.vue'
import { uploadImage } from '@/services/cloudinaryService'

export default {
  name: 'ProfileSelectionView',
  components: {
    ProfileCard,
    ModalComponent,
    FormInput,
    ActionButton,
    ToastNotification,
  },
  data() {
    return {
      showAddProfileModal: false,
      showPinModal: false,
      showAdminPinModal: false,
      pinInput: '',
      pinError: '',
      adminPinInput: '',
      adminPinError: '',
      selectedProfileId: null,
      isUploading: false,
      newProfile: {
        name: '',
        age: null,
        avatar: null,
        avatarPreview: null,
      },
      // Toast State
      showToast: false,
      toastMessage: '',
      toastVariant: 'success',
      isLoading: false,
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
      return this.userStore.currentUser?.maxProfiles || 4
    },
    canAddProfile() {
      return this.profiles.length < this.maxUsers
    },
    isAdmin() {
      return this.userStore.isAdmin
    },
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
    selectProfile(profileId) {
      // Check if profile has PIN protection
      const profile = this.profiles.find((p) => p.id === profileId)
      if (profile?.settings?.pin) {
        // Show PIN modal
        this.selectedProfileId = profileId
        this.pinInput = ''
        this.pinError = ''
        this.showPinModal = true
      } else {
        // No PIN, proceed directly
        if (this.userStore.selectProfile(profileId)) {
          this.$router.push({ name: 'home' })
        } else {
          this.showNotification('Erro ao selecionar perfil', 'error')
        }
      }
    },
    closePinModal() {
      this.showPinModal = false
      this.pinInput = ''
      this.pinError = ''
      this.selectedProfileId = null
    },
    validateAndSelectProfile() {
      if (!this.selectedProfileId) return

      const profile = this.profiles.find((p) => p.id === this.selectedProfileId)
      if (!profile?.settings?.pin) return

      // Validate PIN
      if (this.pinInput === profile.settings.pin) {
        // PIN correct, select profile
        if (this.userStore.selectProfile(this.selectedProfileId)) {
          this.$router.push({ name: 'home' })
          this.closePinModal()
        } else {
          this.showNotification('Erro ao selecionar perfil', 'error')
        }
      } else {
        // PIN incorrect
        this.pinError = 'PIN incorreto. Tente novamente.'
        this.pinInput = ''
      }
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.showNotification('Por favor, selecione apenas ficheiros de imagem.', 'error')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('A imagem não pode exceder 5MB.', 'error')
        return
      }

      this.isUploading = true

      try {
        const reader = new FileReader()
        reader.onload = async (e) => {
          this.newProfile.avatarPreview = e.target.result

          const result = await uploadImage(file, {
            folder: 'eco-tracker/avatars',
          })

          if (result.success) {
            this.newProfile.avatar = result.url
          } else {
            this.showNotification(result.error || 'Erro ao fazer upload da imagem.', 'error')
            this.newProfile.avatarPreview = null
          }

          this.isUploading = false
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Erro ao processar imagem:', error)
        this.showNotification('Erro ao processar imagem.', 'error')
        this.isUploading = false
      }
    },
    async handleCreateProfile() {
      if (!this.newProfile.name) {
        this.showNotification('Por favor, insira um nome para o perfil.', 'error')
        return
      }

      this.isLoading = true

      try {
        const result = await this.userStore.createProfile({
          name: this.newProfile.name,
          age: this.newProfile.age,
          avatar: this.newProfile.avatar,
        })

        if (result.success) {
          this.showNotification('Perfil criado com sucesso!', 'success')
          this.closeModal()
        } else {
          this.showNotification(result.message || 'Erro ao criar perfil.', 'error')
        }
      } catch {
        this.showNotification('Ocorreu um erro inesperado.', 'error')
      } finally {
        this.isLoading = false
      }
    },
    closeModal() {
      this.showAddProfileModal = false
      this.newProfile = {
        name: '',
        age: null,
        avatar: null,
        avatarPreview: null,
      }
    },
    goToAdmin() {
      // Check if admin profile has a PIN
      const adminProfile = this.profiles.find((p) => p.isAdmin)
      if (adminProfile?.settings?.pin) {
        // Show PIN modal
        this.adminPinInput = ''
        this.adminPinError = ''
        this.showAdminPinModal = true
      } else {
        // No PIN, proceed directly
        this.$router.push({ name: 'admin' })
      }
    },
    closeAdminPinModal() {
      this.showAdminPinModal = false
      this.adminPinInput = ''
      this.adminPinError = ''
    },
    validateAndGoToAdmin() {
      const adminProfile = this.profiles.find((p) => p.isAdmin)
      if (!adminProfile?.settings?.pin) return

      // Validate PIN
      if (this.adminPinInput === adminProfile.settings.pin) {
        // PIN correct, go to admin
        this.closeAdminPinModal()
        this.$router.push({ name: 'admin' })
      } else {
        // PIN incorrect
        this.adminPinError = 'PIN incorreto. Tente novamente.'
        this.adminPinInput = ''
      }
    },
  },
}
</script>
