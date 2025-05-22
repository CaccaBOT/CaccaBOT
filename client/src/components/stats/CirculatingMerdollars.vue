<script setup lang="ts">
import Asset from '../../types/Asset'
const props = defineProps<{
  value: number
  includesAssets: boolean
}>()
</script>

<template>
  <div class="circulating-merdollars-wrapper w-max">
    <div class="stats bg-base-300 text-center shadow-sm">
      <div class="stat">
        <div class="stat-title">Circulating Merdollars</div>
        <div class="stat-value flex items-center justify-center text-success">
          {{ props.value.toLocaleString() }}
          <img
            alt="Merdollar"
            class="merdollar ml-2 inline h-[50px] w-[50px]"
            :src="Asset.MERDOLLAR"
          />
        </div>
        <div v-show="props.includesAssets" class="stat-desc mt-2">
          including assets
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
