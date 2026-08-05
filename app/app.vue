<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Uni Matokeo'
const description = 'Check your university or college academic results in seconds. Pick your institution, enter your admission number, and view your official report card — no login, no queueing at the notice board.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/matokeo.png',
  twitterCard: 'summary_large_image'
})

const router = useRouter()
const route = useRoute()

function reopenPolicy() {
  if (route.path === '/') {
    router.push('/mut?showPolicy=true')
    return
  }

  router.replace({
    query: {
      ...route.query,
      showPolicy: 'true'
    }
  })
}
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-15 min-h-10 shrink-0" />
        </NuxtLink>
        <TemplateMenu />
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <div class="text-sm text-muted space-y-1">
          <p class="flex flex-row items-center gap-1">
            <AppLogo class="h-8 w-auto" />
            • © {{ new Date().getFullYear() }} Uni Matokeo
          </p>
          <p class="text-xs">
            Provided as-is, for personal, non-commercial use. Look up only your own results, or those you're
            authorized to access.
            Not affiliated with the listed institutions — reports are fetched directly from each institution's
            official portal.
            <UButton variant="soft" color="neutral" size="xs" class=" h-auto align-baseline" @click="reopenPolicy">
              Cookie & usage policy
            </UButton>
          </p>
        </div>
      </template>

      <template #right>
        <UButton to="https://github.com/" target="_blank" icon="i-simple-icons-github" aria-label="GitHub"
          color="neutral" variant="ghost" />
      </template>
    </UFooter>
  </UApp>
</template>