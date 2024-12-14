<script setup lang="ts">
import router from "../router/router"
import HeroiconsLogout from "~icons/heroicons/arrow-left-end-on-rectangle"
import HeroiconsUser from "~icons/heroicons/user"
import MaterialSymbolsPassword from "~icons/material-symbols/password"
import { useSessionStore } from "../stores/session"
import HeroiconsPaintBrush from "~icons/heroicons/paint-brush"

const sessionStore = useSessionStore()

function showChangePasswordModal() {
  if (sessionStore.session.id) {
    sessionStore.showChangePasswordModal = true
  }
}

function showChangeThemeModal() {
  sessionStore.showChangeThemeModal = true
}

function logout() {
  sessionStore.logout()
  sessionStore.showLoginModal = false
  router.push("/leaderboard")
}
</script>

<template>
  <div
    v-show="sessionStore.session.id && sessionStore.showNavMenu"
    class="nav-menu-wrapper absolute right-[5vw] top-[8.5vh] z-[100]"
  >
    <ul
      @click="sessionStore.showNavMenu = false"
      tabindex="0"
      class="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow"
    >
      <li>
        <button @click="router.push('/profile/own')">
          <HeroiconsUser class="text-xl" />
          Profile
        </button>
      </li>
      <li>
        <button @click="showChangePasswordModal">
          <MaterialSymbolsPassword class="text-xl" />
          Change Password
        </button>
      </li>
      <li>
        <button @click="showChangeThemeModal">
          <HeroiconsPaintBrush class="text-xl" />
          Change Theme
        </button>
      </li>
      <li>
        <button @click="logout">
          <HeroiconsLogout class="text-xl" />
          Logout
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
