<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  matches: string[]
  totalCount: number
  hasPattern: boolean
}>()

const copiedWord = ref<string | null>(null)

async function copyWord(word: string) {
  await navigator.clipboard.writeText(word)
  copiedWord.value = word
  setTimeout(() => { copiedWord.value = null }, 1500)
}
</script>

<template>
  <div class="mt-4">
    <div
      v-if="hasPattern && totalCount > 0"
      class="mb-2 text-sm text-gray-500 dark:text-gray-400"
    >
      <span v-if="totalCount <= matches.length">
        {{ totalCount.toLocaleString() }} {{ totalCount === 1 ? 'match' : 'matches' }}
      </span>
      <span v-else>
        Showing {{ matches.length.toLocaleString() }} of {{ totalCount.toLocaleString() }} matches
      </span>
    </div>

    <ul
      v-if="matches.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 max-h-[calc(100vh-260px)] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <li
        v-for="word in matches"
        :key="word"
        class="group flex cursor-pointer items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-1.5 font-mono text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-r-gray-100 sm:dark:[&:nth-child(odd)]:border-r-gray-700"
        :class="copiedWord === word ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'"
        @click="copyWord(word)"
      >
        <span>{{ word }}</span>
        <span class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 dark:text-gray-500">
          {{ copiedWord === word ? '✓ copied' : 'copy' }}
        </span>
      </li>
    </ul>

    <p
      v-else-if="hasPattern"
      class="text-center text-gray-400 dark:text-gray-500 py-8"
    >
      No matches found
    </p>

    <p
      v-else
      class="text-center text-gray-400 dark:text-gray-500 py-8"
    >
      Type a regex above to search
    </p>
  </div>
</template>
