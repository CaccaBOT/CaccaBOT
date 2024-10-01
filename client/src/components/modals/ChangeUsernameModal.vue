<script setup lang="ts">
import router from "../../router/router"
import noPfp from "../../assets/no_pfp.webp"
import { ref } from "vue"
import { useSessionStore } from "../../stores/session"
import { useAPIStore } from "../../stores/api"

const sessionStore = useSessionStore()
const { client } = useAPIStore()

const newUsername = ref("")
const usernameError = ref("")

const validation = /^[a-zA-Z0-9_]{2,}[a-zA-Z]+[0-9]*$/

async function change() {
  usernameError.value = ""

  if (!validation.test(newUsername.value)) {
    newUsername.value = ""
    document
      .querySelectorAll("input")
      .forEach((x) => x.classList.add("input-bordered", "input-error"))
    return
  }

  const response = await client.changeUsername(newUsername.value)

  if (!response.ok) {
    newUsername.value = ""
    document
      .querySelectorAll("input")
      .forEach((x) => x.classList.add("input-bordered", "input-error"))
  } else {
    sessionStore.showChangeUsernameModal = false
    sessionStore.showLoginModal = false
    sessionStore.session.username = newUsername.value
  }
}

function dismissModal(event) {
  if (event.target.classList.contains("change-username-panel-wrapper")) {
    sessionStore.showChangeUsernameModal = false
  }
  newUsername.value = ""
  usernameError.value = ""
}
</script>

<template>
  <div
    class="change-username-panel-wrapper fixed left-0 top-0 z-10 flex h-[100vh] w-full items-center justify-center"
    @click="dismissModal($event)"
  >
    <div
      class="mx-auto flex w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 text-center shadow-xl sm:w-2/3 md:h-[50vh] md:w-[50vw] lg:h-[35vh] lg:w-[40vw] xl:w-[30vw]"
    >
      <div class="prose mx-auto my-4">
        <h1>Change Username</h1>
      </div>
      <div
        class="inputs my-5 flex h-[100px] w-3/4 flex-grow flex-col items-center justify-center gap-4"
      >
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">New Username</span>
          </div>
          <input
            v-model="newUsername"
            type="text"
            placeholder="MasterPooper420"
            class="input input-bordered w-full"
          />
        </label>
      </div>
      <button
        :disabled="newUsername.length < 3"
        class="btn btn-primary mb-4 mt-auto w-2/3 text-lg"
        @click="change"
      >
        Change
      </button>
    </div>
  </div>
</template>

<style scoped>
.change-username-panel-wrapper {
  background: #000a;
}
</style>
