<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import router from '../../router/router'
import { useAPIStore } from '../../stores/api'
import { Card } from '../../types/Card'
import { OrderSide } from '../../enums/OrderSideEnum'
import { Order } from '../../types/Order'
import { OrderRequest } from '../../types/OrderRequest'
import { useSessionStore } from '../../stores/session'
import { useToast } from 'vue-toastification'
import { MarketHistoryDay } from '../../types/MarketHistoryDay'
import OrderBook from '../../components/market/OrderBook.vue'
import MarketChart from '../../components/market/MarketChart.vue'
import OrderForm from '../../components/market/OrderForm.vue'
import MyOrders from '../../components/market/MyOrders.vue'
import { OrderType } from '../../enums/OrderTypeEnum'

const { client } = useAPIStore()
let url = router.currentRoute.value.fullPath.split('/')
const collectibleId = parseInt(url[url.length - 1])
const collectible = ref<Card>()
const sessionStore = useSessionStore()
const toast = useToast()
const userCollectibles = ref<Card[]>([])
const ownOrders = ref<Order[]>([])

const assetPrice = ref(0)

const allOrders = ref<Order[]>([])
const history = ref<MarketHistoryDay[]>([])

const manualPrice = ref(0)

async function createOrder(order: OrderRequest): Promise<boolean> {
  if (window.location.hostname != 'localhost') {
    toast.error('This feature is not available yet')
    return
  }

  // check if the user has enough liquidity to complete the order
  if (order.side == OrderSide.BUY && sessionStore.session.money < order.price) {
    toast.error("You don't have enough liquidity to complete this order")
    return
  }

  // check if the user owns all the collectibles they want to sell
  if (order.side == OrderSide.SELL) {
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

  toast.success('Created order '
    + order.side + ' '
    + (order.type == OrderType.MARKET ? order.type : '')
      + order.quantity + ' @ '
      + (order.type == OrderType.LIMIT ? order.price : '')
    , { timeout: 2000 })
  await fetchOrders()
}

async function fetchHistory() {
  history.value = await (await client.getMarketHistory(collectibleId)).json()
}

async function fetchOrders() {
  let orders = await (await client.getOrdersForCollectible(collectibleId)).json()
  allOrders.value = orders
}

async function fetchOwnOrders() {
  ownOrders.value = await (await client.getOwnOrdersForCollectible(collectibleId)).json()
}

onMounted(async () => {
  assetPrice.value = (await (await client.getAssetPrice(collectibleId)).json()).marketPrice
  let collectibleResponse = await (await client.getCollectible(collectibleId)).json()
  collectible.value = collectibleResponse
  userCollectibles.value = await (await client.getUserCollectibles(sessionStore.session.id)).json()
  fetchOrders()
  fetchHistory()
  fetchOwnOrders()
  manualPrice.value = assetPrice.value
})
</script>

<template>
  <div class="order-wrapper w-11/12 flex flex-col justify-center items-center mx-auto lg:h-[85vh] gap-4">
    <div class="info-wrapper w-full h-full flex flex-row gap-4 mb-12 lg:mb-0">
      <div class="chart-wrapper rounded-xl lg:w-3/4 w-full bg-base-300 h-[50vh]">
        <h1 class="font-bold text-xl m-2 ml-4">{{ collectible?.name }}</h1>
        <MarketChart :history="history" />
      </div>
      <div class="w-1/4 h-[55vh] lg:visible lg:relative invisible absolute">
        <OrderBook :orders="allOrders" :assetPrice="assetPrice" />
      </div>
    </div>
    <div class="w-full flex lg:flex-row flex-col lg:h-[30vh] lg:space-x-5 lg:space-y-0 space-y-5">
      <div class="lg:w-1/3 lg:visible lg:relative invisible absolute w-full rounded-xl bg-base-300 p-5">
        <div class="flex flex-row justify-center items-center h-full">
          <!-- <img :src="collectible?.asset_url" class="rounded-xl lg:w-1/3 w-1/6" alt="Collectible Image" />
          <div class="flex flex-col ml-5">
            <h1 class="font-bold text-xl">{{ collectible?.name }}</h1>
          </div> -->
          <h1 class="text-3xl text-gray-400">Coming Soon</h1>
        </div>
      </div>
      <div class="lg:w-1/3 w-full rounded-xl bg-base-300 flex flex-row justify-center">
        <OrderForm :collectible-id="collectibleId" :asset-price="assetPrice" :collectible="collectible"
          @submit="createOrder" />
      </div>
      <div class="lg:w-1/3 w-full rounded-xl bg-base-300 overflow-auto">
        <MyOrders :own-orders="ownOrders" />
      </div>
    </div>
  </div>
</template>
