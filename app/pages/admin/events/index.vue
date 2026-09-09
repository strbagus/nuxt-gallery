<script setup>
definePageMeta({
  layout: 'admin'
})
const { origin } = useRequestURL()
const { setPageMeta } = usePageMeta()

const fetchData = (params) => {
  return PhotoService.get("events/with-salt", { params: { ...params } })
}

const tbColumns = [
  {
    data: "name",
    label: "Name",
    sortable: true,
    searchable: true
  },
  {
    data: "actions",
    label: "Actions",
    classContent: "text-center"
  }
]

const tbOptions = {
  serverSide: true,
  numbering: true,
}

const copyToClipboard = async (isPrivate, slug, salt) => {
  let text = `${origin}/${slug}`
  isPrivate && (text += `?token=${salt}`)
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

onMounted(() => {
  setPageMeta('Table Events')
})

</script>
<template>
  <div>
    <div>
      <DataTable :columns="tbColumns" :options="tbOptions" :fetch-data="fetchData" :server-side="true">

        <template #cell(name)="{ item }">
          <div class="flex flex-col">
            <span class="font-bold text-base-content">{{ item.name }} <span v-if="item.is_private ==
              1" class="badge badge-info badge-xs">Private</span></span>
            <span class="text-xs opacity-70">{{ item.description }}</span>
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
            <button class="btn btn-ghost btn-xs text-info"
              @click="copyToClipboard(item.is_private, item.slug, item.salt)">Copy Link</button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
