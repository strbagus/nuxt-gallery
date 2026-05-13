<script setup lang="ts">
import { ArrowDownNarrowWide, ArrowDownUp, ArrowUpNarrowWide, Search } from '@lucide/vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  columns: { type: Array<any>, required: true },
  options: { type: Object, required: true },
  fetchData: { type: Function, required: true },
  extraParams: { type: Object, required: false }
})

const isLoading = ref(false)
const data = ref([])
const paramDefault = () => ({
  limit: 10,
  page: 1,
  search: '',
  orderBy: '',
  orderDir: ''
})
const params = reactive(paramDefault())

const meta = reactive({
  total: 50
})

const page = computed(() => {
  const totalPage = Math.ceil(meta.total / params.limit)
  const numbers = []
  for (let i = 1; i <= totalPage; i++) {
    if (i == 1 || i == totalPage || Math.abs(params.page - i) <= 3) {
      numbers.push(i)
    }
    if (Math.abs(params.page - i) == 4) {
      numbers.push("...")
    }
  }
  const rStart = params.limit * params.page - (params.limit - 1)
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
    console.log("[FETCH] error: ", e)
  } finally {
    isLoading.value = false
  }
}

const resolveValue = (obj: any, path: string) => {
  if (!path) return '';
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

onMounted(() => {
  loadData()
  params.limit = Number(route.query.limit) || 10
  params.page = Number(route.query.page) || 1
  params.orderBy = route.query.order_by?.toString() || ''
  params.orderDir = route.query.order_dir?.toString() || ''
  params.search = route.query.search?.toString() || ''
})

const comData = computed(() => {
  let result: any[] = data.value
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
    meta.total = result.length

    if (params.orderBy) {
      result = [...result].sort((a, b) => {
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

    const start = (params.page - 1) * params.limit
    const end = start + params.limit
    result = result.slice(start, end)
  }
  return result
})

const router = useRouter()
const route = useRoute()

let debounceTimer = null
watch(
  () => ({ ...params, ...props.extraParams }),
  (newParams) => {
    const cleanExtraParams = props.extraParams ? Object.fromEntries(
      Object.entries(props.extraParams).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    ) : {}

    router.replace({
      query: {
        ...route.query,
        limit: newParams.limit || 10,
        page: newParams.page || 1,
        order_by: newParams.orderBy || undefined,
        order_dir: newParams.orderDir || undefined,
        search: newParams.search || undefined,
        search_by: searchBy.value || undefined,
        ...cleanExtraParams
      }
    })
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

const handleSort = (c: any) => {
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
          <Search :size="16" />
          <input type="search" v-model="params.search" @input="params.page = 1" placeholder="Search..." />
        </label>
        <span class="link text-base-content italic opacity-65 text-sm"
          @click="router.push({ query: {} }); Object.assign(params, paramDefault())">clear</span>
      </div>
      <div>
        <slot name="topright" />
      </div>
    </div>
    <div class="relative overflow-hidden">
      <div v-if="isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-base-100/60 backdrop-blur-[1px] transition-opacity">
        <div class="flex flex-col items-center gap-2">
          <span class="loading loading-dots loading-md"></span>
          <span class="text-sm font-medium text-base-content/70">Loading data...</span>
        </div>
      </div>
      <div :class="{ 'opacity-50 pointer-events-none': isLoading }" class="transition-all duration-300">
        <div class="overflow-x-auto shadow-lg">
          <table class="table table-zebra">
            <thead>
              <tr class="bg-base-300 text-base-content">
                <th v-if="props.options.numbering" class="w-5 justify-center">No</th>
                <th v-for="h in columns" :class="[h.classHeader, h.sortable ? 'cursor-pointer' : 'pointer-events-none']"
                  @click="handleSort(h.data)">
                  <div class="flex items-center gap-1">
                    <span>{{ h.label }}</span>
                    <template v-if="h.sortable">
                      <ArrowDownUp v-if="params.orderBy != h.data" :size="16" color="gray" />
                      <template v-else>
                        <ArrowDownNarrowWide v-if="params.orderDir == 'desc'" :size="16" />
                        <ArrowUpNarrowWide v-else :size="16" />
                      </template>
                    </template>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in comData">
                <td v-if="props.options.numbering" class="text-center">
                  {{ (params.page - 1) * params.limit + (idx + 1) }}
                </td>
                <template v-for="h in columns">
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
        <div v-if="comData.length > 0" class="grow">Showing {{ page.rStart }} - {{ page.rEnd }} record from total {{
          meta.total }} records. </div>
        <div v-else class="grow">No record found.</div>
        <div class="join">
          <button class="join-item btn btn-sm" @click="params.page--" :disabled="params.page == 1">«</button>
          <button v-for="i in page.numbers" class="join-item btn btn-sm" :disabled="params.page == i || i == '...'"
            @click="params.page = i">{{ i }}</button>
          <button class="join-item btn btn-sm" @click="params.page++"
            :disabled="params.page == page.totalPage">»</button>
        </div>
        <select v-model="params.limit" @change="params.page = 1" class="select select-sm w-16">
          <option :value="10" selected>10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>
