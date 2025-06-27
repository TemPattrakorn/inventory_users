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

  runtimeConfig: {
    strapiApiToken: process.env.STRAPI_API_TOKEN,
    public: {
      strapiUrl: 'http://localhost:1337'
    }
  },

  compatibilityDate: '2024-11-18',
})