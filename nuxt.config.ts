export default defineNuxtConfig({
    ssr: false,
    app: {
        baseURL: '/nuxt/',
        buildAssetsDir: 'assets',
    },
    modules: ['@nuxtjs/tailwindcss'],
    compatibilityDate: '2025-06-24',
})