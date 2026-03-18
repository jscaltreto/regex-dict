<script setup lang="ts">
import { ref } from 'vue'
import { faqItems } from '../data/faq'

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <div class="mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <div
      v-for="(item, i) in faqItems"
      :key="i"
      class="border-b border-gray-200 last:border-b-0 dark:border-gray-700"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        @click="toggle(i)"
      >
        <span>{{ item.q }}</span>
        <svg
          class="ml-4 h-4 w-4 shrink-0 transition-transform"
          :class="{ 'rotate-180': openIndex === i }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        v-if="openIndex === i"
        class="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
        v-html="item.a"
      />
    </div>
  </div>
</template>
