<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import router from '../../router/router';
import { useAPIStore } from '../../stores/api';
import { Card } from '../../types/Card';
import HeroiconsInformationCircle from '~icons/heroicons/information-circle';
import { color } from '../../main';

const { client } = useAPIStore();
let url = router.currentRoute.value.fullPath.split('/');
const collectibleId = parseInt(url[url.length - 1]);
const collectible = ref<Card>();
const selectedOrderType = ref<string>('Market');
const selectedAmount = ref(1)

const assetPrice = ref(5)
const series = ref([{ data: [] }]);

interface Order {
  price: number;
  amount: number;
  total: number;
}

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

onMounted(async () => {
  let response = await (await client.getCollectible(collectibleId)).json();
  collectible.value = response;

});
</script>

<template>
  <div class="order-wrapper w-11/12 flex flex-col justify-center items-center mx-auto h-[85vh] gap-4">
    <div class="info-wrapper w-full h-full flex flex-row gap-4">
      <div class="chart-wrapper rounded-xl w-2/3 bg-base-300 h-[55vh]">
        <h1 class="font-bold text-xl m-2 ml-4">Caccantante</h1>
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
            <span>{{ order.amount.toFixed(0) }}</span>
            <span>{{ order.total.toFixed(0) }}</span>
          </div>
        </div>
        <div class="current-price text-center font-bold text-lg text-green-500 my-2">
          {{ assetPrice }}
        </div>
        <div class="buy-orders flex flex-col text-green-500">
          <div v-for="order in buyOrders" :key="order.price" class="order-row grid grid-cols-3 text-xs p-1">
            <span>{{ order.price.toFixed(0) }}</span>
            <span>{{ order.amount.toFixed(0) }}</span>
            <span>{{ order.total.toFixed(0) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full rounded-xl bg-base-300 h-[50vh] p-4 flex flex-row">
      <div class="flex flex-col justify-between h-full w-96">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Order type</legend>
          <select v-model="selectedOrderType" class="select">
            <option selected>Market</option>
            <option>Limit</option>
          </select>
        </fieldset>
        <div class="order-info-wrapper flex flex-col">
          <div class="flex justify-center items-center">
            <HeroiconsInformationCircle class="text-xl mr-2 w-10" />
            <p v-if="selectedOrderType == 'Market'">
              Market orders are executed immediately at the best available price.
            </p>
            <p v-if="selectedOrderType == 'Limit'">
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
          <button :disabled="selectedAmount == 0" class="btn btn-success w-full">Buy</button>
          <button :disabled="selectedAmount == 0" class="btn btn-error w-full">Sell</button>
        </div>
      </div>
    </div>
  </div>
</template>
