<!-- components/Logo.vue -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    iconOnly?: boolean
  }>(),
  { iconOnly: false }
)
</script>

<template>
  <svg
    v-if="iconOnly"
    width="40"
    height="40"
    viewBox="0 0 160 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 140V30L55 85L90 30L105 150L140 65"
      stroke="var(--ui-primary)"
      stroke-width="18"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-else
    width="220"
    height="70"
    viewBox="0 0 680 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M144 170V60L179 115L214 60L229 180L264 95"
      stroke="var(--ui-primary)"
      stroke-width="16"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <text
      x="304"
      y="135"
      font-size="64"
      font-weight="600"
      letter-spacing="-1"
      fill="currentColor"
    >Matokeo</text>
  </svg>
</template>