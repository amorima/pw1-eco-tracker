<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="true" />
    
    <div class="max-w-[1280px] mx-auto px-[186px] py-8">
      <!-- Page Title -->
      <h1 class="font-['Clash_Grotesk'] font-bold text-[48px] leading-[1.25] text-(--text-body) text-nowrap mt-[52px] mb-[104px]">
        Contactos
      </h1>
      
      <!-- Contact Form Card -->
      <div class="bg-(--system-card) border-2 border-(--system-border) flex flex-col gap-4 max-w-[500px] mx-auto p-4 rounded-[14px] mb-[120px]">
        <p class="font-['Noto_Sans'] font-semibold text-[30px] leading-[1.25] text-(--text-body-sub-titles) text-center">
          Fale connosco
        </p>
        
        <div class="font-['Noto_Sans'] font-normal text-[16px] leading-[1.5] text-(--text-headings)">
          <p class="mb-2">Tem dúvidas, sugestões ou quer saber mais sobre a b.green? Estamos aqui para ajudar e teremos todo o gosto em responder.</p>
          <p>Preencha o formulário abaixo e entraremos em contacto o mais breve possível.</p>
        </div>
        
        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
          <div class="flex flex-col gap-0 h-[35px]">
            <input
              v-model="formData.name"
              type="text"
              placeholder="Nome"
              class="bg-(--system-card) border-2 border-(--system-border) font-['Noto_Sans'] font-bold text-[10px] text-(--text-disabled) p-[12px] rounded-[8px] outline-none focus:border-(--system-ring)"
              required
            />
          </div>
          
          <div class="flex flex-col gap-0 h-[35px]">
            <input
              v-model="formData.email"
              type="email"
              placeholder="Email"
              class="bg-(--system-card) border-2 border-(--system-border) font-['Noto_Sans'] font-bold text-[10px] text-(--text-disabled) p-[12px] rounded-[8px] outline-none focus:border-(--system-ring)"
              required
            />
          </div>
          
          <div class="flex flex-col gap-0 h-[35px]">
            <input
              v-model="formData.subject"
              type="text"
              placeholder="Assunto"
              class="bg-(--system-card) border-2 border-(--system-border) font-['Noto_Sans'] font-bold text-[10px] text-(--text-disabled) p-[12px] rounded-[8px] outline-none focus:border-(--system-ring)"
              required
            />
          </div>
          
          <div class="flex flex-col gap-0 h-[213px]">
            <textarea
              v-model="formData.message"
              placeholder="Escreva aqui a sua mensagem"
              class="bg-(--system-card) border-2 border-(--system-border) font-['Noto_Sans'] font-bold text-[10px] text-(--text-disabled) p-[12px] rounded-[8px] outline-none focus:border-(--system-ring) h-full resize-none"
              required
            ></textarea>
          </div>
          
          <div class="flex gap-3 items-start justify-end">
            <button 
              type="submit"
              class="bg-(--system-ring) flex items-center justify-center px-2 h-[35px] w-[122px] rounded-[14px] cursor-pointer hover:opacity-90"
            >
              <p class="font-['Noto_Sans'] font-bold text-[10px] leading-[1.5] text-(--system-foreground)">
                Submeter
              </p>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <FooterSection />
  </div>
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'

export default {
  name: 'ContactsView',
  components: {
    MenuNav,
    FooterSection
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.formData)
      // Handle form submission - integrate with backend API
      alert('Mensagem enviada com sucesso!')
      // Reset form
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>
