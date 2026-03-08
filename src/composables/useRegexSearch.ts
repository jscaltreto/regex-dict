import { ref, watch, onUnmounted } from 'vue'
import MatcherWorker from '../workers/matcher.worker.ts?worker'
import wordsManifest from '../words-manifest.json'

type WorkerResultMessage = { type: 'result'; matches: string[]; total: number; id: number }
type WorkerErrorMessage = { type: 'error'; message: string; id: number }
type WorkerReadyMessage = { type: 'ready' }
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

  async function loadCorpus(): Promise<void> {
    try {
      const response = await fetch(wordsManifest.file)
      if (!response.ok) throw new Error(`Failed to fetch word list: ${response.status}`)
      if (!response.body) throw new Error('No response body')

      // If the server set Content-Encoding: gzip, the browser already decompressed
      // the response transparently. Otherwise we decompress manually.
      let text: string
      if (response.headers.get('Content-Encoding') === 'gzip') {
        text = await response.text()
      } else {
        const ds = new DecompressionStream('gzip')
        const decompressedStream = response.body.pipeThrough(ds)
        text = await new Response(decompressedStream).text()
      }
      const wordList = text.split(/\r?\n/).filter(Boolean)

      corpusSize.value = wordList.length
      worker.postMessage({ type: 'init', words: wordList })
    } catch (err) {
      isCorpusLoading.value = false
      isSearching.value = false
      corpusError.value = err instanceof Error ? err.message : 'Failed to load word list'
    }
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

  loadCorpus()

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
