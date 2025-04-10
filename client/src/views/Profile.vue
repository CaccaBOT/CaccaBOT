<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import router from "../router/router"
import { useGlobalStore } from "../stores/global"
import { useAPIStore } from "../stores/api"
import { UserStats } from "../types/UserStats"
import Asset from "../types/Asset.ts"
import HeroiconsPencil from "~icons/heroicons/pencil"
import { Poop } from "../types/Profile.ts"
import { useSessionStore } from "../stores/session.ts"
import Achievements from "../components/profile/Achievements.vue"
import UserStatsBadge from "../components/UserStatsBadge.vue"
import Inventory from "../components/profile/Inventory.vue"
import ProfilePoopChart from "../components/profile/ProfilePoopChart.vue"
import PoopUserStats from "../components/profile/PoopUserStats.vue"
import { useModalStore } from "../stores/modal.ts"
import { ModalEnum } from "../types/ModalEnum.ts"

const modalStore = useModalStore()
const globalStore = useGlobalStore()
const { client } = useAPIStore()
const sessionStore = useSessionStore()
const userStats = ref({} as UserStats)
const userCollectibles = ref([])
const isEditingBio = ref(false)
const userAchievements = ref([])
const monthlyUserPoops = ref([] as Poop[])

function isAdmin() {
    if (isOwnProfile()) {
        return sessionStore.session.admin
    } else {
        return globalStore.profile.admin
    }
}

function editBio() {
  //TODO: implement API call
  isEditingBio.value = false
}

function isOwnProfile() {
  return router.currentRoute.value.path.includes("/own")
}

async function fetchUserCollectibles(id: string) {
  userCollectibles.value = await (await client.getUserCollectibles(id)).json()
}

async function fetchUserAchievements(id: string) {
  userAchievements.value = await (await client.getUserAchievements(id)).json()
}

async function fetchProfileStats(id) {
  if (router.currentRoute.value.name == "monthlyProfile" || isOwnProfile()) {
    const year = globalStore.selectedDate.getFullYear()
    const month = globalStore.selectedDate.getMonth() + 1
    userStats.value = await (
      await client.getMonthlyUserStats(id, year, month)
    ).json()
    monthlyUserPoops.value = await (
      await client.getMonthlyPoopsFromUser(id, year, month)
    ).json()
    await fetchUserCollectibles(id)
    await fetchUserAchievements(id)
  }
}

watch(router.currentRoute, async () => {
  const id = (router.currentRoute.value.params.id ??
    sessionStore.session.id) as string
  userStats.value = {} as UserStats
  await fetchProfileStats(id)
})

onMounted(async () => {
  const id = (router.currentRoute.value.params.id ??
    sessionStore.session.id) as string
  await fetchProfileStats(id)
})
</script>

<template>
  <div class="profile-wrapper">
    <div
      v-show="globalStore.profile.username == null"
      class="loader-wrapper flex h-[85vh] w-full items-center justify-center"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-show="globalStore.profile.username" class="profile-info-wrapper">
      <div class="profile-header mx-auto mt-8 text-center">
        <div class="avatar">
          <div
            class="custom-shadow w-24 rounded-full ring-3 ring-primary ring-offset-2 ring-offset-base-100"
          >
            <img
              alt="Profile picture"
              :src="
                (isOwnProfile()
                  ? sessionStore.session.pfp
                  : globalStore.profile.pfp) ?? Asset.NO_PFP
              "
            />
          </div>
          <div
            v-show="isOwnProfile()"
            class="absolute bottom-[-5px] left-[-5px] h-[2.5rem] w-[2.5rem] cursor-pointer rounded-full bg-primary"
          >
            <div
              class="flex h-full items-center justify-center"
              @click="modalStore.open(ModalEnum.ChangePfp)"
            >
              <HeroiconsPencil class="mx-auto text-center" color="black" />
            </div>
          </div>
        </div>
        <div v-show="isOwnProfile() ? sessionStore.session.username : globalStore.profile.username" class="username">
          <h1
            class="mx-auto mt-2 w-max outline-hidden"
            :class="{ 'text-warning': isAdmin() }"
          >
            {{ isOwnProfile() ? sessionStore.session.username : globalStore.profile.username }}
            <HeroiconsPencil
              v-show="isOwnProfile()"
              class="ml-1 inline cursor-pointer text-[1.25rem]"
              @click="modalStore.open(ModalEnum.ChangeUsername)"
            />
          </h1>
        </div>
        <UserStatsBadge
          class="text-lg"
          :poops="globalStore.profile.poops"
          :money="globalStore.profile.money"
        />
      </div>
      <div
        v-show="globalStore.profile.username"
        class="card mx-auto mt-5 w-5/6 bg-base-200 text-center shadow-xl"
      >
        <div
          class="prose card-body mx-auto text-center"
          v-show="globalStore.profile.bio"
        >
          <h1 class="quote-top">“</h1>
          <p>
            {{ globalStore.profile.bio ?? "This user has not set a bio yet." }}
          </p>
          <h1 class="quote-bottom">“</h1>
        </div>
      </div>
      <PoopUserStats :stats="userStats" />
      <Inventory :userCollectibles="userCollectibles" />
      <Achievements :userAchievements="userAchievements" />
      <ProfilePoopChart :poops="monthlyUserPoops" />
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  width: 100%;
}

.username {
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
}

.quote-top {
  position: absolute;
  top: 5%;
  left: 15px;
}

.quote-bottom {
  position: absolute;
  bottom: 5%;
  right: 15px;
  transform: rotate(180deg);
}
</style>
