<script setup lang="ts">
import merdollar from "../assets/merdollar.webp"
const props = defineProps<{
  poops: number
  money: number
}>()
</script>

<template>
  <div class="text-md badge badge-info mt-6 p-4">
    <strong>{{ props.poops }}</strong> 💩 | <strong>{{ props.money }}</strong>
    <img class="merdollar h-[20px] w-[20px]" :src="merdollar" />
  </div>
</template>

<style scoped></style>
