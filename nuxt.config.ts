import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: { transpile: ['vuetify'] },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  vite: {
    vue: {
      template: { transformAssetUrls },
    },
  },

  plugins: [
    '~/plugins/firebase.ts',
  ],

  runtimeConfig: {
    strapiApiToken: process.env.STRAPI_API_TOKEN,
    public: {
      strapiUrl: 'http://localhost:1337',
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      apiToken: process.env.NUXT_PUBLIC_API_TOKEN,
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY
    }
  },
  app: {
    head: {
      title: 'Inventory management system',
    }
  },

  compatibilityDate: '2024-11-18',
})