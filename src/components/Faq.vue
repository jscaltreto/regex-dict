<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const items = [
  {
    q: 'What is a regular expression (regex)?',
    a: 'A regular expression is a pattern used to match text. Instead of searching for a fixed word, you describe the shape of what you\'re looking for — for example, <code>.{5}</code> matches any five-letter word, and <code>[aeiou]{3}</code> matches any three consecutive vowels. The quick reference above covers the most useful patterns.',
  },
  {
    q: 'How does the search work?',
    a: 'After the word list loads, all matching happens in your browser — nothing is sent to a server. Matching runs in a background thread so the page stays responsive even against a list of 275,000+ words.',
  },
  {
    q: 'What does "Match whole word" do?',
    a: 'When checked (the default), your pattern must match the entire word — so <code>cat</code> matches only "cat", not "scatter". When unchecked, the pattern can match anywhere inside a word — <code>cat</code> would also match "concatenate".',
  },
  {
    q: 'Where do the words come from?',
    a: 'The word list is the <a href="https://github.com/words/an-array-of-english-words" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-700 dark:hover:text-gray-200">an-array-of-english-words</a> corpus (~275,000 English words), MIT licensed. The list is used as-is without curation — it may contain words some users find offensive.',
  },
  {
    q: 'Is this open source?',
    a: 'Yes. This project is released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-700 dark:hover:text-gray-200">MIT License</a>.',
  },
  {
    q: 'Does it work offline?',
    a: 'Once the page and word list have loaded, the search works entirely offline. There is no server communication during use.',
  },
]
</script>

<template>
  <div class="mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <div
      v-for="(item, i) in items"
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
