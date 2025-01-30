<script setup lang="ts">
import router from "../../router/router"
import noPfp from "../../assets/no_pfp.webp"
import { onMounted, ref } from "vue"
import { useSessionStore } from "../../stores/session"
import { useAPIStore } from "../../stores/api"
import { useGlobalStore } from "../../stores/global"
const sessionStore = useSessionStore()
const globalStore = useGlobalStore()
const { client } = useAPIStore()
const selectedFile = ref<File | null>(null)
const previewSrc = ref<string | null>(null)

async function change() {
  if (previewSrc.value) {
    const response = await client.changePfp(previewSrc.value)
    if (response.ok) {
      const { url } = await response.json()
      sessionStore.showChangePfpModal = false
      sessionStore.session.pfp = url
      sessionStore.save()
      previewSrc.value = url
    }
  }
}

async function clearPfp() {
  const response = await client.removePfp()
  if (response.ok) {
    sessionStore.showChangePfpModal = false
    sessionStore.session.pfp = null
    sessionStore.save()
  }
}

function selectPfp() {
  ;(document.querySelector("#pfpSelector") as HTMLElement).click()
}

function dismissModal(event) {
  if (event.target.classList.contains("change-profile-picture-panel-wrapper")) {
    sessionStore.showChangePfpModal = false
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]

    const reader = new FileReader()
    reader.onload = (e) => {
      previewSrc.value = e.target?.result as string
    }
    reader.readAsDataURL(selectedFile.value)
  }
}
</script>

<template>
  <div
    class="change-profile-picture-panel-wrapper fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center"
    @click="dismissModal($event)"
  >
    <div
      class="mx-auto flex w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 text-center shadow-xl sm:w-2/3 md:h-[50vh] md:w-[50vw] lg:h-[42vh] lg:w-[40vw] xl:w-[30vw]"
    >
      <div class="prose mx-auto my-4">
        <h1>Change Profile Picture</h1>
      </div>
      <div
        class="custom-shadow h-24 w-24 overflow-hidden rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
      >
        <img
          alt="Profile Picture"
          class="h-24 w-24"
          :src="previewSrc ?? sessionStore.session.pfp ?? noPfp"
        />
      </div>
      <div>
        <p class="my-2 cursor-pointer text-accent" @click="selectPfp">
          Pick a new one
        </p>
        <p
          v-show="sessionStore.session.pfp"
          class="my-2 cursor-pointer text-error"
          @click="clearPfp"
        >
          Remove the current one
        </p>
      </div>
      <input
        id="pfpSelector"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange($event)"
      />
      <button
        :disabled="selectedFile == null"
        class="btn btn-primary mb-4 mt-auto w-2/3 text-lg"
        @click="change"
      >
        Change
      </button>
    </div>
  </div>
</template>

<style scoped>
.change-profile-picture-panel-wrapper {
  background: #000a;
}
</style>
