<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useAPIStore } from '../../stores/api'

const { client } = useAPIStore()

const logs = ref('')
const interval = ref(0)
const outputRef = ref<HTMLTextAreaElement | null>(null)
const hasScrolledInitially = ref(false)

async function refreshLogs() {
    const response = await client.getLogs()
    if (response.ok) {
        const text = await response.text()
        // Remove lines containing "GET | /api/admin/logs"
        const filtered = text
            .split('\n')
            .filter(line => !line.includes('GET | /api/admin/logs'))
            .join('\n')
        logs.value = filtered

        if (!hasScrolledInitially.value) {
            await nextTick()
            if (outputRef.value) {
                outputRef.value.scrollTop = outputRef.value.scrollHeight
            }
            hasScrolledInitially.value = true
        }
    }
}
onMounted(async () => {
    await refreshLogs()
    interval.value = setInterval(refreshLogs, 10000)
})

onUnmounted(() => {
    clearInterval(interval.value)
})
</script>

<template>
  <div class="logs-wrapper h-[85vh] w-[100vw]">
    <div class="flex flex-col w-11/12 mx-auto h-[85vh] items-center justify-between text-lg">
      <textarea
        id="output"
        v-model="logs"
        ref="outputRef"
        class="resize-none text-sm bg-base-300 outline-hidden w-full h-full rounded-lg p-2 text-green-500"
        readonly
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
textarea {
  font-family: monospace;
}
</style>
