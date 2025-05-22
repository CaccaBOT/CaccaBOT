<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSessionStore } from '../../stores/session'
import { useModalStore } from '../../stores/modal'

const modalStore = useModalStore()

const themes = [
  'dark',
  'light',
  'synthwave',
  'cyberpunk',
  'valentine',
  'halloween',
  'forest',
  'aqua',
  'luxury',
  'dracula',
  'night',
  'dim',
  'sunset'
]

const theme = ref('')

watch(theme, () => {
  const themeId = theme.value?.toLowerCase()
  document.querySelector('html').setAttribute('data-theme', themeId)
  localStorage.setItem('theme', themeId)
})

function dismissModal(event) {
  if (event.target.classList.contains('custom-modal')) {
    modalStore.close()
  }
}

function capitalizeFirstLetter(string: string) {
  return (
    string.substring(0, 1).toUpperCase() + string.substring(1, string.length)
  )
}

theme.value = localStorage.getItem('theme')
</script>

<template>
  <div
    class="change-theme-panel-wrapper custom-modal fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center"
    @click="dismissModal($event)"
  >
    <div
      class="mx-auto flex h-[30vh] w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 shadow-xl sm:w-2/3 md:w-[50vw] lg:w-[40vw] xl:w-[30vw]"
    >
      <div class="prose mx-auto my-4">
        <h1>Change Theme</h1>
      </div>
      <fieldset class="fieldset w-full max-w-xs">
        <legend class="fieldset-legend">Theme</legend>
        <select v-model="theme" class="select">
          <option v-for="theme in themes">
            {{ capitalizeFirstLetter(theme) }}
          </option>
        </select>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>

</style>
