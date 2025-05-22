<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loadingPhrases = [
  'Unclogging the toilet',
  'Refilling the TP dispenser',
  'Flushing out bugs',
  'Synchronizing with the septic tank',
  'Setting up poop sensors',
  'Scrubbing the porcelain',
  'Turbo-charging the flush',
  'Sanitizing the seat',
  'Counting toilet paper sheets',
  'Mapping the sewer network',
  'Calling the poop squad'
]

const phrase = ref('')

setInterval(() => [changePhrase()], 1000)

changePhrase()

function changePhrase() {
  phrase.value =
    loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]
}

onMounted(() => {
  setTimeout(() => {
    window.location.reload()
  }, 5000)
})
</script>

<template>
  <div
    class="flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden"
  >
    <h1 class="text-4xl">CaccaBOT is updating</h1>
    <h2 class="mt-4 text-2xl">{{ phrase }}...</h2>
    <div class="loading-animation mt-10"></div>
  </div>
</template>

<style scoped>
.loading-animation {
  display: inline-grid;
  font-size: 10rem;
}

.loading-animation:before,
.loading-animation:after {
  content: "💩";
  grid-area: 1/1;
}

.loading-animation:after {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>
