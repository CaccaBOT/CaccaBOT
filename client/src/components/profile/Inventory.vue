<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Card } from '../../types/Card'
import { getCardRarityClass } from '../../services/collectibleService'
import HeroiconsChevronDown16Solid from '~icons/heroicons/chevron-down-16-solid'

const props = defineProps<{ userCollectibles: Card[] }>()
const inventoryExpanded = ref(false)

function toggleInventory() {
  inventoryExpanded.value = !inventoryExpanded.value
}

function animateInventory(expanded: boolean) {
  nextTick(() => {
    gsap.to('.inventory', {
      height: expanded ? 'auto' : '240px',
      duration: 0.5,
      ease: 'power2.inOut',
      overflow: 'hidden'
    })
  })
}

watch(inventoryExpanded, (newVal) => {
  animateInventory(newVal)
})

onMounted(() => {
  animateInventory(inventoryExpanded.value)
})
</script>

<template>
  <div
    v-show="userCollectibles.length > 0"
    class="inventory-wrapper card mx-auto my-5 w-5/6 bg-base-200"
  >
    <div class="prose m-5">
      <h2>Inventory</h2>
    </div>

    <div
      class="inventory m-5 flex flex-row flex-wrap justify-center md:justify-start"
      style="height: 240px; overflow: hidden;"
    >
      <div
        class="collectible prose relative m-5 mt-0 mb-5 w-32 cursor-pointer"
        v-for="collectible of userCollectibles"
      >
        <span
          class="absolute left-[-5%] top-[10%] h-8 w-8 rounded-full bg-info text-center font-bold text-black"
          >{{ collectible.quantity }}</span
        >
        <img
          alt="Collectible image"
          :class="getCardRarityClass(collectible.rarity_id)"
          class="collectible mb-0 rounded-2xl"
          :src="collectible.asset_url"
        />
        <h4 class="mt-0 p-0 text-center">{{ collectible.name }}</h4>
      </div>
    </div>

    <div class="mb-2 w-full" @click="toggleInventory">
      <HeroiconsChevronDown16Solid
        class="mx-auto cursor-pointer text-4xl"
        :class="{ 'rotate-180': inventoryExpanded }"
      />
    </div>
  </div>
</template>
