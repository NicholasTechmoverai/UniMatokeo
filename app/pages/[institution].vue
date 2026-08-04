<script setup lang="ts">
const route = useRoute()
const institution = computed(() => route.params.institution as string)

const institutionMap = Object.fromEntries(institutions.map(i => [i.key, i]))

const currentInstitution = computed(() => {
    const inst = institutionMap[institution.value]

    if (!inst) {
        throw createError({
            statusCode: 404,
            statusMessage: `Institution "${institution.value}" is not supported.`
        })
    }

    return inst
})

useSeoMeta({
    title: () => `${currentInstitution.value.label} — Academic Reports`,
    description: () => `Look up academic reports for ${currentInstitution.value.label} using your admission number.`
})

const filters = reactive({
    admission: '',
    year: null as number | null,
    semester: null as number | 'whole' | null
})

const url = ref('')
const isReady = ref(false)
const loading = ref(false)

const yearOptions = [
    { label: 'Year 1', value: 1 },
    { label: 'Year 2', value: 2 },
    { label: 'Year 3', value: 3 },
    { label: 'Year 4', value: 4 }
]

const semesterOptions = [
    { label: 'Semester 1', value: 1 },
    { label: 'Semester 2', value: 2 },
    { label: 'Whole Year', value: 'whole' }
]

const canSubmit = computed(() =>
    filters.admission.trim().length > 0
    && filters.year !== null
    && filters.semester !== null
)

function buildUrl() {
    const target = new URL(currentInstitution.value.resultUrl)

    target.searchParams.set('refNo', filters.admission.trim())
    target.searchParams.set('year', `YEAR ${filters.year}`)

    if (filters.semester !== 'whole') {
        target.searchParams.set('semester', `SEMESTER ${filters.semester}:1052`)
    }

    return target.toString()
}

async function submit() {
    if (!canSubmit.value) return

    loading.value = true
    isReady.value = false

    // Small delay so the loading state is perceptible even on instant builds
    await new Promise(resolve => setTimeout(resolve, 150))

    url.value = buildUrl()
    isReady.value = true
    loading.value = false
}

function reset() {
    isReady.value = false
    url.value = ''
}

const otherInstitutions = computed(() =>
    institutions.filter(i => i.key !== institution.value)
)
</script>

<template>
    <container>
        <div class="flex h-screen flex-col bg-muted/30">
            <main class="flex-1 overflow-auto">

                <div class="mx-auto max-w-3xl px-4 py-8 space-y-6">
                    <UPageCard class="flex items-center gap-2" :icon="currentInstitution.icon" spotlight
                        :title="currentInstitution.shortLabel + ' Results'" />
                    <!-- Intro -->
                    <div class="space-y-1">
                        <h1 class="text-xl font-semibold text-highlighted">
                            {{ currentInstitution.label }}
                        </h1>
                        <p class="text-sm text-muted">
                            Enter your admission number to view your academic report card.
                        </p>
                    </div>

                    <!-- Search form -->
                    <UPageCard>
                        <form class="space-y-4" @submit.prevent="submit">
                            <UFormField label="Admission number" required>
                                <UInput v-model="filters.admission" icon="i-lucide-hash"
                                    placeholder="e.g. CTM212-0123/2022" class="w-full" :disabled="loading" />
                            </UFormField>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <UFormField label="Year of study" required>
                                    <USelectMenu v-model="filters.year" :items="yearOptions" label-key="label"
                                        value-key="value" icon="i-lucide-calendar" placeholder="Select year"
                                        class="w-full" :disabled="loading" />
                                </UFormField>

                                <UFormField label="Semester" required>
                                    <USelectMenu v-model="filters.semester" :items="semesterOptions" label-key="label"
                                        value-key="value" icon="i-lucide-book-open" placeholder="Select semester"
                                        class="w-full" :disabled="loading" />
                                </UFormField>
                            </div>

                            <UButton type="submit" block size="lg" icon="i-lucide-search" :loading="loading"
                                :disabled="!canSubmit">
                                View report
                            </UButton>

                            <p class="text-xs text-muted text-center">
                                Your details are sent directly to {{ currentInstitution.shortLabel }}'s official portal
                                — nothing is stored here.
                            </p>
                        </form>
                    </UPageCard>

                    <!-- Empty state before first search -->
                    <UPageCard v-if="!isReady" class="border-dashed">
                        <div class="flex flex-col items-center text-center py-8 gap-3">
                            <div class="flex items-center justify-center size-12 rounded-full bg-primary/10">
                                <UIcon name="i-lucide-file-search" class="size-6 text-primary" />
                            </div>
                            <div>
                                <p class="font-medium text-highlighted">No report yet</p>
                                <p class="text-sm text-muted">Fill in the form above and tap "View report" to fetch it.
                                </p>
                            </div>
                        </div>
                    </UPageCard>

                    <!-- Result -->
                    <div v-else class="space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-highlighted">Report</p>
                            <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-rotate-ccw"
                                @click="reset">
                                New search
                            </UButton>
                        </div>

                        <WebsiteFrame :src="url" class="h-[70vh] rounded-lg overflow-hidden border border-default" />
                    </div>

                    <!-- Other institutions -->
                    <UPageCard title="Other institutions">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <UButton v-for="inst in otherInstitutions" :key="inst.key" :to="`/${inst.key}`"
                                variant="soft" color="neutral" :icon="inst.icon" class="justify-start">
                                {{ inst.shortLabel }}
                            </UButton>
                        </div>
                    </UPageCard>

                </div>
            </main>
        </div>
    </container>
</template>