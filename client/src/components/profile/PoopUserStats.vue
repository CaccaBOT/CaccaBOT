<script setup lang="ts">
import { useGlobalStore } from "../../stores/global"
import { UserStats } from "../../types/UserStats"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import HeroiconsFire from "~icons/heroicons/fire"
import HeroiconsChartBar from "~icons/heroicons/chart-bar"
import MaterialSymbolsExposurePlus1Rounded from "~icons/material-symbols/exposure-plus-1-rounded"

const props = defineProps<{
  stats: UserStats
}>()
const globalStore = useGlobalStore()
</script>

<template>
  <div
    v-show="stats.monthlyLeaderboardPosition != null"
    class="card stats mx-auto my-5 flex w-5/6 bg-base-200 text-center shadow-sm sm:flex-col md:flex-row"
  >
    <div class="stat">
      <div class="stat-figure text-sky-500">
        <HeroiconsTrophy class="text-xl" />
      </div>
      <div class="stat-title">Leaderboard</div>
      <div class="stat-value text-sky-500">
        #{{ stats.monthlyLeaderboardPosition }}
      </div>
      <div class="stat-desc">{{ globalStore.displayDate }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-red-500">
        <MaterialSymbolsExposurePlus1Rounded class="text-2xl" />
      </div>
      <div class="stat-title">Count</div>
      <div class="stat-value text-red-500">{{ stats.monthlyPoops }}</div>
      <div class="stat-desc">{{ globalStore.displayDate }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-yellow-500">
        <HeroiconsFire class="text-xl" />
      </div>
      <div class="stat-title">Streak</div>
      <div class="stat-value text-yellow-500">{{ stats.streak }}</div>
      <div class="stat-desc">days in a row</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-green-500">
        <HeroiconsChartBar />
      </div>
      <div class="stat-title">Daily AVG</div>
      <div class="stat-value text-green-500">{{ stats.poopAverage }}</div>
      <div class="stat-desc">{{ globalStore.displayDate }}</div>
    </div>
  </div>
</template>

<style scoped></style>
