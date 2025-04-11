import { createRouter, createWebHistory } from "vue-router"
import { useGlobalStore } from "../stores/global"
import { useSessionStore } from "../stores/session"

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    name: "home",
  },
  {
    path: "/stats",
    component: () => import("../views/Stats.vue"),
    name: "stats",
  },
  {
    path: "/leaderboard",
    component: () => import("../views/Leaderboard.vue"),
    name: "leaderboard",
  },
  {
    path: "/leaderboard/:year/:month",
    component: () => import("../views/Leaderboard.vue"),
    name: "monthlyLeaderboard",
  },
  {
    path: "/profile/:id",
    component: () => import("../views/Profile.vue"),
    name: "profile",
  },
  {
    path: "/profile/:id/:year/:month",
    component: () => import("../views/Profile.vue"),
    name: "monthlyProfile",
  },
  {
    path: "/profile/own",
    component: () => import("../views/Profile.vue"),
    name: "ownProfile",
  },
  {
    path: "/settings",
    component: () => import("../views/Settings.vue"),
    name: "settings",
  },
  {
    path: "/users",
    component: () => import("../views/Users.vue"),
    name: "users",
  },
  {
    path: "/info/manual",
    component: () => import("../views/info/Manual.vue"),
    name: "manualInfo",
  },
  {
    path: "/info/achievements",
    component: () => import("../views/info/AchievementsInfo.vue"),
    name: "achievementsInfo",
  },
  {
    path: "/cards/pack",
    component: () => import("../views/cards/Cards.vue"),
    name: "cards",
  },
  {
    path: "/cards/market",
    component: () => import("../views/cards/Market.vue"),
    name: "market",
  },
  {
    path: "/cards/market/order/:id",
    component: () => import("../views/cards/Order.vue"),
    name: "order",
  },
  {
    path: "/cards/convert",
    component: () => import("../views/cards/Convert.vue"),
    name: "convert",
  },
  {
    path: "/admin/configuration",
    component: () => import("../views/admin/Dashboard.vue"),
    name: "configuration",
  },
  {
    path: "/admin/console",
    component: () => import("../views/admin/Console.vue"),
    name: "console",
  },
  {
    path: "/admin/poop-table",
    component: () => import("../views/admin/PoopTable.vue"),
    name: "poopTable",
  },
  {
    path: "/update",
    component: () => import("../views/Updater.vue"),
    name: "update",
  },
  {
    path: "/poop/:id",
    component: () => import("../views/PoopCertificate.vue"),
    name: "poopCertificate"
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFound.vue"),
    name: "notFound",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(async (to, from) => {
  const globalStore = useGlobalStore()
  const sessionStore = useSessionStore()
  sessionStore.showMobileNavbar = false
  switch (to.name) {
    case "monthlyLeaderboard":
      await globalStore.fetchLeaderboard(
        parseInt(to.params.year as string),
        parseInt(to.params.month as string),
      )
      break
    case "monthlyProfile":
      globalStore.selectedDate = new Date(
        parseInt(to.params.year as string),
        parseInt(to.params.month as string) - 1,
      )
      await globalStore.fetchProfile(to.params.id as string)
      break
    case "profile":
      globalStore.selectedDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
      )
      await globalStore.fetchProfile(to.params.id as string)
      break
    case "ownProfile":
      if (!sessionStore.session.id) {
        router.push("/")
        return
      }
      globalStore.selectedDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
      )
      await globalStore.fetchProfile(sessionStore.session.id as string)
      break
    case "update":
      if (!sessionStore.updateRequired) {
        router.push("/")
        return
      }
  }
})

export default router
