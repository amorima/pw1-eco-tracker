<template>
  <div class="bg-(--system-background) min-h-screen">
    <MenuNav :landing="true" />
    
    <div class="max-w-[1280px] mx-auto px-[186px] py-8">
      <!-- Page Title -->
      <h1 class="font-['Clash_Grotesk'] font-bold text-[48px] leading-[1.25] text-(--text-body) text-nowrap mt-[53px]">
        Sobre nós
      </h1>
      
      <!-- Main Content Card -->
      <div class="bg-(--system-card) border-2 border-(--system-border) flex flex-col gap-8 p-8 rounded-[14px] mt-[96px] mb-[60px]">
        <!-- Mission Section -->
        <div class="flex flex-col items-center">
          <div class="flex flex-col gap-2 items-center mb-2">
            <p class="font-['Noto_Sans'] font-semibold text-[24px] leading-[1.5] text-(--text-body-sub-titles)">
              Desde sua casa para a Terra
            </p>
            <p class="font-['Noto_Sans'] font-normal text-[18px] leading-[1.75] text-(--text-body-sub-titles)">
              A nossa missão
            </p>
          </div>
          <p class="font-['Noto_Sans'] font-normal text-[16px] leading-[1.5] text-(--text-body) text-center max-w-[850px]">
            Tornar escolhas sustentáveis acessíveis e recompensadoras, usando tecnologia para transformar dados em ação. Através de métricas claras, metas personalizadas e incentivos positivos, queremos empoderar cada usuário a viver de maneira mais consciente, contribuindo para um futuro mais verde.
          </p>
        </div>
        
        <!-- Info Cards -->
        <div class="flex flex-col gap-4">
          <!-- Card 1 -->
          <div class="bg-(--system-card) border-2 border-(--system-border) flex gap-[33px] items-start p-8 rounded-[14px]">
            <div class="h-[216px] w-[446px] rounded-[14px] overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800" 
                alt="Sustainability"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex items-center">
              <p class="font-['Noto_Sans'] font-normal text-[16px] leading-[1.5] text-(--text-body) w-[274px]">
                Na b.green, acreditamos que pequenas atitudes geram grandes transformações. Criamos uma plataforma de eco-tracking inteligente que ajuda pessoas e organizações a medir, entender e reduzir seu impacto ambiental de forma simples, transparente e motivadora.
              </p>
            </div>
          </div>
          
          <!-- Card 2 -->
          <div class="bg-(--system-card) border-2 border-(--system-border) flex gap-[33px] items-start p-8 rounded-[14px]">
            <div class="flex items-center">
              <p class="font-['Noto_Sans'] font-normal text-[16px] leading-[1.5] text-(--text-body) w-[274px]">
                A b.green nasceu da união entre sustentabilidade e inovação. Trabalhamos com uma equipe multidisciplinar, apaixonada por tecnologia e comprometida com a construção de soluções que respeitam o planeta e promovem o bem-estar coletivo.
              </p>
            </div>
            <div class="h-[192px] w-[446px] rounded-[14px] overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800" 
                alt="Innovation"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div class="flex flex-col gap-6 items-center">
          <button 
            @click="$router.push('/register')"
            class="border-[3px] border-(--system-ring) flex items-center justify-center px-[49.5px] py-[15px] rounded-[12px] cursor-pointer hover:bg-(--system-ring) hover:text-(--system-foreground) transition-colors w-[183px]"
          >
            <p class="font-['Noto_Sans'] font-bold text-[15px] leading-[1.5] text-(--system-ring) hover:text-(--system-foreground)">
              Comece já!
            </p>
          </button>
          
          <div class="flex items-center justify-center px-8 py-[10px] rounded-[10px]">
            <p class="font-['Noto_Sans'] font-semibold text-[20px] leading-[1.5] text-(--text-body) text-center max-w-[804px]">
              Porque cuidar do meio ambiente não deve ser complicado, deve ser parte de nós.<br />
              Junte-se à b.green e comece hoje a fazer a diferença!
            </p>
          </div>
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
  name: 'AboutUsView',
  components: {
    MenuNav,
    FooterSection
  }
}
</script>
