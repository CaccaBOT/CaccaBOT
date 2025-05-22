<script setup lang="ts">
import { Ref, ref } from 'vue'

type TimeUntilNewMonth = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const newMonth = ref(
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
)

const timeUntilNewMonth: Ref = ref(setTime())
const interval = setInterval(() => {
  timeUntilNewMonth.value = setTime()
}, 1000)

function setTime(): TimeUntilNewMonth {
  let now = new Date().getTime()
  let diff = newMonth.value.getTime() - now

  if (diff <= 0) {
    clearInterval(interval)
    diff = 0
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24))
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 99) {
    return { days: 99, hours: 99, minutes: 99, seconds: 99 }
  }

  return { days, hours, minutes, seconds }
}
</script>

<template>
  <div
    class="month-reset-countdown-wrapper flex w-max flex-col flex-wrap rounded-2xl bg-base-300 p-5 text-center"
  >
    <div class="grid auto-cols-max grid-flow-col gap-5 text-center">
      <div class="flex flex-col">
        <span class="countdown font-mono text-4xl">
          <span :style="'--value:' + timeUntilNewMonth.days"></span>
        </span>
        days
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-4xl">
          <span :style="'--value:' + timeUntilNewMonth.hours"></span>
        </span>
        hours
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-4xl">
          <span :style="'--value:' + timeUntilNewMonth.minutes"></span>
        </span>
        min
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-4xl">
          <span :style="'--value:' + timeUntilNewMonth.seconds"></span>
        </span>
        sec
      </div>
    </div>
    <span class="stat-desc mt-2 text-sm">until next month</span>
  </div>
</template>

<style scoped></style>
