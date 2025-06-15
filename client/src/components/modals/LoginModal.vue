<script setup lang="ts">
import Asset from '../../types/Asset'
import { ref } from 'vue'
import LineMdLoadingLoop from '~icons/line-md/loading-loop'
import { useModalStore } from '../../stores/modal'
import IcBaselineDiscord from '~icons/ic/baseline-discord'
const modalStore = useModalStore()

const isLoading = ref(false)
const discordRedirectUrl = import.meta.env.VITE_DISCORD_REDIRECT_URL

async function discordLogin() {
  window.location.href = discordRedirectUrl
}

function dismissModal(event) {
  if (event.target.classList.contains('custom-modal')) {
    modalStore.close()
  }
}
</script>

<template>
  <div class="login-panel-wrapper custom-modal fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center" @click="dismissModal($event)">
    <form class="mx-auto flex h-2/5 w-[85vw] flex-col items-center gap-6 rounded-2xl bg-base-300 p-4 shadow-xl sm:w-2/3 md:w-[50vw] lg:w-[40vw] xl:w-[30vw]" @submit.prevent="() => {}">
      <div class="prose mx-auto mt-4">
        <h1>Authentication</h1>
      </div>
      <div class="avatar my-5">
        <div class="w-24 rounded-full ring-3 ring-primary ring-offset-2 ring-offset-base-100">
          <img alt="No profile picture logo" :src="Asset.NO_PFP" />
        </div>
      </div>
      <div class="flex md:flex-row flex-col w-full justify-center items-center md:space-x-8">
        <button class="btn btn-primary my-4 w-2/3" @click="discordLogin">
          <LineMdLoadingLoop v-if="isLoading"/>
          <IcBaselineDiscord class="text-xl" v-if="!isLoading"/>
          <span v-if="!isLoading">Discord Login</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
