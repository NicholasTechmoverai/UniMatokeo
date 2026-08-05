import { institutions } from '~/utils/index'

export default defineEventHandler(() => {
  const baseUrl = 'https://uni-matokeo.vercel.app' 
  
  const routes = [
    '/',
    ...institutions.map(inst => `/${inst.key}`)
  ]
  
  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    changefreq: 'weekly',
    priority: route === '/' ? 1.0 : 0.8
  }))
})