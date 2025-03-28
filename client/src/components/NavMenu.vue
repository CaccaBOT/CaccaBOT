<script setup lang="ts">
import router from "../router/router"
import HeroiconsLogout from "~icons/heroicons/arrow-left-end-on-rectangle"
import HeroiconsUser from "~icons/heroicons/user"
import MaterialSymbolsPassword from "~icons/material-symbols/password"
import { useSessionStore } from "../stores/session"
import HeroiconsPaintBrush from "~icons/heroicons/paint-brush"
import { ref, watch, nextTick } from "vue"
import gsap from "gsap"
import { useModalStore } from "../stores/modal"
import { ModalEnum } from "../types/ModalEnum"
import AkarIconsGear from '~icons/akar-icons/gear'

const sessionStore = useSessionStore()
const modalStore = useModalStore()
const navMenu = ref<HTMLElement | null>(null)

function showChangePasswordModal() {
  if (sessionStore.session.id) {
    modalStore.open(ModalEnum.ChangePassword)
  }
}

function showChangeThemeModal() {
  modalStore.open(ModalEnum.ChangeTheme)
}

function goToSettings() {
  router.push("/settings")
}

function logout() {
  sessionStore.logout()
  modalStore.close()
  router.push("/leaderboard")
}

watch(
  () => sessionStore.showNavMenu,
  async (newVal) => {
    await nextTick()

    if (newVal && navMenu.value) {
      gsap.fromTo(
        navMenu.value,
        { opacity: 0, y: -30, x: 10, scale: 0.75 },
        { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      )
    } else if (navMenu.value) {
      gsap.to(navMenu.value, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          sessionStore.showNavMenu = false
        },
      })
    }
  }
)
</script>

<template>
  <div
    v-if="sessionStore.session.id && sessionStore.showNavMenu"
    ref="navMenu"
    class="nav-menu-wrapper absolute right-[5vw] top-[8.5vh] z-100"
  >
    <ul
      @click="sessionStore.showNavMenu = false"
      tabindex="0"
      class="menu dropdown-content z-1 mt-3 w-52 rounded-box bg-base-300 p-2 shadow-sm"
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
        <button @click="goToSettings">
          <AkarIconsGear class="text-xl" />
          Settings
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
