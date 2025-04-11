import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"
import { VitePWA } from "vite-plugin-pwa"
import { viteStaticCopy } from "vite-plugin-static-copy"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Icons({
      compiler: "vue3",
      autoInstall: true,
    }),
    VitePWA({
      registerType: "prompt",
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
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^\/public\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "public-assets",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 12, // 12 hours
              },
            },
          },
          {
            urlPattern: /\/docs$/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "robots.txt",
          dest: ".",
        },
      ],
    }),
  ],
})
