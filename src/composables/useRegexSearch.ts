import { ref, watch, onUnmounted } from 'vue'
import MatcherWorker from '../workers/matcher.worker.ts?worker'

type WorkerResultMessage = { type: 'result'; matches: string[]; total: number; id: number }
type WorkerErrorMessage = { type: 'error'; message: string; id: number }
type WorkerReadyMessage = { type: 'ready'; count: number }
type WorkerResponse = WorkerResultMessage | WorkerErrorMessage | WorkerReadyMessage

export function useRegexSearch() {
  const pattern = ref('')
  const wholeWord = ref(true)
  const matches = ref<string[]>([])
  const totalCount = ref(0)
  const isSearching = ref(false)
  const regexError = ref<string | null>(null)
  const isCorpusLoading = ref(true)
  const corpusError = ref<string | null>(null)
  const corpusSize = ref(0)

  const isCorpusReady = ref(false)

  const worker = new MatcherWorker()
  let searchId = 0
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const msg = event.data
    if (msg.type === 'ready') {
      corpusSize.value = msg.count
      isCorpusLoading.value = false
      isCorpusReady.value = true
    } else if (msg.type === 'result') {
      if (msg.id === searchId) {
        matches.value = msg.matches
        totalCount.value = msg.total
        isSearching.value = false
      }
    } else if (msg.type === 'error') {
      if (msg.id === searchId) {
        regexError.value = msg.message
        isSearching.value = false
      }
    }
  }

  worker.onerror = () => {
    isCorpusLoading.value = false
    isSearching.value = false
    corpusError.value = 'Worker error occurred'
  }

  function runSearch(): void {
    const p = pattern.value.trim()

    if (!p) {
      matches.value = []
      totalCount.value = 0
      isSearching.value = false
      regexError.value = null
      return
    }

    // Validate regex on main thread for instant feedback
    try {
      const testPattern = wholeWord.value ? `^(?:${p})$` : p
      new RegExp(testPattern, 'i')
      regexError.value = null
    } catch (err) {
      regexError.value = err instanceof Error ? err.message : 'Invalid regular expression'
      matches.value = []
      totalCount.value = 0
      isSearching.value = false
      return
    }

    isSearching.value = true
    if (!isCorpusReady.value) return
    searchId++
    worker.postMessage({ type: 'search', pattern: p, wholeWord: wholeWord.value, id: searchId })
  }

  function scheduleSearch(): void {
    if (debounceTimer !== null) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(runSearch, 250)
  }

  watch([pattern, wholeWord], scheduleSearch)
  watch(isCorpusReady, (ready) => {
    if (ready && pattern.value.trim()) {
      if (debounceTimer !== null) clearTimeout(debounceTimer)
      runSearch()
    }
  })

  onUnmounted(() => {
    worker.terminate()
    if (debounceTimer !== null) clearTimeout(debounceTimer)
  })

  return {
    pattern,
    wholeWord,
    matches,
    totalCount,
    isSearching,
    regexError,
    isCorpusLoading,
    corpusError,
    corpusSize,
  }
}
