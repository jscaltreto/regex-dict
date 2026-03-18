export interface FaqItem {
  q: string
  a: string // HTML answer for display
}

export const faqItems: FaqItem[] = [
  {
    q: 'What is a regex dictionary?',
    a: 'A regex dictionary lets you search a word list using regular expressions (regex) — patterns that describe the <em>shape</em> of words rather than exact matches. For example, <code>.*tion</code> finds all words ending in "tion" (like <em>nation</em> or <em>motion</em>), <code>.{5}</code> finds any five-letter word, and <code>(.).*\\1</code> finds words that start and end with the same letter. It\'s useful for crosswords, Scrabble, word games, and linguistics.',
  },
  {
    q: 'What is a regular expression (regex)?',
    a: 'A regular expression is a pattern used to match text. Instead of searching for a fixed word, you describe the shape of what you\'re looking for — for example, <code>.{5}</code> matches any five-letter word, and <code>.*[aeiou]{3}.*</code> matches any word containing three consecutive vowels. The quick reference above covers the most useful patterns.',
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
    a: 'Once the page and word list have loaded, the search works entirely offline within your browser. There is no server communication during use, and your searches are never recorded or logged.',
  },
]
