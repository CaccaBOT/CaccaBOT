<script setup lang="ts">
import { ref, watch } from 'vue'
import { MarketHistoryDay } from '../../types/MarketHistoryDay'
import { color } from '../../main'

const props = defineProps<{
  history: MarketHistoryDay[]
}>()

const chartType = ref<'candlestick' | 'line'>('candlestick')
const series = ref([{ data: [], name: 'Price' }])

const prices = ref([])
const minPrice = ref(0)
const maxPrice = ref(0)

const chartOptions = ref({
  chart: {
    type: chartType.value,
    background: 'transparent',
    animations: { enabled: false },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        customIcons: [
          {
            icon: `<div style="padding: 3px 6px; font-size: 15px;">📊</div>`,
            index: -1,
            title: 'Candlestick Chart',
            class: 'custom-candle-btn',
            click: () => {
              chartType.value = 'candlestick'
              chartOptions.value.chart.type = 'candlestick'
            }
          },
          {
            icon: `<div style="padding: 3px 6px; font-size: 15px;">📈</div>`,
            index: -1,
            title: 'Line Chart',
            class: 'custom-line-btn',
            click: () => {
              chartType.value = 'line'
              chartOptions.value.chart.type = 'line'
            }
          }
        ]
      }
    }
  },
  xaxis: { type: 'datetime' },
  yaxis: {
    min: minPrice,
    max: maxPrice,
    tickAmount: 10,
    labels: {
      formatter: (value: number) => Math.round(value).toString()
    },
    tooltip: { enabled: true }
  },
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

  prices.value = props.history.flatMap(entry => [entry.high_price, entry.low_price])
  minPrice.value = Math.floor(Math.min(...prices.value) / 5) * 5
  maxPrice.value = Math.ceil(Math.max(...prices.value) / 5) * 5

}, { immediate: true })

watch(chartType, (newType) => {
  chartOptions.value.chart.type = newType
  props.history && watch(() => props.history, () => { }, { immediate: true })
})
</script>

<template>
  <div class="chart-wrapper relative rounded-xl w-full h-full bg-base-300">
    <apexchart v-if="history.length > 0" :type="chartType" width="99%" height="100%" :options="chartOptions"
      :series="series" />
    <div v-else class="flex items-center justify-center h-full text-gray-400 text-2xl">No data available</div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  padding: 0.5rem;
}
</style>
