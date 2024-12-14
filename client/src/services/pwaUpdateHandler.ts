//@ts-ignore
import { registerSW } from "virtual:pwa-register"
import router from "../router/router"
import { useSessionStore } from "../stores/session"

export function setupPWAUpdateListener() {
  const sessionStore = useSessionStore()
  const updateSW = registerSW({
    onNeedRefresh() {
      sessionStore.updateRequired = true
      router.push("/update")
      updateSW(true)
    },
  })
}
