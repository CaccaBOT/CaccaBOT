<script setup lang="ts">
import router from "../../router/router"
import { ref } from "vue";
import { useSessionStore } from "../../stores/session"
import { useAPIStore } from "../../stores/api"
import { useToast } from "vue-toastification"
import { useModalStore } from "../../stores/modal";

const sessionStore = useSessionStore();
const modalStore = useModalStore();
const { client } = useAPIStore();
const toast = useToast();

const newPassword = ref("");

async function change() {
  try {
    const response = await client.changePassword(newPassword.value);
    if (!response.ok) {
      newPassword.value = "";
      document.querySelectorAll("input").forEach((x) => x.classList.add("input-error"));
      const body = await response.json();
      toast.error(body.error);
    }

    modalStore.close()
    sessionStore.logout();
    router.push("/");
  } catch (e) {
    toast.error("Failed to change password");
  }
}

function dismissModal(event) {
  if (event.target.classList.contains("custom-modal")) {
    modalStore.close()
  }
  newPassword.value = "";
}
</script>

<template>
  <div class="change-password-panel-wrapper custom-modal fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center" @click="dismissModal($event)">
    <div class="mx-auto flex w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 shadow-xl sm:w-2/3 md:h-[50vh] md:w-[50vw] lg:h-[35vh] lg:w-[40vw] xl:w-[30vw]">
      <div class="prose mx-auto my-4">
        <h1>Change Password</h1>
      </div>
      <div class="inputs my-5 flex h-[100px] w-3/4 grow flex-col items-center justify-center gap-4">
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend">New Password</legend>
          <input id="newPassword" v-model="newPassword" type="password" placeholder="I<3Poop69420" class="input w-full" />
        </fieldset>
      </div>
      <button :disabled="newPassword.length < 3" class="btn btn-primary mb-4 mt-auto w-2/3 text-lg" @click="change">
        Change
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>