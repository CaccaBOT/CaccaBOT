<script setup lang="ts">
import { ref } from 'vue'
import { useSessionStore } from '../../stores/session'
import { useAPIStore } from '../../stores/api'
import { useModalStore } from '../../stores/modal'

const modalStore = useModalStore()
const sessionStore = useSessionStore()
const { client } = useAPIStore()

const newUsername = ref('')
const usernameError = ref('')

const validation = /^[a-zA-Z0-9_.]{3,12}$/

async function change() {
  usernameError.value = ''

  if (!validate()) {
    newUsername.value = ''
    document
      .querySelectorAll('input')
      .forEach((x) => x.classList.add('input-error'))
    return
  }

  const username = newUsername.value

  const response = await client.changeUsername(newUsername.value)

  if (!response.ok) {
    newUsername.value = ''
    document
      .querySelectorAll('input')
      .forEach((x) => x.classList.add('input-error'))
  } else {
    modalStore.close()
    sessionStore.session.username = username
  }
}

function dismissModal(event) {
  if (event.target.classList.contains('custom-modal')) {
    modalStore.close()
  }
  newUsername.value = ''
  usernameError.value = ''
}

function validate() {
  return validation.test(newUsername.value)
}
</script>

<template>
  <div
    class="change-username-panel-wrapper custom-modal fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center"
    @click="dismissModal($event)"
  >
    <div
      class="mx-auto flex w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 shadow-xl sm:w-2/3 md:h-[50vh] md:w-[50vw] lg:h-[35vh] lg:w-[40vw] xl:w-[30vw]"
    >
      <div class="prose mx-auto my-4">
        <h1>Change Username</h1>
      </div>
      <div
        class="inputs my-5 flex h-[100px] w-3/4 grow flex-col items-center justify-center gap-4"
      >
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend">New Username</legend>
          <input
            v-model="newUsername"
            type="text"
            placeholder="MasterPooper420"
            class="input w-full"
          />
        </fieldset>
      </div>
      <button
        :disabled="!validate()"
        class="btn btn-primary mb-4 mt-auto w-2/3 text-lg"
        @click="change"
      >
        Change
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
