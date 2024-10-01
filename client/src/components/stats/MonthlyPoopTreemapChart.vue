<script setup lang="ts">
import ApexCharts from "vue3-apexcharts"
import { onBeforeMount, ref, watch } from "vue"
import { color } from "../../main.ts" // Assuming 'color' determines the theme mode (light/dark)

// Define the props with TypeScript (or JavaScript if not using TypeScript)
const props = defineProps<{
  users: Array
}>()

// Define the chart options using a ref
const options = ref({
  series: [
    {
      data: [], // Empty initially, will be populated with user data
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
      return `${val} (${Math.round(opts.value)}%)` // Display label and percentage
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
    mode: color, // Applies the mode based on 'color' from the main file
  },
  plotOptions: {
    treemap: {
      distributed: true, // Each cell can have its own color
      enableShades: false, // Shades between nodes for better differentiation
    },
  },
})

// Watch for changes in the `users` prop
watch(
  () => props.users, // Watching the `users` prop
  (newUsers) => {
    if (newUsers) {
      // Update the chart data when new user data is available
      options.value.series[0].data = newUsers.map((user) => ({
        x: user.username,
        y: user.percentage,
      }))
    }
  },
  { immediate: true }, // Trigger the watcher immediately on component mount
)
</script>

<template>
  <div class="monthly-poop-treemap-chart-wrapper w-[90vw]">
    <ApexCharts height="250" :options="options" :series="options.series" />
  </div>
</template>

<style scoped></style>
