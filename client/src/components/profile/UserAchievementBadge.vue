<script setup lang="ts">
import { useAchievementStore } from '../../stores/achievement'
import { Achievement } from '../../types/Achievement'
import { UserAchievement } from '../../types/UserAchievement'
import HeroiconsTrophy from '~icons/heroicons/trophy'
import { computed } from 'vue'
import { formatDate } from '../../utils/formatter'

const achievementStore = useAchievementStore()
const props = defineProps<{ achievement: UserAchievement }>()
const achievements = computed(() => achievementStore.achievements)

function getAchievement(id: string) {
  return achievements.value.find((a) => a.id === id)
}

function getDifficultyClass(achievement?: Achievement) {
  const difficultyMap = {
    1: 'text-rarity-common',
    2: 'text-rarity-rare',
    3: 'text-rarity-epic',
    4: 'text-rarity-legendary'
  }
  return difficultyMap[achievement?.difficulty_id] || ''
}
</script>

<template>
    <div class="achievement flex w-80 cursor-pointer flex-col items-center justify-start rounded-xl bg-base-300">
        <div class="flex items-end w-full h-20">
            <div class="icon-wrapper m-4 rounded-full bg-base-100 p-4">
                <HeroiconsTrophy class="text-xl"
                    :class="getDifficultyClass(getAchievement(achievement.achievement_id))" />
            </div>
            <div class="flex h-full w-full flex-col">
                <h4 class="mt-4 p-0 text-lg font-bold"
                    v-tooltip="getAchievement(achievement.achievement_id)?.description">
                    {{
                        getAchievement(achievement.achievement_id)?.name || "Unknown"
                    }}
                </h4>
            </div>
        </div>
        <p class="ml-auto mt-2 text-sm font-thin text-gray-400">
            {{ formatDate(achievement.timestamp) }}
        </p>
    </div>
</template>
