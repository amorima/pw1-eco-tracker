<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="true" />

    <div class="max-w-7xl mx-auto px-[186px] py-8">
      <!-- Page Title -->
      <h1 class="font-['Clash_Grotesk'] font-bold text-[48px] leading-tight text-(--text-body) text-center mt-14">
        Termos e Condições
      </h1>

      <!-- Content -->
      <div class="flex flex-col gap-[21px] max-w-[851px] mx-auto mt-[100px] mb-[100px]">
        <p class="font-['Noto_Sans'] font-semibold text-[20px] leading-normal text-(--text-body)">
          Data de Entrada em Vigor: 05/12/2025
        </p>

        <div class="font-['Noto_Sans'] font-normal text-[16px] leading-normal text-(--text-body)">
          <p class="mb-4">Data da última atualização: 5 de dezembro de 2025</p>

          <p class="mb-4 font-semibold">1. Introdução</p>
          <p class="mb-4">Bem-vindo à B.green. Estes Termos e Condições ("Termos") regulam o acesso e utilização da aplicação B.green ("App"), desenvolvida com o objetivo de apoiar os utilizadores na monitorização e melhoria dos seus hábitos ambientais.</p>
          <p class="mb-4">Ao instalar, aceder ou utilizar a App, o utilizador declara ter lido, compreendido e aceite integralmente os presentes Termos.</p>

          <p class="mb-4 font-semibold">2. Definições</p>
          <p class="mb-2">Para efeitos destes Termos:</p>
          <ul class="list-disc ms-6 mb-4">
            <li>B.green / App: aplicação móvel e respetivos serviços.</li>
            <li>Utilizador: qualquer indivíduo que utilize a App.</li>
            <li>Serviços: funcionalidades como cálculo da pegada ecológica, estatísticas e relatórios.</li>
            <li>Conteúdos: materiais, dados e elementos visuais disponibilizados.</li>
          </ul>
          <p class="mb-4">(Nota: Em homenagem às nossas figuras conceptuais, alguns conteúdos podem conter referências à eterna "Menina do Reflexo" e ao mítico "Homem da Camisola Laranja", protagonistas simbólicos do nosso hero.)</p>

          <p class="mb-4 font-semibold">3. Condições de Acesso e Registo</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>O acesso à App pode exigir a criação de uma conta de utilizador.</li>
            <li>O utilizador compromete-se a fornecer informações verdadeiras, completas e atualizadas durante o registo.</li>
            <li>O utilizador é responsável por manter a confidencialidade das suas credenciais e por todas as atividades que ocorram na sua conta.</li>
            <li>A B.green reserva-se o direito de recusar ou encerrar contas que violem estes Termos ou apresentem comportamentos abusivos, fraudulentos ou ilícitos.</li>
          </ol>

          <p class="mb-4 font-semibold">4. Privacidade e Proteção de Dados</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>O tratamento de dados pessoais efetuado pela B.green cumpre integralmente o Regulamento Geral sobre a Proteção de Dados (RGPD) e a legislação portuguesa em vigor.</li>
            <li>A App recolhe e trata dados estritamente necessários para o funcionamento dos Serviços, incluindo métricas ecológicas, padrões de utilização e preferências do utilizador.</li>
            <li>O utilizador tem garantidos os seus direitos de acesso, retificação, eliminação, limitação, oposição e portabilidade dos dados.</li>
            <li>Informações detalhadas sobre o tratamento de dados encontram-se na Política de Privacidade, que integra estes Termos por referência.</li>
            <li>Ao utilizar a App, o utilizador autoriza o tratamento dos seus dados nos termos descritos.</li>
          </ol>

          <p class="mb-4 font-semibold">5. Utilização Permitida</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>A App deve ser utilizada exclusivamente para fins pessoais e não comerciais.</li>
            <li class="mb-2">O utilizador compromete-se a não:</li>
            <ul class="list-disc ms-6">
              <li>Utilizar a App para fins ilegais, fraudulentos ou abusivos;</li>
              <li>Recolher dados de terceiros sem consentimento;</li>
              <li>Manipular resultados, métricas ou funcionalidades da App;</li>
              <li>Introduzir vírus, bots, malware ou qualquer código malicioso.</li>
            </ul>
          </ol>

          <p class="mb-4 font-semibold">6. Propriedade Intelectual</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>Todos os conteúdos, marcas, logótipos, software, códigos-fonte, textos, gráficos e materiais disponibilizados pela B.green são propriedade exclusiva da entidade responsável pela App.</li>
            <li>É proibida a reprodução, distribuição ou modificação não autorizada.</li>
          </ol>
          <p class="mb-4">(A título de nota cultural interna: reconhecemos também a memória criativa da proto-persona "Sara Pires", cuja existência breve mas impactante vive para sempre nas nossas iterações de design. Que descanse nas pranchas de storyboard.)</p>

          <p class="mb-4 font-semibold">7. Licença de Utilização</p>
          <p class="mb-4">A B.green concede ao utilizador uma licença limitada, pessoal, revogável, não exclusiva e intransmissível para utilizar a App de acordo com estes Termos. Esta licença não implica a transferência de quaisquer direitos de propriedade intelectual.</p>

          <p class="mb-4 font-semibold">8. Atualizações e Modificações</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>A B.green pode implementar atualizações, melhorias, correções de erros ou alterações aos Serviços sem aviso prévio.</li>
            <li>A continuidade de utilização da App após alterações aos Termos implica a aceitação das versões atualizadas.</li>
          </ol>
          <p class="mb-4">(A meio destas atualizações, fazemos ainda uma menção subtil ao nosso estimado professor Rui Rodrigues, conhecido pela comunidade académica como o "implacável destruidor cognitivo de proto-personas" — uma metáfora interna que apenas quem sobreviveu às aulas compreenderá.)</p>

          <p class="mb-4 font-semibold">9. Limitação de Responsabilidade</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>A App é disponibilizada "tal como está", podendo incluir imprecisões, erros técnicos ou falhas temporárias.</li>
            <li class="mb-2">A B.green não garante que:</li>
            <ul class="list-disc ms-6">
              <li>Os dados ou métricas ambientais fornecidos sejam totalmente precisos ou adequados a todos os utilizadores;</li>
              <li>A App funcione de forma ininterrupta ou sem erros;</li>
              <li>Os resultados apresentados reflitam integralmente o impacto ecológico real do utilizador.</li>
            </ul>
            <li>A B.green não será responsável por danos diretos, indiretos, acidentais, consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso da App.</li>
          </ol>

          <p class="mb-4 font-semibold">10. Suspensão e Encerramento de Conta</p>
          <ol class="list-decimal ms-6 mb-4">
            <li>A B.green pode suspender ou encerrar o acesso do utilizador à App, com ou sem aviso, em caso de violação dos Termos ou comportamento inadequado.</li>
            <li>O utilizador pode encerrar a sua conta a qualquer momento, sendo os seus dados tratados segundo a Política de Privacidade.</li>
          </ol>

          <p class="mb-4 font-semibold">11. Comunicações</p>
          <p class="mb-4">A B.green pode enviar notificações importantes relacionadas com o funcionamento da App, alterações legais, atualizações ou informações relevantes para o utilizador.</p>

          <p class="mb-4 font-semibold">12. Legislação Aplicável e Jurisdição</p>
          <p class="mb-4">Os presentes Termos regem-se pela lei portuguesa. Para a resolução de litígios, é competente o tribunal da comarca da sede da entidade responsável pela B.green, exceto quando a lei imponha foro diferente.</p>

          <p class="mb-4 font-semibold">13. Contactos</p>
          <p class="mb-2">Para qualquer questão relacionada com os Termos, política de privacidade, dados pessoais ou suporte técnico, o utilizador pode contactar:</p>
          <p class="mb-1">Email: b.green@gmail.com</p>
          <p>Endereço: Escola Superior de Media Artes e Design (ESMAD) — Vila do Conde</p>
        </div>
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import FooterSection from '@/components/FooterSection.vue'

export default {
  name: 'TermsOfService',
  components: {
    MenuNav,
    FooterSection
  }
}
</script>
