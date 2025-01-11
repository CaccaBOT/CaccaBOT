<script setup lang="ts">
import notFound from "../assets/404.webp"
</script>

<template>
  <div class="not-found-wrapper flex h-[85vh] items-center justify-center">
    <img
      alt="Page not found"
      :src="notFound"
      class="w-[80vw] drop-shadow-xl md:w-[60vw] lg:w-[40vw]"
    />
    <div class="absolute flex flex-col font-black text-error z-[-1]">
      <h1 class="text-[10em] opacity-80 md:text-[20em] lg:text-[25em]">404</h1>
    </div>
  </div>
</template>

<style scoped></style>
