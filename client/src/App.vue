<script setup lang="ts">
import Header from './components/Header.vue'
import { useSessionStore } from './stores/session'
import { useHead } from '@unhead/vue'
import { baseURL } from './services/API.ts'
import { useAchievementStore } from './stores/achievement.ts'
import { computed, onMounted } from 'vue'
import { useAPIStore } from './stores/api.ts'
import { useGlobalStore } from './stores/global.ts'
import { useToast } from 'vue-toastification'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useModalStore } from './stores/modal.ts'
import { useSettingsStore } from './stores/settings.ts'
import { ModalEnum } from './types/ModalEnum.ts'
import router from './router/router.ts'
import { isSnowflake } from './utils/snowflake.ts'

const toast = useToast()
const globalStore = useGlobalStore()
const { client } = useAPIStore()
const achievementStore = useAchievementStore()
const modalStore = useModalStore()

const activeModalComponent = computed(() => modalStore.modalComponent)
const activeModalProps = computed(() => modalStore.modalProps)

const sessionStore = useSessionStore()
const settingsStore = useSettingsStore()
sessionStore.load()

useHead({
  link: [
    {
      rel: 'preconnect',
      href: baseURL,
      crossorigin: 'anonymous'
    }
  ]
})

onMounted(async () => {
  settingsStore.load()

  try {
    const instanceInfo = await (await client.getInstanceInfo()).json()
    globalStore.instance.name = instanceInfo.name
    globalStore.instance.description = instanceInfo.description
    globalStore.instance.version = instanceInfo.version
  } catch (e) {
    toast.error('Failed to retrieve server version')
  }

  const theme = localStorage.getItem('theme')

  if (theme != null) {
    document.querySelector('html').setAttribute('data-theme', theme)
  }

  await achievementStore.loadAchievements()
  // @ts-expect-error - window.umami is defined by the Umami script
  window.umami.identify({ username: sessionStore.session.username })

  if (settingsStore.smoothScrolling) {
    new Lenis({
      autoRaf: true
    })
  }
})
</script>

<template>
  <Header />
  <Transition name="fade">
    <component v-if="activeModalComponent" :is="activeModalComponent" v-bind="activeModalProps"
      @close="modalStore.close" />
  </Transition>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
