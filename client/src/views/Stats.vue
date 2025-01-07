<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useGlobalStore } from "../stores/global"
import { useAPIStore } from "../stores/api"
import CirculatingMerdollars from "../components/stats/CirculatingMerdollars.vue"
import MonthResetCountdown from "../components/stats/MonthResetCountdown.vue"
import PoopCount from "../components/stats/PoopCount.vue"
import TopPooper from "../components/stats/TopPooper.vue"
import { User } from "../types/User"
import UserCount from "../components/stats/UserCount.vue"
import MonthlyPoopTreemapChart from "../components/stats/MonthlyPoopTreemapChart.vue"
import PoopLineChart from "../components/stats/PoopLineChart.vue"
import LongestStreak from "../components/stats/LongestStreak.vue"
import { useToast } from "vue-toastification"
const toast = useToast()
const globalStore = useGlobalStore()
const { client } = useAPIStore()

const stats = ref(null)

onMounted(async () => {
  try {
    const response = await client.getStats()
    if (response.ok) {
      stats.value = await response.json()
    }
  } catch (e) {
    toast.error("Failed to retrieve stats")
  }
})

const mockUser = {
  username: "iBalls",
} as User
</script>

<template>
  <div class="stats-wrapper">
    <div
      v-show="stats == null"
      class="loader-wrapper flex h-[85vh] w-full items-center justify-center"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div
      v-show="stats != null"
      class="stats-widgets prose flex flex-wrap items-center justify-center text-center"
    >
      <div class="section m-2 w-max rounded-2xl bg-base-200 p-2">
        <h1>Time</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <MonthResetCountdown />
        </div>
      </div>

      <div
        v-show="stats != null"
        class="section m-2 w-max rounded-2xl bg-base-200 p-2"
      >
        <h1>Users</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <UserCount :value="stats?.users.total" :is-monthly="false" />
          <UserCount :value="stats?.users.monthly" :is-monthly="true" />
        </div>
      </div>

      <div
        v-show="stats != null"
        class="section m-2 w-max rounded-2xl bg-base-200 p-2"
      >
        <h1>Economy</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <CirculatingMerdollars
            :value="stats?.economy.circulatingMoneyWithAssets ?? 0"
            :includes-assets="true"
          />
          <CirculatingMerdollars
            :value="stats?.economy.circulatingMoney ?? 0"
            :includes-assets="false"
          />
        </div>
      </div>

      <div
        v-show="stats != null"
        class="section m-2 w-max rounded-2xl bg-base-200 p-2"
      >
        <h1>Poops</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <PoopCount
            frequency="daily"
            :value="stats?.poopStats.daily.poops"
            :trend="stats?.poopStats.daily.trend"
          />
          <PoopCount
            frequency="weekly"
            :value="stats?.poopStats.weekly.poops"
            :trend="stats?.poopStats.weekly.trend"
          />
          <PoopCount
            frequency="monthly"
            :value="stats?.poopStats.monthly.poops"
            :trend="stats?.poopStats.monthly.trend"
          />
          <PoopCount
            frequency="total"
            :value="stats?.poopStats.total.poops"
            :trend="0"
          />
        </div>
      </div>

      <div v-show="stats" class="section m-2 w-max rounded-2xl bg-base-200 p-2">
        <h1>Top Poopers</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <TopPooper
            :user="stats?.topPoopers.daily"
            :value="stats?.topPoopers.daily?.poops"
            frequency="daily"
          />
          <TopPooper
            :user="stats?.topPoopers.weekly"
            :value="stats?.topPoopers.weekly?.poops"
            frequency="weekly"
          />
          <TopPooper
            :user="stats?.topPoopers.monthly"
            :value="stats?.topPoopers.monthly?.poops"
            frequency="monthly"
          />
          <TopPooper
            :user="stats?.topPoopers.total"
            :value="stats?.topPoopers.total?.poops"
            frequency="total"
          />
        </div>
      </div>

      <!-- <div v-show="stats" class="section m-2 w-max rounded-2xl bg-base-200 p-2">
        <h1>Streak</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <LongestStreak :user="mockUser" :value="123" />
        </div>
      </div> -->

      <div v-show="stats" class="section m-2 w-max rounded-2xl bg-base-200 p-2">
        <h1>Monthly Poop Distribution</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <MonthlyPoopTreemapChart :users="stats?.distribution" />
        </div>
      </div>

      <div v-show="stats" class="section m-2 w-max rounded-2xl bg-base-200 p-2">
        <h1>Poop Trend</h1>
        <div class="not-prose flex flex-wrap items-center justify-center">
          <PoopLineChart :poopsPerDay="stats?.poopsPerDay" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-widgets h1 {
  margin-bottom: 1vh;
}

.section div {
  margin: 5px;
}

.stats-widgets {
  max-width: 100%;
}
</style>
