<script setup lang="ts">
import { watch } from 'vue'
import { useSettingsStore } from '../stores/settings'
const settingsStore = useSettingsStore()

watch(settingsStore.$state, () => {
    console.log('calling save')
  settingsStore.save()
}, { deep: true })
</script>

<template>
    <div class="settings-wrapper mx-auto flex w-11/12 flex-row items-center justify-between">
        <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64">
            <legend class="fieldset-legend text-lg">UI</legend>
            <label class="fieldset-label flex justify-around text-white text-lg">
                Smooth Scrolling
                <input type="checkbox" v-model="settingsStore.smoothScrolling" class="toggle toggle-success" />
            </label>
        </fieldset>
    </div>
</template>

<style scoped></style>
