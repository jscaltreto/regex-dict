# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check (vue-tsc) then bundle to dist/
npm run preview    # serve dist/ locally
```

There are no tests and no linter configured beyond `vue-tsc` (run implicitly by `npm run build`).

## Architecture

This is a single-page Vue 3 app that searches ~275,000 English words via regex, entirely client-side. There is no backend.

### Data flow

1. `src/main.ts` mounts `App.vue`
2. `App.vue` calls `useRegexSearch()` (composable) and passes reactive state down to components
3. `useRegexSearch` spawns a Web Worker (`src/workers/matcher.worker.ts`) and owns all search state — pattern, whole-word toggle, matches, error, loading status, corpus size
4. The worker imports the word list from the `an-array-of-english-words` npm package (bundled into the worker chunk at build time, ~3.3 MB). It processes searches in 50K-word chunks via `setTimeout` to avoid blocking, with a 5-second ReDoS timeout
5. Whole-word mode wraps the user pattern as `^(?:pattern)$` before compiling the regex (done on both main thread for validation and in worker for matching)

### index.html is a template

`index.html` uses `{{placeholder}}` syntax and `<!--comment-->` placeholders that are filled at build time by the `siteMetaPlugin` in `vite.config.ts`. Do not hardcode values directly in `index.html`.

- **`src/data/site.ts`** — single source of truth for `name`, `title`, `url`, `description`. These are substituted into all meta tags, OG tags, Twitter card, canonical link, and the WebApplication JSON-LD schema.
- **`src/data/faq.ts`** — single source of truth for FAQ content. The `Faq.vue` component imports from here, and the plugin generates the FAQPage JSON-LD from the same data. HTML tags are stripped when writing to JSON-LD.

To add or update FAQ items, edit only `src/data/faq.ts`. To change the site title/URL/description, edit only `src/data/site.ts`.

### Key subtlety: whole-word match affects example regexes

When writing regex examples in FAQ answers or documentation, remember that whole-word mode (the default) wraps patterns as `^(?:pattern)$`. This means:
- `tion` matches only the word "tion", not words *ending* in "tion" — use `.*tion`
- `[aeiou]{3}` matches only 3-letter all-vowel words — use `.*[aeiou]{3}.*` for words *containing* three consecutive vowels
- Anchors in user patterns (`^`, `$`) are redundant but harmless under whole-word mode
