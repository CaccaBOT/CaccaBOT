<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAPIStore } from '../../stores/api'
import { useSessionStore } from '../../stores/session'
import { Card } from '../../types/Card'
import { getCardRarityClass, getRarityName, getTextRarityClass } from '../../services/collectibleService'
import { CollectibleRarity } from '../../enums/CollectibleRarity'
import HeroiconsOutlineRefresh from '~icons/heroicons-outline/refresh'
import UilCancel from '~icons/uil/cancel';
import CardWithCount from '../../components/convert/CardWithCount.vue'
import JSConfetti from "js-confetti"
import cardBack from '../../assets/card_back.png'

const { client } = useAPIStore()
const sessionStore = useSessionStore()

const collectibles = ref<Card[]>([])
const selectedRarity = ref<CollectibleRarity | null>(null)
const selections = ref<Card[]>([])
const foundCollectible = ref({} as Card)
const animationDone = ref(true)

function select(collectible: Card) {
  document.querySelectorAll('.collectible > img').forEach((element) => {
    selectedRarity.value = collectible.rarity_id
    if (!element.classList.contains(getCardRarityClass(collectible.rarity_id))) {
      element.parentElement.classList.add('disabled')
    }
  })

  if (selections.value.length < 10) {
    if (getSelectedCount(collectible) >= collectible.quantity) {
      return
    }
    selections.value.push(collectible)
  }

}

function reset() {
  selections.value = []
  document.querySelectorAll('.collectible').forEach((element) => {
    element.classList.remove('disabled')
  })
}

function getSelectedCount(collectible: Card) {
  return selections.value.filter((x) => x.name === collectible.name).length
}

async function convert() {
  const collectibleIds = selections.value.map((x) => x.id)
  foundCollectible.value = await (await client.convertCollectibles(collectibleIds)).json()
  animateConversion()
  reset()
  await fetchCollectibles()
}

function animateConversion() {
  animationDone.value = false
  const overlay = document.createElement('div')
  overlay.classList.add('black-overlay')
  document.body.appendChild(overlay)
  const foundCollectibleWrapper = document.querySelector('.found-collectible') as HTMLElement
  const foundCollectibleImage = document.querySelector('#foundCollectibleImage') as HTMLImageElement
  foundCollectibleWrapper.classList.remove('hidden')
  document.querySelector('body').style.overflowY = 'hidden'
  window.scrollTo(0, 0)
  foundCollectibleWrapper.style.animation = 'spin-up 3s cubic-bezier(.17,.67,.35,1.03) forwards'
  setTimeout(() => {
    animationDone.value = true
    foundCollectibleImage.src = foundCollectible.value.asset_url
  }, 3000)
  foundCollectibleWrapper.onclick = () => {
    animationDone.value = false
    foundCollectibleWrapper.style.animation = 'bring-down 0.75s ease-in-out forwards'
    setTimeout(() => {
      animationDone.value = true
      foundCollectibleWrapper.classList.add('hidden')
      document.querySelector('body').style.overflowY = 'auto'
      overlay.remove()
      foundCollectibleImage.src = cardBack
    }, 750)
  }
}

async function fetchCollectibles() {
  let userCollectibles = await ((await client.getUserCollectibles(sessionStore.session.id)).json())
  collectibles.value = userCollectibles.filter((c) => c.rarity_id !== CollectibleRarity.Caccasmagorico)
}

onMounted(async () => {
  fetchCollectibles()
})
</script>

<template>
  <div class="convert-wrapper w-full flex flex-col justify-between h-[85vh] transition-all-500">
    <div class="cards">
      <div class="card-wrapper w-full flex flex-row flex-wrap items-center justify-center">
        <CardWithCount @click="select(collectible)" class="collectible prose relative m-5 mb-5 w-32 cursor-pointer"
          v-for="collectible of collectibles" :collectible="collectible" :count="getSelectedCount(collectible)" />
      </div>
    </div>

    <div class="convert-button-wrapper w-full flex items-center justify-center">
      <button v-if="selections.length < 10"
        class="lg:w-1/8 btn btn-error w-2/3 sm:w-2/3 md:w-1/5 mb-10 rounded-tr-none rounded-br-none">
        Select {{ 10 - selections.length }} collectibles
      </button>
      <button v-if="selections.length === 10"
        class="lg:w-1/8 btn btn-success w-2/3 sm:w-2/3 md:w-1/5 mb-10 rounded-tr-none rounded-br-none" @click="convert">
        <HeroiconsOutlineRefresh />
        Convert
      </button>
      <button :disabled="selections.length === 0" class="btn btn-warning w-max mb-10 rounded-tl-none rounded-bl-none"
        @click="reset">
        <UilCancel />
        Reset
      </button>
    </div>

    <div class="found-collectible z-30 w-64 cursor-pointer absolute bottom-[-25%] hidden">
      <img id="foundCollectibleImage" alt="Collectible image" :class="getCardRarityClass(foundCollectible.rarity_id)"
        class="collectible mb-5 rounded-2xl"
        :src="cardBack" />
      <h3 class="text-3xl w-full text-center font-bold" :class="{ 'no-opacity': !animationDone }">{{
        foundCollectible.name }}</h3>
      <h3 class="text-xl w-full text-center font-bold"
        :class="{ [getTextRarityClass(foundCollectible.rarity_id)]: true, 'no-opacity': !animationDone }">
        {{ getRarityName(foundCollectible.rarity_id) }}
      </h3>
    </div>
  </div>
</template>

<style scoped>
.collectible:hover {
  transform: scale(1.05);
  transition: transform 0.2s;
}

.collectible {
  transition: transform 0.2s;
}

.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  user-select: none;
  pointer-events: none;
}

.selected-count {
  pointer-events: none;
}

.no-opacity {
  opacity: 0;
}
</style>
