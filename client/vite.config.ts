import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: "vue3",
      autoInstall: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CaccaBOT",
        short_name: "CaccaBOT",
        description:
          "Interact with the CaccaBOT ecosystem with a simple WebApp",
        theme_color: "#646EE4",
        background_color: "#1D232A",
        icons: [
          {
            src: "pwa-192x192.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "pwa-512x512.webp",
            sizes: "512x512",
            type: "image/webp",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
})
