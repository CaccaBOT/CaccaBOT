<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import router from '../../router/router'
import { useAPIStore } from '../../stores/api'
import { Card } from '../../types/Card'
import HeroiconsInformationCircle from '~icons/heroicons/information-circle'
import { color } from '../../main'
import { OrderSide } from '../../enums/OrderSideEnum'
import { Order } from '../../types/Order'
import { OrderRequest } from '../../types/OrderRequest'
import { OrderType } from '../../enums/OrderTypeEnum'
import { useSessionStore } from '../../stores/session'
import { useToast } from 'vue-toastification'

const { client } = useAPIStore()
let url = router.currentRoute.value.fullPath.split('/')
const collectibleId = parseInt(url[url.length - 1])
const collectible = ref<Card>()
const selectedOrderType = ref<string>(OrderType.MARKET)
const selectedAmount = ref(1)
const sessionStore = useSessionStore()
const toast = useToast()
const userCollectibles = ref<Card[]>([])

const assetPrice = ref(0)
const series = ref([{ data: [] }])

const allOrders = ref<Order[]>([])
const buyOrders = ref<Order[]>([])
const sellOrders = ref<Order[]>([])

const chartOptions = {
  chart: {
    type: 'candlestick',
    background: 'transparent',
    animations: { enabled: false },
  },
  xaxis: { type: 'datetime' },
  yaxis: { tooltip: { enabled: true } },
  theme: { mode: color },
};

const selectedPrice = computed(() => {
  if (selectedOrderType.value === 'Market') {
    return assetPrice.value * selectedAmount.value;
  } else {
    return selectedPrice.value;
  }
});

async function createOrder(orderSide: OrderSide) {
  // for now it works only locally
  if (window.location.hostname != 'localhost') {
    toast.error('This feature is not available yet')
    return
  }

  let order: OrderRequest = {
    collectibleId: collectibleId,
    price: selectedPrice.value,
    quantity: selectedAmount.value,
    side: orderSide,
    type: OrderType[selectedOrderType.value],
  }

  // check if the user has enough liquidity to complete the order
  if (orderSide == OrderSide.BUY && sessionStore.session.money < order.price) {
    toast.error("You don't enough liquidity to complete this order")
    return
  }

  // check if the user owns all the collectibles they want to sell
  if (orderSide == OrderSide.SELL) {
    let foundCollectible = userCollectibles.value.find((c) => c.id == collectibleId)
    let isCollectibleOwned = (foundCollectible != null)
    if (!isCollectibleOwned) {
      toast.error("You don't own this collectible")
      return
    }

    let quantityOwned = foundCollectible.quantity
    if (quantityOwned < order.quantity) {
      toast.error("You don't own enough collectibles to complete this order")
      return
    }
  }

  let response = await client.createOrder(order)

  if (!response.ok) {
    toast.error((await response.json()).error)
    return
  }

  toast.success('Order created successfully')
}

onMounted(async () => {
  assetPrice.value = (await (await client.getAssetPrice(collectibleId)).json()).marketPrice
  let collectibleResponse = await (await client.getCollectible(collectibleId)).json()
  collectible.value = collectibleResponse
  userCollectibles.value = await (await client.getUserCollectibles(sessionStore.session.id)).json()
})
</script>

<template>
  <div class="order-wrapper w-11/12 flex flex-col justify-center items-center mx-auto h-[85vh] gap-4">
    <div class="info-wrapper w-full h-full flex flex-row gap-4">
      <div class="chart-wrapper rounded-xl w-2/3 bg-base-300 h-[55vh]">
        <h1 class="font-bold text-xl m-2 ml-4">{{ collectible?.name }}</h1>
        <apexchart type="candlestick" width="100%" height="80%" :options="chartOptions" :series="series"></apexchart>
      </div>
      <div class="order-book-wrapper rounded-xl w-1/3 bg-base-300 h-[55vh] flex flex-col p-2">
        <h2 class="text-center text-lg font-bold mb-2">Order Book</h2>
        <div class="order-book grid grid-cols-3 text-xs text-gray-400 p-1 border-b">
          <span>Price</span>
          <span>Amount</span>
          <span>Total</span>
        </div>
        <div class="sell-orders flex flex-col-reverse text-red-500">
          <div v-for="order in sellOrders" :key="order.price" class="order-row grid grid-cols-3 text-xs p-1">
            <span>{{ order.price.toFixed(0) }}</span>
            <span>0</span>
            <span>0</span>
          </div>
        </div>
        <div class="current-price text-center font-bold text-lg text-green-500 my-2">
          {{ assetPrice }}
        </div>
        <div class="buy-orders flex flex-col text-green-500">
          <div v-for="order in buyOrders" :key="order.price" class="order-row grid grid-cols-3 text-xs p-1">
            <span>{{ order.price.toFixed(0) }}</span>
            <span>0</span>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full rounded-xl bg-base-300 h-[50vh] p-4 flex flex-row">
      <div class="flex flex-col justify-between h-full w-96">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Order type</legend>
          <select v-model="selectedOrderType" class="select">
            <option selected>{{ OrderType.MARKET }}</option>
            <option>{{ OrderType.LIMIT }}</option>
          </select>
        </fieldset>
        <div class="order-info-wrapper flex flex-col">
          <div class="flex justify-center items-center">
            <HeroiconsInformationCircle class="text-xl mr-2 w-10" />
            <p v-if="selectedOrderType == OrderType.MARKET">
              Market orders are executed immediately at the best available price.
            </p>
            <p v-if="selectedOrderType == OrderType.LIMIT">
              Limit orders are executed at a specific price or better, only when the market reaches that price.
            </p>
          </div>
        </div>
      </div>
      <div class="order-form flex flex-col w-96 justify-center items-center">
        <div>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Price</legend>
            <input :disabled="selectedOrderType == 'Market'" v-model="selectedPrice" type="number" class="input" />
          </fieldset>
        </div>
        <div>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Amount</legend>
            <input v-model="selectedAmount" type="number" class="input" />
          </fieldset>
        </div>
        <div class="flex flex-row justify-center mt-4">
          <button @click="createOrder(OrderSide.BUY)" :disabled="selectedAmount == 0"
            class="btn btn-success w-full">Buy</button>
          <button @click="createOrder(OrderSide.SELL)" :disabled="selectedAmount == 0"
            class="btn btn-error w-full">Sell</button>
        </div>
      </div>
    </div>
  </div>
</template>
