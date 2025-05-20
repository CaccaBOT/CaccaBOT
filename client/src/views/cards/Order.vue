<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
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
import Terms from '../../components/market/Terms.vue'

const api = useAPIStore()
const { client } = api
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
const bidPrice = ref(0)
const askPrice = ref(0)
const isSocketConnected = ref(false)

async function updateOrders() {
  await Promise.all([
    fetchOrders(),
    fetchOwnOrders(),
    fetchHistory()
  ])
  calculatePrices()
  updateBalance()
}

async function updateBalance() {
  let profile = await (await client.getOwnProfile()).json()
  sessionStore.session.money = profile.money
}

async function deleteOrder(orderId: number) {
  const response = await client.deleteOrder(orderId)
  if (!response.ok) {
    toast.error((await response.json()).error || 'Failed to delete order')
    return
  }
}

async function createOrder(order: OrderRequest): Promise<boolean> {
  if (order.side == OrderSide.BUY && sessionStore.session.money < order.price) {
    toast.error("You don't have enough liquidity to complete this order")
    return
  }

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
}

function calculateBidPrice(): number {
  let buyOrders = allOrders.value.filter((o) => o.side == OrderSide.BUY && o.type == 'LIMIT' && o.active)
  let maxBuyOrder = buyOrders.reduce((max, order) => Math.max(max, order.price), 0)
  return maxBuyOrder
}

function calculateAskPrice(): number {
  let sellOrders = allOrders.value.filter((o) => o.side == OrderSide.SELL && o.type == 'LIMIT' && o.active)
  let minSellOrder = sellOrders.reduce((min, order) => Math.min(min, order.price), Infinity)
  return minSellOrder
}

function calculatePrices(): void {
  bidPrice.value = calculateBidPrice()
  askPrice.value = calculateAskPrice()
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

watch(() => api.socket?.active, (newVal) => {
  isSocketConnected.value = newVal
}, { immediate: true })

onMounted(async () => {
  api.initSocket()

  assetPrice.value = (await (await client.getAssetPrice(collectibleId)).json()).marketPrice
  let collectibleResponse = await (await client.getCollectible(collectibleId)).json()
  collectible.value = collectibleResponse
  userCollectibles.value = await (await client.getUserCollectibles(sessionStore.session.id)).json()
  await updateOrders()
  fetchHistory()

  api.socket.on('market', async () => {
    await updateOrders()
  })
})

onUnmounted(() => {
  api.disconnectSocket()
})
</script>

<template>
  <div class="order-wrapper w-11/12 flex flex-col justify-center items-center mx-auto lg:h-[85vh] gap-4">
    <div class="info-wrapper w-full h-full flex flex-row gap-4 mb-12 lg:mb-0">
      <div class="chart-wrapper rounded-xl lg:w-3/4 w-full bg-base-300 h-[50vh]">
        <div class="flex flex-row w-full items-center justify-between px-5">
          <h1 class="font-bold text-2xl mt-5 ml-4">{{ collectible?.name }}</h1>
          <div class="mt-5 flex flex-row items-center space-x-2">
            <div v-if="api.socket?.active" aria-label="success" class="status status-success animate-pulse"></div>
            <div v-else class="status status-error"></div>
            <p>{{ api.socket?.active ? 'Connected' : 'Disconnected' }}</p>
          </div>
        </div>
        <MarketChart :history="history" />
      </div>
      <div class="w-1/4 h-[55vh] lg:visible lg:relative invisible absolute">
        <OrderBook :orders="allOrders" :assetPrice="assetPrice" />
      </div>
    </div>
    <div class="w-full flex lg:flex-row flex-col lg:h-[30vh] lg:space-x-5 lg:space-y-0 space-y-5">
      <div class="lg:w-1/4 lg:visible lg:relative invisible absolute w-full rounded-xl bg-base-300 p-5 overflow-hidden">
        <Terms />
      </div>
      <div class="lg:w-2/5 w-full rounded-xl bg-base-300 flex flex-row justify-center">
        <OrderForm :collectible-id="collectibleId" :bid-price="bidPrice" :ask-price="askPrice" :asset-price="assetPrice"
          :collectible="collectible" @submit="createOrder" />
      </div>
      <div class="lg:w-3/7 w-full rounded-xl bg-base-300 overflow-auto h-[30vh]">
        <MyOrders :own-orders="ownOrders" @delete="deleteOrder" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>