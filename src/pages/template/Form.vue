<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { SaveIcon, XIcon } from '@lucide/vue'

const router = useRouter()

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

const handleSubmit = () => {
  console.log('Form submitted:', form)
  router.push('/template')
}

const handleCancel = () => {
  router.push('/template')
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title mb-4 text-2xl font-bold">Sample Form</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Name</span>
            </label>
            <input v-model="form.name" type="text" placeholder="e.g. Alpha Service Mesh"
              class="input input-bordered w-full" required />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Category</span>
            </label>
            <input v-model="form.category" type="text" placeholder="e.g. Infrastructure"
              class="input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Status</span>
            </label>
            <select v-model="form.status" class="select select-bordered w-full">
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Priority</span>
            </label>
            <input v-model.number="form.priority" type="number" placeholder="1" class="input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Uptime (%)</span>
            </label>
            <input v-model.number="form.uptime_percentage" type="number" step="0.01" placeholder="99.99"
              class="input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Version</span>
            </label>
            <input v-model="form.metadata.version" type="text" placeholder="v1.0.0"
              class="input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Owner</span>
            </label>
            <input v-model="form.metadata.owner" type="text" placeholder="DevOps Team"
              class="input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Tags</span>
            </label>
            <input v-model="form.tags" type="text" placeholder="comma separated tags"
              class="input input-bordered w-full" />
            <label class="label">
              <span class="label-text-alt opacity-60">Enter tags separated by commas</span>
            </label>
          </div>
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
