<script setup lang="ts">
import { ref, computed } from 'vue'
import { Order } from '../../types/Order'
import HeroiconsTrash from '~icons/heroicons/trash'

const props = defineProps<{
  ownOrders: Order[]
}>()

const emit = defineEmits<{
  (e: 'delete', orderId: number): void
}>()

const selectedTab = ref<'active' | 'inactive'>('active')

const activeOrders = computed(() =>
  props.ownOrders.filter(order => order.active)
)

const inactiveOrders = computed(() =>
  props.ownOrders.filter(order => !order.active)
)

function getStatus(order: Order): string {
  if (order.executed) {
    return 'Executed'
  } else if (order.active) {
    return 'Pending'
  } else {
    return 'Cancelled'
  }
}
</script>

<template>
  <div class="my-orders-wrapper w-full h-full md:p-2 overflow-auto">
    <div class="flex flex-row justify-between">
      <h2 class="ml-5 text-xl font-semibold my-2">Your Orders</h2>

      <div role="tablist" class="tabs tabs-bordered justify-center">
        <button role="tab" class="tab" :class="{ 'tab-active': selectedTab === 'active' }"
          @click="selectedTab = 'active'">
          Active
        </button>
        <button role="tab" class="tab" :class="{ 'tab-active': selectedTab === 'inactive' }"
          @click="selectedTab = 'inactive'">
          Inactive
        </button>
      </div>
    </div>

    <table class="table w-full text-sm text-center">
      <thead>
        <tr>
          <th>Side</th>
          <th>Price</th>
          <th>Status</th>
          <th>Created at</th>
          <th>Executed At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody v-if="(selectedTab === 'active' ? activeOrders : inactiveOrders).length > 0">
        <tr v-for="(order, index) in selectedTab === 'active' ? activeOrders : inactiveOrders" :key="index">
          <td>
            <div class="badge font-bold" :class="order.side === 'BUY' ? 'badge-success' : 'badge-error'">
              {{ order.side }}
            </div>
          </td>
          <td>{{ order.price ?? 'Market' }}</td>
          <td>{{ getStatus(order) }}</td>
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
          <td>
            <button v-if="!order.executed && order.active" class="btn btn-sm btn-error"
              @click="emit('delete', order.id)">
              <HeroiconsTrash class="mx-auto text-lg" />
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="border-0">
          <td colspan="6" class="text-center text-gray-400 text-2xl">&nbsp;</td>
        </tr>
        <tr class="border-0">
          <td colspan="6" class="text-center text-gray-400 text-2xl">No Orders</td>
        </tr>
        <tr class="border-0">
          <td colspan="6" class="text-center text-gray-400 text-2xl">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.my-orders-wrapper::-webkit-scrollbar {
  display: none;
}

table,
th,
td {
  padding: 0.5rem;
}
</style>
