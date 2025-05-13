<script setup lang="ts">
import { ref, computed } from 'vue'
import { OrderSide } from '../../enums/OrderSideEnum'
import { OrderType } from '../../enums/OrderTypeEnum'
import HeroiconsXMark20Solid from '~icons/heroicons/x-mark-20-solid'
import HeroiconsEquals20Solid from '~icons/heroicons/equals-20-solid'
import type { Card } from '../../types/Card'
import type { OrderRequest } from '../../types/OrderRequest'
import Asset from '../../types/Asset'

const props = defineProps<{
  collectibleId: number
  collectible: Card | undefined
  assetPrice: number
  bidPrice: number
  askPrice: number
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

const bidPrice = computed(() => {
  if (
    props.bidPrice === null ||
    props.bidPrice === Infinity ||
    props.bidPrice === -Infinity) {
    return 0
  }

  return props.bidPrice
})

const askPrice = computed(() => {
  if (
    props.askPrice === null ||
    props.askPrice === Infinity ||
    props.askPrice === -Infinity) {
    return 0
  }

  return props.askPrice
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
  <div class="order-form flex flex-col items-center p-6">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Order type</legend>
      <select v-model="selectedOrderType" class="select w-80">
        <option selected>{{ OrderType.MARKET }}</option>
        <option>{{ OrderType.LIMIT }}</option>
      </select>
    </fieldset>

    <div class="flex flex-row space-x-2 items-center justify-center">
      <fieldset :class="selectedOrderType === OrderType.LIMIT ? 'w-20' : 'w-80'" class="fieldset">
        <legend class="fieldset-legend">Amount</legend>
        <input v-model="selectedAmount" type="number" class="input" />
      </fieldset>

      <HeroiconsXMark20Solid v-if="selectedOrderType === OrderType.LIMIT" class="text-xl mt-6" />

      <fieldset v-if="selectedOrderType === OrderType.LIMIT" class="fieldset w-20">
        <legend class="fieldset-legend">Price</legend>
        <input v-model="manualPrice" type="number" class="input" />
      </fieldset>

      <HeroiconsEquals20Solid v-if="selectedOrderType === OrderType.LIMIT" class="text-xl mt-6" />

      <fieldset v-if="selectedOrderType === OrderType.LIMIT" class="fieldset w-20">
        <legend class="fieldset-legend">Total</legend>
        <input readonly :value="manualPrice * selectedAmount" type="text" class="input" />
      </fieldset>
    </div>

    <div class="flex flex-row justify-center mt-6 space-x-8">
      <button v-if="selectedOrderType === OrderType.MARKET" @click="handleSubmit(OrderSide.BUY)"
        :disabled="selectedAmount === 0" class="btn btn-success w-40">Buy ({{ selectedAmount * askPrice }} <img
          :src="Asset.MERDOLLAR" class="w-[18px]">)</button>
      <button v-if="selectedOrderType === OrderType.MARKET" @click="handleSubmit(OrderSide.SELL)"
        :disabled="selectedAmount === 0" class="btn btn-error w-40">Sell ({{ selectedAmount * bidPrice }} <img
          :src="Asset.MERDOLLAR" class="w-[18px]">)</button>

      <button v-if="selectedOrderType === OrderType.LIMIT" @click="handleSubmit(OrderSide.BUY)"
        :disabled="selectedAmount === 0" class="btn btn-success w-40">Buy</button>
      <button v-if="selectedOrderType === OrderType.LIMIT" @click="handleSubmit(OrderSide.SELL)"
        :disabled="selectedAmount === 0" class="btn btn-error w-40">Sell</button>
    </div>
  </div>
</template>

<style scoped></style>