<script setup lang="ts">
// Consent is stored as a cookie so it persists across visits and works with SSR
const consent = useCookie('matokeo-consent', {
    maxAge: 60 * 60 * 24 * 3, // 3 days
    default: () => null,
})

const route = useRoute()
const router = useRouter()

const consentOpen = ref(!consent.value)
const blocked = ref(false)

function acceptConsent() {
    consent.value = 'accepted'
    consentOpen.value = false
    blocked.value = false
    closeUrlPolicy()

}

function declineConsent() {
    blocked.value = true
    consentOpen.value = false
    closeUrlPolicy()
    window.close()
}

function reopenPolicy() {
    consentOpen.value = true
}

watch(
    () => route.query.showPolicy,
    (value) => {
        if (value === 'true') {
            consentOpen.value = true
        }
    },
    { immediate: true },
)


function closeUrlPolicy() {
    const { showPolicy, ...query } = route.query
    router.replace({ query })
}

const institution = computed(() => route.params.institution as string)

const institutionMap = Object.fromEntries(institutions.map((i) => [i.key, i]))

const currentInstitution = computed(() => {
    const inst = institutionMap[institution.value]

    if (!inst) {
        throw createError({
            statusCode: 404,
            statusMessage: `Institution "${institution.value}" is not supported.`,
        })
    }

    return inst
})

useSeoMeta({
    title: () => `${currentInstitution.value.label} — Academic Reports`,
    description: () =>
        `Look up academic reports for ${currentInstitution.value.label} using your admission number.`,
})

const filters = reactive({
    admission: '',
    year: null as number | null,
    semester: null as number | 'whole' | null,
})

const url = ref('')
const isReady = ref(false)
const loading = ref(false)

const yearOptions = [
    { label: 'Year 1', value: 1 },
    { label: 'Year 2', value: 2 },
    { label: 'Year 3', value: 3 },
    { label: 'Year 4', value: 4 },
    { label: 'Year 5', value: 5 },
]

const semesterOptions = [
    { label: 'Semester 1', value: 1 },
    { label: 'Semester 2', value: 2 },
    { label: 'Semester 3 (if tri sem)', value: 3 },
    { label: 'Whole Year', value: 'whole' },
]

const canSubmit = computed(
    () =>
        filters.admission.trim().length > 0 &&
        filters.year !== null &&
        filters.semester !== null,
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

    await new Promise((resolve) => setTimeout(resolve, 150))

    url.value = buildUrl()
    isReady.value = true
    loading.value = false
}

function reset() {
    isReady.value = false
    url.value = ''
    filters.admission = ''
}

const otherInstitutions = computed(() =>
    institutions.filter((i) => i.key !== institution.value),
)

const appConfig = useAppConfig()

watch(
    () => route.params.institution,
    (institutionKey) => {
        if (typeof institutionKey === 'string') {
            const institution = institutions.find(i => i.key === institutionKey)
            if (institution) {
                appConfig.ui.colors.primary = institution.color
            } else {
                appConfig.ui.colors.primary = 'yellow' // Default fallback
            }
        }
    },
    { immediate: true }
)
</script>

<template>
    <Container>
        <!-- Blocking overlay when consent is declined -->
        <div v-if="blocked" class="fixed inset-0 z-50 flex items-center justify-center bg-default px-4">
            <div class="max-w-sm text-center space-y-4">
                <UIcon name="i-lucide-shield-x" class="size-10 mx-auto text-muted" />
                <h1 class="text-lg font-semibold text-highlighted">Access declined</h1>
                <p class="text-sm text-muted">
                    You need to accept the cookie and usage policy to use Uni Matokeo.
                    You can close this tab now, or review the policy again below.
                </p>
                <div class="space-x-2">
                    <UButton variant="soft" color="primary" @click="reopenPolicy">
                        Review policy
                    </UButton>
                </div>
            </div>
        </div>

        <div v-else class="flex h-screen flex-col bg-muted/30">
            <main class="flex-1 overflow-auto">
                <div class="mx-auto max-w-3xl px-4 py-8 space-y-6">
                    <!-- Institution header -->
                    <UPageCard class="flex items-center gap-2" :icon="currentInstitution.icon" spotlight
                        :title="`${currentInstitution.shortLabel} Results`" />

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
                                Your details are sent directly to
                                {{ currentInstitution.shortLabel }}'s official portal — nothing
                                is stored here.
                            </p>
                        </form>
                    </UPageCard>

                    <!-- Empty state -->
                    <UPageCard v-if="!isReady" class="border-dashed">
                        <div class="flex flex-col items-center text-center py-8 gap-3">
                            <div class="flex items-center justify-center size-12 rounded-full bg-primary/10">
                                <UIcon name="i-lucide-file-search" class="size-6 text-primary" />
                            </div>
                            <div>
                                <p class="font-medium text-highlighted">No report yet</p>
                                <p class="text-sm text-muted">
                                    Fill in the form above and tap "View report" to fetch it.
                                </p>
                            </div>
                        </div>
                    </UPageCard>

                    <!-- Results -->
                    <div v-else class="space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-highlighted">Report</p>
                            <div class="space-x-2">
                                <UButton variant="subtle" color="neutral" size="xs" icon="i-lucide-rotate-ccw"
                                    @click="reset">
                                    New search
                                </UButton>
                                <UModal fullscreen title="Results Reports fullscreen">
                                    <UButton label="Full" color="neutral" icon="i-lucide-maximize-2" size="xs"
                                        variant="subtle" />

                                    <template #body>
                                        <WebsiteFrame :src="url"
                                            class="h-[70vh] rounded-lg overflow-hidden border border-default" />
                                    </template>
                                </UModal>
                            </div>
                        </div>

                        <WebsiteFrame :src="url" class="h-[70vh] rounded-lg overflow-hidden border border-default" />
                    </div>

                    <!-- Other institutions -->
                    <UPageCard title="Other institutions">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <UButton v-for="inst in otherInstitutions" :key="inst.key" :to="`/${inst.key}/`"
                                variant="soft" color="neutral" :icon="inst.icon" class="justify-start">
                                {{ inst.shortLabel }}
                            </UButton>
                        </div>
                    </UPageCard>
                </div>
            </main>
        </div>

        <!-- Consent modal -->
        <UModal v-model:open="consentOpen" :dismissible="false" :close="false" title="Before you continue">
            <template #body>
                <div class="space-y-4 text-sm text-muted">
                    <p>
                        Uni Matokeo uses one functional cookie to remember this choice. We
                        don't use tracking or advertising cookies.
                    </p>

                    <div class="space-y-2">
                        <p class="font-medium text-highlighted">Acceptable use</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>
                                Only look up results using your own admission number, or one
                                you're authorized to check.
                            </li>
                            <li>
                                Don't use this site to access another student's academic records
                                without their permission.
                            </li>
                            <li>
                                Reports are pulled directly from each institution's official
                                portal — Uni Matokeo doesn't store or alter them.
                            </li>
                        </ul>
                    </div>

                    <p class="text-xs">
                        By continuing, you agree to these terms and to the use of a
                        functional cookie for this purpose.
                    </p>
                </div>
            </template>

            <template #footer>
                <div class="flex w-full justify-end gap-2">
                    <UButton color="neutral" variant="ghost" @click="declineConsent">
                        Decline & exit
                    </UButton>
                    <UButton @click="acceptConsent"> Accept & continue </UButton>
                </div>
            </template>
        </UModal>
    </Container>
</template>