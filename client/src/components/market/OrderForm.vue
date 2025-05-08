<script setup lang="ts">
import { ref, computed } from 'vue'
import { OrderSide } from '../../enums/OrderSideEnum'
import { OrderType } from '../../enums/OrderTypeEnum'
import HeroiconsXMark20Solid from '~icons/heroicons/x-mark-20-solid'
import HeroiconsEquals20Solid from '~icons/heroicons/equals-20-solid'
import type { Card } from '../../types/Card'
import type { OrderRequest } from '../../types/OrderRequest'

const props = defineProps<{
  collectibleId: number
  collectible: Card | undefined
  assetPrice: number
}>()

const emit = defineEmits<{
  (e: 'submit', order: OrderRequest): void
}>()

const selectedOrderType = ref<string>(OrderType.MARKET)
const selectedAmount = ref(1)
const manualPrice = ref(props.assetPrice)

const selectedPrice = computed(() => {
  return selectedOrderType.value === OrderType.MARKET
    ? props.assetPrice * selectedAmount.value
    : manualPrice.value
})

function handleSubmit(side: OrderSide) {
  const order: OrderRequest = {
    collectibleId: props.collectibleId,
    price: selectedPrice.value,
    quantity: selectedAmount.value,
    side,
    type: OrderType[selectedOrderType.value],
  }
  emit('submit', order)
}
</script>

<template>
  <div class="order-form flex flex-col items-center p-5">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Order type</legend>
      <select v-model="selectedOrderType" class="select w-80">
        <option selected>{{ OrderType.MARKET }}</option>
        <option>{{ OrderType.LIMIT }}</option>
      </select>
    </fieldset>

    <div class="flex flex-row space-x-2 items-center justify-center">
      <fieldset class="fieldset w-20">
        <legend class="fieldset-legend">Amount</legend>
        <input v-model="selectedAmount" type="number" class="input" />
      </fieldset>

      <HeroiconsXMark20Solid class="text-xl mt-6" />

      <fieldset class="fieldset w-20">
        <legend class="fieldset-legend">Price</legend>
        <input v-show="selectedOrderType === OrderType.MARKET" :disabled="true" :value="selectedPrice" type="number" class="input" />
        <input v-show="selectedOrderType === OrderType.LIMIT" v-model="manualPrice" type="number" class="input" />
      </fieldset>

      <HeroiconsEquals20Solid class="text-xl mt-6" />

      <fieldset class="fieldset w-20">
        <legend class="fieldset-legend">Total</legend>
        <input readonly :value="selectedOrderType === OrderType.MARKET ? selectedPrice * selectedAmount : manualPrice * selectedAmount" type="number" class="input" />
      </fieldset>
    </div>

    <div class="flex flex-row justify-center mt-6 space-x-8">
      <button @click="handleSubmit(OrderSide.BUY)" :disabled="selectedAmount === 0"
        class="btn btn-success w-full">Buy</button>
      <button @click="handleSubmit(OrderSide.SELL)" :disabled="selectedAmount === 0"
        class="btn btn-error w-full">Sell</button>
    </div>
  </div>
</template>

<style scoped>
</style>