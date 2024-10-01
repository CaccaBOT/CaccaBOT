<script setup lang="ts">
import { ref, watch, onBeforeMount, onMounted } from "vue"
import ApexCharts from "vue3-apexcharts"
import { PoopsPerDay } from "../../types/PoopsPerDay"
import { color } from "../../main"

// Define the props with TypeScript
const props = defineProps<{
  poopsPerDay: PoopsPerDay
}>()

const updater = ref(0)

// Reactive data
const categories = ref(Object.keys(props.poopsPerDay ?? {})) // The dates
const data = ref(Object.values(props.poopsPerDay ?? {})) // The poop counts

// Chart options
const options = ref({
  series: [
    {
      name: "Poops",
      data: data.value,
    },
  ],
  chart: {
    type: "line", // Using a line chart to show trends over time
    background: "transparent",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    categories: categories.value,
  },
  tooltip: {
    x: {
      format: "dd/MM/yyyy", // Format the tooltip date display
    },
  },
  theme: {
    mode: color,
  },
})

watch(
  () => props.poopsPerDay,
  (newValue) => {
    categories.value = Object.keys(newValue ?? {})
    data.value = Object.values(newValue ?? {})
    options.value.series[0].data = data.value
    options.value.xaxis.categories = categories.value
    updater.value++
  },
  { immediate: true },
)
</script>

<template>
  <div class="monthly-poop-line-chart-wrapper w-[90vw]">
    <ApexCharts
      height="200"
      :options="options"
      :series="options.series"
      :key="updater"
    />
  </div>
</template>

<style scoped></style>
