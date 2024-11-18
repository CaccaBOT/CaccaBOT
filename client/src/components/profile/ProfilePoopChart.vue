<script setup lang="ts">
import { ref, watch } from "vue"
import { useGlobalStore } from "../../stores/global"
import { DisplayedResult } from "../../types/DisplayedResult"
import { Poop } from "../../types/Profile"
import { color } from "../../main.ts"

const props = defineProps<{
  poops: Poop[]
}>()

const globalStore = useGlobalStore()
let options = ref({})
let series = ref([])

function groupByDay(data: Poop[]) {
  const grouped: Record<string, number> = {}
  data.forEach((item) => {
    const date = new Date(item.timestamp)
    const day = date.toISOString().split("T")[0]
    grouped[day] = (grouped[day] || 0) + 1
  })
  return grouped
}

function fillMissingDays(grouped: Record<string, number>) {
  const startDate = new Date(
    globalStore.selectedDate.getFullYear(),
    globalStore.selectedDate.getMonth(),
    2,
  )
  const endDate = new Date(
    globalStore.selectedDate.getFullYear(),
    globalStore.selectedDate.getMonth() + 1,
    1,
  )
  const filled: Record<string, number> = {}
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const day = currentDate.toISOString().split("T")[0]
    filled[day] = grouped[day] || 0
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return filled
}

function updateChartData() {
  const groupedByDay = groupByDay(props.poops)
  const filledData = fillMissingDays(groupedByDay)

  const result: DisplayedResult[] = Object.keys(filledData).map((date) => ({
    date,
    count: filledData[date],
  }))

  options.value = {
    chart: {
      type: "area",
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "date",
      categories: result.map((x) => x.date),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          return val.toFixed(0)
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return val.toString()
        },
      },
    },
    theme: {
      mode: color,
    },
  }

  series.value = [
    {
      name: "poop",
      data: result.map((x) => x.count),
    },
  ]
}

watch(() => props.poops, updateChartData, { immediate: true })
</script>

<template>
  <div class="chart mx-auto w-[95%]">
    <apexchart height="300" type="area" :options="options" :series="series" />
  </div>
</template>

<style scoped></style>
