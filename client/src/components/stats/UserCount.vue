<script setup lang="ts">
const props = defineProps<{
  value: number
  isMonthly: boolean
}>()
</script>

<template>
  <div class="user-count-wrapper w-max">
    <div class="stats bg-base-300 text-center shadow-sm">
      <div class="stat">
        <div class="stat-title">
          {{ props.isMonthly ? "Monthly" : "" }} Users
        </div>
        <div class="stat-value">{{ props.value }}</div>
        <div v-show="props.isMonthly" class="stat-desc mt-2">
          active this month
        </div>
        <div v-show="!props.isMonthly" class="stat-desc mt-2">in total</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
