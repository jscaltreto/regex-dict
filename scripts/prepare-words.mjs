#!/usr/bin/env node
import { createWriteStream, statSync } from 'fs'
import { createGzip } from 'zlib'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import words from 'an-array-of-english-words' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '../public/words.txt.gz')

const sorted = [...new Set(words)].sort()
console.log(`Preparing ${sorted.length} words...`)

const gzip = createGzip({ level: 9 })
const out = createWriteStream(outPath)
gzip.pipe(out)
gzip.write(sorted.join('\n'))
gzip.end()

out.on('finish', () => {
  const kb = (statSync(outPath).size / 1024).toFixed(0)
  console.log(`Done: public/words.txt.gz (${kb} KB)`)
})
