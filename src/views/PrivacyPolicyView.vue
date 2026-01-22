<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="true" />

    <div class="max-w-[1280px] mx-auto px-6 lg:px-[186px] py-8">
      <!-- Page Title -->
      <h1
        class="font-['Clash_Grotesk'] font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[1.25] text-(--text-body) text-center mt-8 lg:mt-[54px]"
      >
        Política de privacidade
      </h1>

      <!-- Content -->
      <div
        class="flex flex-col gap-[21px] max-w-[851px] mx-auto mt-8 lg:mt-[100px] mb-12 lg:mb-[100px]"
      >
        <p
          class="font-['Noto_Sans'] font-semibold text-lg lg:text-[20px] leading-[1.5] text-(--text-body)"
        >
          Data de Entrada em Vigor: 05/12/2025
        </p>

        <div
          class="font-['Noto_Sans'] font-normal text-sm lg:text-[16px] leading-[1.5] text-(--text-body)"
        >
          <p class="mb-4 font-semibold">1. Informação que Recolhemos</p>
          <p class="mb-2">Recolhemos informação sobre si de várias formas:</p>
          <ul class="mb-4">
            <li class="mb-2">
              <strong>A. Informação que Nos Fornece:</strong>
              <ul class="list-disc ms-6 mt-2">
                <li>
                  Dados da Conta: O seu nome, endereço de e-mail, palavra-passe (em hash), e
                  qualquer informação de perfil que escolha fornecer durante o registo.
                </li>
                <li>
                  Dados de Transação/Faturação: Informação de pagamento (que pode ser gerida por um
                  processador de pagamento terceiro), endereço de faturação e detalhes da
                  subscrição.
                </li>
                <li>
                  Comunicações: Informação que fornece ao contactar-nos, tais como pedidos de apoio
                  ou feedback.
                </li>
                <li>
                  Conteúdo Gerado pelo Utilizador: Quaisquer dados, ficheiros ou informação que
                  carregue, crie ou armazene utilizando o Serviço.
                </li>
              </ul>
            </li>
            <li>
              <strong>B. Informação que Recolhemos Automaticamente (Dados de Utilização):</strong>
              <ul class="list-disc ms-6 mt-2">
                <li>
                  Informação de Dispositivo e Utilização: Endereço IP, tipo de navegador (browser),
                  sistema operativo, identificadores únicos de dispositivo, páginas web de
                  referência, páginas visualizadas e a hora/data da sua visita.
                </li>
                <li>
                  Cookies e Tecnologias de Rastreio: Utilizamos cookies, web beacons e tecnologias
                  similares para recolher informação, manter a sua sessão e analisar padrões de
                  utilização.
                </li>
              </ul>
            </li>
          </ul>

          <p class="mb-4 font-semibold">2. Como Utilizamos a Sua Informação</p>
          <p class="mb-2">Utilizamos a informação que recolhemos para os seguintes fins:</p>
          <ul class="list-disc ms-6 mb-4">
            <li>
              Para Fornecer o Serviço: Para operar, manter e melhorar o Serviço, gerir a sua conta e
              satisfazer os seus pedidos.
            </li>
            <li>
              Comunicação: Para lhe enviar avisos técnicos, atualizações, alertas de segurança e
              mensagens administrativas e de apoio.
            </li>
            <li>
              Personalização: Para personalizar a sua experiência e fornecer funcionalidades e
              conteúdo relevantes.
            </li>
            <li>
              Análise e Melhoria (Analytics): Para monitorizar e analisar tendências, utilização e
              atividades relacionadas com o Serviço e melhorar a sua funcionalidade.
            </li>
            <li>
              Segurança e Conformidade: Para detetar e prevenir transações fraudulentas e outras
              atividades ilegais, e proteger os direitos e propriedade de [Nome da Sua Empresa] e de
              terceiros.
            </li>
          </ul>

          <p class="mb-4 font-semibold">3. Partilha da Sua Informação</p>
          <p class="mb-2">
            Podemos partilhar ou divulgar a sua informação nas seguintes circunstâncias:
          </p>
          <ul class="list-disc ms-6 mb-4">
            <li>
              A. Com Prestadores de Serviços: Podemos partilhar a sua informação com fornecedores
              terceiros, consultores e outros prestadores de serviços que realizam serviços em nosso
              nome, tais como processamento de pagamentos, alojamento (hosting), análise (analytics)
              e apoio ao cliente. Estes prestadores são obrigados a proteger a sua informação.
            </li>
            <li>
              B. Conformidade com a Lei: Poderemos divulgar a sua informação se acreditarmos que é
              exigido pela lei aplicável, regulamento, processo legal ou pedido governamental.
            </li>
            <li>
              C. Transferências Comerciais: Em conexão com, ou durante negociações de, qualquer
              fusão, venda de ativos da empresa, financiamento ou aquisição de todo ou parte do
              nosso negócio por outra empresa.
            </li>
            <li>
              D. Com o Seu Consentimento: Poderemos partilhar a sua informação com a sua permissão
              ou sob a sua direção.
            </li>
          </ul>

          <p class="mb-4 font-semibold">4. Segurança de Dados</p>
          <p class="mb-4">
            Tomamos medidas razoáveis, incluindo salvaguardas administrativas, técnicas e físicas,
            para ajudar a proteger a sua informação contra perda, roubo, uso indevido e acesso,
            divulgação, alteração e destruição não autorizados. No entanto, nenhum método de
            transmissão pela Internet ou armazenamento eletrónico é completamente seguro, e não
            podemos garantir a segurança absoluta.
          </p>

          <p class="mb-4 font-semibold">5. Retenção de Dados</p>
          <p class="mb-4">
            Reteremos a informação que recolhemos pelo tempo necessário para fornecer o Serviço,
            para os nossos legítimos fins comerciais, ou até que solicite a sua eliminação, a menos
            que um período de retenção mais longo seja exigido ou permitido por lei.
          </p>

          <p class="mb-4 font-semibold">6. As Suas Opções e Direitos</p>
          <p class="mb-2">Tem certos direitos relativamente à sua informação pessoal, incluindo:</p>
          <ul class="list-disc ms-6 mb-4">
            <li>
              Acesso e Correção: Pode rever, atualizar ou corrigir a informação da sua conta a
              qualquer momento, acedendo às definições da sua conta.
            </li>
            <li>
              Oposição a Marketing (Opt-Out): Pode optar por não receber e-mails promocionais
              nossos, seguindo as instruções nesses e-mails.
            </li>
            <li>
              Direitos de Dados (por exemplo, RGPD/CCPA): Dependendo da sua localização, pode ter o
              direito de aceder, eliminar ou restringir o tratamento dos seus dados pessoais. Entre
              em contacto connosco usando a informação abaixo para exercer estes direitos.
            </li>
          </ul>

          <p class="mb-4 font-semibold">7. Websites e Serviços de Terceiros</p>
          <p class="mb-4">
            O Serviço pode conter links para websites ou serviços de terceiros. Esta Política de
            Privacidade não se aplica a estes sites de terceiros. Encorajamo-lo a rever as políticas
            de privacidade de quaisquer sites de terceiros que visite.
          </p>

          <p class="mb-4 font-semibold">8. Alterações a Esta Política</p>
          <p class="mb-4">
            Poderemos alterar esta Política de Privacidade periodicamente. Se fizermos alterações,
            iremos notificá-lo revendo a data no topo da política e, em alguns casos, poderemos
            fornecer-lhe um aviso adicional (como adicionar uma declaração à nossa página inicial ou
            enviar-lhe uma notificação por e-mail).
          </p>

          <p class="mb-4 font-semibold">9. Contacte-nos</p>
          <p class="mb-2">
            Se tiver alguma questão sobre esta Política de Privacidade, por favor, contacte-nos em:
          </p>
          <p>E-mail: be.green@bGreen.com</p>
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
  name: 'PrivacyPolicyView',
  components: {
    MenuNav,
    FooterSection,
  },
}
</script>
