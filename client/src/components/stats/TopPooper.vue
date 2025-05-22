<script setup lang="ts">
import Asset from '../../types/Asset'
import { Frequency } from '../../types/Frequency'
import { User } from '../../types/User'

const props = defineProps<{
  frequency: Frequency
  user?: User
  value: number
}>()

function getWord(frequency: Frequency) {
  if (frequency == 'weekly' || frequency == 'monthly') {
    return `this ${frequency.substring(0, frequency.length - 2)}`
  } else if (frequency == 'daily') {
    return 'today'
  } else {
    return frequency
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<template>
  <div class="top-pooper-wrapper w-max">
    <div class="stat w-max rounded-2xl bg-base-300">
      <div class="stat-figure text-secondary">
        <div class="avatar">
          <div class="w-16 rounded-full">
            <img alt="Profile picture" :src="props.user?.pfp ?? Asset.NO_PFP" />
          </div>
        </div>
      </div>
      <div class="stat-title">
        {{ capitalizeFirstLetter(props.frequency) }} Top Pooper
      </div>
      <div class="stat-value">
        {{ props.user != null ? props.user.username : "N/A" }}
      </div>
      <div v-show="props.user != null" class="stat-desc text-secondary">
        {{ props.value }} poops {{ getWord(props.frequency) }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
