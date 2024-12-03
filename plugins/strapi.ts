import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const strapiClient = axios.create({
        baseURL: 'http://localhost:1337',
        headers: {
            'Authorization': `Bearer ${config.strapiApiToken}`
        }
    })

    return {
        provide: {
            strapi: strapiClient
        }
    }
})