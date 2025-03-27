<script setup lang="ts">
import router from "../../router/router";
import noPfp from "../../assets/no_pfp.webp";
import { ref } from "vue";
import { useSessionStore } from "../../stores/session";
import { useAPIStore } from "../../stores/api";
import { useToast } from "vue-toastification";
const sessionStore = useSessionStore();
const { client } = useAPIStore();
const toast = useToast();

const isLoading = ref(false)
const username = ref("");
const password = ref("");

async function login() {
  try {
    isLoading.value = true
    const response = await client.login(username.value, password.value);
    const body = await response.json();
    isLoading.value = false
    username.value = "";
    password.value = "";
    if (!response.ok) {
      document.querySelectorAll("input").forEach((x) => x.classList.add("input-error"));
      toast.error(body.error);
      return;
    }

    sessionStore.session = body;
    sessionStore.save();
  } catch (e) {
    toast.error("Failed to login");
  }
}

function dismissModal(event) {
  if (event.target.classList.contains("login-panel-wrapper")) {
    sessionStore.showLoginModal = false;
  }
}
</script>

<template>
  <div class="login-panel-wrapper fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center" @click="dismissModal($event)">
    <form class="mx-auto flex h-2/3 w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 shadow-xl sm:w-2/3 md:w-[50vw] lg:w-[40vw] xl:w-[30vw]" @submit.prevent="() => {}">
      <div class="prose mx-auto my-4">
        <h1>Authentication</h1>
      </div>
      <div class="avatar mt-5">
        <div class="w-24 rounded-full ring-3 ring-primary ring-offset-2 ring-offset-base-100">
          <img alt="No profile picture logo" :src="noPfp" />
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
      <button :disabled="username.length == 0 || password.length == 0" class="btn btn-primary my-4 w-2/3 text-lg" @click="login">
        <span v-if="isLoading" class="loading loading-spinner w-4 mx-2"></span>
        Login
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-panel-wrapper {
  background: #000a;
}
</style>
