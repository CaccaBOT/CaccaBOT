import { defineStore } from "pinia"
import { Session } from "../types/Session"
import { useAPIStore } from "./api"

export const useSessionStore = defineStore("session", {
  state: () => ({
    session: {} as Session,
    showLoginModal: false,
    showNavMenu: false,
    showChangePasswordModal: false,
    showChangeUsernameModal: false,
    showChangePfpModal: false,
    showMobileNavbar: false,
    showChangeThemeModal: false
  }),
  getters: {},
  actions: {
    save() {
      localStorage.setItem("token", this.session.token)
    },
    async load() {
      const token = localStorage.getItem("token") ?? null
      if (!token) {
        return
      }
      this.session.token = token
      const { client } = useAPIStore()
      this.session = await (await client.getOwnProfile()).json()
      this.session.token = token
    },
    async logout() {
      const { client } = useAPIStore()
      await client.logout(this.session.token)
      this.session = {}
      localStorage.removeItem("token")
    },
  },
})
