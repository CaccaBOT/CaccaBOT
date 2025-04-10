<script setup lang="ts">
import Asset from "../../types/Asset"
import { User } from "../../types/User"

const props = defineProps<{
  user: User
  value: number
}>()
</script>

<template>
  <div class="longest-streak-wrapper w-max">
    <div class="stat w-max rounded-2xl bg-base-300">
      <div class="stat-figure text-secondary">
        <div class="avatar">
          <div class="w-16 rounded-full">
            <img alt="Profile picture" :src="props.user.pfp ?? Asset.NO_PFP" />
          </div>
        </div>
      </div>
      <div class="stat-title">Longest Streak</div>
      <div class="stat-value">{{ props.user.username }}</div>
      <div class="stat-desc text-secondary">
        {{ props.value }} days in a row
      </div>
    </div>
  </div>
</template>

<style scoped></style>
