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

// Consent is stored as a cookie so it persists across visits and works with SSR
const consent = useCookie('matokeo-consent', {
  maxAge: 60 * 60 * 24 * 3, //3 days cookie
  default: () => null
})

const consentOpen = ref(!consent.value)
const blocked = ref(false)

function acceptConsent() {
  consent.value = 'accepted'
  consentOpen.value = false
  blocked.value = false
}

function declineConsent() {
  blocked.value = true
  consentOpen.value = false
  // Best effort — browsers only allow this for tabs opened via script

  window.close()

}


function reopenPolicy() {
  consentOpen.value = true
}
</script>

<template>
  <UApp>
    <!-- Blocking screen shown if the visitor declines and the tab could not be closed -->
    <div v-if="blocked" class="fixed inset-0 z-50 flex items-center justify-center bg-default px-4">
      <div class="max-w-sm text-center space-y-4">
        <UIcon name="i-lucide-shield-x" class="size-10 mx-auto text-muted" />
        <h1 class="text-lg font-semibold text-highlighted">Access declined</h1>
        <p class="text-sm text-muted">
          You need to accept the cookie and usage policy to use Uni Matokeo. You can close this tab now, or review the
          policy again below.
        </p>
        <div class="space-x-2">
          <UButton variant="soft" color="primary" @click="reopenPolicy">
            Review policy
          </UButton>

        </div>

      </div>
    </div>

    <template v-else>
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
              <AppLogo class="h-8 w-auto" /> • © {{ new Date().getFullYear() }} Uni Matokeo
            </p>
            <p class="text-xs">
              Provided as-is, for personal, non-commercial use. Look up only your own results, or those you're
              authorized to access.
              Not affiliated with the listed institutions — reports are fetched directly from each institution's
              official portal.
              <UButton variant="link" color="neutral" size="xs" class="p-0 h-auto align-baseline" @click="reopenPolicy">
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
    </template>

    <!-- Consent gate -->
    <UModal v-model:open="consentOpen" :dismissible="false" :close="false" title="Before you continue">
      <template #body>
        <div class="space-y-4 text-sm text-muted">
          <p>
            Uni Matokeo uses one functional cookie to remember this choice. We don't use tracking or advertising
            cookies.
          </p>

          <div class="space-y-2">
            <p class="font-medium text-highlighted">Acceptable use</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Only look up results using your own admission number, or one you're authorized to check.</li>
              <li>Don't use this site to access another student's academic records without their permission.</li>
              <li>Reports are pulled directly from each institution's official portal — Uni Matokeo doesn't store or
                alter them.</li>
            </ul>
          </div>

          <p class="text-xs">
            By continuing, you agree to these terms and to the use of a functional cookie for this purpose.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="declineConsent">
            Decline & exit
          </UButton>
          <UButton @click="acceptConsent">
            Accept & continue
          </UButton>
        </div>
      </template>
    </UModal>
  </UApp>
</template>