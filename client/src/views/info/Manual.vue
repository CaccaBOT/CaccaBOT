<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

const manual = ref('')
onMounted(async () => {
  const manualRaw = await (
    await fetch(
      'https://raw.githubusercontent.com/CaccaBOT/CaccaBOT-Manual/refs/heads/main/static/manual/output.md'
    )
  ).text()
  marked.use(
    markedKatex({ throwOnError: false, displayMode: true, output: 'mathml' })
  )
  manual.value = await marked.parse(manualRaw)
  document.querySelector('.manual-wrapper').innerHTML = manual.value
})
</script>

<template>
  <div class="manual-wrapper prose w-11/12 mx-auto">
    <div
      class="loader-wrapper flex h-[85vh] w-full items-center justify-center"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </div>
</template>

<style scoped>
::v-deep(p) {
  font-size: 1rem;
}

::v-deep(h2) {
  font-size: 1.7rem;
}

::v-deep(h3) {
  font-size: 1.5rem;
}

::v-deep(h4) {
  font-size: 1.2rem;
}

::v-deep(h5) {
  color: var(--tw-prose-headings);
  font-weight: 500;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}

::v-deep(h6) {
  color: var(--tw-prose-headings);
  font-weight: 500;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
  font-size: 0.882rem;
}

.manual-wrapper {
  max-width: 100%;
}
</style>
