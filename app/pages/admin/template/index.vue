<script setup>
import { PlusIcon } from '@lucide/vue'

definePageMeta({
  layout: 'admin'
})

const toast = useToast()
const confirm = useConfirm()
const route = useRoute()
const { setPageMeta } = usePageMeta()

const fetchData = (params) => {
  // Use runtimeConfig if possible, but keeping Axios for now as requested/existing
  return MainService.get("/data-list.json", { params: { ...params } })
}

const tbColumns = [
  {
    data: "name",
    label: "Name",
    sortable: true,
    searchable: true
  },
  {
    data: "status",
    label: "Status",
    searchable: true,
  },
  {
    data: "priority",
    label: "Priority",
    classHeader: "justify-end",
    classContent: "text-end",
    sortable: true,
  },
  {
    data: "uptime_percentage",
    label: "Uptime(%)",
    classHeader: "justify-end",
    classContent: "text-end",
    info: "Persentase Service Menyala",
    sortable: true,
  },
  {
    data: "metadata",
    label: "Metadata",
  },
  {
    data: "actions",
    label: "Actions",
    classContent: "text-center"
  }
]

const tbOptions = {
  serverSide: false,
  numbering: true,
}

const extraParams = reactive({
  category: "",
  status: "",
})

onMounted(() => {
  setPageMeta('Table Template', [
    { label: 'Home', href: '/admin' },
    { label: 'Templates' },
    { label: 'Table View' }
  ])
  if (route.query.status) extraParams.status = route.query.status.toString()
  if (route.query.category) extraParams.category = route.query.category.toString()
})

const handleClear = () => {
  Object.assign(extraParams, {
    category: "",
    status: "",
  })
}

const deleteItem = async () => {
  const ok = await confirm.ask({
    title: 'Delete Record',
    message: 'This will permanently remove record. Continue?',
    confirmText: 'Yes, Delete',
    type: 'error'
  })

  if (ok) {
    try {
      toast.success('Record deleted')
    } catch (_e) {
      toast.error('Failed to delete')
    }
  }
}
</script>
<template>
  <div>
    <div class="flex justify-between items-center mb-4 gap-4">
      <div class="flex gap-2">
        <select v-model="extraParams.status" class="select select-bordered select-sm">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="deprecated">Deprecated</option>
        </select>
        <input v-model="extraParams.category" type="text" class="input input-bordered input-sm"
          placeholder="Filter category...">
      </div>
    </div>
    <div>
      <DataTable :columns="tbColumns" :options="tbOptions" :fetch-data="fetchData" :extra-params="extraParams"
        @clear="handleClear">
        <template #topright>
          <NuxtLink to="/admin/template/form" class="btn btn-primary btn-sm">
            <PlusIcon :size="16" /> Tambah
          </NuxtLink>
        </template>

        <template #cell(name)="{ item }">
          <div class="flex flex-col">
            <span class="font-bold text-base-content">{{ item.name }}</span>
            <span class="text-xs opacity-50">{{ item.category }}</span>
            <div class="flex gap-2 flex-wrap mt-2">
              <span v-for="tag in item.tags" :key="tag" class="badge badge-sm badge-primary">{{ tag }}</span>
            </div>
          </div>
        </template>

        <template #cell(status)="{ value }">
          <div class="badge badge-sm" :class="{
            'badge-success': value === 'active',
            'badge-warning': value === 'maintenance',
            'badge-error': value === 'deprecated'
          }">
            {{ value }}
          </div>
        </template>
        <template #cell(uptime_percentage)="{ value }">
          <span>{{ value.toFixed(2) }}%</span>
        </template>
        <template #cell(metadata)="{ item }">
          <ul>
            <li>Version:&nbsp; <span class="badge">{{ item.metadata.version }}</span></li>
            <li>Owner:&nbsp; <span class="badge">{{ item.metadata.owner }}</span></li>
            <li>Created At:&nbsp; <span class="badge">{{ item.created_at }}</span></li>
            <li>Updated At:&nbsp; <span class="badge">{{ item.updated_at }}</span></li>
          </ul>
        </template>

        <template #cell(actions)="{ item }">
          <div class="flex gap-2 justify-center">
            <button class="btn btn-ghost btn-xs text-info" @click="console.log('Edit', item.id)">Edit</button>
            <button class="btn btn-ghost btn-xs text-error" @click="deleteItem(item.id)">Delete</button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
