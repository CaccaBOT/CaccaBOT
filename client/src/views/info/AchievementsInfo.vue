<script setup lang="ts">
import AchievementBadge from '../../components/AchievementBadge.vue'
import { useAchievementStore } from '../../stores/achievement'

const achievementStore = useAchievementStore()
const sortedAchievements = achievementStore.achievements.sort((a, b) => b.difficulty_id - a.difficulty_id)
</script>

<template>
  <div class="achievements-wrapper w-11/12 mx-auto flex flex-wrap justify-center gap-4 mb-4">
    <div v-for="achievement in sortedAchievements" :key="achievement.id">
      <AchievementBadge :achievement="achievement" />
    </div>
  </div>
</template>

<style scoped>

</style>
