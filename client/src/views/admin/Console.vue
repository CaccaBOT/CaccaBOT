<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSessionStore } from '../../stores/session'
const sessionStore = useSessionStore()

const username = ref(sessionStore.session.username)
const context = ref('')
const promptPrefix = ref(`${username.value} -> `)
const prompt = ref('')
const memory = ref<string[]>([])
const index = ref(-1)

function printBanner() {
  context.value += `Welcome to the Admin console\n`
  context.value += `Type 'help' to see the available commands\n`
}

function callMemory(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    if (index.value >= memory.value.length - 1) return
    index.value++
    prompt.value = memory.value[index.value]
    return
  }

  if (event.key === 'ArrowDown') {
    if (index.value > 0) {
      index.value--
      prompt.value = memory.value[index.value]
      return
    }

    index.value = -1
    prompt.value = ''
  }
}

function execute() {
  if (prompt.value.trim() === '') return
  context.value += `${promptPrefix.value}${prompt.value}\n`
  memory.value.unshift(prompt.value)
  index.value = -1
  prompt.value = ''

  const output = document.querySelector('#output') as HTMLTextAreaElement
  if (output) output.scrollTop = output.scrollHeight
}

onMounted(() => {
  ;(document.querySelector('#prompt') as HTMLInputElement)?.focus()
  printBanner()
})
</script>

<template>
  <div class="admin-console-wrapper h-[85vh] w-[100vw]">
    <div class="flex flex-col w-11/12 mx-auto h-[85vh] items-center justify-between text-lg">
      <textarea id="output" v-model="context"
        class="resize-none bg-neutral-950 outline-hidden w-full h-full rounded-tl-lg rounded-tr-lg p-2 text-green-500" readonly></textarea>
        <hr>
        <form class="w-full" @submit.prevent="execute">
          <input id="prompt" @keydown="callMemory" v-model="prompt" class="w-full bg-neutral-950 outline-hidden rounded-br-lg rounded-bl-lg p-2 text-green-500" type="text">
        </form>
    </div>
  </div>
</template>

<style scoped>
input, textarea {
  font-family: monospace;
}
</style>
