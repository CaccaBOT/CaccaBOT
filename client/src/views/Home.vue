<script setup lang="ts">
import homeImage from "../assets/home.webp"
import HeroiconsDownload from "~icons/heroicons/arrow-down-tray"
import { onMounted, ref } from "vue"
import { useGlobalStore } from "../stores/global"
const globalStore = useGlobalStore()

let installPrompt = ref(null)

async function install() {
  await installPrompt.value.prompt()
}

onMounted(async () => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault()
    installPrompt.value = event
  })
})
</script>

<template>
  <div v-if="!globalStore.instance.name" class="loader-wrapper flex h-[85vh] w-full items-center justify-center">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  <div v-if="globalStore.instance.name" class="home-wrapper flex h-[85vh] w-full flex-col items-center justify-center">
    <img alt="CaccaBOT Logo" width="20rem" height="20rem" fetchpriority="high" class="mb-5 w-80" :src="homeImage" />
    <div class="prose text-center">
      <h1 class="mb-2">{{ globalStore.instance.name }}</h1>
      <p class="m-0 mb-4 text-xl">{{ globalStore.instance.description }}</p>
      <p class="m-0 text-2xl">{{ globalStore.instance.version }}</p>
    </div>
    <button v-show="installPrompt != null" @click="install" class="btn btn-success mt-6 w-80">
      <HeroiconsDownload class="text-xl" />
      Install
    </button>
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdLfTEASEb96vbTRplcNU0Y1PM8QYmdUT7oginiyAdj1skdoQ/viewform"
      target="_blank" class="link link-info mt-8 underline-offset-2">Send suggestions here!</a>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
}
</style>
