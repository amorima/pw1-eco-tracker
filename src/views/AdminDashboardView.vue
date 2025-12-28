<template>
    <MenuNav :landing="false"/>
    <div class="p-8 flex justify-center w-full">
    <div class="space-y-4 w-[930px]">
      <CollapsibleCard title="Analise rápida mensal">
        <div class="flex gap-4 items-center w-full">
          <div class="bg-white border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)">
            <p class="font-normal text-base">CO2 Evitado</p>
            <p class="font-semibold text-4xl">22.8 kg</p>
          </div>
          
          <div class="bg-white border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 text-(--text-body-sub-titles)">
            <p class="font-normal text-base">Consumo mensal total</p>
            <p class="font-semibold text-4xl">275 kWh</p>
          </div>
          
          <div class="bg-white border-2 border-(--system-border) rounded-[10px] p-4 flex flex-col gap-4 flex-1 text-(--text-body-sub-titles)">
            <p class="font-normal text-base">Consumo médio por membro</p>
            <p class="font-semibold text-4xl">68.75 kWh/membro</p>
          </div>
        </div>
      </CollapsibleCard>
    </div>
  </div>
</template>

<script>
import CollapsibleCard from '@/components/CollapsibleCard.vue'
import MenuNav from '@/components/MenuNav.vue';

export default {
  name: 'AdminDashboardView',
  components: {
    CollapsibleCard,
    MenuNav,
  }
}
</script>

<style scoped>
</style>
