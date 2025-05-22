<script setup lang="ts">
import { Card } from '../../types/Card'
import { getCardRarityClass } from '../../services/collectibleService'

const props = defineProps<{
  collectible: Card
  count: number
}>()
</script>

<template>
  <div class="collectible prose relative m-5 mb-5 w-32 cursor-pointer">
    <div
      class="selected-count-wrapper z-10 absolute w-full flex justify-center items-center h-[95%] mx-auto text-white font-bold drop-shadow-[0_2.5px_1.5px_rgba(0,0,0,1)]">
      <div class="selected-count text-3xl p-2 rounded-2xl">{{ count }}/{{ collectible.quantity }}</div>
    </div>
    <img alt="Collectible image" :class="getCardRarityClass(collectible.rarity_id)"
      class="collectible mb-0 rounded-2xl opacity-70" :src="collectible.asset_url" />
    <h4 class="mt-0 p-0 text-center">{{ collectible.name }}</h4>
  </div>
</template>

<style scoped>
.collectible {
  user-select: none;
}

.selected-count {
  background: rgba( 255, 255, 255, 0.25 );
  box-shadow: 0 8px 32px 1 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 10px );
  -webkit-backdrop-filter: blur( 10px );
  border: 1px solid rgba( 255, 255, 255, 0.18 );
}
</style>
