type InitMessage = { type: 'init'; words: string[] }
type SearchMessage = { type: 'search'; pattern: string; wholeWord: boolean; id: number }
type WorkerMessage = InitMessage | SearchMessage

type ResultMessage = { type: 'result'; matches: string[]; total: number; id: number }
type ErrorMessage = { type: 'error'; message: string; id: number }

const MAX_RESULTS = 1000
const CHUNK_SIZE = 50_000
// Maximum wall-clock milliseconds a single search is allowed to run.
// Catastrophically backtracking regexes (ReDoS) will be cut off at this limit.
const SEARCH_TIMEOUT_MS = 5_000

let words: string[] = []
let currentId = -1

function processSearch(pattern: string, wholeWord: boolean, id: number): void {
  let regex: RegExp
  try {
    const finalPattern = wholeWord ? `^(?:${pattern})$` : pattern
    regex = new RegExp(finalPattern)
  } catch {
    postMessage({ type: 'error', message: 'Invalid regular expression', id } satisfies ErrorMessage)
    return
  }

  const matches: string[] = []
  let total = 0
  let i = 0
  const deadline = Date.now() + SEARCH_TIMEOUT_MS

  function chunk(): void {
    if (currentId !== id) return

    if (Date.now() > deadline) {
      postMessage({ type: 'error', message: 'Search timed out — try a less complex pattern', id } satisfies ErrorMessage)
      return
    }

    const end = Math.min(i + CHUNK_SIZE, words.length)
    for (; i < end; i++) {
      if (regex.test(words[i])) {
        total++
        if (matches.length < MAX_RESULTS) {
          matches.push(words[i])
        }
      }
    }

    if (i < words.length) {
      setTimeout(chunk, 0)
    } else {
      postMessage({ type: 'result', matches, total, id } satisfies ResultMessage)
    }
  }

  chunk()
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data
  if (msg.type === 'init') {
    words = msg.words
    postMessage({ type: 'ready' })
  } else if (msg.type === 'search') {
    currentId = msg.id
    processSearch(msg.pattern, msg.wholeWord, msg.id)
  }
}
