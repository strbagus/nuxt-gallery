<script setup>
import DataTable from '@/components/DataTable.vue'
import { MainService } from '@/services/Axios'
import { PlusIcon } from '@lucide/vue'
import { reactive } from 'vue'

const fetchData = (params) => {
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
    classHeader: "text-end",
    classContent: "text-end",
    sortable: true,
  },
  {
    data: "uptime_percentage",
    label: "Uptime(%)",
    info: "Makin tinggi makin baik",
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
</script>
<template>
  <div class="flex justify-between items-center mb-4 gap-4">
    <div class="flex gap-2">
      <select v-model="extraParams.status" class="select select-bordered select-sm">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="maintenance">Maintenance</option>
        <option value="deprecated">Deprecated</option>
      </select>
      <input type="text" v-model="extraParams.category" class="input input-bordered input-sm"
        placeholder="Filter category...">
    </div>
  </div>
  <div>
    <DataTable :columns="tbColumns" :options="tbOptions" :fetch-data="fetchData" :extra-params="extraParams">
      <template v-slot:topright>
        <RouterLink to="/template/form" class="btn btn-primary btn-sm">
          <PlusIcon :size="16" /> Tambah
        </RouterLink>
      </template>

      <template #cell(name)="{ item }">
        <div class="flex flex-col">
          <span class="font-bold text-base-content">{{ item.name }}</span>
          <span class="text-xs opacity-50">{{ item.category }}</span>
          <div class="flex gap-2 flex-wrap mt-2">
            <span v-for="tag in item.tags" class="badge badge-sm badge-primary">{{ tag }}</span>
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
          <button class="btn btn-ghost btn-xs text-error" @click="console.log('Delete', item.id)">Delete</button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
