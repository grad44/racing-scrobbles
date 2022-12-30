// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            apiKey: process.env.API_KEY,
            apiBaseUrl: process.env.API_BASE_URL,
            baseUrl: process.env.BASE_URL
        }
    }
})
