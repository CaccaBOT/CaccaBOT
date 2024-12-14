import { defineStore } from "pinia"
import { useAPIStore } from "./api"
import { Leaderboard } from "../types/Leaderboard"
import { Profile } from "../types/Profile"
import { useToast } from "vue-toastification"

export const useGlobalStore = defineStore("global", {
  state: () => ({
    instance: {
      name: null,
      description: null,
      version: null,
    },
    leaderboard: [] as Leaderboard,
    profile: {} as Profile,
    isFetching: false,
    selectedDate: new Date(),
  }),
  getters: {
    displayDate: (state) =>
      new Date(
        state.selectedDate.getFullYear(),
        state.selectedDate.getMonth(),
      ).toLocaleDateString("default", { year: "numeric", month: "long" }),
  },
  actions: {
    async fetchLeaderboard(year: number, month: number) {
      try {
        this.isFetching = true
        const apiStore = useAPIStore()
        let leaderboardResponse = await apiStore.client.getMonthlyLeaderboard(
          year,
          month,
        )
        this.isFetching = false
        if (leaderboardResponse.ok) {
          this.$state.leaderboard = await leaderboardResponse.json()
        }
      } catch (e) {
        const toast = useToast()
        toast.error("Failed to fetch leaderboard")
      }
    },
    async fetchProfile(id: string) {
      try {
        this.profile = {}
        this.isFetching = true
        const apiStore = useAPIStore()
        let profileResponse = await apiStore.client.getProfile(id)
        this.isFetching = false
        if (profileResponse.ok) {
          this.$state.profile = await profileResponse.json()
        }
      } catch (e) {
        const toast = useToast()
        toast.error("Failed to fetch user profile")
      }
    },
    nextMonth() {
      let year = this.selectedDate.getFullYear()
      let month = this.selectedDate.getMonth()

      if (month == 11) {
        year++
        month = 0
      } else {
        month++
      }

      this.selectedDate = new Date(year, month)
    },
    prevMonth() {
      let year = this.selectedDate.getFullYear()
      let month = this.selectedDate.getMonth()

      if (month == 0) {
        year--
        month = 11
      } else {
        month--
      }

      this.selectedDate = new Date(year, month)
    },
  },
})
