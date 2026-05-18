<script setup>
import { SaveIcon, XIcon } from '@lucide/vue'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const errors = reactive({})

const form = reactive({
  name: '',
  category: '',
  status: 'active',
  isActive: true,
  priority: 1,
  uptime_percentage: 100,
  tags: '',
  metadata: {
    version: '',
    owner: ''
  }
})

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (!form.name) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (form.uptime_percentage < 0 || form.uptime_percentage > 100) {
    errors.uptime_percentage = 'Uptime must be between 0 and 100'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (!validate()) return

  console.log('Form submitted:', form)
  router.push('/admin/template')
}

const handleCancel = () => {
  router.push('/admin/template')
}
const { setPageMeta } = usePageMeta()

onMounted(() => {
  setPageMeta('Template Form', [
    { label: 'Home', href: '/admin' },
    { label: 'Templates', href: '/admin/template' },
    { label: 'Form' }
  ])
})
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title mb-4 text-2xl font-bold">Sample Form</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField label="Name" required :error="errors.name" v-slot="{ id, isError }">
            <input v-model="form.name" :id="id" type="text" placeholder="e.g. Alpha Service Mesh"
              class="input input-bordered w-full" :class="{ 'input-error': isError }" />
          </FormField>

          <FormField label="Category" v-slot="{ id }">
            <input v-model="form.category" :id="id" type="text" placeholder="e.g. Infrastructure"
              class="input input-bordered w-full" />
          </FormField>

          <FormField label="Status" v-slot="{ id }">
            <select v-model="form.status" :id="id" class="select select-bordered w-full">
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </FormField>

          <FormField label="Priority" v-slot="{ id }">
            <input v-model.number="form.priority" :id="id" type="number" placeholder="1"
              class="input input-bordered w-full" />
          </FormField>

          <FormField label="Uptime (%)" :error="errors.uptime_percentage" v-slot="{ id, isError }">
            <input v-model.number="form.uptime_percentage" :id="id" type="number" step="0.01" placeholder="99.99"
              class="input input-bordered w-full" :class="{ 'input-error': isError }" />
          </FormField>

          <FormField label="Version" v-slot="{ id }">
            <input v-model="form.metadata.version" :id="id" type="text" placeholder="v1.0.0"
              class="input input-bordered w-full" />
          </FormField>

          <FormField label="Owner" v-slot="{ id }">
            <input v-model="form.metadata.owner" :id="id" type="text" placeholder="DevOps Team"
              class="input input-bordered w-full" />
          </FormField>

          <FormField label="Tags" hint="Enter tags separated by commas" v-slot="{ id }">
            <input v-model="form.tags" :id="id" type="text" placeholder="comma separated tags"
              class="input input-bordered w-full" />
          </FormField>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input v-model="form.isActive" type="checkbox" class="checkbox checkbox-primary" />
            <span class="label-text font-semibold">Is Active</span>
          </label>
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-base-200">
          <button type="button" class="btn btn-ghost" @click="handleCancel">
            <XIcon :size="18" /> Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            <SaveIcon :size="18" /> Save Template
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
