<template>
    <button
        :class="[landing ? 'text-white' : 'text-(--text-body-titles)','hover:border-b-2 border-(--system-ring) h-fit']"
    >
        <span class="text-button"><slot></slot></span>
    </button>
</template>

<script>
    export default {
        name: 'MenuButton',
        props: {
            landing: {
                type: Boolean,
                default: true
            }
        }
    }
</script>