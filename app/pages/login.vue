<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const handleLogin = (e: any) => {
  e.preventDefault()
  router.push('/admin')
}
const ssoLogin = () => {
  const url = typeof window !== 'undefined' ? window.location.origin : ''
  console.log("h: ", url)
}
</script>
<template>
  <div class="min-h-screen flex flex-wrap">
    <div class="hidden lg:block w-1/4 bg-linear-60 from-accent-content to-accent" />
    <div class="w-full lg:w-3/4 flex items-center">
      <div class="w-full p-3 max-w-md mx-auto">
        <h1 class="text-center text-3xl font-bold">Welcome Back</h1>
        <div class="w-full my-5 h-2 bg-linear-90 from-transparent via-accent to-transparent" />
        <form @submit.prevent="handleLogin">
          <div class="my-2">
            <label for="user">Username</label>
            <input type="text" class="input w-full" placeholder="username">
          </div>
          <div class="my-2">
            <label for="pass">Password</label>
            <input type="password" class="input w-full" placeholder="********">
          </div>
          <div class="my-4">
            <button type="submit" class="btn btn-primary w-full">Login</button>
          </div>

        </form>
        <p class="text-center">or</p>
        <div class="my-4">
          <button type="submit" class="btn btn-accent btn-outline w-full" @click="ssoLogin">Login SSO</button>
        </div>
      </div>
    </div>
  </div>
</template>
