<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRegexSearch } from './composables/useRegexSearch'
import SearchBox from './components/SearchBox.vue'
import ResultsList from './components/ResultsList.vue'
import RegexGuide from './components/RegexGuide.vue'
import Faq from './components/Faq.vue'

const {
  pattern,
  wholeWord,
  matches,
  totalCount,
  isSearching,
  regexError,
  isCorpusLoading,
  corpusError,
  corpusSize,
} = useRegexSearch()

// Animated word count ticker — cycles random numbers while loading,
// then settles to the real count over a brief animation.
const displayCount = ref(Math.floor(Math.random() * 150_000 + 200_000))
let tickerInterval: ReturnType<typeof setInterval> | null = null

tickerInterval = setInterval(() => {
  displayCount.value = Math.floor(Math.random() * 150_000 + 200_000)
}, 50)

watch(corpusSize, (real) => {
  if (real <= 0) return
  if (tickerInterval !== null) { clearInterval(tickerInterval); tickerInterval = null }

  const steps = 15
  const duration = 600
  let step = 0

  const settle = setInterval(() => {
    step++
    const t = step / steps
    // Narrow the random range toward the real value
    const spread = Math.round((1 - t * t) * 50_000)
    displayCount.value = real + Math.round((Math.random() - 0.5) * spread)
    if (step >= steps) {
      clearInterval(settle)
      displayCount.value = real
    }
  }, duration / steps)
})

onUnmounted(() => { if (tickerInterval !== null) clearInterval(tickerInterval) })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 px-4 py-10">
    <div class="mx-auto max-w-2xl">
      <header class="mb-8 text-center">
        <h1 class="font-mono text-4xl font-bold">
          <span class="text-gray-400 dark:text-gray-500">/^</span><span class="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Regex Dictionary</span><span class="text-gray-400 dark:text-gray-500">$/</span>
        </h1>
        <p class="mt-2 font-mono text-sm text-gray-500 dark:text-gray-400">
          Search {{ displayCount.toLocaleString() }} English words with a regular expression
        </p>
      </header>

      <div
        v-if="corpusError"
        class="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-center text-red-600 dark:text-red-400"
      >
        <p class="font-medium">Failed to load dictionary</p>
        <p class="mt-1 text-sm">{{ corpusError }}</p>
      </div>

      <SearchBox
        v-model="pattern"
        :whole-word="wholeWord"
        :disabled="!!corpusError"
        :is-searching="isSearching"
        :error="regexError"
        @update:whole-word="wholeWord = $event"
      />
      <ResultsList
        :matches="matches"
        :total-count="totalCount"
        :has-pattern="pattern.trim().length > 0"
      />
      <div class="mt-10">
        <RegexGuide />
        <Faq />
      </div>
    </div>

    <footer class="mx-auto mt-12 max-w-2xl border-t border-gray-200 pb-8 pt-6 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
      <p>
        Word list from
        <a
          href="https://github.com/words/an-array-of-english-words"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-600 dark:hover:text-gray-300"
        >an-array-of-english-words</a>
        (MIT) — reproduced without curation; may contain offensive words.
        This project is released under the
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-600 dark:hover:text-gray-300"
        >MIT License</a>.
      </p>
      <p class="mt-2">
        <a
          href="https://github.com/jscaltreto/regex-dict"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
      </p>
    </footer>
  </div>
</template>
