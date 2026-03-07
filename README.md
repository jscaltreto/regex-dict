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

The compressed word list at `public/words.txt.gz` is pre-built and committed. To regenerate it from the upstream source (requires `curl` and `gzip`):

```bash
npm run prepare-words
```

## Attribution

Word list sourced from [dwyl/english-words](https://github.com/dwyl/english-words), released under the [Unlicense](https://unlicense.org/) (public domain).

## License

[MIT](https://opensource.org/licenses/MIT)
