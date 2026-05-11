<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue';
import { Form, House, LayoutTemplate, LogOutIcon, Moon, PanelLeftOpen, SlidersHorizontal, Sun, Table2 } from '@lucide/vue';
import { computed, ref } from 'vue';

const menus = ref([
  {
    icon: House,
    title: "Home",
    path: "/",
  },
  {
    icon: SlidersHorizontal,
    title: "Setting",
    path: "/setting",
  },
  {
    icon: LayoutTemplate,
    title: "Templates",
    sub: [
      {
        icon: Table2,
        title: "Table View",
        path: "/template",
      },
      {
        icon: Form,
        title: "Form",
        path: "/template/form",
      }
    ]
  }
])
const isBreakpointLg = computed(() => {
  return window.innerWidth > 1024
})

</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" :checked="isBreakpointLg" />
    <div class="drawer-content flex flex-col">
      <nav class="navbar w-full bg-base-300">
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <PanelLeftOpen :size="16" />
        </label>
        <div class="px-4 grow">The Sound Project</div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="avatar">
            <div class="w-10 cursor-pointer rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li class="my-3">
              Satrio Bagus
            </li>
            <li class="my-3">
              <label class="swap swap-rotate">
                <input type="checkbox" class="theme-controller" value="dark" checked />
                <Sun class="swap-on" />
                <Moon class="swap-off" />
              </label>
            </li>
            <li class="my-3"><button class="btn btn-outline btn-error">
                <LogOutIcon />&nbsp;Logout
              </button></li>
          </ul>
        </div>
      </nav>
      <div class="px-5 py-8 grow">
        <slot />
      </div>
      <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>Copyright © {{ new Date().getFullYear() }} - All right reserved by <a href="https://github.com/strbagus"
              class="link" target="_blank">strbagus</a></p>
        </aside>
      </footer>
    </div>
    <div class="drawer-side is-drawer-close:overflow-hidden">
      <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="flex h-dvh flex-col items-start bg-base-200 is-drawer-close:w-0 is-drawer-open:w-64">
        <div class="mx-auto py-4">
          <a href="/" class="flex justify-center items-center">
            <img src="/favicon.ico" />
            <span class="font-semibold text-xl px-3">Baseline</span>
          </a>
        </div>
        <div class="w-full h-1 bg-linear-to-r from-base-200 via-base-300 to-base-200"></div>
        <ul class="menu w-full grow flex flex-nowrap overflow-y-auto">
          <SideMenu :menus />
        </ul>
        <div class="w-full h-1 bg-linear-to-r from-base-200 via-base-300 to-base-200"></div>
        <div class="mx-auto py-4">Halo</div>

      </div>
    </div>
  </div>
</template>
