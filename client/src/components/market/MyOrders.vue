<script setup lang="ts">
import { Order } from '../../types/Order'

const props = defineProps<{
  ownOrders: Order[]
}>()
</script>

<template>
  <div class="my-orders-wrapper w-full h-full md:p-2 overflow-auto">
    <h2 class="text-center text-xl font-semibold my-2">Your Orders</h2>
    <table class="table w-full text-sm text-center">
      <thead>
        <tr>
          <th>Price</th>
          <th>Side</th>
          <th>Status</th>
          <th>Created at</th>
          <th>Executed At</th>
        </tr>
      </thead>
      <tbody v-if="ownOrders.length > 0">
        <tr v-for="(order, index) in ownOrders" :key="index">
          <td>{{ order.price ?? 'Market' }}</td>
          <td>
            <div class="badge font-bold" :class="order.side === 'BUY' ? 'badge-success' : 'badge-error'"> {{ order.side
              }} </div>
          </td>
          <td>{{ order.executed ? 'Executed' : 'Pending' }}</td>
          <td>
            <span v-if="order.creation_timestamp">
              {{ order.creation_timestamp }}
            </span>
            <span v-else>-</span>
          </td>
          <td>
            <span v-if="order.executed && order.execution_timestamp">
              {{ order.execution_timestamp }}
            </span>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="10" class="text-2xl">&nbsp;</td>
        </tr>
        <tr>
          <td colspan="10" class="text-center text-gray-400 text-2xl">No orders</td>
        </tr>
        <tr>
          <td colspan="10" class="text-2xl">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.my-orders-wrapper::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}

table, th, td {
  padding: 0.5rem;
}
</style>
