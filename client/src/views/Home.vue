<script setup lang="ts">
import Asset from '../types/Asset'
import HeroiconsDownload from '~icons/heroicons/arrow-down-tray'
import { onMounted, ref } from 'vue'
import MdiGithub from '~icons/mdi/github'
import AntDesignTikTokOutlined from '~icons/ant-design/tik-tok-outlined'
import SimpleIconsInstagram from '~icons/simple-icons/instagram'
import { useGlobalStore } from '../stores/global'
import HeroiconsUserGroup from '~icons/heroicons/user-group'
import { useSessionStore } from '../stores/session'
import IcBaselineDiscord from '~icons/ic/baseline-discord'
import router from '../router/router'
import { useModalStore } from '../stores/modal'
import { ModalEnum } from '../types/ModalEnum'
const globalStore = useGlobalStore()
const sessionStore = useSessionStore()
const modalStore = useModalStore()

let installPrompt = ref(null)

async function install() {
  await installPrompt.value.prompt()
}

function discordLogin() {
  router.push('/auth/discord')
}

onMounted(async () => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt.value = event
  })
})
</script>

<template>
  <div>
    <div v-if="!globalStore.instance.name" class="loader-wrapper flex h-[85vh] w-full items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-if="globalStore.instance.name"
      class="home-wrapper flex h-[85vh] w-full flex-col items-center justify-center">
      <img alt="CaccaBOT Logo" fetchpriority="high" class="mb-5 sm:w-90 w-64" :src="Asset.HOME" />
      <div class="prose text-center">
        <h1 class="mb-2">{{ globalStore.instance.name }}</h1>
        <p class="m-0 mb-4 p-2 text-xl">{{ globalStore.instance.description }}</p>
        <p class="m-0 text-2xl">{{ globalStore.instance.version }}</p>
      </div>
      <button v-if="sessionStore.session.id && !sessionStore.session.discordId" @click="discordLogin" class="btn btn-primary mt-6 w-80">
        <IcBaselineDiscord class="text-xl" />
        Link to Discord
      </button>
      <button v-show="installPrompt != null" @click="install" class="btn btn-success mt-6 w-80">
        <HeroiconsDownload class="text-xl" />
        Install
      </button>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdLfTEASEb96vbTRplcNU0Y1PM8QYmdUT7oginiyAdj1skdoQ/viewform"
        target="_blank" class="link link-info mt-8 underline-offset-2">Send suggestions here!</a>
      <div class="flex text-3xl w-full justify-center mt-5">
        <a href="https://www.instagram.com/caccabot/" target="_blank">
          <SimpleIconsInstagram class="mx-2" />
        </a>
        <a href="https://www.tiktok.com/@caccabot" target="_blank">
          <AntDesignTikTokOutlined class="mx-2" />
        </a>
        <a href="https://github.com/CaccaBOT" target="_blank">
          <MdiGithub class="mx-2" />
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
}
</style>
