<script setup lang="ts">

useSeoMeta({
  title: 'Uni Matokeo — Check your academic results instantly',
  description: 'Pick your institution, enter your admission number, and view your official academic report card in seconds.'
})

const steps = [
  {
    icon: 'i-lucide-list',
    title: 'Choose your institution',
    description: 'Pick your university or college from the list below.'
  },
  {
    icon: 'i-lucide-hash',
    title: 'Enter your admission number',
    description: 'Add your admission number, year, and semester.'
  },
  {
    icon: 'i-lucide-file-check-2',
    title: 'View your report',
    description: 'Your official report card loads straight from the institution\'s own portal.'
  }
]
</script>

<template>
  <div>
    <UPageHero
      title="Your results, one tap away"
      description="Matokeo pulls your academic report straight from your institution's official portal — no login, no app, no waiting in line at the notice board."
      :links="[{
        label: 'Find your institution',
        to: '#institutions',
        trailingIcon: 'i-lucide-arrow-down',
        size: 'xl'
      }, {
        label: 'How it works',
        to: '#how-it-works',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    />

    <UPageSection
      id="how-it-works"
      title="How it works"
      description="Three steps, no paperwork."
    >
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="flex flex-col items-center text-center gap-3"
        >
          <div class="relative flex items-center justify-center size-14 rounded-full bg-primary/10">
            <UIcon :name="step.icon" class="size-6 text-primary" />
            <span class="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-primary text-inverted text-xs font-medium">
              {{ index + 1 }}
            </span>
          </div>
          <div>
            <p class="font-medium text-highlighted">{{ step.title }}</p>
            <p class="text-sm text-muted mt-1">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="institutions"
      title="Select your institution"
      description="More institutions are added regularly — don't see yours yet? Let us know below."
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ULink
          v-for="inst in institutions"
          :key="inst.key"
          :to="`/${inst.key}`"
          class="group"
        >
          <UPageCard class="h-full transition-colors group-hover:border-primary">
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center size-11 rounded-lg bg-primary/10 shrink-0">
                <UIcon :name="inst.icon" class="size-5 text-primary" />
              </div>
              <div class="min-w-0">
                <p class="font-medium text-highlighted truncate">{{ inst.shortLabel }}</p>
                <p class="text-sm text-muted line-clamp-2">{{ inst.label }}</p>
              </div>
            </div>
            <template #footer>
              <span class="inline-flex items-center gap-1 text-sm font-medium text-primary">
                View results
                <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </template>
          </UPageCard>
        </ULink>
      </div>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Studying somewhere not listed?"
        description="We're adding new institutions regularly. Tell us which one to add next and we'll get it up as soon as we can."
        variant="subtle"
        :links="[{
          label: 'More Institutions dropping soon',
          trailingIcon: 'i-lucide-clock',
          color: 'neutral'
        }]"
      />
    </UPageSection>
  </div>
</template>