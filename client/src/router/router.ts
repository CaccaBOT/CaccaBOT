import { createRouter, createWebHistory } from "vue-router"
import { useGlobalStore } from "../stores/global"
import { useSessionStore } from "../stores/session"

const routes = [
  { 
    path: "/", 
    component: () => import("../views/Home.vue"), 
    name: "home" 
  },
  { 
    path: "/stats", 
    component: () => import("../views/Stats.vue"), 
    name: "stats" 
  },
  { 
    path: "/leaderboard", 
    component: () => import("../views/Leaderboard.vue"), 
    name: "leaderboard" 
  },
  {
    path: "/leaderboard/:year/:month",
    component: () => import("../views/Leaderboard.vue"),
    name: "monthlyLeaderboard",
  },
  { 
    path: "/profile/:id", 
    component: () => import("../views/Profile.vue"), 
    name: "profile" 
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
    path: "/users", 
    component: () => import("../views/Users.vue"), 
    name: "users" 
  },
  { 
    path: "/manual", 
    component: () => import("../views/Manual.vue"), 
    name: "manual" 
  },
  { 
    path: "/cards", 
    component: () => import("../views/Cards.vue"), 
    name: "cards" 
  },
  {
    path: "/admin",
    component: () => import("../views/admin/Dashboard.vue"),
    name: "admin"
  }
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
        new Date(
          parseInt(to.params.year as string),
          parseInt(to.params.month as string),
        ),
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
  }
})

export default router
