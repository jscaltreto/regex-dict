import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/data/site'
import { faqItems } from './src/data/faq'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

function inlineJson(value: unknown): string {
  return JSON.stringify(value, null, 2).replace(/\n/g, '\n    ')
}

function jsonLdScript(schema: unknown): string {
  return `<script type="application/ld+json">\n    ${inlineJson(schema)}\n    <\/script>`
}

function siteMetaPlugin() {
  return {
    name: 'site-meta',
    transformIndexHtml(html: string) {
      // Placeholder substitution
      html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        const value = site[key as keyof typeof site]
        return value ?? `{{${key}}}`
      })

      // WebApplication JSON-LD
      const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: site.name,
        url: site.url,
        description:
          'Search a dictionary of 275,000+ English words using regular expressions. Runs entirely in the browser via a Web Worker — no server, no data sent anywhere.',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires a modern browser with JavaScript enabled',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          'Regex word search across 275,000+ English words',
          'Entirely client-side — no server required',
          'Works offline after first load',
          'Runs in a background Web Worker for a responsive UI',
          'Dark mode support',
        ],
      }
      html = html.replace('<!--web-app-schema-->', jsonLdScript(webAppSchema))

      // FAQPage JSON-LD
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: stripHtml(item.a) },
        })),
      }
      html = html.replace('<!--faq-schema-->', jsonLdScript(faqSchema))

      return html
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), vue(), siteMetaPlugin()],
  build: {
    target: 'es2022',
  },
})
