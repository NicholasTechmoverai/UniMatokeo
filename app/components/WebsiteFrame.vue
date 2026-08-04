<script setup lang="ts">
const props = defineProps<{
  src: string
}>()

const loading = ref(true)
const failed = ref(false)
const iframeRef = ref<HTMLIFrameElement>()

const domain = computed(() => {
  try {
    return new URL(props.src).hostname
  } catch {
    return props.src
  }
})

function handleLoad() {
  loading.value = false
  failed.value = false
}

function handleError() {
  loading.value = false
  failed.value = true
}

function reload() {
  if (!iframeRef.value) return
  loading.value = true
  failed.value = false
  iframeRef.value.src = props.src
}

watch(() => props.src, () => {
  loading.value = true
  failed.value = false
})
</script>

<template>
  <div class="flex h-full flex-col bg-default">

    <!-- Chrome bar -->
    <div class="flex items-center gap-2 border-b border-default bg-muted/50 px-3 py-2">
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="size-2.5 rounded-full bg-error/60" />
        <span class="size-2.5 rounded-full bg-warning/60" />
        <span class="size-2.5 rounded-full bg-success/60" />
      </div>

      <div class="flex-1 flex items-center gap-1.5 min-w-0 rounded-md bg-default px-2 py-1 text-xs text-muted border border-default">
        <UIcon name="i-lucide-lock" class="size-3 shrink-0" />
        <span class="truncate">{{ domain }}</span>
      </div>

      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-rotate-cw"
        :disabled="loading"
        @click="reload"
      />
    </div>

    <!-- Content -->
    <div class="relative flex-1">
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-default"
      >
        <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-primary" />
        <p class="text-sm text-muted">Loading report…</p>
      </div>

      <div
        v-else-if="failed"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-default px-6 text-center"
      >
        <UIcon name="i-lucide-wifi-off" class="size-6 text-error" />
        <div>
          <p class="text-sm font-medium text-highlighted">Couldn't load the report</p>
          <p class="text-xs text-muted">The portal may be slow or unreachable right now.</p>
        </div>
        <UButton size="xs" icon="i-lucide-rotate-cw" @click="reload">
          Try again
        </UButton>
      </div>

      <iframe
        ref="iframeRef"
        :src="src"
        class="h-full w-full min-h-[700px] border-0"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
  </div>
</template>