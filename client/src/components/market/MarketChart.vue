<script setup lang="ts">
import { ref, watch } from 'vue'
import { MarketHistoryDay } from '../../types/MarketHistoryDay'
import { color } from '../../main'

const props = defineProps<{
  history: MarketHistoryDay[]
}>()

const chartType = ref<'candlestick' | 'line'>('candlestick')
const series = ref([{ data: [], name: 'Price' }])

const chartOptions = ref({
  chart: {
    type: chartType.value,
    background: 'transparent',
    animations: { enabled: false },
  },
  xaxis: { type: 'datetime' },
  yaxis: { tooltip: { enabled: true } },
  theme: { mode: color },
  plotOptions: {
    candlestick: {
      colors: {
        upward: 'oklch(76% 0.177 163.223)',
        downward: 'oklch(71% 0.194 13.428)',
      },
    },
  },
  tooltip: {
    x: { format: 'dd MMM yyyy' },
  },
})

watch(() => props.history, (newHistory) => {
  if (chartType.value === 'candlestick') {
    series.value = [
      {
        name: 'Price',
        data: newHistory.map((entry: MarketHistoryDay) => ({
          x: new Date(entry.timestamp),
          y: [
            entry.open_price,
            entry.high_price,
            entry.low_price,
            entry.close_price,
          ],
        })),
      },
    ]
  } else {
    series.value = [
      {
        name: 'Price',
        data: newHistory.map((entry: MarketHistoryDay) => ({
          x: new Date(entry.timestamp),
          y: entry.close_price,
        }))
      },
    ]
  }
}, { immediate: true })

watch(chartType, (newType) => {
  chartOptions.value.chart.type = newType
  props.history && watch(() => props.history, () => {}, { immediate: true })
})
</script>

<template>
  <div class="chart-wrapper relative rounded-xl w-full h-full bg-base-300">
    <div v-if="history.length > 0" class="absolute top-[-5%] right-5 z-10 flex">
      <button class="btn btn-xs" :class="{ 'btn-primary': chartType === 'candlestick' }" @click="chartType = 'candlestick'">Candlestick</button>
      <button class="btn btn-xs" :class="{ 'btn-primary': chartType === 'line' }" @click="chartType = 'line'">Line</button>
    </div>
  
    <apexchart
      v-if="history.length > 0"
      :type="chartType"
      width="100%"
      height="100%"
      :options="chartOptions"
      :series="series"
    />
    <div v-else class="flex items-center justify-center h-full text-gray-400 text-2xl">No data available</div>
  </div>
</template>


<style scoped>
.chart-wrapper {
  padding: 0.5rem;
}
</style>
