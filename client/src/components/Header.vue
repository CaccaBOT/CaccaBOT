<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import router from '../router/router'
import HeroiconsTrophy from '~icons/heroicons/trophy'
import HeroiconsBookOpen from '~icons/heroicons/book-open'
import HeroiconsChartBar from '~icons/heroicons/chart-bar'
import HeroiconsUsers from '~icons/heroicons/users'
import Asset from '../types/Asset'
import { useSessionStore } from '../stores/session'
import NavMenu from '../components/NavMenu.vue'
import StreamlineCards from '~icons/streamline/cards'
import HeroiconsWrench from '~icons/heroicons/wrench'
import AkarIconsGear from '~icons/akar-icons/gear'
import SiTerminalDuotone from '~icons/si/terminal-duotone'
import FluentAppsList24Regular from '~icons/fluent/apps-list-24-regular'
import IconoirBoxIso from '~icons/iconoir/box-iso'
import WeuiShopOutlined from '~icons/weui/shop-outlined'
import HugeiconsMenu02 from '~icons/hugeicons/menu-02'
import HeroiconsOutlineRefresh from '~icons/heroicons-outline/refresh'
import RiAwardLine from '~icons/ri/award-line'
import HeroiconsInformationCircle from '~icons/heroicons/information-circle'
import { useModalStore } from '../stores/modal'
import { ModalEnum } from '../types/ModalEnum'
import { formatMoney } from '../utils/formatter'
import { MenuItem } from '../types/MenuItem'
import HeroiconsTableCells from '~icons/heroicons/table-cells'

const sessionStore = useSessionStore()
const modalStore = useModalStore()

function isActive(route: string): boolean {
  return router.currentRoute.value.path.startsWith(route)
}

function showLoginModal() {
  if (sessionStore.session.id == null) {
    modalStore.open(ModalEnum.Login)
  }
}

function toggleNavMenu() {
  sessionStore.showNavMenu = !sessionStore.showNavMenu
}

function isAdmin() {
  if (sessionStore.session.id == null) {
    return false
  }

  return sessionStore.session.admin
}

function canAccess(menuItem: MenuItem): boolean {
  return (
    (!menuItem.requiresAdmin || isAdmin()) &&
    (!menuItem.requiresAuth || sessionStore.session.id != null)
  )
}

const menuItems = ref<MenuItem[]>([
  {
    label: 'Ranks',
    icon: HeroiconsTrophy,
    route: '/leaderboard',
    class: 'text-primary',
    requiresAdmin: false,
    requiresAuth: false
  },
  {
    label: 'Info',
    icon: HeroiconsInformationCircle,
    route: '/info',
    class: 'text-secondary',
    requiresAdmin: false,
    requiresAuth: false,
    subsections: [
      {
        label: 'Manual',
        icon: HeroiconsBookOpen,
        route: '/info/manual',
        requiresAdmin: false,
        requiresAuth: false
      },
      {
        label: 'Achievements',
        icon: RiAwardLine,
        route: '/info/achievements',
        requiresAdmin: false,
        requiresAuth: false
      }
    ]
  },
  {
    label: 'Stats',
    icon: HeroiconsChartBar,
    route: '/stats',
    class: 'text-accent',
    requiresAdmin: false,
    requiresAuth: false
  },
  {
    label: 'Cards',
    icon: StreamlineCards,
    route: '/cards',
    class: 'text-success',
    requiresAdmin: false,
    requiresAuth: false,
    subsections: [
      {
        label: 'Packs',
        icon: IconoirBoxIso,
        route: '/cards/pack',
        requiresAdmin: false,
        requiresAuth: false
      },
      {
        label: 'Market',
        icon: WeuiShopOutlined,
        route: '/cards/market',
        requiresAdmin: false,
        requiresAuth: false
      },
      {
        label: 'Convert',
        icon: HeroiconsOutlineRefresh,
        route: '/cards/convert',
        requiresAdmin: false,
        requiresAuth: true
      }
    ]
  },
  {
    label: 'Users',
    icon: HeroiconsUsers,
    route: '/users',
    class: 'text-info',
    requiresAdmin: false,
    requiresAuth: false
  },
  {
    label: 'Admin',
    icon: HeroiconsWrench,
    route: '/admin',
    class: 'text-error',
    requiresAdmin: true,
    requiresAuth: true,
    subsections: [
      {
        label: 'Configuration',
        icon: AkarIconsGear,
        route: '/admin/configuration',
        requiresAdmin: true,
        requiresAuth: true
      },
      {
        label: 'Console',
        icon: SiTerminalDuotone,
        route: '/admin/console',
        requiresAdmin: true,
        requiresAuth: true
      },
      {
        label: 'Poop Table',
        icon: FluentAppsList24Regular,
        route: '/admin/poop-table',
        requiresAdmin: true,
        requiresAuth: true
      },
      {
        label: 'Logs',
        icon: HeroiconsTableCells,
        route: '/admin/logs',
        requiresAdmin: true,
        requiresAuth: true
      }
    ]
  }
])

const formattedMoney = computed(() => formatMoney(sessionStore.session.money))

onMounted(() => {
  document.querySelector('body').addEventListener('click', (event) => {
    document
      .querySelectorAll('details')
      .forEach((x) => x.removeAttribute('open'))
  })
})
</script>

<template>
  <div class="header-wrapper w-full flex">
    <div class="navbar navbar-start mx-auto mb-5 mt-4 w-11/12 rounded-2xl bg-base-300 shadow-2xl">
      <div class="xl:navbar-start flex flex-nowrap">
        <div class="dropdown">
          <div tabindex="0" class="btn btn-ghost lg:hidden">
            <HugeiconsMenu02 class="text-xl" />
          </div>
          <ul class="menu dropdown-content z-20 mt-3 w-52 rounded-box bg-base-300 p-2 shadow-sm">
            <li v-for="item in menuItems" :key="item.route" class="mx-2" :class="{
              [item.class]: isActive(item.route),
              'hidden': !canAccess(item)
            }">
              <details v-if="item.subsections">
                <summary>
                  <component :is="item.icon" class="text-xl" />
                  {{ item.label }}
                </summary>
                <ul class="p-2">
                  <li v-for="sub in item.subsections" :key="sub.route">
                    <RouterLink :to="sub.route" :class="{ 'hidden': !canAccess(sub) }">
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
        <ul class="menu menu-horizontal z-20 w-full flex-nowrap justify-center items-center">
          <li v-for="item in menuItems" :key="item.route" class="mx-2"
            :class="{ [item.class]: isActive(item.route), 'hidden': !canAccess(item) }">
            <details v-if="item.subsections">
              <summary>
                <component :is="item.icon" class="text-xl" />
                {{ item.label }}
              </summary>
              <ul class="p-2">
                <li v-for="sub in item.subsections" :key="sub.route">
                  <RouterLink :to="sub.route" :class="{ 'hidden': !canAccess(sub) }">
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
          <div class="w-16 rounded-full bg-base-300 ring-3 ring-primary ring-offset-2 ring-offset-base-100">
            <img alt="CaccaBOT Logo" fetchpriority="high" :src="sessionStore.session.pfp ?? Asset.NO_PFP" />
          </div>
        </div>
        <div v-if="sessionStore.session.id != null" class="invisible lg:visible badge badge-success mr-20 font-bold">
          {{ formattedMoney }} <img :src="Asset.MERDOLLAR" class="w-[18px]" />
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
