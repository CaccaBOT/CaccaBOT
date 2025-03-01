<script setup lang="ts">
import { Frequency } from "../../types/Frequency"

const props = defineProps<{
  frequency: Frequency
  value: number
  trend: number
}>()

function getWord(frequency: Frequency) {
  if (frequency == "weekly" || frequency == "monthly") {
    return `last ${frequency.substring(0, frequency.length - 2)}`
  } else {
    return "yesterday"
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<template>
  <div class="poop-count-wrapper w-max">
    <div class="stats bg-base-300 shadow-sm">
      <div class="stat text-center">
        <div class="stat-title">
          {{ capitalizeFirstLetter(props.frequency) }} Poops
        </div>
        <div
          class="stat-value"
          :class="
            props.frequency != 'total'
              ? props.trend > 0
                ? 'text-success'
                : 'text-error'
              : ''
          "
        >
          {{ props.value }}
        </div>
        <div v-show="props.frequency != 'total'" class="stat-desc">
          {{ Math.abs(props.trend) }}%
          {{ props.trend > 0 ? "more" : "less" }} than
          {{ getWord(props.frequency) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
