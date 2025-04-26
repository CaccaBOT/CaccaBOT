import { useSessionStore } from "../stores/session"
import { OrderRequest } from "../types/OrderRequest"

export const baseURL = import.meta.env.VITE_API_URL
export const baseAPIURL = `${baseURL}/api`

export default class API {
  sessionStore = useSessionStore()

  async linkDiscord(code: string) {
    return await fetch(`${import.meta.env.VITE_API_URL}/api/auth/discord?code=${code}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.sessionStore.session.token
      }
    })
  }

  async getAssetPrice(collectibleId: number) {
    return await fetch(`${baseAPIURL}/market/price/${collectibleId}`)
  }

  async createOrder(order: OrderRequest) {
    return await fetch(`${baseAPIURL}/market/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify(order)
    })
  }

  async getPoop(id: number) {
    return await fetch(`${baseAPIURL}/poop/${id}`)
  }

  async deletePoop(id: number) {
    return await fetch(`${baseAPIURL}/admin/poop/${id}`, {
      method: "DELETE",
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async getCollectible(id: number) {
    return await fetch(`${baseAPIURL}/collectible/${id}`)
  }

  async getAllCollectibles() {
    return await fetch(`${baseAPIURL}/collectible/list`)
  }

  async convertCollectibles(collectibles: number[]) {
    return await fetch(`${baseAPIURL}/collectible/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        collectibles,
      }),
    })
  }

  async getAllUsers() {
    return await fetch(`${baseAPIURL}/instance/users`, {
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async getPoops(offset: Number) {
    return await fetch(`${baseAPIURL}/admin/poops?offset=${offset}`, {
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async getAllAchievements() {
    return await fetch(`${baseAPIURL}/achievement`)
  }

  async getUserAchievements(userId: string) {
    return await fetch(`${baseAPIURL}/achievement/${userId}`)
  }

  async getInstanceInfo() {
    return await fetch(`${baseAPIURL}/instance/info`)
  }

  async login(username: string, password: string) {
    return await fetch(`${baseAPIURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    })
  }

  async logout(token: string) {
    return await fetch(`${baseAPIURL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
      }),
    })
  }

  async changeUsername(username: string) {
    return await fetch(`${baseAPIURL}/profile/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        username,
      }),
    })
  }

  async changePassword(password: string) {
    return await fetch(`${baseAPIURL}/auth/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        password,
      }),
    })
  }

  async changePfp(base64Pfp: string) {
    return await fetch(`${baseAPIURL}/profile/pfp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        image: base64Pfp,
      }),
    })
  }

  async openPack() {
    return await fetch(`${baseAPIURL}/collectible/open`, {
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async removePfp() {
    return await fetch(`${baseAPIURL}/profile/pfp`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({}),
    })
  }

  async getMonthlyLeaderboard(year: number, month: number) {
    return await fetch(`${baseAPIURL}/poop/leaderboard/${year}/${month}`)
  }

  async getLeaderboard() {
    return await fetch(`${baseAPIURL}/poop/leaderboard`)
  }

  async getProfile(id: string) {
    return await fetch(`${baseAPIURL}/profile/${id}`)
  }

  async getOwnProfile() {
    return await fetch(`${baseAPIURL}/profile`, {
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async getStats() {
    return await fetch(`${baseAPIURL}/poop/stats`)
  }

  async getUserCollectibles(id: string) {
    return await fetch(`${baseAPIURL}/collectible/inventory/${id}`)
  }

  async getUserStats(id: string) {
    return await fetch(`${baseAPIURL}/poop/stats/${id}`)
  }

  async getMonthlyUserStats(id: string, year: number, month: number) {
    return await fetch(`${baseAPIURL}/poop/stats/${id}/${year}/${month}`)
  }

  async searchProfile(username: string) {
    return await fetch(`${baseAPIURL}/profile/search?username=${username}`)
  }

  async getPoopsFromUser(id: string) {
    return await fetch(`${baseAPIURL}/poop/user/${id}`)
  }

  async getMonthlyPoopsFromUser(id: string, year: number, month: number) {
    return await fetch(`${baseAPIURL}/poop/user/${id}/${year}/${month}`)
  }

  async getMonthlyPoops(date = new Date()) {
    return await fetch(
      `${baseAPIURL}/poop/all/${date.getFullYear()}/${date.getMonth()}`,
    )
  }
}
