<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="true" />

    <div class="max-w-[1280px] mx-auto px-[186px] py-8">
      <!-- Page Title -->
      <h1
        class="font-['Clash_Grotesk'] font-bold text-[48px] leading-[1.25] text-(--text-body) text-nowrap mt-[52px] mb-[104px]"
      >
        Contactos
      </h1>

      <!-- Contact Form Card -->
      <div
        class="bg-(--system-card) border-2 border-(--system-border) flex flex-col gap-4 max-w-[500px] mx-auto p-4 rounded-[14px] mb-[120px]"
      >
        <p
          class="font-['Noto_Sans'] font-semibold text-[30px] leading-[1.25] text-(--text-body-sub-titles) text-center"
        >
          Fale connosco
        </p>

        <div
          class="font-['Noto_Sans'] font-normal text-[16px] leading-[1.5] text-(--text-headings)"
        >
          <p class="mb-2">
            Tem dúvidas, sugestões ou quer saber mais sobre a b.green? Estamos aqui para ajudar e
            teremos todo o gosto em responder.
          </p>
          <p>Preencha o formulário abaixo e entraremos em contacto o mais breve possível.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <FormInput v-model="formData.name" type="text" placeholder="Nome" />

          <FormInput v-model="formData.email" type="email" placeholder="Email" />

          <FormInput v-model="formData.subject" type="text" placeholder="Assunto" />

          <div class="flex flex-col gap-0">
            <textarea
              v-model="formData.message"
              placeholder="Escreva aqui a sua mensagem"
              class="bg-(--system-background) border-2 border-(--system-border) font-['Noto_Sans'] text-body-base text-(--system-foreground) px-4 py-3 rounded-(--border-radius-md) outline-none hover:border-(--system-ring) focus:border-(--system-ring) transition-colors h-[213px] resize-none"
              required
            ></textarea>
          </div>

          <div class="flex gap-3 items-start justify-end">
            <ActionButton type="submit"> Submeter </ActionButton>
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
import FormInput from '@/components/FormInput.vue'
import ActionButton from '@/components/ActionButton.vue'

export default {
  name: 'ContactsView',
  components: {
    MenuNav,
    FooterSection,
    FormInput,
    ActionButton,
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
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
        message: '',
      }
    },
  },
}
</script>
