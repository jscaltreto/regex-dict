<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

interface Row {
  pattern: string
  desc: string
  example: string
}

interface Section {
  title: string
  intro: string
  rows: Row[]
}

const sections: Section[] = [
  {
    title: 'Character matchers',
    intro: 'These match a single character at a specific position in the word.',
    rows: [
      { pattern: '.',      desc: 'Any single letter (a wildcard)',          example: 'c.t → cat, cot, cut, cit…' },
      { pattern: '[aeiou]', desc: 'Exactly one of the letters listed',      example: 'b[aeiou]t → bat, bet, bit, bot, but' },
      { pattern: '[a-f]',  desc: 'Any letter in the range a through f',     example: '[a-f]ox → aox, box, cox, dox…' },
      { pattern: '[^aeiou]', desc: 'Any letter not in the list',            example: 'b[^aeiou]t → bbt, bct, bdt…' },
    ],
  },
  {
    title: 'Anchors',
    intro: 'Anchors don\'t match a letter — they match a position in the word. The "Match whole word" toggle adds ^ and $ for you automatically, but you can also use them manually when the toggle is off.',
    rows: [
      { pattern: '^',  desc: 'The start of the word — nothing comes before this', example: '^un → unify, undo, untie…' },
      { pattern: '$',  desc: 'The end of the word — nothing comes after this',    example: 'ing$ → running, singing…' },
    ],
  },
  {
    title: 'Quantifiers',
    intro: 'A quantifier always applies to the character or group immediately before it, and controls how many times that thing must appear.',
    rows: [
      { pattern: '*',     desc: 'Zero or more — the previous item can repeat any number of times, or not appear at all', example: 'ca*t → ct, cat, caat, caaat…' },
      { pattern: '+',     desc: 'One or more — the previous item must appear at least once',                             example: 'ca+t → cat, caat, caaat…' },
      { pattern: '?',     desc: 'Optional — the previous item appears once or not at all',                              example: 'colou?r → color, colour' },
      { pattern: '{5}',   desc: 'Exactly 5 of the previous item',                                                       example: '.{5} → any 5-letter word' },
      { pattern: '{3,5}', desc: 'Between 3 and 5 of the previous item (inclusive)',                                     example: '.{3,5} → 3, 4, or 5-letter words' },
    ],
  },
  {
    title: 'Combining patterns',
    intro: 'These let you build more complex expressions.',
    rows: [
      { pattern: 'ab|cd', desc: 'Match either the left side or the right side',    example: 'cat|dog → cat or dog' },
      { pattern: '(abc)', desc: 'Group characters so a quantifier applies to all of them', example: '(un|re)do → undo or redo' },
    ],
  },
]
</script>

<template>
  <div class="mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <button
      type="button"
      class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      @click="open = !open"
    >
      <h2 class="text-sm font-medium">Regex quick reference</h2>
      <svg
        class="h-4 w-4 shrink-0 transition-transform"
        :class="{ 'rotate-180': open }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="open" class="border-t border-gray-200 dark:border-gray-700">
      <div
        v-for="section in sections"
        :key="section.title"
        class="border-b border-gray-100 px-4 py-4 last:border-b-0 dark:border-gray-700/60"
      >
        <h3 class="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {{ section.title }}
        </h3>
        <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">{{ section.intro }}</p>
        <table class="w-full text-sm">
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
            <tr v-for="row in section.rows" :key="row.pattern" class="align-top">
              <td class="py-1.5 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">{{ row.pattern }}</td>
              <td class="py-1.5 pr-4 text-gray-600 dark:text-gray-400">{{ row.desc }}</td>
              <td class="py-1.5 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:table-cell">{{ row.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
        Uses standard JavaScript regular expressions. &nbsp;
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-600 dark:hover:text-gray-300"
        >Full reference on MDN &rarr;</a>
      </p>
    </div>
  </div>
</template>
