<script setup lang="ts">
import { ref, computed } from 'vue'
import { tokenize, tokenClass } from '../composables/useRegexHighlight'

const props = defineProps<{
  modelValue: string
  wholeWord: boolean
  disabled: boolean
  isSearching: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:wholeWord': [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const highlightRef = ref<HTMLDivElement | null>(null)

const tokens = computed(() => tokenize(props.modelValue))

function syncScroll() {
  if (inputRef.value && highlightRef.value) {
    highlightRef.value.scrollLeft = inputRef.value.scrollLeft
  }
}
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center rounded-lg border transition-colors focus-within:ring-2"
      :class="[
        error
          ? 'border-red-400 focus-within:ring-red-400 dark:border-red-500 dark:focus-within:ring-red-500'
          : 'border-gray-300 focus-within:ring-blue-500 dark:border-gray-600 dark:focus-within:ring-blue-400',
        'bg-white dark:bg-gray-800',
      ]"
    >
      <span
        v-if="wholeWord"
        class="select-none pl-4 font-mono text-base text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      >^</span>

      <!-- Overlay wrapper -->
      <div class="relative min-w-0 flex-1">
        <!-- Highlight layer -->
        <div
          ref="highlightRef"
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3 font-mono text-base whitespace-pre"
        ><span
            v-for="(token, i) in tokens"
            :key="i"
            :class="tokenClass(token.type)"
          >{{ token.text }}</span></div>

        <!-- Actual input — transparent text so the highlight layer shows through -->
        <input
          ref="inputRef"
          :value="modelValue"
          :disabled="disabled"
          type="text"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          :placeholder="wholeWord ? 'qu.*ing' : 'Type a regex, e.g. ^qu.*ing$'"
          class="relative w-full bg-transparent px-3 py-3 font-mono text-base text-transparent caret-gray-900 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:caret-gray-100 dark:placeholder-gray-500"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @scroll="syncScroll"
        />
      </div>

      <div class="flex shrink-0 items-center gap-2 pr-3">
        <span
          v-if="wholeWord"
          class="select-none font-mono text-base text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >$</span>
        <svg
          v-if="isSearching"
          class="h-5 w-5 animate-spin text-blue-500"
          aria-label="Searching..."
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <button
          v-if="modelValue && !isSearching"
          type="button"
          aria-label="Clear"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="emit('update:modelValue', ''); inputRef?.focus()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between">
      <label class="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <input
          :checked="wholeWord"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          @change="emit('update:wholeWord', ($event.target as HTMLInputElement).checked)"
        />
        Match whole word
      </label>
      <p v-if="error" class="text-sm text-red-500 dark:text-red-400">{{ error }}</p>
    </div>
  </div>
</template>
