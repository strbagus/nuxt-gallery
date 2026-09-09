<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

interface FetchError {
  statusCode?: number
  message: string
}

const s3Url = (import.meta.env.VITE_S3_URL || 'https://s3.strbagus.com/gallery').replace(/\/$/, '')
const items: any = ref([])
const isLoad = ref(false)
const page = ref(1)
const hasMore = ref(true)
const fetchError = ref<FetchError | null>(null)
const tokenInput = ref('')

const route = useRoute()
const router = useRouter()
const sentinel = ref<HTMLElement | null>(null)
const selectedImage = ref<string | null>(null)
const isZoomed = ref(false)
const isImgLoaded = ref(false)
const isDownloading = ref(false)
const event: any = ref({})

let observer: IntersectionObserver | null = null

const currentToken = computed(() => {
  return (route.query.token as string) || tokenInput.value || ''
})

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

// Reset state when image changes or closes
watch(selectedImage, () => {
  isZoomed.value = false
  isImgLoaded.value = false
  isDownloading.value = false
})

const downloadHD = async () => {
  if (!selectedImage.value || isDownloading.value) return
  isDownloading.value = true
  try {
    const params: Record<string, any> = {}
    if (currentToken.value) {
      params.token = currentToken.value
    }
    const req = await PhotoService.get(`/photos/${route.params.path}/original/${selectedImage.value}`, { params })
    const { url: downloadUrl, filename } = req.data.data

    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename || selectedImage.value
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (e) {
    console.error("Failed to download HD photo:", e)
  } finally {
    isDownloading.value = false
  }
}

const getData = async (slug: any) => {
  if (isLoad.value || !hasMore.value || fetchError.value) return

  isLoad.value = true
  try {
    const limit = 25
    const params: Record<string, any> = {
      limit,
      page: page.value
    }
    if (currentToken.value) {
      params.token = currentToken.value
    }

    const req = await PhotoService.get(`photos/${slug}`, { params })
    const newData = req.data?.data || []

    if (newData.length < limit) {
      hasMore.value = false
    }

    items.value = [...items.value, ...newData]
    page.value++
    fetchError.value = null
  } catch (e: any) {
    console.error("Failed to load photos:", e)
    const status = e?.response?.status
    if (status === 403) {
      hasMore.value = false
      fetchError.value = {
        statusCode: 403,
        message: 'This archive is private. A valid access token is required.'
      }
    } else if (status === 404) {
      hasMore.value = false
      fetchError.value = {
        statusCode: 404,
        message: 'Gallery not found.'
      }
    } else {
      fetchError.value = {
        statusCode: status || 500,
        message: e?.response?.data?.message || 'Failed to load photos. Please try again.'
      }
    }
  } finally {
    isLoad.value = false
  }
}

const getEvent = async (slug: any) => {
  try {
    const params: Record<string, any> = {}
    if (currentToken.value) {
      params.token = currentToken.value
    }
    const req = await PhotoService.get(`events/${slug}`, { params })
    event.value = req.data?.data || {}
  } catch (e) {
    console.error("Failed to load event details:", e)
  }
}

const retry = () => {
  fetchError.value = null
  hasMore.value = true
  getData(route.params.path)
}

const submitToken = () => {
  if (!tokenInput.value.trim()) return
  router.push({
    query: {
      ...route.query,
      token: tokenInput.value.trim()
    }
  })
}

// Watch for token query changes in route
watch(
  () => route.query.token,
  (newToken) => {
    tokenInput.value = (newToken as string) || ''
    items.value = []
    page.value = 1
    hasMore.value = true
    fetchError.value = null
    getEvent(route.params.path)
    getData(route.params.path)
  }
)

// Watch sentinel element to re-attach observer if sentinel remounts
watch(sentinel, (el) => {
  if (el && observer) {
    observer.observe(el)
  }
})

onMounted(() => {
  if (route.query.token) {
    tokenInput.value = route.query.token as string
  }

  getEvent(route.params.path)
  getData(route.params.path)

  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && !isLoad.value && hasMore.value && !fetchError.value) {
      getData(route.params.path)
    }
  }, { rootMargin: '200px' })

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
<template>
  <div class="max-w-450 mx-auto px-6 pt-12 pb-8">
    <NuxtLink to="/"
      class="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-cyan-400 transition mb-6 group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      BACK TO CATALOG
    </NuxtLink>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end border-b border-slate-800 pb-8">

      <div class="md:col-span-2 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="event.location"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ event.location }}
          </span>
          <span
            class="px-2.5 py-0.5 rounded text-xs font-medium bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 tracking-wide uppercase">
            {{ event.is_private == 1 ? "Private" : "Public" }} Archive
          </span>
        </div>

        <div class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl">
            {{ event.name || route.params.path }}
          </h1>
          <p v-if="event.description" class="text-slate-400 text-base max-w-2xl leading-relaxed">
            {{ event.description }}
          </p>
        </div>
      </div>

      <div
        class="flex flex-col space-y-2 font-mono text-xs text-slate-400 md:justify-self-end w-full
        md:w-auto md:min-w-70 bg-base-200/50 p-4 rounded-lg border border-slate-800/60">
        <div class="flex justify-between border-b border-slate-800/50 pb-1.5">
          <span class="text-slate-500 uppercase">Date</span>
          <span class="text-slate-200">{{ formatDate(event.date) || '-' }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-800/50 pb-1.5">
          <span class="text-slate-500 uppercase">Total</span>
          <span class="text-slate-200">{{ event.total_photos ?? items.length }} Photos</span>
        </div>
        <div class="flex justify-between pt-0.5">
          <span class="text-slate-500 uppercase">Slug Hash</span>
          <span class="text-cyan-400/90">{{ event.slug || route.params.path }}</span>
        </div>
      </div>

    </div>
  </div>

  <!-- Initial Error / 403 / 404 States when no items have been loaded -->
  <div v-if="fetchError && items.length === 0" class="max-w-md mx-auto px-6 py-16 text-center">
    <!-- 403 Forbidden: Private Archive State -->
    <div v-if="fetchError.statusCode === 403" class="bg-base-200/50 border border-slate-800 p-8 rounded-2xl space-y-4">
      <div class="w-14 h-14 mx-auto rounded-full bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
        <Icon name="lucide:lock-keyhole" class="w-7 h-7" />
      </div>
      <div class="space-y-1">
        <h3 class="text-xl font-bold text-slate-100">Private Archive</h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          {{ fetchError.message }}
        </p>
      </div>
      <form @submit.prevent="submitToken" class="space-y-3 pt-2">
        <div class="flex gap-2">
          <input
            v-model="tokenInput"
            type="text"
            placeholder="Enter access token..."
            class="input input-sm flex-1 bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
          />
          <button
            type="submit"
            :disabled="!tokenInput.trim() || isLoad"
            class="btn btn-sm bg-cyan-500 hover:bg-cyan-400 text-black border-0 font-semibold disabled:opacity-50"
          >
            Unlock
          </button>
        </div>
      </form>
    </div>

    <!-- 404 Not Found -->
    <div v-else-if="fetchError.statusCode === 404" class="bg-base-200/50 border border-slate-800 p-8 rounded-2xl space-y-4">
      <div class="w-14 h-14 mx-auto rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400">
        <Icon name="lucide:folder-x" class="w-7 h-7" />
      </div>
      <div class="space-y-1">
        <h3 class="text-xl font-bold text-slate-100">Archive Not Found</h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          The requested archive could not be found.
        </p>
      </div>
      <NuxtLink to="/" class="btn btn-sm btn-outline border-slate-700 text-slate-300 hover:bg-slate-800">
        Back to Catalog
      </NuxtLink>
    </div>

    <!-- Other Errors -->
    <div v-else class="bg-base-200/50 border border-slate-800 p-8 rounded-2xl space-y-4">
      <div class="w-14 h-14 mx-auto rounded-full bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-400">
        <Icon name="lucide:alert-triangle" class="w-7 h-7" />
      </div>
      <div class="space-y-1">
        <h3 class="text-xl font-bold text-slate-100">Unable to Load Archive</h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          {{ fetchError.message }}
        </p>
      </div>
      <button @click="retry" class="btn btn-sm bg-cyan-500 hover:bg-cyan-400 text-black border-0 font-semibold">
        Try Again
      </button>
    </div>
  </div>

  <!-- Photo Grid -->
  <div v-else class="flex flex-wrap max-w-450 mx-auto">
    <!-- Initial Loading Skeletons -->
    <template v-if="isLoad && items.length === 0">
      <div v-for="n in 8" :key="'init-skel-' + n" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-1 sm:p-2">
        <div class="skeleton aspect-4/3 w-full rounded-none"></div>
      </div>
    </template>

    <!-- Photo Items -->
    <div v-for="(i, idx) in items" :key="idx" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
      <figure class="relative aspect-4/3 overflow-hidden bg-no-repeat bg-cover bg-center cursor-pointer"
        @click="selectedImage = i"
        :style="{ backgroundImage: `url('${s3Url}/previews/${route.params.path}/sm_${i}')` }">
        <img loading="lazy" :src="`${s3Url}/previews/${route.params.path}/md_${i}`"
          class="w-full h-full object-cover transition duration-500 hover:scale-105" :alt="'Image of ' + i">

        <div class="absolute bottom-0 w-full">
          <div class="w-full bg-black/70 text-end">
            <p class="text-sm italic">{{ idx + 1 }} of {{ items.length }}</p>
          </div>
        </div>
      </figure>
    </div>

    <!-- Subsequent Page Loading Skeletons -->
    <template v-if="isLoad && items.length > 0">
      <div v-for="n in 4" :key="'more-skel-' + n" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-1 sm:p-2">
        <div class="skeleton aspect-4/3 w-full rounded-none opacity-60"></div>
      </div>
    </template>

    <!-- Error on subsequent page (items already present) -->
    <div v-if="fetchError && items.length > 0" class="w-full py-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
      <span>Failed to load additional photos: {{ fetchError.message }}</span>
      <button @click="retry" class="btn btn-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30">
        Retry
      </button>
    </div>

    <!-- End of catalog message -->
    <div v-if="!hasMore && !isLoad && items.length > 0" class="w-full py-8 text-center text-xs font-mono text-slate-500">
      // END OF CATALOG &bull; {{ items.length }} PHOTOS LOADED //
    </div>

    <!-- Sentinel for Infinite Scroll -->
    <div v-if="hasMore && !fetchError" ref="sentinel" class="w-full h-20 flex justify-center items-center">
      <p v-if="isLoad" class="text-gray-500 italic">Loading more...</p>
    </div>

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <div v-if="selectedImage" class="fixed inset-0 z-50 flex flex-col bg-black/95" @click.self="selectedImage = null">

        <!-- Header / Controls -->
        <div class="flex justify-between items-center p-4 text-white">
          <p class="text-sm font-medium truncate max-w-[50%]">{{ selectedImage }}</p>
          <div class="flex items-center gap-4">
            <button @click="toggleZoom" class="p-2 hover:bg-white/10 rounded-full transition"
              :title="isZoomed ? 'Zoom Out' : 'Zoom In'">
              <span v-if="!isZoomed" class="text-2xl">🔍+</span>
              <span v-else class="text-2xl">🔍-</span>
            </button>
            <button @click="selectedImage = null"
              class="p-2 hover:bg-white/10 rounded-full transition text-3xl line-height-none">&times;</button>
          </div>
        </div>

        <!-- Image Container -->
        <div class="flex-1 overflow-auto flex items-center justify-center p-4" @click.self="selectedImage = null">

          <img :src="`${s3Url}/previews/${route.params.path}/lg_${selectedImage}`"
            @click="toggleZoom" @load="isImgLoaded = true"
            class="transition-all duration-500 shadow-2xl bg-cover bg-center bg-no-repeat" :style="{
              backgroundImage: `url('${s3Url}/previews/${route.params.path}/sm_${selectedImage}')`,
              opacity: isImgLoaded ? 1 : 0
            }" :class="[
              isZoomed ? 'max-w-none max-h-none cursor-zoom-out' : 'max-w-full max-h-[80vh] object-contain cursor-zoom-in'
            ]" :alt="'Large image of ' + selectedImage">
        </div>

        <!-- Footer / Actions -->
        <div class="p-6 flex justify-center gap-4 bg-black/40 backdrop-blur-sm">
          <button @click="downloadHD" :disabled="isDownloading" class="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200
            transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isDownloading ? 'Downloading...' : 'Download HD' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
