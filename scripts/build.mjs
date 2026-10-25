// Builds the deployable site into dist/: a copy of site/ plus the blog generated
// from content/articles. With --drafts, builds into preview/ instead and includes
// drafts (marked noindex) so they can be read before approval. With --check,
// only validates.

import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Marked } from 'marked';
import { ROOT, CATEGORIES, loadContent, validate, wordCount } from './content.mjs';

const SITE = 'https://www.digitalrebuild.co.uk';
const args = new Set(process.argv.slice(2));
const withDrafts = args.has('--drafts');
const checkOnly = args.has('--check');
const OUT = join(ROOT, withDrafts ? 'preview' : 'dist');

const content = loadContent();
const { errors, warnings } = validate(content);
for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} error(s). Nothing was built.`);
  process.exit(1);
}

const pages = [...content.articles, ...(withDrafts ? content.drafts : [])].map((a) => ({
  ...a,
  published: a.published ?? a.scheduled,
  updated: a.updated ?? a.scheduled,
}));
pages.sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));

console.log(`${content.articles.length} article(s), ${content.drafts.length} draft(s) valid.`);
if (checkOnly) process.exit(0);

// --- helpers ---------------------------------------------------------------

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');
const ukDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function renderMarkdown(md) {
  const headings = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const id = slugify(html);
        if (depth === 2) headings.push({ id, html });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith(SITE);
        const attrs = external ? ' rel="noopener"' : '';
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${attrs}>${text}</a>`;
      },
    },
  });
  // Wrap tables so they scroll sideways on phones instead of breaking the layout.
  const html = marked.parse(md).replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  return { html, headings };
}

const LOGO = (size, fill) => `<svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="7" fill="${fill}"/><rect x="6" y="6" width="7" height="16" rx="2" fill="white"/><rect x="15" y="6" width="7" height="7" rx="2" fill="white" opacity="0.75"/><rect x="15" y="15" width="7" height="7" rx="2" fill="white" opacity="0.5"/></svg>`;

function layout({ title, description, canonical, ogType = 'website', schema, body, noindex }) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${canonical}">`}
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/Assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Digital Rebuild">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}/Assets/digital-rebuild-og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/Assets/blog.css">
  <script type="application/ld+json">
${json(schema)}
  </script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap site-header__inner">
      <a href="/" class="logo">${LOGO(28, 'var(--accent)')}Digital Rebuild</a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="/#services">Services</a>
        <a href="/#pricing">Pricing</a>
        <a href="/blog/" aria-current="${canonical.endsWith('/blog/') ? 'page' : 'false'}">Guides</a>
        <a href="/#contact">Contact</a>
      </nav>
      <a href="/#contact" class="btn">Free website check</a>
    </div>
  </header>
${body}
  <footer class="site-footer">
    <div class="wrap site-footer__inner">
      <div>
        <p class="logo logo--footer">${LOGO(24, '#01696f')}Digital Rebuild</p>
        <p>Modern websites for UK small businesses. Based in Barry, South Wales, serving the Vale of Glamorgan, Cardiff and UK remote clients.</p>
      </div>
      <ul>
        <li><a href="/#services">Services</a></li>
        <li><a href="/#pricing">Pricing</a></li>
        <li><a href="/blog/">Guides</a></li>
        <li><a href="/#contact">Free website check</a></li>
        <li><a href="tel:+447709498894">07709 498894</a></li>
      </ul>
    </div>
    <p class="wrap site-footer__copy">&copy; ${new Date().getFullYear()} Digital Rebuild</p>
  </footer>
</body>
</html>
`;
}

const ORG = { '@type': 'Organization', '@id': `${SITE}/#business`, name: 'Digital Rebuild', url: `${SITE}/` };
const AUTHOR = (name) => ({ '@type': 'Person', name, url: `${SITE}/#founding`, worksFor: ORG });

function articlePage(a, all) {
  const { html, headings } = renderMarkdown(a.body);
  const url = `${SITE}/blog/${a.slug}/`;
  const minutes = Math.max(1, Math.round(wordCount(a.body) / 230));
  const related = (a.related ?? []).map((s) => all.find((x) => x.slug === s)).filter(Boolean);
  const faq = a.faq ?? [];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: a.h1,
        description: a.description,
        datePublished: a.published,
        dateModified: a.updated,
        author: AUTHOR(a.author),
        publisher: ORG,
        mainEntityOfPage: url,
        image: `${SITE}/Assets/digital-rebuild-og.png`,
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE}/blog/` },
          { '@type': 'ListItem', position: 3, name: a.title, item: url },
        ],
      },
      ...(faq.length
        ? [{
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }]
        : []),
    ],
  };

  const body = `  <main id="main" class="wrap article">
    ${a.kind === 'draft' ? `<p class="draft-banner">Draft preview: ${esc(a.status)}, scheduled for ${ukDate(a.scheduled)}. Not published.</p>` : ''}
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/blog/">Guides</a> <span aria-hidden="true">/</span> <span>${esc(CATEGORIES[a.category])}</span></nav>
    <header class="article__head">
      <p class="eyebrow">${esc(CATEGORIES[a.category])}</p>
      <h1>${esc(a.h1)}</h1>
      <p class="meta">By ${esc(a.author)} &middot; <time datetime="${a.published}">${ukDate(a.published)}</time>${a.updated !== a.published ? ` &middot; Updated <time datetime="${a.updated}">${ukDate(a.updated)}</time>` : ''} &middot; ${minutes} min read</p>
    </header>
    ${headings.length >= 3 ? `<details class="toc" open><summary>In this guide</summary><ol>${headings.map((h) => `<li><a href="#${h.id}">${h.html}</a></li>`).join('')}</ol></details>` : ''}
    <div class="prose">
