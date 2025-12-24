<template>
    <button 
        :class="[
            'h-[50px] rounded-(--border-radius-xl) px-7 py-3 flex items-center justify-center gap-2.5 border-[0.5px] transition-all duration-200',
            variant === 'secondary' 
                ? 'bg-transparent border-(--system-ring) text-(--system-ring) hover:shadow-[0_0_20px_rgba(140,177,97,0.6)]'
                : 'bg-(--system-ring) border-(--system-ring) text-(--system-foreground) hover:bg-(--system-popover-foreground)'
        ]"
    >
        <span class="text-button flex justify-center"><slot></slot></span>
    </button>
</template>

<script>
    export default {
        name: 'ActionButton',
        props: {
            variant: {
                type: String,
                default: 'primary',
            },
        }
    }
</script>