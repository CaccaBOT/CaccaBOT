<script setup lang="ts">
import Asset from "../types/Asset"
import { onMounted, ref } from "vue"
import { useGlobalStore } from "../stores/global"
import { useSessionStore } from "../stores/session"
import { useAPIStore } from "../stores/api"
import TablerArrowsDiff from '~icons/tabler/arrows-diff'
import IcBaselineDiscord from '~icons/ic/baseline-discord'
import HeroiconsCheck20Solid from '~icons/heroicons/check-20-solid'
import HeroiconsOutlineRefresh from '~icons/heroicons-outline/refresh'
import router from "../router/router"
import { useToast } from "vue-toastification"

const globalStore = useGlobalStore()
const sessionStore = useSessionStore()
const { client } = useAPIStore()
const toast = useToast()

const redirectUrl = import.meta.env.VITE_DISCORD_REDIRECT_URL

const code = ref(null)
const discordUser = ref(null)
const loading = ref(false)

function link() {
    window.location.href = redirectUrl
}

function retry() {
    code.value = null
    router.push('/auth/discord')
}

onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search)
    code.value = urlParams.get('code')

    if (!code.value) {
        return
    }

    loading.value = true
    let response

    if (sessionStore.session.id) {
        response = await client.linkDiscord(code.value)
    } else {
        response = await client.discordLogin(code.value)
    }

    loading.value = false

    if (response.ok) {

        if (!sessionStore.session.id) {
            sessionStore.session = await response.json()
            toast.success("Logged in successfully")
            router.push('/')
            return
        }

        discordUser.value = await response.json()
        sessionStore.session.discordId = discordUser.value.id
    } else {

        if (!sessionStore.session.id) {
            toast.error("Failed to login")
            router.push('/')
            return
        }

        toast.error("Failed to link Discord account")
    }
})

</script>

<template>
    <div v-if="loading" class="loader-wrapper flex h-[85vh] w-full items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-if="!loading" class="discord-link-wrapper w-full h-[85vh] flex items-center justify-center">
        <div v-if="!code"
            class="hero bg-base-300 rounded-2xl shadow-xl p-8 flex flex-col items-center w-11/12 sm:w-2/3 lg:w-1/2">

            <h1 class="font-bold text-4xl mb-3 text-center text-primary">
                Link CaccaBOT with Discord
            </h1>
            <p class="text-base text-base-content/70 mb-8 text-center max-w-md">
                Connect your CaccaBOT account to Discord in just one click and unlock all features!
            </p>

            <div class="flex flex-row justify-center items-center space-x-5 md:space-x-10 mb-8">
                <div
                    class="flex justify-center items-center ring-4 ring-primary w-16 h-16 md:w-32 md:h-32 ring-offset-2 ring-offset-base-100 rounded-full p-3 md:p-5 hover:scale-110 transition-transform">
                    <img :src="Asset.HOME" class="h-10 w-10 md:w-20 md:h-20" />
                </div>
                <TablerArrowsDiff class="text-5xl text-secondary animate-pulse" />
                <div
                    class="flex justify-center items-center ring-4 ring-primary w-16 h-16 md:w-32 md:h-32 ring-offset-2 ring-offset-base-100 rounded-full p-3 md:p-5 hover:scale-110 transition-transform">
                    <IcBaselineDiscord class="text-4xl md:text-7xl text-primary" />
                </div>
            </div>

            <button @click="link()"
                class="btn btn-primary mt-5 text-lg md:text-xl px-10 py-4 shadow-md hover:scale-105 transition-transform">
                <TablerArrowsDiff class="mr-2" /> Link account
            </button>
        </div>

        <div v-if="discordUser?.id"
            class="hero bg-base-300 rounded-2xl shadow-xl p-8 flex flex-col items-center w-11/12 sm:w-2/3 lg:w-1/2">

            <h1 class="font-bold text-4xl mb-3 text-center text-primary">
                Link CaccaBOT with Discord
            </h1>
            <p class="text-base text-base-content/70 mb-8 text-center max-w-md">
                Thank you for linking your account!
            </p>

            <div class="account-info text-center">
                <div class="ring-4 h-30 w-30 ring-primary ring-offset-2 ring-offset-base-100 rounded-full mx-auto">
                    <img class="rounded-full"
                        :src="`https://cdn.discordapp.com/avatars/${discordUser?.id}/${discordUser?.avatar}.webp?size=128`">
                </div>
                <h3 class="text-2xl font-bold mt-4">{{ discordUser?.username }}</h3>
            </div>

            <button @click="router.push('/')"
                class="btn btn-success mt-10 text-xl px-10 py-4 shadow-md hover:scale-105 transition-transform">
                <HeroiconsCheck20Solid class="mr-2" /> Done
            </button>
        </div>

        <div v-if="!discordUser?.id && code"
            class="hero bg-base-300 rounded-2xl shadow-xl p-8 flex flex-col items-center w-11/12 sm:w-2/3 lg:w-1/2">

            <h1 class="font-bold text-4xl mb-3 text-center text-primary">
                Link CaccaBOT with Discord
            </h1>
            <p class="text-base text-base-content/70 my-4 text-center max-w-md">
                An error has occurred while linking your account. Please try again later.
            </p>

            <button @click="retry()"
                class="btn btn-warning mt-10 text-xl px-10 py-4 shadow-md hover:scale-105 transition-transform">
                <HeroiconsOutlineRefresh class="mr-2" /> Retry
            </button>
        </div>
    </div>
</template>


<style scoped></style>
