<script setup lang="ts">
import { ref, watch } from "vue"
import { useSessionStore } from "../../stores/session"
import { useAPIStore } from "../../stores/api"
import { useToast } from "vue-toastification"
const sessionStore = useSessionStore()

const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
]

const theme = ref("")

watch(theme, () => {
    const themeId = theme.value.toLowerCase()
    document.querySelector('html').setAttribute('data-theme', themeId)
    localStorage.setItem('theme', themeId)
})

function dismissModal(event) {
    if (event.target.classList.contains("change-theme-panel-wrapper")) {
        sessionStore.showChangeThemeModal = false
    }
}

function capitalizeFirstLetter(string: string) {
    return string.substring(0, 1).toUpperCase() +
    string.substring(1, string.length)
}

theme.value = localStorage.getItem('theme')
</script>

<template>
    <div class="change-theme-panel-wrapper fixed left-0 top-0 z-10 flex h-[100vh] w-full items-center justify-center"
        @click="dismissModal($event)">
        <div
            class="mx-auto flex w-[85vw] flex-col items-center gap-4 rounded-2xl bg-base-300 p-4 text-center shadow-xl sm:w-2/3 h-[30vh] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]">
            <div class="prose mx-auto my-4">
                <h1>Change Theme</h1>
            </div>
            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Theme</span>
                </div>
                <select v-model="theme" class="select select-bordered">
                    <option v-for="theme in themes">{{ capitalizeFirstLetter(theme) }}</option>
                </select>
            </label>
        </div>
    </div>
</template>

<style scoped>
.change-theme-panel-wrapper {
    background: #000a;
}
</style>
