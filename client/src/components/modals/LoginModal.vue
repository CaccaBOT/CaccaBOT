<script setup lang="ts">
import router from "../../router/router"
import Asset from "../../types/Asset"
import { ref } from "vue";
import { useSessionStore } from "../../stores/session"
import { useAPIStore } from "../../stores/api"
import { useToast } from "vue-toastification"
import LineMdLoadingLoop from '~icons/line-md/loading-loop'
import { useModalStore } from "../../stores/modal"
import IcBaselineDiscord from '~icons/ic/baseline-discord'
const sessionStore = useSessionStore()
const { client } = useAPIStore()
const toast = useToast()
const modalStore = useModalStore()

const isLoading = ref(false)
const username = ref("")
const password = ref("")

const discordRedirectUrl = import.meta.env.VITE_DISCORD_REDIRECT_URL

async function login() {
  try {
    isLoading.value = true
    const response = await client.login(username.value, password.value);
    const body = await response.json();
    isLoading.value = false
    username.value = "";
    password.value = "";
    if (!response.ok) {
      document.querySelectorAll("input").forEach((x) => x.classList.add("input-error"))
      toast.error(body.error)
      return;
    }

    sessionStore.session = body
    toast.success(`Logged in as ${sessionStore.session.username}`)
    sessionStore.save()
    modalStore.close()
  } catch (e) {
    toast.error("Failed to login")
  }
}

async function discordLogin() {
  window.location.href = discordRedirectUrl
}

function dismissModal(event) {
  if (event.target.classList.contains("custom-modal")) {
    modalStore.close()
  }
}
</script>

<template>
  <div class="login-panel-wrapper custom-modal fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center" @click="dismissModal($event)">
    <form class="mx-auto flex h-2/3 w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 shadow-xl sm:w-2/3 md:w-[50vw] lg:w-[40vw] xl:w-[30vw]" @submit.prevent="() => {}">
      <div class="prose mx-auto my-4">
        <h1>Authentication</h1>
      </div>
      <div class="avatar mt-5">
        <div class="w-24 rounded-full ring-3 ring-primary ring-offset-2 ring-offset-base-100">
          <img alt="No profile picture logo" :src="Asset.NO_PFP" />
        </div>
      </div>
      <div class="inputs my-5 flex h-[100px] w-3/4 grow flex-col items-center justify-center gap-4">
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend">Username</legend>
          <input id="username" v-model="username" type="text" placeholder="PooperTrooper69" class="input w-full" />
        </fieldset>
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend">Password</legend>
          <input id="password" v-model="password" type="password" placeholder="PoopIsMyBae987@#" class="input w-full" />
        </fieldset>
      </div>
      <div class="flex md:flex-row flex-col w-full justify-center items-center md:space-x-8">
        <button class="btn btn-primary my-4 w-2/3 md:w-1/3" @click="discordLogin">
          <LineMdLoadingLoop v-if="isLoading"/>
          <IcBaselineDiscord class="text-xl" v-if="!isLoading"/>
          <span v-if="!isLoading">Discord Login</span>
        </button>
        <button :disabled="username.length == 0 || password.length == 0" class="btn btn-success my-4 w-2/3 md:w-1/3" @click="login">
          <LineMdLoadingLoop v-if="isLoading"/>
          <span v-if="!isLoading">Legacy Login</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
