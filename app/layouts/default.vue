<template>
  <nav class="navbar bg-base-300/75 shadow top-0 fixed z-10 backdrop-blur-sm">
    <div class="flex-1 flex items-center max-w-7xl mx-auto">
      <NuxtLink to="/">
        <!-- <Icon name="lucide:camera" class="text-purple-500" size="64" /> -->
        <h1 class="text-xl text-red font-semibold italic">Lens of <span class="text-cyan-300">Moments</span></h1>
      </NuxtLink>
      <!-- <div class="px-2">
        <h1 class="text-xl text-red font-semibold italic">Lens of <span class="text-pink-400">Moments</span></h1>
        <p class="text-sm italic">documentary photographer &bull; event stories</p>
      </div> -->
    </div>
  </nav>
  <div class="flex flex-col min-h-screen pt-24">
    <main class="py-5 grow">
      <slot />
    </main>
    <footer class="bg-base-300 shadow py-3 text-center">
      <div>&copy; {{ new Date().getFullYear() }} - All right reserved.</div>
    </footer>
  </div>
</template>
