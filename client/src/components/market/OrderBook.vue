<script setup lang="ts">
import { watch, ref } from 'vue'
import { Order } from '../../types/Order'
import { OrderSide } from '../../enums/OrderSideEnum'
import { OrderType } from '../../enums/OrderTypeEnum'
import { OrderBookEntry } from '../../types/OrderBookEntry'

const props = defineProps<{
  orders: Order[]
  assetPrice: number
}>()

const orderBookBuyEntries = ref<OrderBookEntry[]>([])
const orderBookSellEntries = ref<OrderBookEntry[]>([])

function aggregateOrders(orderSide: OrderSide): OrderBookEntry[] {
  return props.orders
    .filter(
      (order) =>
        order.side === orderSide &&
        order.type === OrderType.LIMIT &&
        order.active
    )
    .reduce((acc: OrderBookEntry[], order) => {
      const entry = acc.find((e) => e.price === order.price)
      if (entry) {
        entry.quantity += 1
      } else {
        acc.push({ price: order.price, quantity: 1 })
      }
      return acc
    }, [])
    .sort((a, b) => b.price - a.price)
}

watch(
  () => props.orders,
  () => {
    orderBookBuyEntries.value = aggregateOrders(OrderSide.BUY)
    orderBookSellEntries.value = aggregateOrders(OrderSide.SELL)
  },
  { immediate: true }
)
</script>

<template>
  <div class="order-book-wrapper w-full h-full rounded-xl bg-base-300 flex flex-col p-4 shadow-md">
    <h2 class="text-center text-xl font-semibold mb-3 text-base-content">Order Book</h2>

    <div class="grid grid-cols-3 text-sm text-gray-400 font-bold border-base-content/20 pb-1 mb-1">
      <span class="text-left">Amount</span>
      <span class="text-center">Price</span>
      <span class="text-right">Total</span>
    </div>

    <div v-if="orders.length > 0" class="flex flex-col justify-between flex-1 overflow-hidden">
      <div class="order-book-list sell-orders flex-1 flex flex-col-reverse gap-1 overflow-auto">
        <div v-for="entry in orderBookSellEntries" :key="'sell-' + entry.price"
          class="order-row grid grid-cols-3 text-sm p-2 rounded bg-red-500/10 text-error">
          <span class="text-left">{{ entry.quantity }}</span>
          <span class="text-center">{{ entry.price }}</span>
          <span class="text-right">{{ entry.price * entry.quantity }}</span>
        </div>
      </div>

      <div class="text-center bg-base-100 font-bold text-lg my-1">
        <span class="ml-2">{{ assetPrice }}</span>
      </div>

      <div class="order-book-list buy-orders flex-1 flex flex-col gap-1 overflow-auto">
        <div v-for="entry in orderBookBuyEntries" :key="'buy-' + entry.price"
          class="order-row grid grid-cols-3 text-sm p-2 rounded bg-green-500/10 text-success">
          <span class="text-left">{{ entry.quantity }}</span>
          <span class="text-center">{{ entry.price }}</span>
          <span class="text-right">{{ entry.price * entry.quantity }}</span>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col justify-center flex-1">
      <span class="text-center text-2xl text-gray-400">No Orders</span>
    </div>
  </div>
</template>

<style scoped>
.order-book-list::-webkit-scrollbar {
  display: none;
}
</style>
