#!/usr/bin/env node
import { createWriteStream, statSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
import { createHash } from 'crypto'
import { createGzip } from 'zlib'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import words from 'an-array-of-english-words' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')

const sorted = [...new Set(words)].sort()
const content = sorted.join('\n')
console.log(`Preparing ${sorted.length} words...`)

// Compute content hash for cache-busting filename
const hash = createHash('md5').update(content).digest('hex').slice(0, 8)
const filename = `words.${hash}.txt.gz`

// Remove any previous hashed word files
for (const f of readdirSync(publicDir)) {
  if (/^words\.[a-f0-9]+\.txt\.gz$/.test(f)) unlinkSync(resolve(publicDir, f))
}

const outPath = resolve(publicDir, filename)
const gzip = createGzip({ level: 9 })
const out = createWriteStream(outPath)
gzip.pipe(out)
gzip.write(content)
gzip.end()

out.on('finish', () => {
  // Write manifest so the app can import the hashed filename at build time
  const manifestPath = resolve(__dirname, '../src/words-manifest.json')
  writeFileSync(manifestPath, JSON.stringify({ file: `/${filename}` }) + '\n')

  const kb = (statSync(outPath).size / 1024).toFixed(0)
  console.log(`Done: public/${filename} (${kb} KB)`)
})
