import { institutions } from "./app/utils/index"

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    siteUrl: 'https://uni-matokeo.vercel.app',
    exclude: ['/api/**'],
    urls: [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0
      },
      ...institutions.map(inst => ({
        loc: `/${inst.key}`,
        changefreq: 'weekly',
        priority: 0.8
      }))
    ]
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ssr: true,

  nitro: {
    prerender: {
      routes: [
        '/',
        ...institutions.map(inst => `/${inst.key}`),
        ...institutions.map(inst => `/${inst.key}/`)
      ],
      crawlLinks: true
    }
  },

  routeRules: {
    '/': { prerender: true },
    ...Object.fromEntries(
      institutions.map(inst => [`/${inst.key}`, { prerender: true }])
    ),
    ...Object.fromEntries(
      institutions.map(inst => [`/${inst.key}/`, { prerender: true }])
    ),
    '/**': { ssr: true }
  },

  generate: {
    routes: [
      '/',
      ...institutions.map(inst => `/${inst.key}`)
    ]
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})