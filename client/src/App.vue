<script setup lang="ts">
import Header from "./components/Header.vue"
import LoginModal from "./components/modals/LoginModal.vue"
import { useSessionStore } from "./stores/session"
import { useHead } from "@unhead/vue"
import { baseURL } from "./services/API.ts"
import ChangePasswordModal from "./components/modals/ChangePasswordModal.vue"
import ChangePfpModal from "./components/modals/ChangePfpModal.vue"
import ChangeUsernameModal from "./components/modals/ChangeUsernameModal.vue"
import { useAchievementStore } from "./stores/achievement.ts"
import { onMounted } from "vue"
import { useAPIStore } from "./stores/api.ts"
import { useGlobalStore } from "./stores/global.ts"
import { useToast } from "vue-toastification"
import ChangeThemeModal from "./components/modals/ChangeThemeModal.vue"
import Lenis from "lenis"

import 'lenis/dist/lenis.css'

const toast = useToast()
const globalStore = useGlobalStore()
const { client } = useAPIStore()
const achievementStore = useAchievementStore()

const sessionStore = useSessionStore()
sessionStore.load()

useHead({
  link: [
    {
      rel: "preconnect",
      href: baseURL,
      crossorigin: "anonymous",
    },
  ],
})

onMounted(async () => {
  try {
    const instanceInfo = await (await client.getInstanceInfo()).json()
    globalStore.instance.name = instanceInfo.name
    globalStore.instance.description = instanceInfo.description
    globalStore.instance.version = instanceInfo.version
  } catch (e) {
    toast.error("Failed to retrieve server version")
  }

  const theme = localStorage.getItem("theme")

  if (theme != null) {
    document.querySelector("html").setAttribute("data-theme", theme)
  }

  await achievementStore.loadAchievements()
  // @ts-expect-error - window.umami is defined by the Umami script
  window.umami.identify({ username: sessionStore.session.username })

  new Lenis({
    autoRaf: true
  })
})
</script>

<template>
  <Header />
  <LoginModal
    v-show="!sessionStore.session.id && sessionStore.showLoginModal"
  />
  <ChangePasswordModal
    v-show="sessionStore.session.id && sessionStore.showChangePasswordModal"
  />
  <ChangeUsernameModal
    v-show="sessionStore.session.id && sessionStore.showChangeUsernameModal"
  />
  <ChangePfpModal
    v-show="sessionStore.session.id && sessionStore.showChangePfpModal"
  />
  <ChangeThemeModal
    v-show="sessionStore.session.id && sessionStore.showChangeThemeModal"
  />
  <router-view v-slot="{ Component, route }">
    <Transition name="bounce">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.35s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
