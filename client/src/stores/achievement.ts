import { defineStore } from "pinia"
import { useAPIStore } from "./api"
import { useGlobalStore } from "./global"
import { Achievement } from "../types/Achievement"

export const useAchievementStore = defineStore("achievements", {
  state: () => ({
    version: null,
    achievements: [] as Achievement[],
  }),
  actions: {
    async loadAchievements() {
        const { client } = useAPIStore()
        const globalStore = useGlobalStore()
        if (localStorage.getItem('achievements') != null) {
            const { version, achievements } = JSON.parse(localStorage.getItem('achievements'))
            if (globalStore.version === version) {
                this.achievements = achievements
                return
            }
        }

        this.achievements = await (await client.getAllAchievements()).json()
        this.version = globalStore.version
        this.saveAchievements()
    },
    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify({
            version: this.version,
            achievements: this.achievements
        }))
    }
  }
})
