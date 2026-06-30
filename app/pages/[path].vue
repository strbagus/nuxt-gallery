<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
const s3Url = (import.meta.env.VITE_S3_URL || 'https://s3.strbagus.my.id/gallery').replace(/\/$/, '')
const items: any = ref([])
const isLoad = ref(false)
const page = ref(1)
const hasMore = ref(true)
const route = useRoute()
const sentinel = ref(null)
const selectedImage = ref(null)
const isZoomed = ref(false)
const isImgLoaded = ref(false)
const event: any = ref({})

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

// Reset state when image changes or closes
watch(selectedImage, () => {
  isZoomed.value = false
  isImgLoaded.value = false
})

const getData = async (slug: any) => {
  if (isLoad.value || !hasMore.value) return

  isLoad.value = true
  try {
    const limit = 25
    const req = await PhotoService.get(`/photos/${slug}?limit=${limit}&page=${page.value}`)
    const newData = req.data.data

    if (newData.length < limit) {
      hasMore.value = false
    }

    items.value = [...items.value, ...newData]
    page.value++
  } catch (e) {
    console.log("err: ", e)
  } finally {
    isLoad.value = false
  }
}

const getEvent = async (slug: any) => {
  try {
    const req = await PhotoService.get(`/events/${slug}`)
    event.value = req.data.data
  } catch (e) {
    console.log("err: ", e)
  }
}

onMounted(() => {
  // isLoad.value = true
  getEvent(route.params.path)
  getData(route.params.path)

  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      getData(route.params.path)
    }
  }, { rootMargin: '200px' })

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})
</script>
<template>
  <div class="max-w-450 mx-auto px-6 pt-12 pb-8">
    <a href="/"
      class="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-cyan-400 transition mb-6 group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      BACK TO CATALOG
    </a>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end border-b border-slate-800 pb-8">

      <div class="md:col-span-2 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span
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
            {{ event.name }}
          </h1>
          <p class="text-slate-400 text-base max-w-2xl leading-relaxed">
            {{ event.description }}
          </p>
        </div>
      </div>

      <div
        class="flex flex-col space-y-2 font-mono text-xs text-slate-400 md:justify-self-end w-full
        md:w-auto md:min-w-70 bg-base-200/50 p-4 rounded-lg border border-slate-800/60">
        <div class="flex justify-between border-b border-slate-800/50 pb-1.5">
          <span class="text-slate-500 uppercase">Date</span>
          <span class="text-slate-200">{{ formatDate(event.date) || 'null' }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-800/50 pb-1.5">
          <span class="text-slate-500 uppercase">Total</span>
          <span class="text-slate-200">{{ event.total_photos }} Photos</span>
        </div>
        <div class="flex justify-between pt-0.5">
          <span class="text-slate-500 uppercase">Slug Hash</span>
          <span class="text-cyan-400/90">{{ event.slug }}</span>
        </div>
      </div>

    </div>
  </div>
  <div class="flex flex-wrap max-w-450 mx-auto">
    <div v-if="isLoad" v-for="_ in 7" class="w-1/2 sm:w-1/3 md:w-1/4 p-1 sm:p-5">
      <div class="flex w-full flex-col">
        <div class="skeleton h-64 w-full"></div>
      </div>
    </div>
    <div v-for="(i, idx) in items" :key="idx" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">

      <figure class="relative aspect-4/3 overflow-hidden bg-no-repeat bg-cover bg-center cursor-pointer"
        @click="selectedImage = i"
        :style="{ backgroundImage: `url('${s3Url}/previews/${route.params.path}/sm_${i}')` }">
        <img loading=lazy :src="`${s3Url}/previews/${route.params.path}/md_${i}`"
          class="w-full h-full object-cover transition duration-500 hover:scale-105" :alt="'Image of ' + i">

        <div class="absolute bottom-0 w-full">
          <div class="w-full bg-black/70 text-end">
            <p class="text-sm italic">{{ idx + 1 }} of {{ items.length }}</p>
          </div>
        </div>
      </figure>
    </div>
    <div ref="sentinel" class="w-full h-20 flex justify-center items-center">
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
          <button class="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200
            transition cursor-pointer">
            Download HD
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
