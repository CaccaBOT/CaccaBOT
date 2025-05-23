import { createApp } from 'vue'
import './style.css'
import router from './router/router'
import VueApexCharts from 'vue3-apexcharts'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import { setupPWAUpdateListener } from './services/pwaUpdateHandler'
import Tooltip from '@programic/vue3-tooltip'
import '@programic/vue3-tooltip/dist/index.css'

export const color =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

createApp(App)
  .use(router)
  .use(VueApexCharts)
  .use(Tooltip)
  .use(createPinia())
  .use(createHead())
  .use(Toast, {
    timeout: 2500,
    position: POSITION.TOP_CENTER
  } as PluginOptions)
  .mount('#app')

setupPWAUpdateListener()
