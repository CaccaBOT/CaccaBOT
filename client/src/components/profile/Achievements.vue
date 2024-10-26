<script setup lang="ts">
import { useAchievementStore } from '../../stores/achievement';
import { Achievement } from '../../types/Achievement';
import { UserAchievement }  from '../../types/UserAchievement'
import HeroiconsTrophy from "~icons/heroicons/trophy"
const achievementStore = useAchievementStore()
const props = defineProps<{
    userAchievements: UserAchievement[]
}>()
const achievements = achievementStore.achievements
function getAchievement(id: string) {
  return achievements.find(a => a.id === id)
}

function getDifficultyClass(achievement: Achievement) {
  let difficultyMap = {
    1: "text-rarity-common",
    2: "text-rarity-rare",
    3: "text-rarity-epic",
    4: "text-rarity-legendary",
  }

  return difficultyMap[achievement.difficulty_id]
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} at ${hour}:${minute}`
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
        class="achievements flex flex-row flex-wrap justify-center"
      >
        <div
          class="achievement w-80 flex flex-row justify-start items-center m-4 p-2 rounded-xl mb-5 cursor-pointer bg-base-300"
          v-for="userAchievement of userAchievements"
        >
        <div class="icon-wrapper m-4 p-4 bg-base-100 rounded-full">
          <HeroiconsTrophy class="text-xl" :class="getDifficultyClass(getAchievement(userAchievement.achievement_id))" />
        </div>
        <div class="flex flex-col w-full h-full">
          <h4 class="p-0 font-bold text-lg mt-5">{{ getAchievement(userAchievement.achievement_id).name }}</h4>
          <p class="text-sm font-thin text-gray-400 ml-auto mt-auto">{{ formatDate(userAchievement.timestamp) }}</p>
        </div>

        </div>
      </div>
    </div>
</template>

<style scoped>

</style>
