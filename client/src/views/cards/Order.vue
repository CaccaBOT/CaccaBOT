<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from '../../router/router';
import { useAPIStore } from '../../stores/api';
import { Card } from '../../types/Card';
const { client } = useAPIStore()
let url = router.currentRoute.value.fullPath.split('/')
const collectibleId = parseInt(url[url.length - 1])
const collectible = ref<Card>()

onMounted(async () => {
    let response = await (await client.getCollectible(collectibleId)).json()
    collectible.value = response
})
</script>

<template>
  <div class="order-wrapper w-11/12 h-[85vh] mx-auto flex flex-row flex-wrap justify-center items-center">
    <h1 class="text-4xl">Coming Soon</h1>
  </div>
</template>

<style scoped></style>
