<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AssetCard from '../../components/market/AssetCard.vue'
import { Card } from '../../types/Card'
import { useAPIStore } from '../../stores/api'
import { MarketDay } from '../../types/MarketDay'
const { client } = useAPIStore()

const collectibles = ref<Card[]>([])
const prices = ref<MarketDay[]>([])

async function fetchCollectibles() {
  let response = (await (await client.getAllCollectibles()).json()) as Card[]
  response = response.sort((a, b) => b.rarity_id - a.rarity_id)
  collectibles.value = response
}

async function fetchMarketPrices() {
  const response = (await (
    await client.getMarketPrices()
  ).json()) as MarketDay[]
  prices.value = response
}

function getPriceForCollectible(collectibleId: number): MarketDay {
  return prices.value.find(
    (price: MarketDay) => price.collectibleId === collectibleId
  ) as MarketDay
}

onMounted(() => {
  fetchCollectibles()
  fetchMarketPrices()
})
</script>

<template>
  <div class="market-wrapper w-11/12 mx-auto flex flex-row flex-wrap gap-10 justify-center align-middle">
    <AssetCard v-for="collectible in collectibles"
    :collectible="collectible"
    :change="getPriceForCollectible(collectible.id)?.dailyVariation ?? 0"
    :price="getPriceForCollectible(collectible.id)?.price ?? 0" />
  </div>
</template>

<style scoped></style>
