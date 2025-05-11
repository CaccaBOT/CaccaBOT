<script setup lang="ts">
import { onMounted, ref } from "vue"
import { marked } from "marked"
import markedKatex from "marked-katex-extension"

const lore = ref("")
onMounted(async () => {
  const loreRaw = await (
    await fetch(
      "https://raw.githubusercontent.com/CaccaBOT/CaccaBOT-Manual/refs/heads/main/static/origin/origin.md",
    )
  ).text()
  marked.use(
    markedKatex({ throwOnError: false, displayMode: true, output: "mathml" }),
  )
  lore.value = await marked.parse(loreRaw)
  document.querySelector(".lore-wrapper").innerHTML = lore.value
})
</script>

<template>
  <div class="lore-wrapper prose w-11/12 mx-auto">
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

.lore-wrapper {
  max-width: 100%;
}
</style>
