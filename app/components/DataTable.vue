<script setup lang="ts">
interface Column {
  data: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  classHeader?: string;
  classContent?: string;
  info?: string;
}

interface Options {
  serverSide: boolean;
  numbering?: boolean;
}

const props = withDefaults(defineProps<{
  columns: Column[];
  options: Options;
  fetchData: (params: Record<string, any>) => Promise<any>;
  extraParams?: Record<string, any>;
}>(), {
  extraParams: () => ({})
})

const emit = defineEmits(['clear'])

const isLoading = ref(false)
const data = ref<any[]>([])
const paramDefault = () => ({
  limit: 10,
  page: 1,
  search: '',
  orderBy: '',
  orderDir: ''
})
const params = reactive(paramDefault())
const isClearing = ref(false)

const meta = reactive({
  total: 0
})

const page = computed(() => {
  const totalPage = Math.ceil(meta.total / params.limit)
  const numbers: (number | string)[] = []
  for (let i = 1; i <= totalPage; i++) {
    if (i == 1 || i == totalPage || Math.abs(params.page - i) <= 3) {
      numbers.push(i)
    } else if (Math.abs(params.page - i) == 4) {
      numbers.push("...")
    }
  }
  const rStart = meta.total === 0 ? 0 : params.limit * (params.page - 1) + 1
  const rEnd = Math.min(params.page * params.limit, meta.total)
  return { totalPage, numbers, rStart, rEnd }
})

const searchBy = computed(() => {
  return props.columns
    .filter(n => n.searchable)
    .map(n => n.data)
    .filter(Boolean)
    .join(',')
})

const loadData = async () => {
  isLoading.value = true
  try {
    const payload = {
      limit: params.limit || 10,
      page: params.page || 1,
      order_by: params.orderBy || undefined,
      order_dir: params.orderDir || undefined,
      search: params.search || undefined,
      search_by: searchBy.value || undefined,
      ...props.extraParams
    }
    const res = await props.fetchData(payload)
    data.value = res.data.data || []
    meta.total = res.data.metadata?.total || res.data.data?.length || 0
  } catch (e) {
    console.error("[FETCH] error: ", e)
  } finally {
    isLoading.value = false
  }
}

