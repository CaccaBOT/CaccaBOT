<script setup lang="ts">
import { useAchievementStore } from "../../stores/achievement"
import { Achievement } from "../../types/Achievement"
import { UserAchievement } from "../../types/UserAchievement"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import { computed, ref } from "vue"
import HeroiconsChevronDown16Solid from "~icons/heroicons/chevron-down-16-solid"

const achievementStore = useAchievementStore()
const props = defineProps<{
  userAchievements: UserAchievement[]
}>()
const achievements = computed(() => achievementStore.achievements)
const isLoading = computed(() => achievements.value.length === 0)

function getAchievement(id: string) {
  return achievements.value.find((a) => a.id === id)
}

function getDifficultyClass(achievement?: Achievement) {
  const difficultyMap = {
    1: "text-rarity-common",
    2: "text-rarity-rare",
    3: "text-rarity-epic",
    4: "text-rarity-legendary",
  }

  return difficultyMap[achievement?.difficulty_id] || ""
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  const hour = date.getHours().toString().padStart(2, "0")
  const minute = date.getMinutes().toString().padStart(2, "0")
  return `${day}/${month}/${year} at ${hour}:${minute}`
}

const achievementsExpanded = ref(false)
function toggleAchievements() {
  achievementsExpanded.value = !achievementsExpanded.value
}
</script>

<template>
  <div
    v-show="userAchievements.length > 0"
    class="achievement-wrapper card mx-auto my-5 w-5/6 bg-base-200"
  >
    <div class="prose m-5">
      <h2>Achievements</h2>
    </div>

    <div
      :style="{
        height: achievementsExpanded ? 'auto' : '140px',
        overflow: achievementsExpanded ? 'visible' : 'hidden',
      }"
    >
      <div
        v-if="!isLoading"
        class="achievements flex flex-row flex-wrap justify-center"
      >
        <div
          class="achievement m-4 mb-5 flex w-80 cursor-pointer flex-row items-center justify-start rounded-xl bg-base-300 p-2"
          v-for="userAchievement of userAchievements"
          :key="userAchievement.achievement_id"
        >
          <div class="icon-wrapper m-4 rounded-full bg-base-100 p-4">
            <HeroiconsTrophy
              class="text-xl"
              :class="
                getDifficultyClass(
                  getAchievement(userAchievement.achievement_id),
                )
              "
            />
          </div>
          <div class="flex h-full w-full flex-col">
            <h4 class="mt-5 p-0 text-lg font-bold">
              {{
                getAchievement(userAchievement.achievement_id)?.name ||
                "Unknown"
              }}
            </h4>
            <p class="ml-auto mt-auto text-sm font-thin text-gray-400">
              {{ formatDate(userAchievement.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-2 w-full" @click="toggleAchievements">
      <HeroiconsChevronDown16Solid
        class="mx-auto cursor-pointer text-4xl"
        :class="{ 'rotate-180': achievementsExpanded }"
      />
    </div>
  </div>
</template>
