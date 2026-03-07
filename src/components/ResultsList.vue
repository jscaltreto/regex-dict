<script setup lang="ts">
defineProps<{
  matches: string[]
  totalCount: number
  hasPattern: boolean
}>()
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
      class="max-h-[calc(100vh-260px)] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <li
        v-for="word in matches"
        :key="word"
        class="border-b border-gray-100 dark:border-gray-700 px-4 py-1.5 font-mono text-sm text-gray-800 dark:text-gray-200 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        {{ word }}
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
