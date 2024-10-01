<script setup lang="ts">
import Header from "./components/Header.vue"
import LoginModal from "./components/modals/LoginModal.vue"
import router from "./router/router"
import { useSessionStore } from "./stores/session"
import { useHead } from "@unhead/vue"
import { baseURL } from "./services/API.ts"
import ChangePasswordModal from "./components/modals/ChangePasswordModal.vue"
import ChangePfpModal from "./components/modals/ChangePfpModal.vue"
import ChangeUsernameModal from "./components/modals/ChangeUsernameModal.vue"

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
