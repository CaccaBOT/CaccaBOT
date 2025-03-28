import { defineStore } from "pinia"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    smoothScrolling: true
  }),
  getters: {},
  actions: {
    save() {
      localStorage.setItem("settings", JSON.stringify(this.state))
    },
    load() {
      const settings = localStorage.getItem("settings") ?? null
      if (!settings) {
        return
      }
      this.state = JSON.parse(settings)
    }
  },
})
