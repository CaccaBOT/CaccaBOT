<script setup lang="ts">
import router from '../router/router'
import Asset from '../types/Asset'
import { useGlobalStore } from '../stores/global'
import { onBeforeUnmount, ref, watch } from 'vue'
import HeroiconsChevronLeft from '~icons/heroicons/chevron-left?width=24px&height=24px'
import HeroiconsChevronRight from '~icons/heroicons/chevron-right?width=24px&height=24px'
const globalStore = useGlobalStore()
import type { Ref } from 'vue'
import { TimeUntilNewMonth } from '../types/TimeUntilNewMonth'

const { year, month } = router.currentRoute.value.params

if (year && month) {
  globalStore.selectedDate = new Date(
    parseInt(year as string),
    parseInt(month as string) - 1
  )
} else {
  globalStore.selectedDate = new Date()
  router.replace(
    `/leaderboard/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`
  )
}

function goToProfile(id: string) {
  router.push(
    `/profile/${id}/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`
  )
}

function prevMonth() {
  globalStore.prevMonth()
  router.push(
    `/leaderboard/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`
  )
}

function nextMonth() {
  globalStore.nextMonth()
  router.push(
    `/leaderboard/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`
  )
}

const newMonth = ref(
  new Date(
    globalStore.selectedDate.getFullYear(),
    globalStore.selectedDate.getMonth() + 1,
    1
  )
)

const timeUntilNewMonth: Ref = ref(setTime())
let interval = setInterval(() => {
  timeUntilNewMonth.value = setTime()
}, 1000)

function setTime(): TimeUntilNewMonth {
  updateNewMonth()
  const MONTH_IN_MILLISECONDS = 2629746000
  if (
    globalStore.selectedDate.getTime() + MONTH_IN_MILLISECONDS <=
    new Date().getTime()
  ) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

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

function updateNewMonth() {
  newMonth.value = new Date(
    globalStore.selectedDate.getFullYear(),
    globalStore.selectedDate.getMonth() + 1,
    1
  )
}

watch(
  () => globalStore.selectedDate,
  () => {
    updateNewMonth()
    timeUntilNewMonth.value = setTime()
    clearInterval(interval)
    interval = setInterval(() => {
      timeUntilNewMonth.value = setTime()
    }, 1000)
  }
)

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="leaderboard-wrapper">
    <div
      class="header mx-auto flex w-11/12 flex-row items-center justify-between"
    >
      <HeroiconsChevronLeft
        @click="prevMonth()"
        class="btn btn-circle btn-active p-3"
      />
      <div class="mb-2 rounded-2xl bg-base-200 px-5 py-2">
        <h1 class="text-center">{{ globalStore.displayDate }}</h1>
        <div
          class="countdown-wrapper flex flex-col flex-wrap items-center justify-center"
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
        </div>
      </div>
      <HeroiconsChevronRight
        @click="nextMonth()"
        class="btn btn-circle btn-active p-3"
      />
    </div>

    <img
      alt="No poops found"
      class="mx-auto sm:w-full md:w-1/3"
      v-show="globalStore.leaderboard.length === 0 && !globalStore.isFetching"
      :src="Asset.NO_POOPS_FOUND"
    />

    <h2
      v-show="globalStore.leaderboard.length === 0 && !globalStore.isFetching"
      class="text-center text-4xl font-bold text-error"
    >
      NO POOPS FOUND
    </h2>
    <div
      v-show="globalStore.isFetching"
      class="loader-wrapper flex h-[70vh] w-full items-center justify-center"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div
      v-show="globalStore.leaderboard.length > 0 && !globalStore.isFetching"
      class="overflow-x-auto april-fools"
    >
      <table class="table-xl table w-full">
        <thead>
          <tr class="text-center text-xl">
            <th>Rank</th>
            <th>User</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in globalStore.leaderboard">
            <td class="prose text-center">
              <h3>{{ user.rank }}°</h3>
            </td>

            <td>
              <div
                class="user-cell flex items-center gap-3"
                @click="goToProfile(user.id)"
              >
                <div class="avatar">
                  <div class="mask mask-circle h-16 w-16">
                    <img alt="Profile picture" :src="user.pfp ?? Asset.NO_PFP" />
                  </div>
                </div>
                <div>
                  <div class="text-xl font-bold md:text-2xl">
                    <h2>{{ user.username }}</h2>
                  </div>
                </div>
              </div>
            </td>

            <td class="prose text-center">
              <h3>{{ user.poops }}</h3>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

.header h1 {
  font-size: 2rem;
  font-weight: bold;
}

.header h2 {
  font-size: 1.4rem;
  font-weight: bold;
}

.user-cell {
  width: 30%;
  margin: auto;
  cursor: pointer;
}

tr:nth-child(1) > td {
  background: linear-gradient(
    45deg,
    rgba(186, 148, 62, 1) 0%,
    rgba(236, 172, 32, 1) 20%,
    rgba(186, 148, 62, 1) 39%,
    rgba(249, 244, 180, 1) 50%,
    rgba(186, 148, 62, 1) 60%,
    rgba(236, 172, 32, 1) 80%,
    rgba(186, 148, 62, 1) 100%
  );
  animation: shine 2s infinite;
  background-size: 200%;
  background-position: left;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

tr:nth-child(2) > td {
  background: linear-gradient(
    45deg,
    #757575 0%,
    #9e9e9e 25%,
    #e8e8e8 50%,
    #9e9e9e 75%,
    #757575 100%
  );
  animation: shine 2s infinite;
  background-size: 200%;
  background-position: left;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

tr:nth-child(3) > td {
  background: linear-gradient(
    45deg,
    rgba(153, 101, 21, 1) 0%,
    rgba(172, 117, 35, 1) 20%,
    rgba(153, 101, 21, 1) 39%,
    rgba(186, 140, 59, 1) 50%,
    rgba(153, 101, 21, 1) 60%,
    rgba(172, 117, 35, 1) 80%,
    rgba(153, 101, 21, 1) 100%
  );
  animation: shine 2s infinite;
  background-size: 200%;
  background-position: left;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes shine {
  to {
    background-position: right;
  }
}

@media only screen and (max-width: 700px) {
  .user-cell {
    width: 100%;
  }

  .header h1 {
    font-size: 1.6rem;
    font-weight: bold;
  }
}
</style>
