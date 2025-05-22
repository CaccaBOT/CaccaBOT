<script setup lang="ts">
import Asset from '../types/Asset'
import { Poop } from '../types/Profile'
import router from '../router/router'
import { onMounted, ref } from 'vue'
import { useAPIStore } from '../stores/api'
import { User } from '../types/User'
import { useToast } from 'vue-toastification'

const { client } = useAPIStore()
const toast = useToast()
const poopId = parseInt(router.currentRoute.value.params.id as any)
const poop = ref<Poop>()
const user = ref<User>()
const formattedDate = ref('')
const formattedTime = ref('')

onMounted(async () => {
  let response = await client.getPoop(poopId)

  if (!response.ok) {
    toast.error('Poop not found')
    return
  }

  poop.value = await response.json()
  user.value = await (await client.getProfile(poop.value.user_id)).json()

  const date = new Date(poop.value.timestamp)
  formattedDate.value = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  formattedTime.value = date.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<template>
    <div class="poop-certificate-wrapper flex justify-center items-center w-11/12 h-[85vh] mx-auto">
        <div class="hero bg-base-300 sm:w-2/3 lg:w-1/2 rounded-xl">
            <div class="hero-content w-full flex-col">
                <h1 class="lg:text-4xl text-2xl mb-4 font-bold">Poop Certificate #{{ poop?.id }}</h1>
                <img :src="user?.pfp ?? Asset.NO_PFP"
                    class="shadow-2xl w-28 h-28 rounded-full mt-2 bg-base-300 ring-3 ring-primary ring-offset-2 ring-offset-base-100" />
                <h3 class="text-2xl font-bold">{{ user?.username }}</h3>
                <p class="m-4">
                    Presented to <strong>{{ user?.username }}</strong> in recognition of a notable poop on
                    <strong>{{ formattedDate }}</strong> at <strong>{{ formattedTime }}</strong>
                </p>
                <div class="mt-4 flex w-full justify-start text-gray-400">
                    <p>Certified {{ formattedDate }} at {{ formattedTime }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
