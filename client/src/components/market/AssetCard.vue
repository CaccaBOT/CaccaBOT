<script setup lang="ts">
import { Card } from "../../types/Card"
import Asset from "../../types/Asset";
import router from "../../router/router";

const props = defineProps<{
    collectible: Card
    price: number
    change: number
}>()
</script>

<template>
    <div class="card bg-base-300 w-64 shadow-xl">
        <figure>
            <img class="h-64 rounded-2xl mt-5" :src="collectible.asset_url" alt="Asset" />
        </figure>
        <div class="card-body p-2 w-full justify-center text-center">
            <h2 class="card-title mx-auto mb-2">{{ collectible.name }}</h2>
            <div
                class="price-wrapper flex flex-row justify-center align-center text-slate-800 font-bold w-[80%] mx-auto">
                <div :class="{ 'bg-success': change > 0, 'bg-error': change < 0, 'bg-slate-500': change == 0 }"
                    class="w-[50%] rounded-l-full">
                    <p class="text-lg">{{ change.toFixed(2) }}%</p>
                </div>
                <div class="w-[50%] rounded-r-full bg-primary flex items-center justify-center">
                    <span class="inline-flex items-center">
                        <p class="text-lg mr-1">{{ price.toFixed(0) }}</p>
                        <img alt="Merdollar" class="merdollar h-[18px] w-[18px]" :src="Asset.MERDOLLAR" />
                    </span>
                </div>
            </div>
            <div class="card-actions justify-center mt-5">
                <RouterLink class="w-full" :to="`${router.currentRoute.value.fullPath}cards/market/order/${collectible.id}`">
                    <button class="btn btn-primary w-10/12 mb-5 text-lg">Trade</button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
