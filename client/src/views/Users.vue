<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useAPIStore } from "../stores/api"
import Asset from "../types/Asset.ts"
import { User } from "../types/User.ts"
import { useToast } from "vue-toastification"
import router from "../router/router.ts"
import UserStatsBadge from "../components/UserStatsBadge.vue"
import HeroiconsMagnifyingGlass16Solid from '~icons/heroicons/magnifying-glass-16-solid'

const toast = useToast()
const { client } = useAPIStore()
const users = ref(null)
const search = ref("")
const filteredUsers = ref([])

function goToProfile(id: string) {
  router.push(
    `/profile/${id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
  )
}

watch(search, (newSearch: string) => {
  if (newSearch === "") {
    filteredUsers.value = users.value
    return
  }
  filteredUsers.value = users.value.filter((user: User) =>
    user.username.toLowerCase().includes(newSearch.toLowerCase())
  )
})

onMounted(async () => {
  try {
    const usersResponse = await (await client.getLeaderboard()).json()
    users.value = usersResponse.sort((a: User, b: User) => b.poops - a.poops)
    filteredUsers.value = users.value
  } catch (e) {
    toast.error("Failed to retrieve users")
  }
})
</script>

<template>
  <div class="users-wrapper">
    <div v-show="users == null" class="loader-wrapper flex h-[85vh] w-full items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-show="users != null" class="w-10/12 mx-auto my-2">
      <label class="input w-full">
        <HeroiconsMagnifyingGlass16Solid />
        <input v-model="search" type="search" required placeholder="Search" />
      </label>
    </div>
    <div class="users flex w-full flex-row flex-wrap items-center justify-center">
      <div @click="goToProfile(user.id)" v-for="user of filteredUsers" class="card m-4 w-64 bg-base-200 shadow-xl">
        <div class="card-body mx-auto flex flex-col">
          <div class="avatar mx-auto">
            <div class="mb-2 w-20 rounded-full ring-3 ring-primary ring-offset-2 ring-offset-base-100">
              <img alt="Profile picture" :src="user.pfp ?? Asset.NO_PFP" />
            </div>
          </div>
          <div class="flex flex-col items-center">
            <h2 class="card-title" :class="{ 'text-warning': user.admin }">{{ user.username }}</h2>
            <UserStatsBadge :poops="user.poops" :money="user.money" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: all 0.25s;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.1);
}
</style>
