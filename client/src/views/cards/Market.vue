<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AssetCard from '../../components/market/AssetCard.vue';
import { Card } from '../../types/Card';
import { CollectibleRarity } from '../../enums/CollectibleRarity';
import { useAPIStore } from '../../stores/api';
const { client } = useAPIStore()
const collectibles = ref<Card[]>([])

async function fetchCollectibles() {
  let response = await ((await client.getAllCollectibles()).json()) as Card[]
  response = response.sort((a,b) => b.rarity_id - a.rarity_id)
  collectibles.value = response
}

onMounted(() => {
  fetchCollectibles()
})

function getRandomizedChange(): number {
  const changeOptions = [-1, 0, 1];
  const sign = changeOptions[Math.floor(Math.random() * changeOptions.length)];
  const magnitude = Math.random() * 5;
  return sign * magnitude;
}

function getRandomizedPrice(): number {
  return parseFloat((Math.random() * 100 + 1).toFixed(2));
}
</script>

<template>
  <div class="market-wrapper w-11/12 mx-auto flex flex-row flex-wrap gap-10 justify-center align-middle">
    <AssetCard v-for="collectible in collectibles" :collectible="collectible" :change="getRandomizedChange()" :price="getRandomizedPrice()" />
  </div>
</template>

<style scoped></style>
