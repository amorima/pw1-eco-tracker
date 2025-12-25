<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Navigation -->
    <MenuNav :landing="true"/>
    
    <!-- Hero Section with Diagonal Cut -->
    <section class="relative pb-20 bg-(--system-foreground)" style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 80px), 0 100%)">
      <div class="max-w-[910px] mx-auto relative px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-80px)] py-2">
          <!-- Left Content -->
          <div class="space-y-8 z-10 lg:pr-8">
            <div class="space-y-2">
              <h1 class="text-hero text-white leading-none">Gerir energia,</h1>
              <h1 class="text-hero text-(--system-ring) leading-none">poupar o</h1>
              <h1 class="text-hero text-(--system-ring) leading-none">planeta!</h1>
            </div>
            
            <p class="text-body-base text-[#d9d9d9] max-w-lg">Monitorize o consumo energético da sua família, descubra onde pode poupar e contribua para um futuro mais sustentável. Transforme pequenos hábitos em grandes impactos.</p>
            
            <div class="flex flex-col sm:flex-row gap-(--spacing-md) items-start">
              <ActionButton @click="$router.push({name:'register'})" variant="primary">Começar agora<span class="material-symbols-outlined">keyboard_arrow_right</span></ActionButton>
              <ActionButton variant="secondary">Ver demo </ActionButton>
            </div>
            
            <div class="grid grid-cols-3 gap-8 pt-4">
              <div class="space-y-1">
                <span class="text-heading-h4 text-[#d9d9d9] block">15k+</span>
                <span class="text-body-small text-(--system-ring)">Famílias Activas</span>
              </div>
              <div class="space-y-1">
                <span class="text-heading-h4 text-[#d9d9d9] block">2.4M€</span>
                <span class="text-body-small text-(--system-ring)">Poupados</span>
              </div>
              <div class="space-y-1">
                <span class="text-heading-h4 text-[#d9d9d9] block">890t</span>
                <span class="text-body-small text-(--system-ring)">CO₂ Evitado</span>
              </div>
            </div>
          </div>
          
          <!-- Right Image -->
          <div class="relative h-[600px] lg:h-[800px] w-[900px] ">
            <div class="absolute inset-0 -bottom-50 flex items-center justify-center">
              <img 
                src="@/assets/hero-girl.png" 
                alt="Freelancer working"
                class="w-auto h-full max-w-none"
              />
            </div>
          </div>
        </div>
        
        <!-- Center Button -->
        <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <a href="#carrosel" class="bg-(--system-ring) border-[0.5px] py-1.5 border-(--system-popover-foreground) rounded-full w-[35px] h-[59px] flex items-start hover:items-end justify-center pb-2 hover:bg-(--system-popover-foreground) transition-colors">
            <span class="material-symbols-outlined">keyboard_double_arrow_down</span>
          </a>
        </div>

      </div>
    </section>

    <section id="carrosel" class="min-h-screen bg-white py-20 flex items-center">
      <div class="max-w-[910px] mx-auto px-6 h-full flex items-center">
        <FeatureCarousel />
      </div>
    </section>

    <section id="como-funciona" class="min-h-screen bg-white py-20 flex items-center">
      <div class="max-w-[910px] mx-auto px-6">
        <div class="flex flex-col gap-[73px] items-center">
          <!-- Header -->
          <div class="flex flex-col gap-[29px] items-center text-center max-w-[511px]">
            <h2 class="text-hero text-(--text-body-titles) leading-tight">Como funciona</h2>
            <p class="text-heading-h3 text-(--system-ring) leading-relaxed">Comece a poupar em 4 passos simples</p>
          </div>

          <!-- Steps -->
          <div class="flex gap-4 items-center justify-between w-full">
            <!-- Step 1 -->
            <div class="flex flex-col gap-[25px] items-center w-[216px]">
              <div class="bg-(--text-body-titles) w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[48px] font-bold text-(--system-ring) leading-none" style="font-family: 'Clash Grotesk', sans-serif;">01</span>
              </div>
              <div class="text-heading-h2 text-(--text-body-titles) text-center leading-tight">
                <p class="mb-0">Crie</p>
                <p>Conta</p>
              </div>
              <p class="text-body-base text-(--system-ring) text-center h-[58px]">Registe-se gratuitamente e configure perfis familiares</p>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col gap-[25px] items-center w-[216px]">
              <div class="bg-(--text-body-titles) w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[48px] font-bold text-(--system-ring) leading-none" style="font-family: 'Clash Grotesk', sans-serif;">02</span>
              </div>
              <div class="text-heading-h2 text-(--text-body-titles) text-center leading-tight">
                <p class="mb-0">Adicione</p>
                <p>aparelhos</p>
              </div>
              <p class="text-body-base text-(--system-ring) text-center h-[58px]">Liste os eletrodomésticos que quer monitorizar</p>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col gap-[25px] items-center w-[216px]">
              <div class="bg-(--text-body-titles) w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[48px] font-bold text-(--system-ring) leading-none" style="font-family: 'Clash Grotesk', sans-serif;">03</span>
              </div>
              <div class="text-heading-h2 text-(--text-body-titles) text-center leading-tight">
                <p class="mb-0">Registe</p>
                <p>consumos</p>
              </div>
              <p class="text-body-base text-(--system-ring) text-center h-[58px]">Introduza dados de utilização facilmente</p>
            </div>

            <!-- Step 4 -->
            <div class="flex flex-col gap-[25px] items-center w-[216px]">
              <div class="bg-(--text-body-titles) w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[48px] font-bold text-(--system-ring) leading-none" style="font-family: 'Clash Grotesk', sans-serif;">04</span>
              </div>
              <p class="text-heading-h2 text-(--text-body-titles) text-center leading-tight">Poupe & Melhore</p>
              <p class="text-body-base text-(--system-ring) text-center h-[58px]">Analise estatísticas e otimize o seu consumo</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="cta" class="min-h-screen bg-(--system-foreground) py-20 flex items-center relative" style="clip-path: polygon(0 10%, 100% 0, 100% 90%, 0 100%)">
      <div class="max-w-[910px] mx-auto px-6 w-full">
        <div class="flex flex-col items-center text-center space-y-8">
          <!-- Main Title -->
          <div class="space-y-0">
            <h2 class="text-hero text-white leading-none">PRONTO PARA</h2>
            <h2 class="text-hero text-white leading-none">COMEÇAR A POUPAR?</h2>
          </div>
          
          <!-- Subtitle -->
          <p class="text-heading-h3 text-(--system-ring) leading-relaxed max-w-[700px]">
            Junte-se a milhares de famílias que já estão a fazer a diferença
          </p>
          
          <!-- Action Buttons -->
          <div class="flex gap-4 items-center">
            <ActionButton @click="$router.push({name:'register'})" variant="primary">
              Começar agora
              <span class="material-symbols-outlined text-base ml-2">keyboard_arrow_right</span>
            </ActionButton>
            <ActionButton variant="secondary">Ver demo</ActionButton>
          </div>
        </div>
      </div>
    </section>

    <section id="impacto" class="min-h-screen flex items-center bg-white py-20">
      <div class="max-w-[910px] mx-auto px-6 w-full">
        <div class="flex flex-col gap-[73px] items-center">
          <!-- Header -->
          <div class="flex flex-col gap-[29px] items-center text-center w-full">
            <h2 class="text-hero text-(--text-body-titles) leading-tight">O nosso impacto coletivo</h2>
            <p class="text-heading-h3 text-(--text-body-sub-titles) leading-relaxed">
              Resultados reais da nossa comunidade
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-4 gap-6 w-full max-w-[872px]">
            <!-- Stat 1: Energy -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 rounded-[10px] bg-[rgba(232,148,84,0.08)] flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px] text-[#e89454]">bolt</span>
              </div>
              <p class="text-heading-h3 text-[#e89454] text-center">2.4 GWh</p>
              <p class="text-body-small text-(--text-body-titles) text-center">Energia Poupada</p>
            </div>

            <!-- Stat 2: CO2 -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 rounded-[10px] bg-[rgba(116,160,79,0.08)] flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px] text-(--system-ring)">trending_down</span>
              </div>
              <p class="text-heading-h3 text-(--system-ring) text-center">890t</p>
              <p class="text-body-small text-(--text-body-titles) text-center">CO₂ Evitado</p>
            </div>

            <!-- Stat 3: Water -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 rounded-[10px] bg-[rgba(116,160,79,0.08)] flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px] text-(--system-ring)">water_drop</span>
              </div>
              <p class="text-heading-h3 text-(--system-ring) text-center">1.2M L</p>
              <p class="text-body-small text-(--text-body-titles) text-center">Água Conservada</p>
            </div>

            <!-- Stat 4: Families -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 rounded-[10px] bg-[rgba(232,148,84,0.08)] flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px] text-[#e89454]">groups</span>
              </div>
              <p class="text-heading-h3 text-[#e89454] text-center">15,000+</p>
              <p class="text-body-small text-(--text-body-titles) text-center">Famílias Ativas</p>
            </div>
          </div>

          <!-- Chart -->
          <div class="bg-(--text-body-sub-titles) rounded-(--border-radius-xl) p-6 w-full max-w-[872px] h-[284px]">
            <h3 class="text-[18px] text-(--system-ring) mb-4">Evolução Mensal da Poupança</h3>
            <div class="flex items-end justify-between h-48 gap-2">
              <!-- Bar 1 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 84.7px;"></div>
                <span class="text-[10px] text-(--system-ring)">1</span>
              </div>
              <!-- Bar 2 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 97.875px;"></div>
                <span class="text-[10px] text-(--system-ring)">2</span>
              </div>
              <!-- Bar 3 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 90.35px;"></div>
                <span class="text-[10px] text-(--system-ring)">3</span>
              </div>
              <!-- Bar 4 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 122.35px;"></div>
                <span class="text-[10px] text-(--system-ring)">4</span>
              </div>
              <!-- Bar 5 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 109.175px;"></div>
                <span class="text-[10px] text-(--system-ring)">5</span>
              </div>
              <!-- Bar 6 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 131.762px;"></div>
                <span class="text-[10px] text-(--system-ring)">6</span>
              </div>
              <!-- Bar 7 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 128px;"></div>
                <span class="text-[10px] text-(--system-ring)">7</span>
              </div>
              <!-- Bar 8 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 141.175px;"></div>
                <span class="text-[10px] text-(--system-ring)">8</span>
              </div>
              <!-- Bar 9 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 135.525px;"></div>
                <span class="text-[10px] text-(--system-ring)">9</span>
              </div>
              <!-- Bar 10 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 150.588px;"></div>
                <span class="text-[10px] text-(--system-ring)">10</span>
              </div>
              <!-- Bar 11 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 146.813px;"></div>
                <span class="text-[10px] text-(--system-ring)">11</span>
              </div>
              <!-- Bar 12 -->
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="bg-(--system-ring) rounded-t-[10px] w-full" style="height: 160px;"></div>
                <span class="text-[10px] text-(--system-ring)">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="testemunhos" class="min-h-screen flex items-center bg-(--system-ring) py-20">
      <div class="max-w-[910px] mx-auto px-6 w-full">
        <div class="flex flex-col gap-[73px] items-center">
          <!-- Header -->
          <div class="flex flex-col gap-[29px] items-center text-center w-full">
            <h2 class="text-hero text-(--system-foreground) leading-tight">O que dizem as famílias</h2>
            <p class="text-heading-h3 text-white leading-relaxed max-w-[596px]">
              Histórias reais de quem já está a fazer a diferença
            </p>
          </div>

          <!-- Testimonial Cards -->
          <div class="flex items-start justify-between w-full gap-6">
            <!-- Card 1: Ana Costa -->
            <div class="bg-white border-[1.6px] border-(--system-border) rounded-(--border-radius-xl) p-[26px] w-[260px] flex flex-col gap-4">
              <div class="flex gap-3 items-center">
                <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="../assets/ana.jpg" alt="Ana Costa" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="text-body-base text-(--text-body-titles) font-normal">Ana Costa</p>
                  <p class="text-body-small text-(--text-body-titles)">Lisboa</p>
                </div>
              </div>
              <p class="text-body-small text-(--text-body-titles) leading-relaxed">
                Reduzimos 40% do consumo em 3 meses. A app é intuitiva e toda a família participa!
              </p>
              <div class="bg-(--primary-secondary) rounded-full px-3 py-1 flex items-center gap-2 w-fit">
                <span class="material-symbols-outlined text-[16px] text-(--text-body-titles)">stars</span>
                <span class="text-[12px] text-(--text-body-titles)">Nível 15</span>
              </div>
            </div>

            <!-- Card 2: Carlos Silva -->
            <div class="bg-white border-[1.6px] border-(--system-border) rounded-(--border-radius-xl) p-[26px] w-[260px] flex flex-col gap-4">
              <div class="flex gap-3 items-center">
                <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="../assets/carlos.jpg" alt="Carlos Silva" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="text-body-base text-(--text-body-titles) font-normal">Carlos Silva</p>
                  <p class="text-body-small text-(--text-body-titles)">Porto</p>
                </div>
              </div>
              <p class="text-body-small text-(--text-body-titles) leading-relaxed">
                Excelente ferramenta educativa. Os meus filhos agora percebem a importância de poupar energia.
              </p>
              <div class="bg-(--primary-secondary) rounded-full px-3 py-1 flex items-center gap-2 w-fit">
                <span class="material-symbols-outlined text-[16px] text-(--text-body-titles)">emoji_events</span>
                <span class="text-[12px] text-(--text-body-titles)">Eco Warrior</span>
              </div>
            </div>

            <!-- Card 3: Maria Santos -->
            <div class="bg-white border-[1.6px] border-(--system-border) rounded-(--border-radius-xl) p-[26px] w-[260px] flex flex-col gap-4">
              <div class="flex gap-3 items-center">
                <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="../assets/maria.jpg" alt="Maria Santos" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="text-body-base text-(--text-body-titles) font-normal">Maria Santos</p>
                  <p class="text-body-small text-(--text-body-titles)">Braga</p>
                </div>
              </div>
              <p class="text-body-small text-(--text-body-titles) leading-relaxed">
                A gamificação motiva todos. Competimos de forma saudável para ver quem poupa mais!
              </p>
              <div class="bg-(--primary-secondary) rounded-full px-3 py-1 flex items-center gap-2 w-fit">
                <span class="material-symbols-outlined text-[16px] text-(--text-body-titles)">emoji_events</span>
                <span class="text-[12px] text-(--text-body-titles)">Top 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faqs" class="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div class="w-full max-w-[912px] flex flex-col gap-[73px]">
        <!-- Header -->
        <div class="flex flex-col gap-[29px] items-center text-center">
          <h2 class="text-hero font-bold text-(--text-body-titles) max-w-[858px]">
            Perguntas frequentes
          </h2>
          <p class="text-heading-h3 font-semibold text-(--text-body-sub-titles) max-w-[596px]">
            Tudo o que precisa de saber sobre o b.green
          </p>
        </div>

        <!-- FAQ Items -->
        <div class="flex flex-col gap-5">
          <FAQItem>
            <template #question>Como funciona o sistema de monitorização?</template>
            <template #answer>
              <p>Registe manualmente os consumos diários de energia, água e outros recursos da sua casa. O sistema calcula automaticamente o impacto ambiental e oferece sugestões personalizadas para reduzir o desperdício.</p>
            </template>
          </FAQItem>

          <FAQItem>
            <template #question>A aplicação é gratuita?</template>
            <template #answer>
              <p>Sim! O b.green é completamente gratuito para uso básico. Oferecemos funcionalidades premium opcionais para quem deseja relatórios mais detalhados e análises avançadas.</p>
            </template>
          </FAQItem>

          <FAQItem>
            <template #question>Quantos membros podem participar?</template>
            <template #answer>
              <p>Pode adicionar até 10 membros da família na sua conta. Cada membro pode registar as suas próprias atividades e acompanhar o progresso individual e coletivo.</p>
            </template>
          </FAQItem>

          <FAQItem>
            <template #question>Os meus dados estão seguros?</template>
            <template #answer>
              <p>Absolutamente. Utilizamos encriptação de ponta a ponta e seguimos as normas RGPD. Os seus dados nunca são partilhados com terceiros sem o seu consentimento explícito.</p>
            </template>
          </FAQItem>

          <FAQItem>
            <template #question>Posso cancelar a qualquer momento?</template>
            <template #answer>
              <p>Sim, pode cancelar a sua conta a qualquer momento através das definições. Todos os seus dados serão permanentemente eliminados conforme solicitado.</p>
            </template>
          </FAQItem>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script>
import MenuNav from '@/components/MenuNav.vue'
import ActionButton from '@/components/ActionButton.vue'
import FeatureCarousel from '@/components/FeatureCarousel.vue'
import FAQItem from '@/components/FAQItem.vue'
import FooterSection from '@/components/FooterSection.vue'

export default {
  name: 'LandingPageView',
  components: {
    MenuNav,
    ActionButton,
    FeatureCarousel,
    FAQItem,
    FooterSection
  }
}
</script>
