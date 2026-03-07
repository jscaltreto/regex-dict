# Regex Dictionary

Search a large English word list using regular expressions — entirely in the browser.

**[regexdict.com](https://regexdict.com)**

## Features

- **Client-side only** — no server, no backend, no data sent anywhere
- **Web Worker** — regex matching runs off the main thread so the UI stays responsive
- **Syntax highlighting** — matched portions of each word are highlighted
- **Offline after first load** — the word list is cached by the browser
- **Dark mode** — follows your system preference

## Tech Stack

- [Vue 3](https://vuejs.org/) + Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Local Development

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Updating the Word List

The word list is generated at build time from the [`an-array-of-english-words`](https://github.com/words/an-array-of-english-words) npm package and is not committed to the repo. To regenerate it manually:

```bash
npm run prepare-words
```

## Attribution

Word list sourced from [an-array-of-english-words](https://github.com/words/an-array-of-english-words) (derived from the [Letterpress](https://github.com/lorenbrichter/Words) word list), MIT licensed.

## License

[MIT](https://opensource.org/licenses/MIT)
