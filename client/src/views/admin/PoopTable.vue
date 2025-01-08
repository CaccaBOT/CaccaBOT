<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useAPIStore } from '../../stores/api'
import noPfp from '../../assets/no_pfp.webp'
import { formatDate } from '../../utils/dateFormatter'
import { User } from '../../types/User'
import HeroiconsTrash from '~icons/heroicons/trash?width=24px&height=24px';

const { client } = useAPIStore()

let poops = ref([])
let users = ref([])
let page = ref(0)

const loadPoops = async (pageNumber: number) => {
    const response = await client.getPoops(pageNumber * 50)
    const newPoops = await response.json()
    poops.value = [...poops.value, ...newPoops]
}

const loadUsers = async () => {
    const response = await client.getAllUsers()
    users.value = await response.json()
}

function getUser(id: string): User {
  return users.value.find((u) => u.id === id)
}

onMounted(() => {
    loadPoops(page.value)
    loadUsers()
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
            <table class="table-xl table w-full text-center">
                <thead class="text-lg">
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="poop in poops" :key="poop.id">
                        <td>{{ poop.id }}</td>
                        <td class="w-[10%]">
                            <div class="flex flex-row items-center gap-3">
                                <div class="avatar">
                                    <div class="rounded-full h-12 w-12">
                                        <img :src="getUser(poop.user_id)?.pfp ?? noPfp"
                                            alt="Profile Picture" />
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold">{{getUser(poop.user_id)?.username}}</div>
                                </div>
                            </div>
                        </td>
                        <td>{{formatDate(poop.timestamp)}}</td>
                        <th>
                            <button onclick="alert('ti piacerebbe vero?')" class="btn btn-square btn-error">
                                <HeroiconsTrash/>
                            </button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped></style>
