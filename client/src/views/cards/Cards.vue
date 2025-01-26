<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useAPIStore } from "../../stores/api"
import { useSessionStore } from "../../stores/session"
import { Card } from "../../types/Card"
import Pack from "../../components/Pack.vue"
import merdollar from "../../assets/merdollar.webp"
import { CollectibleRarity } from "../../enums/CollectibleRarity"
import { getTextRarityClass } from "../../services/collectibleService"
const { client } = useAPIStore()
const sessionStore = useSessionStore()
const foundCard = ref({} as Card)
const isOpening = ref(false)
const packRef = ref(null)
const updater = ref(0)

async function openPack() {
  isOpening.value = true
  const response = await client.openPack()
  if (!response.ok) {
    return
  }
  packRef.value.open()
  sessionStore.session.money = sessionStore.session.money - 5
  foundCard.value = await response.json()
  document.querySelector("#openPack")?.classList.add("fade-out")
  document.querySelector("#notEnoughMoney")?.classList.add("fade-out")
  document
    .querySelector(".card")
    .classList.add(getRarityClass(foundCard.value.rarity_id))
  document
    .querySelector(".card-info > h2")
    .classList.add(getTextRarityClass(foundCard.value.rarity_id))
}

function getRarityClass(rarityId: CollectibleRarity) {
  let rarityMap = {
    1: "rarity-common",
    2: "rarity-rare",
    3: "rarity-epic",
    4: "rarity-legendary",
  }

  return rarityMap[rarityId]
}

async function reset() {
  isOpening.value = false
  await packRef.value.reset()
  updater.value++
  document
    .querySelector(".card")
    .classList.remove(getRarityClass(foundCard.value.rarity_id))
  document
    .querySelector(".card-info > h2")
    .classList.remove(getTextRarityClass(foundCard.value.rarity_id))
}

</script>

<template>
  <div
    class="cards-wrapper flex flex-col justify-between sm:h-[75vh] md:h-[80vh]"
  >
    <div
      class="card-pack flex cursor-pointer flex-row items-center justify-center"
    >
      <Pack :key="updater" ref="packRef" />
    </div>
    <div
      class="card-wrapper mt-24 flex hidden w-full items-center justify-center"
    >
      <div class="position-relative card w-2/3 md:w-1/3 lg:w-1/5">
        <img
          alt="Found card image"
          class="rounded-lg bg-base-300"
          :src="foundCard.asset_url"
          @click="reset"
        />
      </div>
    </div>
    <div class="card-info w-100 prose mx-auto my-2 hidden text-center">
      <h1 class="mb-1 mt-5">{{ foundCard.name }}</h1>
      <h2 class="rarity mt-3">{{ CollectibleRarity[foundCard.rarity_id] }}</h2>
    </div>
    <button
      v-if="!sessionStore.session.id"
      class="lg:w-1/8 btn btn-error mx-auto w-2/3 sm:w-2/3 md:w-1/5"
    >
      Login required
    </button>
    <button
      v-if="sessionStore.session.money >= 5"
      id="openPack"
      :disabled="isOpening"
      class="lg:w-1/8 btn btn-success mx-auto w-2/3 sm:w-2/3 md:w-1/5"
      @click="openPack"
    >
      Open Pack (5 <img class="merdollar h-[20px] w-[20px]" :src="merdollar" />)
    </button>
    <button
      id="notEnoughMoney"
      v-if="sessionStore.session.money < 5"
      class="lg:w-1/8 btn btn-error mx-auto w-2/3 sm:w-2/3 md:w-1/5"
    >
      You can't buy this item (5
      <img
        alt="Merdollar"
        class="merdollar h-[20px] w-[20px]"
        :src="merdollar"
      />)
    </button>
  </div>
</template>

<style scoped>
.slide-down {
  animation: slide-down 0.5s ease-in-out forwards;
}

@keyframes slide-down {
  from {
    transform: translateY(0vh);
  }

  to {
    transform: translateY(100vh);
  }
}

@keyframes zoom-in {
  0% {
    transform: scale(0);
  }

  80% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.fade-out {
  animation: fade-out 0.5s linear forwards;
  user-select: none;
  pointer-events: none;
}

.card::before {
  content: "";
  display: block;
  padding-bottom: 141.67%;
  /* Aspect ratio 5:7 */
}

.card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-in {
  animation: zoom-in 1s forwards ease-out;
}
</style>
