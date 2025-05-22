import { defineStore } from 'pinia'
import API from '../services/API'
import { io, Socket } from 'socket.io-client'

export const useAPIStore = defineStore('api', {
  state: () => ({
    client: new API(),
    socket: null as Socket | null
  }),

  actions: {
    initSocket() {
      if (!this.socket) {
        this.socket = io(import.meta.env.VITE_API_URL)
      }
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    }
  }
})
