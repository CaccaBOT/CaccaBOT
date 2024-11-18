<script setup lang="ts">
import notFound from '../assets/404.webp'
</script>

<template>
    <div class="not-found-wrapper flex justify-center items-center h-[85vh]">
        <img alt="Page not found" :src="notFound" class="lg:w-[40vw] md:w-[60vw] w-[80vw] z-10 drop-shadow-xl">
        <div class="text-error font-black flex flex-col absolute">
            <h1 class="lg:text-[25em] md:text-[20em] text-[10em] opacity-80">404</h1>
        </div>
    </div>
</template>

<style scoped></style>
