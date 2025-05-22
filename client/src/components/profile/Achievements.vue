<script setup lang="ts">
import { useAchievementStore } from '../../stores/achievement'
import { UserAchievement } from '../../types/UserAchievement'
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import HeroiconsChevronDown16Solid from '~icons/heroicons/chevron-down-16-solid'
import { gsap } from 'gsap'
import AchievementBadge from './UserAchievementBadge.vue'

const achievementStore = useAchievementStore()
const props = defineProps<{ userAchievements: UserAchievement[] }>()
const achievements = computed(() => achievementStore.achievements)
const isLoading = computed(() => achievements.value.length === 0)

const achievementsExpanded = ref(false)

function toggleAchievements() {
  achievementsExpanded.value = !achievementsExpanded.value
}

function animateAchievements(expanded: boolean) {
  nextTick(() => {
    gsap.to('.achievements-container', {
      height: expanded ? 'auto' : '140px',
      duration: 0.5,
      ease: 'power2.inOut',
      overflow: 'hidden'
    })
  })
}

watch(achievementsExpanded, (newVal) => {
  animateAchievements(newVal)
})

onMounted(() => {
  animateAchievements(achievementsExpanded.value)
})
</script>

<template>
  <div
    v-show="userAchievements.length > 0"
    class="achievement-wrapper card mx-auto my-5 w-5/6 bg-base-200"
  >
    <div class="prose m-5">
      <h2>Achievements</h2>
    </div>

    <div class="achievements-container" style="height: 140px; overflow: hidden;">
      <div
        v-if="!isLoading"
        class="achievements flex flex-row flex-wrap justify-center"
      >
        <div
          class="achievement m-4 mb-5 flex w-80 cursor-pointer flex-row items-center justify-start rounded-xl bg-base-300 p-2"
          v-for="userAchievement of userAchievements"
          :key="userAchievement.achievement_id"
        >
        <AchievementBadge :achievement="userAchievement" />
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
