<script setup lang="ts">
import ApexCharts from "vue3-apexcharts"
import { ref, watch } from "vue"
import { color } from "../../main.ts"

const props = defineProps<{
  users
}>()

const options = ref({
  series: [
    {
      data: [],
    },
  ],
  chart: {
    type: "treemap",
    toolbar: {
      show: false,
    },
    background: "transparent",
  },
  legend: {
    show: false,
  },
  colors: [
    "#4CAF50",
    "#FF9800",
    "#2196F3",
    "#FF5722",
    "#9C27B0",
    "#03A9F4",
    "#E91E63",
    "#8BC34A",
    "#FFC107",
    "#00BCD4",
  ],
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return `${val} (${Math.round(opts.value)}%)`
    },
    style: {
      colors: ["#000"],
    },
    offsetX: 0,
    offsetY: 0,
    textAnchor: "middle",
  },
  tooltip: {
    y: {
      formatter: (val: number) => {
        return val.toString() + "%"
      },
    },
  },
  theme: {
    mode: color,
  },
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false,
    },
  },
})

watch(
  () => props.users,
  (newUsers) => {
    if (newUsers) {
      options.value.series[0].data = newUsers.map((user) => ({
        x: user.username,
        y: user.percentage,
      }))
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="monthly-poop-treemap-chart-wrapper w-[90vw]">
    <ApexCharts height="250" :options="options" :series="options.series" />
  </div>
</template>

<style scoped></style>
