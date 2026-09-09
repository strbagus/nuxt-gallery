<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
const s3Url = (import.meta.env.VITE_S3_URL || 'https://s3.strbagus.my.id/gallery').replace(/\/$/, '')
const isLoad = ref(true)

const items: any = ref([])
const metadata: any = ref({})
const filters = ['public', 'all']
const activeFilter = ref('public')
const page = ref(1)

const totalPages = computed(() => {
  const total = metadata.value?.total || 0
  return Math.ceil(total / 9)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const numbers: (number | string)[] = []
  for (let i = 1; i <= total; i++) {
    if (i == 1 || i == total || Math.abs(page.value - i) <= 2) {
      numbers.push(i)
    } else if (Math.abs(page.value - i) == 3) {
      numbers.push("...")
    }
  }
  return numbers
})

const getData = async () => {
  isLoad.value = true
  try {
    setTimeout(() => { }, 500)
    const req = await PhotoService.get("events", {
      params: {
        page: page.value,
        limit: 9,
        order_by: 'created_at',
        order_dir: 'desc',
        is_private: activeFilter.value === 'all' ? undefined : (activeFilter.value === 'private' ? 1 : 0)
      }
    })
    items.value = req.data.data
    metadata.value = req.data.metadata
  } catch (e) {
    console.log("err: ", e)
  } finally {
    isLoad.value = false
  }
}

watch(page, () => {
  getData()
})

watch(activeFilter, () => {
  if (page.value === 1) {
    getData()
  } else {
    page.value = 1
  }
})

onMounted(() => {
  getData()
})

</script>


<template>
  <div class="max-w-7xl mx-auto px-6 pt-6 sm:pt-32 pb-10">
    <main class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-10">
      <div class="md:col-span-2 space-y-3">
        <h1 class="text-4xl font-extrabold text-slate-100 tracking-tight sm:text-5xl">
          Lens of <span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-sky-400">Moments</span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-xl">
          A structured digital archive documenting visual fragments, workspaces, and cultural heritage. Every collection
          serves as a snapshot of time, preserved in high fidelity.
        </p>
      </div>

    </main>

    <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-850">
      <div class="flex gap-2 text-xs font-medium">
        <button v-for="f in filters" @click="activeFilter = f" :class="[
          'px-3 py-1.5 rounded-md transition capitalize',
          activeFilter === f
            ? 'bg-slate-800 text-cyan-400 border border-slate-700/50'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent cursor-pointer'
        ]">{{ f }}</button>
      </div>
      <span class="text-xs font-mono text-slate-500">
        Showing {{ items.length }} of {{ metadata.total }} Catalogs
      </span>
    </div>

  </div>
  <div class="flex flex-wrap max-w-7xl mx-auto justify-center">
    <div v-if="isLoad" v-for="_ in 3" class="w-full sm:w-1/2 md:w-1/3 p-1 sm:p-3 md:p-5">
      <div class="flex w-full flex-col gap-4">
        <div class="skeleton h-64 w-full"></div>
        <div class="skeleton h-4 w-28"></div>
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
      </div>
    </div>
    <div v-else v-for="i in items" class="w-full sm:w-1/2 md:w-1/3 p-1 sm:p-3 md:p-5">
      <NuxtLink :to="i.is_private ? '#' : i.slug" :class="i.is_private && 'cursor-not-allowed'">
        <div class=" group">
          <figure class="relative aspect-4/3 overflow-hidden bg-gray-700 rounded-lg">
            <img loading="lazy" :src="`${s3Url}/previews/${i.slug}/md_${i.thumbnail}`"
              class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              :alt="'Image of ' + i.name">
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="badge bg-black/60 text-white border-0 backdrop-blur-sm text-xs">
                <Icon name="lucide:camera" /> {{ i.total_photos }} Photos
              </span>
              <span v-if="i.is_private" class="badge bg-black/60 text-white border-0
                backdrop-blur-sm text-xs">
                <Icon name="lucide:lock-keyhole" /> Private
              </span>
            </div>
          </figure>
          <div class="px-5 pt-1 pb-3 text-center">
            <h2 class="font-semibold group-hover:opacity-85 duration-300">{{ i.name }}</h2>
            <div class="text-xs text-cyan-300 mt-1 group-hover:opacity-90 duration-300">
              <Icon name="lucide:calendar" /> {{ formatDate(i.date) }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
  <div v-if="totalPages > 1" class="flex flex-wrap max-w-7xl mx-auto justify-center items-center gap-1 mt-6">
    <button :disabled="page === 1" @click="page--"
      class="px-3 py-1.5 rounded-md text-xs transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400">
      « Prev
    </button>
    <button v-for="i in pageNumbers" :key="i" :disabled="i === '...'" @click="typeof i === 'number' ? page = i : null"
      :class="[
        'px-3 py-1.5 rounded-md text-xs transition capitalize',
        page === i
          ? 'bg-slate-800 text-cyan-400 border border-slate-700/50'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent cursor-pointer'
      ]">
      {{ i }}
    </button>
    <button :disabled="page === totalPages" @click="page++"
      class="px-3 py-1.5 rounded-md text-xs transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400">
      Next »
    </button>
  </div>
</template>
