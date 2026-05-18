import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxt/icon',
    '@nuxt/eslint',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/style.css'],
  devtools: { enabled: true },
  routeRules: {
    '/': { ssr: true },
    '/admin/**': { ssr: false }
  }
})
