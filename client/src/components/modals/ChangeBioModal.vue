<script setup lang="ts">
import router from "../../router/router"
import noPfp from "../../assets/no_pfp.webp"
import { ref } from "vue"
import { useSessionStore } from "../../stores/session"
import { useAPIStore } from "../../stores/api"
import { useToast } from "vue-toastification"
const sessionStore = useSessionStore()
const { client } = useAPIStore()
const toast = useToast()

const newBio = ref("")

async function change() {
//   try {
//     const response = await client.changeBio(newBio.value)
//     if (!response.ok) {
//       newBio.value = ""
//       document
//         .querySelectorAll("input")
//         .forEach((x) => x.classList.add("input-bordered", "input-error"))
//       const body = await response.json()
//       toast.error(body.error)
//     }
    sessionStore.showChangeBioModal = false
    sessionStore.showLoginModal = false
    sessionStore.logout()
    router.push("/")
//   } catch (e) {
//     toast.error("Failed to change bio")
//   }
}

function dismissModal(event) {
  if (event.target.classList.contains("change-bio-panel-wrapper")) {
    sessionStore.showChangeBioModal = false
  }
  newBio.value = ""
}
</script>

<template>
  <div
    class="change-bio-panel-wrapper fixed left-0 top-0 z-10 flex h-[100vh] w-full items-center justify-center"
    @click="dismissModal($event)"
  >
    <div
      class="mx-auto flex w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 text-center shadow-xl sm:w-2/3 md:h-[50vh] md:w-[50vw] lg:h-[35vh] lg:w-[40vw] xl:w-[30vw]"
    >
      <div class="prose mx-auto my-4">
        <h1>Change Bio</h1>
      </div>
      <div
        class="inputs my-5 flex h-[100px] w-3/4 flex-grow flex-col items-center justify-center gap-4"
      >
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">New Bio</span>
          </div>
          <input
            v-model="newBio"
            type="textarea"
            placeholder="I like to poop because it makes me feel free"
            class="input input-bordered w-full"
          />
        </label>
      </div>
      <button
        :disabled="newBio.length < 3"
        class="btn btn-primary mb-4 mt-auto w-2/3 text-lg"
        @click="change"
      >
        Change
      </button>
    </div>
  </div>
</template>

<style scoped>
.change-bio-panel-wrapper {
  background: #000a;
}
</style>
