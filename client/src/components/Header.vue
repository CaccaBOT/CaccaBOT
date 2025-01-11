<script setup lang="ts">
import { ref } from 'vue';
import router from "../router/router"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import HeroiconsBookOpen from "~icons/heroicons/book-open"
import HeroiconsChartBar from "~icons/heroicons/chart-bar"
import HeroiconsUsers from "~icons/heroicons/users"
import noPfp from "../assets/no_pfp.webp"
import { useSessionStore } from "../stores/session"
import NavMenu from "../components/NavMenu.vue"
import StreamlineCards from "~icons/streamline/cards"
import HeroiconsWrench from '~icons/heroicons/wrench'
import AkarIconsGear from '~icons/akar-icons/gear'
import SiTerminalDuotone from '~icons/si/terminal-duotone'
import FluentAppsList24Regular from '~icons/fluent/apps-list-24-regular'
import IconoirBoxIso from '~icons/iconoir/box-iso'
import WeuiShopOutlined from '~icons/weui/shop-outlined'
import HugeiconsMenu02 from '~icons/hugeicons/menu-02'

const sessionStore = useSessionStore()

function isActive(route: string): boolean {
  return router.currentRoute.value.path.startsWith(route)
}

function showLoginModal() {
  if (sessionStore.session.id == null) {
    sessionStore.showLoginModal = true
  }
}

function toggleNavMenu() {
  sessionStore.showNavMenu = !sessionStore.showNavMenu
}

function isAdmin() {
  return sessionStore.session.admin
}

interface SubsectionItem {
  label: string;
  icon: any;
  route: string;
}

interface MenuItem {
  label: string;
  icon: any;
  route: string;
  class: string;
  requiresAdmin: boolean;
  subsections?: SubsectionItem[];
}

const menuItems = ref<MenuItem[]>([
  {
    label: "Ranks",
    icon: HeroiconsTrophy,
    route: "/leaderboard",
    class: "text-primary",
    requiresAdmin: false,
  },
  {
    label: "Manual",
    icon: HeroiconsBookOpen,
    route: "/manual",
    class: "text-secondary",
    requiresAdmin: false,
  },
  {
    label: "Stats",
    icon: HeroiconsChartBar,
    route: "/stats",
    class: "text-accent",
    requiresAdmin: false,
  },
  {
    label: "Cards",
    icon: StreamlineCards,
    route: "/cards",
    class: "text-success",
    requiresAdmin: false,
    subsections: [
      {
        label: "Packs",
        icon: IconoirBoxIso,
        route: "/cards/pack",
      },
      {
        label: "Market",
        icon: WeuiShopOutlined,
        route: "/cards/market",
      },
    ],
  },
  {
    label: "Users",
    icon: HeroiconsUsers,
    route: "/users",
    class: "text-info",
    requiresAdmin: false,
  },
  {
    label: "Admin",
    icon: HeroiconsWrench,
    route: "/admin",
    class: "text-error",
    requiresAdmin: true,
    subsections: [
      {
        label: "Configuration",
        icon: AkarIconsGear,
        route: "/admin/configuration",
      },
      {
        label: "Console",
        icon: SiTerminalDuotone,
        route: "/admin/console",
      },
      {
        label: "Poop Table",
        icon: FluentAppsList24Regular,
        route: "/admin/poop-table",
      },
    ]
  }
])

</script>

<template>
  <div class="header-wrapper w-full">
    <div class="navbar navbar-start mx-auto mb-5 mt-4 w-11/12 rounded-2xl bg-base-300 shadow-2xl">
      <div class="xl:navbar-start">
        <div class="dropdown">
          <div tabindex="0" class="btn btn-ghost lg:hidden">
            <HugeiconsMenu02 class="text-xl" />
          </div>
          <ul class="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow">
            <li v-for="item in menuItems" :key="item.route" class="mx-2"
              :class="{ [item.class]: isActive(item.route), 'hidden': item.requiresAdmin && !isAdmin() }">
              <details v-if="item.subsections">
                <summary>
                  <component :is="item.icon" class="text-xl" />
                  {{ item.label }}
                </summary>
                <ul class="p-2">
                  <li v-for="sub in item.subsections" :key="sub.route">
                    <RouterLink :to="sub.route">
                      <component :is="sub.icon" class="text-xl" />
                      {{ sub.label }}
                    </RouterLink>
                  </li>
                </ul>
              </details>
              <RouterLink v-else :to="item.route">
                <component :is="item.icon" class="text-xl" />
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <RouterLink class="btn btn-ghost mr-5 text-2xl" to="/">
          CaccaBOT
        </RouterLink>
      </div>
      <div class="hidden lg:flex w-full">
        <ul class="menu menu-horizontal z-[1] w-full flex-nowrap justify-center items-center">
          <li v-for="item in menuItems" :key="item.route" class="mx-2"
            :class="{ [item.class]: isActive(item.route), 'hidden': item.requiresAdmin && !isAdmin() }">
            <details v-if="item.subsections">
              <summary>
                <component :is="item.icon" class="text-xl" />
                {{ item.label }}
              </summary>
              <ul class="p-2">
                <li v-for="sub in item.subsections" :key="sub.route">
                  <RouterLink :to="sub.route">
                    <component :is="sub.icon" class="text-xl" />
                    {{ sub.label }}
                  </RouterLink>
                </li>
              </ul>
            </details>
            <RouterLink v-else :to="item.route">
              <component :is="item.icon" class="text-xl" />
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="navbar-end cursor-pointer">
        <div @click="
          sessionStore.session.id != null ? toggleNavMenu() : showLoginModal()
          " class="avatar absolute right-[4vw]">
          <div class="w-16 rounded-full bg-base-300 ring ring-primary ring-offset-2 ring-offset-base-100">
            <img alt="CaccaBOT Logo" fetchpriority="high" :src="sessionStore.session.pfp ?? noPfp" />
          </div>
        </div>
        <NavMenu />
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  transition: all 0.25s;
}

.avatar:hover {
  transform: scale(1.1);
}
</style>
