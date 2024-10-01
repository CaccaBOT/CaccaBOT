import { defineStore } from "pinia"
import API from "../services/API"

export const useAPIStore = defineStore("api", {
  state: () => ({
    client: new API(),
  }),
})
