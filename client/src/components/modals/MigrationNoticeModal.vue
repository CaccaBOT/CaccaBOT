<script setup lang="ts">
import router from '../../router/router'
import Asset from '../../types/Asset'
import { useModalStore } from '../../stores/modal'
import IcBaselineDiscord from '~icons/ic/baseline-discord'

const modalStore = useModalStore()

async function discordLogin() {
  modalStore.close()
  router.push('/auth/discord')
}

function dismissModal(event) {
  if (event.target.classList.contains('custom-modal')) {
    modalStore.close()
  }
}
</script>

<template>
    <div class="discord-migration-modal-wrapper custom-modal fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center bg-black/50"
        @click="dismissModal($event)" role="dialog" aria-modal="true">
        <form
            class="relative mx-auto flex max-h-[90vh] w-[85vw] flex-col gap-4 overflow-auto rounded-2xl bg-base-300 p-6 shadow-xl sm:w-2/3 md:w-[50vw] lg:w-[40vw] xl:w-[30vw]">
            <button class="absolute top-3 right-5 text-gray-400 hover:text-white text-xl"
                @click.prevent="modalStore.close()" aria-label="Close" type="button">
                ✕
            </button>

            <div class="prose mx-auto text-center">
                <h1>Migrate to Discord</h1>
            </div>

            <div class="flex justify-center text-primary">
                <IcBaselineDiscord class="text-6xl" />
            </div>

            <div class="prose text-justify">
                <p>
                    Hey there! It looks like you haven't migrated your account to Discord yet.
                    Migrating will ensure you don’t lose access to your account and unlocks a better experience.
                </p>
                <p>Here’s why you should migrate:</p>
                <ul class="list-disc list-inside">
                    <li>Faster and more reliable performance with CaccaBOT</li>
                    <li>Officially supported login method</li>
                    <li>Better organized interface and experience</li>
                    <li>Supports more users simultaneously</li>
                    <li>Easy integration with your Discord servers</li>
                    <li>No need to remember another password</li>
                </ul>
            </div>

            <div class="mt-auto flex justify-center">
                <button class="btn btn-primary w-2/3 my-4" @click.prevent="discordLogin">
                    <IcBaselineDiscord class="text-xl" />
                    <span>Migrate</span>
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
