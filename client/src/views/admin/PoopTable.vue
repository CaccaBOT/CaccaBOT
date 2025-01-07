<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useAPIStore } from '../../stores/api'
import noPfp from '../../assets/no_pfp.webp'

const { client } = useAPIStore()

let poops = ref([])
let users = ref([])
let page = ref(0)

const loadPoops = async (pageNumber: number) => {
    const response = await client.getPoops(pageNumber * 50)
    const newPoops = await response.json()
    poops.value = [...poops.value, ...newPoops]
}

onMounted(() => {
    loadPoops(page.value)
    const handleScroll = () => {
        const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
        if (bottom) {
            page.value += 1
            loadPoops(page.value)
        }
    }

    window.addEventListener('scroll', handleScroll)

    watchEffect(() => {
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })
})
</script>

<template>
    <div class="poop-table-wrapper">
        <div class="overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Timestamp</th>
                        <th>Actions</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="poop in poops" :key="poop.id">
                        <td>{{ poop.id }}</td>
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="avatar">
                                    <div class="mask mask-squircle h-12 w-12">
                                        <img :src="noPfp"
                                            alt="Avatar Tailwind CSS Component" />
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold">User</div>
                                    <div class="text-sm opacity-50">{{poop.user_id}}</div>
                                </div>
                            </div>
                        </td>
                        <td>{{poop.timestamp}}</td>
                        <th>
                            <button class="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped></style>
