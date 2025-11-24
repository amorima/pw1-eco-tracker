<template>
    <div>
        <ol>
            <li v-for="user in userStore.getUsers" :key="user.id">
                {{ user.name }}{{ user.points }}
            </li>
        </ol>
    </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
export default {
    data() {
        return {
            userStore: useUserStore()
        }
    },
}
</script>

<style scoped>

</style>