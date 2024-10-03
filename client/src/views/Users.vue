<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useAPIStore } from "../stores/api"
import noPfp from "../assets/no_pfp.webp"
import { User } from "../types/User.ts"
import { useToast } from "vue-toastification"
import router from "../router/router.ts"
import UserStatsBadge from "../components/UserStatsBadge.vue"

const toast = useToast()
const { client } = useAPIStore()
const users = ref(null)

function goToProfile(id: string) {
  router.push(
    `/profile/${id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
  )
}

onMounted(async () => {
  try {
    const usersResponse = await (await client.getLeaderboard()).json()
    users.value = usersResponse.sort((a: User, b: User) => b.poops - a.poops)
  } catch (e) {
    toast.error("Failed to fetch users")
  }
})
</script>

<template>
  <div class="users-wrapper">
    <div
      v-show="users == null"
      class="loader-wrapper flex h-[85vh] w-full items-center justify-center"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div
      class="users flex w-full flex-row flex-wrap items-center justify-center"
    >
      <div
        @click="goToProfile(user.id)"
        v-for="user of users"
        class="card m-4 w-64 bg-base-200 shadow-xl"
      >
        <div class="card-body mx-auto flex flex-col">
          <div class="avatar mx-auto">
            <div
              class="mb-2 w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
            >
              <img :src="user.pfp ?? noPfp" />
            </div>
          </div>
          <div class="h-100 flex flex-col items-center">
            <h2 class="card-title">{{ user.username }}</h2>
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