const resolveValue = (obj: any, path: string) => {
  if (!path) return '';
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

const router = useRouter()
const route = useRoute()

onMounted(() => {
  loadData()
  params.limit = Number(route.query.limit) || 10
  params.page = Number(route.query.page) || 1
  params.orderBy = route.query.order_by?.toString() || ''
  params.orderDir = route.query.order_dir?.toString() || ''
  params.search = route.query.search?.toString() || ''
})

const filteredData = computed(() => {
  let result = [...data.value]
  if (!props.options.serverSide) {
    if (params.search !== '') {
      result = result.filter((item) => {
        return props.columns.some(col => {
          if (!col.searchable || !col.data) return false;
          const val = resolveValue(item, col.data);
          return val !== undefined && val !== null && String(val).toLowerCase().includes(params.search.toLowerCase());
        });
      });
    }

    if (props.extraParams) {
      result = result.filter((item) => {
        return Object.entries(props.extraParams!).every(([key, value]) => {
          if (value === null || value === undefined || value === '') return true;
          const itemValue = resolveValue(item, key);
          return String(itemValue).toLowerCase() === String(value).toLowerCase();
        });
      });
    }

    if (params.orderBy) {
      result = result.sort((a, b) => {
        const valueA = resolveValue(a, params.orderBy);
        const valueB = resolveValue(b, params.orderBy);

        if (valueA === valueB) return 0;
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          const comparison = valueA.localeCompare(valueB);
          return params.orderDir === 'asc' ? comparison : -comparison;
        }

        if (valueA < valueB) return params.orderDir === 'asc' ? -1 : 1;
        if (valueA > valueB) return params.orderDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
  return result
})

// Update meta.total when filteredData changes (only for client-side)
watch(filteredData, (newData) => {
  if (!props.options.serverSide) {
    meta.total = newData.length
  }
}, { immediate: true })

const comData = computed(() => {
  let result = filteredData.value
  if (!props.options.serverSide) {
    const start = (params.page - 1) * params.limit
    const end = start + params.limit
    result = result.slice(start, end)
  }
  return result
})


let debounceTimer: any = null
watch(
  () => ({ ...params, ...props.extraParams }),
  (newParams) => {
    if (isClearing.value) return

    const query = { ...route.query }

    const updateOrDelete = (key: string, val: any, defaultVal: any = undefined) => {
      if (val !== undefined && val !== null && val !== '' && val !== defaultVal) {
        query[key] = val
      } else {
        delete (query as any)[key]
      }
    }

    updateOrDelete('limit', newParams.limit, 10)
    updateOrDelete('page', newParams.page, 1)
    updateOrDelete('order_by', newParams.orderBy)
    updateOrDelete('order_dir', newParams.orderDir)
    updateOrDelete('search', newParams.search)

    if (newParams.search && searchBy.value) {
      (query as any).search_by = searchBy.value
    } else {
      delete (query as any).search_by
    }

    if (props.extraParams) {
      Object.keys(props.extraParams).forEach(key => {
        updateOrDelete(key, props.extraParams![key])
      })
    }

    router.replace({ query })

    if (props.options.serverSide) {
      isLoading.value = true
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        loadData()
      }, 500)
    }
  },
  { deep: true }
)

const handleClear = async () => {
  isClearing.value = true
  Object.assign(params, paramDefault())
  emit('clear')
  await router.push({ query: {} })
  isClearing.value = false
}

const handleSort = (c: string) => {
  params.orderBy = c
  if (params.orderDir == '') {
    params.orderDir = 'asc'
  } else if (params.orderDir == 'desc') {
    params.orderBy = ''
    params.orderDir = ''
  } else {
    params.orderDir = 'desc'
  }
}
</script>


<template>
  <div>
    <div class="flex justify-between my-3">
      <div class="flex items-end gap-2">
        <label class="input input-sm">
          <Icon name="lucide:search" size="16" />
          <input v-model="params.search" type="search" placeholder="Search..." @input="params.page = 1">
        </label>
        <span class="link text-base-content italic opacity-65 text-sm cursor-pointer" @click="handleClear">clear</span>
      </div>
      <div>
        <slot name="topright" />
      </div>
    </div>
    <div class="relative overflow-hidden">
      <div v-if="isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-base-100/60 backdrop-blur-[1px] transition-opacity">
        <div class="flex flex-col items-center gap-2">
          <span class="loading loading-dots loading-md" />
          <span class="text-sm font-medium text-base-content/70">Loading data...</span>
        </div>
      </div>
      <div :class="{ 'opacity-50 pointer-events-none': isLoading }" class="transition-all duration-300">
        <div class="overflow-x-auto shadow-lg">
          <table class="table table-zebra">
            <thead>
              <tr class="bg-base-300 text-base-content">
                <th v-if="props.options.numbering" class="w-5 justify-center">No</th>
                <th v-for="h in columns" :key="h.data" :class="[h.sortable ? 'cursor-pointer' : '']"
                  @click="h.sortable ? handleSort(h.data) : null">
                  <div class="flex items-center gap-1" :class="h.classHeader">
                    <div v-if="h.info" class="tooltip tooltip-bottom" :data-tip="h.info">
                      <Icon name="lucide:info" size="14" class="text-info cursor-help" @click.stop />
                    </div>
                    <span>{{ h.label }}</span>
                    <template v-if="h.sortable">
                      <Icon v-if="params.orderBy != h.data" name="lucide:arrow-down-up" size="16" class="text-gray-400" />
                      <template v-else>
                        <Icon v-if="params.orderDir == 'desc'" name="lucide:arrow-down-narrow-wide" size="16" />
                        <Icon v-else name="lucide:arrow-up-narrow-wide" size="16" />
                      </template>
                    </template>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in comData" :key="item.id || idx">
                <td v-if="props.options.numbering" class="text-center">
                  {{ (params.page - 1) * params.limit + (idx + 1) }}
                </td>
                <template v-for="h in columns" :key="h.data">
                  <td :class="h.classContent">
                    <slot :name="`cell(${h.data})`" :value="resolveValue(item, h.data)" :item="item">
                      {{ resolveValue(item, h.data) }}
                    </slot>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-between mt-3 gap-3">
        <div v-if="comData.length > 0" class="grow text-sm">Showing {{ page.rStart }} - {{ page.rEnd }} record from
          total {{
            meta.total }} records. </div>
        <div v-else class="grow text-sm">No record found.</div>
        <div class="join">
          <button class="join-item btn btn-sm" :disabled="params.page == 1" @click="params.page--">«</button>
          <button v-for="i in page.numbers" :key="i" class="join-item btn btn-sm"
            :disabled="params.page == i || i == '...'" @click="typeof i === 'number' ? params.page = i : null">{{ i
            }}</button>
          <button class="join-item btn btn-sm" :disabled="params.page == page.totalPage || page.totalPage === 0"
            @click="params.page++">»</button>
        </div>
        <select v-model="params.limit" class="select select-sm w-20" @change="params.page = 1">
          <option :value="10">10 / page</option>
          <option :value="25">25 / page</option>
          <option :value="50">50 / page</option>
          <option :value="100">100 / page</option>
        </select>
      </div>
    </div>
  </div>
</template>
