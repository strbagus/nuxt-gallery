<script setup lang="ts">
const { title, layoutTitle } = usePageMeta()

const route = useRoute()
const reloadKey = ref(route.path)
watch(() => route.path, () => {
  reloadKey.value = route.path
})

const menus = ref([
  {
    icon: 'lucide:house',
    title: "Home",
    path: "/admin",
  },
  {
    icon: 'lucide:layout-template',
    title: "Events",
    sub: [
      {
        icon: 'lucide:table-2',
        title: "View",
        path: "/admin/events",
      }
    ]
  },
  /* {
    icon: 'lucide:layout-template',
    title: "Templates",
    sub: [
      {
        icon: 'lucide:table-2',
        title: "Table View",
        path: "/admin/template",
      },
      {
        icon: 'lucide:square-pen', // Form often uses square-pen or similar in lucide
        title: "Form",
        path: "/admin/template/form",
      }
    ]
  }, */
  {
    icon: 'lucide:sliders-horizontal',
    title: "Setting",
    path: "/admin/setting",
  }
])

const isBreakpointLg = computed(() => {
  return typeof window !== 'undefined' ? window.innerWidth > 1024 : true
})
const confirm = useConfirm()
const logout = async () => {

  const ok = await confirm.ask({
    title: 'Logout',
    message: 'Are you sure to exit this page?',
    confirmText: 'Yes',
    type: 'primary'
  })
  if (ok) {
    await navigateTo('/')
  }

}
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" :checked="isBreakpointLg">
    <div class="drawer-content flex flex-col">
      <nav class="navbar w-full shadow-lg border-b border-base-300 sticky top-0 z-10 bg-base-200">
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <Icon name="lucide:panel-left-open" size="16" />
        </label>
        <div class="px-4 grow font-bold text-lg">{{ layoutTitle }}</div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="avatar">
            <div class="w-10 cursor-pointer rounded-full bg-gray-400">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp">
            </div>
          </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2
            shadow-sm">
            <li class="my-3 px-4 font-semibold">
              Satrio Bagus
            </li>
            <li class="my-3">
              <button class="btn btn-outline btn-error btn-sm mx-2" @click="logout">
                <Icon name="lucide:log-out" size="16" />&nbsp;Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div class="px-5 py-8 grow">
        <div :key="reloadKey" class="flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <h1 class="text-2xl font-bold text-base-content">{{ title || 'Baseline' }}</h1>
          <Breadcrumb />
        </div>
        <slot />
      </div>
      <footer class="footer footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>Copyright © {{ new Date().getFullYear() }} - All right reserved by <a href="https://github.com/strbagus"
              class="link" target="_blank">strbagus</a></p>
        </aside>
      </footer>
    </div>
    <div class="drawer-side is-drawer-close:overflow-hidden">
      <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay" />
      <div class="flex h-dvh flex-col items-start bg-base-200 is-drawer-close:w-0 is-drawer-open:w-64">
        <div class="mx-auto py-4">
          <NuxtLink to="/admin" class="flex justify-center items-center">
            <img src="/favicon.ico">
            <span class="font-semibold text-xl px-3">Baseline</span>
          </NuxtLink>
        </div>
        <div class="w-full h-1 bg-linear-to-r from-base-200 via-base-300 to-base-200" />
        <ul class="menu w-full grow flex flex-nowrap overflow-y-auto">
          <SideMenu :menus />
        </ul>
        <div class="w-full h-1 bg-linear-to-r from-base-200 via-base-300 to-base-200" />
        <div class="mx-auto py-4 text-center w-full text-xs opacity-50">v1.0.0</div>

      </div>
    </div>
  </div>
</template>