${html}
    </div>
    ${faq.length ? `<section class="faq" aria-labelledby="faq"><h2 id="faq">Common questions</h2>${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>` : ''}
    <aside class="cta" aria-label="Free website check">
      <h2>Want a second pair of eyes on your website?</h2>
      <p>Send me your current site and I'll reply with the three biggest fixes I'd make to help it bring in more enquiries. It's free, and there's no obligation.</p>
      <a href="/#contact" class="btn">Get a free website check</a>
    </aside>
    ${related.length ? `<section class="related" aria-labelledby="related"><h2 id="related">Related guides</h2><ul>${related.map((r) => `<li><a href="/blog/${r.slug}/">${esc(r.title)}</a></li>`).join('')}</ul></section>` : ''}
  </main>`;

  return layout({
    title: `${a.title} | Digital Rebuild`,
    description: a.description,
    canonical: url,
    ogType: 'article',
    schema,
    body,
    noindex: a.kind === 'draft',
  });
}

function indexPage(all) {
  const url = `${SITE}/blog/`;
  const cards = all.map((a) => `      <li class="card">
        <p class="eyebrow">${esc(CATEGORIES[a.category])}${a.kind === 'draft' ? ' &middot; DRAFT' : ''}</p>
        <h2><a href="/blog/${a.slug}/">${esc(a.title)}</a></h2>
        <p>${esc(a.description)}</p>
        <p class="meta"><time datetime="${a.published}">${ukDate(a.published)}</time></p>
      </li>`).join('\n');

  const body = `  <main id="main" class="wrap listing">
    <header class="listing__head">
      <p class="eyebrow">Guides</p>
      <h1>Plain-English website guides for UK small businesses</h1>
      <p>Practical advice on what a website should cost, how to get found on Google and how to turn visitors into enquiries. Written by Russell at Digital Rebuild in Barry, South Wales.</p>
    </header>
    ${all.length ? `<ul class="cards">\n${cards}\n    </ul>` : '<p class="empty">The first guides are on their way.</p>'}
  </main>`;

  return layout({
    title: 'Website guides for UK small businesses | Digital Rebuild',
    description: 'Plain-English guides on website costs, getting found on Google and turning visitors into enquiries, for UK small businesses and tradespeople.',
    canonical: url,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Website guides for UK small businesses',
      url,
      publisher: ORG,
      hasPart: all.filter((a) => a.kind === 'article').map((a) => ({ '@type': 'BlogPosting', headline: a.h1, url: `${SITE}/blog/${a.slug}/` })),
    },
    body,
    // An empty listing is not worth indexing; it starts counting once the first guide is live.
    noindex: withDrafts || !all.some((a) => a.kind === 'article'),
  });
}

// --- build -----------------------------------------------------------------

rmSync(OUT, { recursive: true, force: true });
cpSync(join(ROOT, 'site'), OUT, { recursive: true });

for (const a of pages) {
  mkdirSync(join(OUT, 'blog', a.slug), { recursive: true });
  writeFileSync(join(OUT, 'blog', a.slug, 'index.html'), articlePage(a, pages));
}
mkdirSync(join(OUT, 'blog'), { recursive: true });
writeFileSync(join(OUT, 'blog', 'index.html'), indexPage(pages));

const live = pages.filter((a) => a.kind === 'article');
const homeLastmod = readFileSync(join(ROOT, 'site/sitemap.xml'), 'utf8').match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
const urls = [
  { loc: `${SITE}/`, lastmod: homeLastmod },
  ...(live.length ? [{ loc: `${SITE}/blog/`, lastmod: live[0].updated }] : []),
  ...live.map((a) => ({ loc: `${SITE}/blog/${a.slug}/`, lastmod: a.updated })),
];
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`).join('\n')}
</urlset>
`);

if (live.length) {
  const llms = readFileSync(join(ROOT, 'site/llms.txt'), 'utf8').trimEnd();
  const list = live.map((a) => `- [${a.title}](${SITE}/blog/${a.slug}/): ${a.description}`).join('\n');
  writeFileSync(join(OUT, 'llms.txt'), `${llms}\n\n## Guides\n${list}\n`);
}

console.log(`Built ${pages.length} page(s) into ${withDrafts ? 'preview/' : 'dist/'}${withDrafts ? ' (drafts included, noindex)' : ''}.`);
