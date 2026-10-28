import type { Plugin } from 'vite'
import { experience, profile, projects, skills } from './src/lib/content.ts'

/** Where the site is served. Used for canonical links, Open Graph, the sitemap and structured data. */
export const SITE_URL = 'https://viandwi24.com'

const TITLE = `${profile.name} (@${profile.handle}) · ${profile.role}`
const DESCRIPTION =
  `${profile.name} is a ${profile.role.toLowerCase()} from Indonesia building web apps, web games and Solana / web3 projects. ` +
  'Walk around a little voxel house in a Japanese street to see his projects, experience and how to reach him.'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const sameAs = profile.links.filter((l) => l.url.startsWith('http')).map((l) => l.url)

/** Head tags: description, canonical, Open Graph, Twitter card, theme colors and JSON-LD. */
function headTags() {
  const og = `${SITE_URL}/og.png`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: profile.name,
        alternateName: profile.handle,
        jobTitle: profile.role,
        description: profile.bio.join(' '),
        url: SITE_URL,
        image: `${SITE_URL}/avatar.png`,
        email: profile.links.find((l) => l.url.startsWith('mailto:'))?.url,
        sameAs,
        knowsAbout: skills.flatMap((g) => g.items.map(([name]) => name)),
        worksFor: { '@type': 'Organization', name: experience[0].company },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: profile.name,
        description: DESCRIPTION,
        inLanguage: 'en',
        author: { '@id': `${SITE_URL}/#person` },
      },
    ],
  }
  return `
    <title>${esc(TITLE)}</title>
    <meta name="description" content="${esc(DESCRIPTION)}" />
    <meta name="author" content="${esc(profile.name)}" />
    <meta name="keywords" content="${esc([profile.name, profile.handle, 'portfolio', 'web developer', 'blockchain developer', 'Solana', 'Svelte', 'Three.js', 'voxel', 'Indonesia'].join(', '))}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${SITE_URL}/" />

    <meta property="og:type" content="profile" />
    <meta property="og:site_name" content="${esc(profile.name)}" />
    <meta property="og:title" content="${esc(TITLE)}" />
    <meta property="og:description" content="${esc(DESCRIPTION)}" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:image" content="${og}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="A voxel house on a Japanese street: the portfolio of ${esc(profile.name)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="profile:first_name" content="Alfian" />
    <meta property="profile:last_name" content="Dwi Nugraha" />
    <meta property="profile:username" content="${esc(profile.handle)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(TITLE)}" />
    <meta name="twitter:description" content="${esc(DESCRIPTION)}" />
    <meta name="twitter:image" content="${og}" />
    <meta name="twitter:image:alt" content="A voxel house on a Japanese street: the portfolio of ${esc(profile.name)}" />

    <meta name="theme-color" content="#dfa25a" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#161d3a" media="(prefers-color-scheme: dark)" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
}

/**
 * The site is drawn in WebGL, so crawlers and no-JS visitors would see nothing.
 * This is the same content as plain HTML, shown only when JavaScript is off.
 */
function noscript() {
  const link = (url: string, label: string) => `<a href="${esc(url)}" rel="noopener">${esc(label)}</a>`
  return `
    <noscript>
      <style>html, body { overflow: auto; height: auto; } #app { display: none; }</style>
      <main class="static">
        <header>
          <img src="/avatar.webp" alt="${esc(profile.name)}" width="96" height="96" />
          <h1>${esc(profile.name)}</h1>
          <p>${esc(profile.role)} · @${esc(profile.handle)}</p>
        </header>
        <section>
          <h2>About</h2>
          ${profile.bio.map((p) => `<p>${esc(p)}</p>`).join('')}
          <ul>${profile.links.map((l) => `<li>${link(l.url, l.label)}</li>`).join('')}</ul>
        </section>
        <section>
          <h2>Skills</h2>
          ${skills.map((g) => `<h3>${esc(g.title)}</h3><p>${g.items.map(([n]) => esc(n)).join(', ')}</p>`).join('')}
        </section>
        <section>
          <h2>Experience</h2>
          <ul>${experience.map((e) => `<li><strong>${esc(e.role)}</strong>, ${esc(e.company)} (${esc(e.date)}): ${e.tasks.map(esc).join('; ')}</li>`).join('')}</ul>
        </section>
        <section>
          <h2>Projects</h2>
          <ul>${projects
            .map((p) => `<li><strong>${esc(p.title)}</strong> (${p.year}, ${esc(p.type)}): ${esc(p.description)} ${p.links.map((l) => link(l.url, l.label)).join(' ')}</li>`)
            .join('')}</ul>
        </section>
        <p>Turn on JavaScript to walk around the voxel house.</p>
      </main>
    </noscript>`
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image><image:loc>${SITE_URL}/og.png</image:loc></image:image>
${projects
  .filter((p) => p.image)
  .map((p) => `    <image:image><image:loc>${SITE_URL}${p.image}</image:loc></image:image>`)
  .join('\n')}
  </url>
</urlset>
`
}

const robots = () => `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

const manifest = () =>
  JSON.stringify(
    {
      name: profile.name,
      short_name: profile.handle,
      description: DESCRIPTION,
      start_url: '/',
      display: 'standalone',
      background_color: '#dfa25a',
      theme_color: '#dfa25a',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  )

/** Injects SEO tags and a no-JS fallback into index.html, and emits sitemap.xml, robots.txt and the web manifest. */
export function seo(): Plugin {
  const files: Record<string, () => string> = {
    'sitemap.xml': sitemap,
    'robots.txt': robots,
    'site.webmanifest': manifest,
  }
  const types: Record<string, string> = { xml: 'application/xml', txt: 'text/plain', webmanifest: 'application/manifest+json' }
  return {
    name: 'seo',
    transformIndexHtml(html) {
      return html.replace('<!--seo-head-->', headTags()).replace('<!--seo-body-->', noscript())
    },
    // Served in dev, written on build
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.slice(1) ?? ''
        if (!(name in files)) return next()
        res.setHeader('Content-Type', types[name.split('.').pop()!])
        res.end(files[name]())
      })
    },
    generateBundle() {
      for (const [fileName, make] of Object.entries(files)) this.emitFile({ type: 'asset', fileName, source: make() })
    },
  }
}
