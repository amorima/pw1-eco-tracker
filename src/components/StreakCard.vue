<template>
  <div class="bg-(--system-foreground) flex gap-[10px] items-start overflow-hidden p-[8px] relative rounded-[8px] w-[85px] h-[85px]">
    <div class="absolute flex flex-col items-start left-[-14px] top-[-16px]">
      <div class="w-[101px] h-[101px]">
        <img 
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 101 101' fill='none'%3E%3Cpath d='M50.5 10C30 15 25 35 30 50C35 65 45 75 50.5 80C56 75 66 65 71 50C76 35 71 15 50.5 10Z' fill='%23e5eda0' opacity='0.3'/%3E%3Cpath d='M50.5 20C40 23 37 35 40 45C43 55 48 62 50.5 65C53 62 58 55 61 45C64 35 61 23 50.5 20Z' fill='%23f4d03f'/%3E%3C/svg%3E" 
          alt="streak flame"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div class="flex flex-col items-start leading-[0] relative shrink-0 text-white">
      <div class="flex flex-col font-['Noto_Sans'] font-semibold h-[16px] justify-center relative shrink-0 text-[20px] w-full">
        <p class="leading-[1.5]">{{ days }}</p>
      </div>
      <div class="flex flex-col font-['Noto_Sans'] font-normal justify-end relative shrink-0 text-[12px] w-full">
        <p class="leading-[1.5]">day streak</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StreakCard',
  props: {
    days: {
      type: Number,
      default: 0
    }
  }
}
</script>
