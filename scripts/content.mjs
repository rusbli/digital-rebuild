// Loads and validates articles (content/articles) and drafts (content/drafts).
// Shared by build.mjs and drafts.mjs so both apply exactly the same rules.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const ARTICLES_DIR = join(ROOT, 'content/articles');
export const DRAFTS_DIR = join(ROOT, 'content/drafts');

export const CATEGORIES = {
  'costs-and-planning': 'Website costs and planning',
  'getting-found': 'Getting found on Google',
  'more-enquiries': 'Turning visitors into enquiries',
};

const REQUIRED = ['title', 'h1', 'description', 'slug', 'category', 'primaryKeyword', 'author'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Words and moves from the house style guide. Reported as warnings, not errors.
const SLOP = [
  'delve', 'tapestry', 'testament', 'pivotal', 'underscore', 'showcase', 'foster',
  'robust', 'vibrant', 'meticulous', 'moreover', 'furthermore', 'nestled',
  'groundbreaking', "in today's world", 'in a world where', 'when it comes to',
  'at the end of the day', "let's dive in", "let's unpack", "here's what you need to know",
  'at its core', 'moving forward', 'game-changer', 'unlock',
];

export function today() {
  // UK date, so a run just after midnight in summer is not a day behind.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
}

export function splitFrontMatter(raw, file) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing front matter block`);
  return { data: parseYaml(match[1]) ?? {}, body: match[2], frontMatter: match[1] };
}

function readDir(dir, kind) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => {
      const path = join(dir, f);
      const raw = readFileSync(path, 'utf8');
      const { data, body } = splitFrontMatter(raw, f);
      return { ...data, body, kind, file: f, path };
    });
}

export function loadContent() {
  return { articles: readDir(ARTICLES_DIR, 'article'), drafts: readDir(DRAFTS_DIR, 'draft') };
}

export function wordCount(md) {
  return md.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`|\-[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function internalBlogLinks(body) {
  return [...body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/?(?:#[^)]*)?\)/g)].map((m) => m[1]);
}

// Returns { errors, warnings }. An article may only link to published articles;
// a draft may also link to drafts scheduled before it, because those go live first.
export function validate({ articles, drafts }) {
  const errors = [];
  const warnings = [];
  const all = [...articles, ...drafts];
  const now = today();

  const seen = (key) => {
    const counts = new Map();
    for (const item of all) {
      const v = String(item[key] ?? '').toLowerCase();
      if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    return counts;
  };
  const slugCounts = seen('slug');
  const keywordCounts = seen('primaryKeyword');
  const published = new Set(articles.map((a) => a.slug));

  for (const item of all) {
    const where = `${item.kind === 'draft' ? 'content/drafts' : 'content/articles'}/${item.file}`;
    const err = (m) => errors.push(`${where}: ${m}`);
    const warn = (m) => warnings.push(`${where}: ${m}`);

    for (const field of REQUIRED) if (!item[field]) err(`missing "${field}"`);
    if (item.slug && !SLUG.test(item.slug)) err(`slug "${item.slug}" must be lowercase words joined by hyphens`);
    if (item.slug && basename(item.file, '.md') !== item.slug) err(`file name must be ${item.slug}.md`);
    if (item.slug && slugCounts.get(item.slug.toLowerCase()) > 1) err(`slug "${item.slug}" is used more than once`);
    if (item.primaryKeyword && keywordCounts.get(String(item.primaryKeyword).toLowerCase()) > 1) {
      err(`primaryKeyword "${item.primaryKeyword}" is used by another article`);
    }
    if (item.category && !CATEGORIES[item.category]) err(`category must be one of ${Object.keys(CATEGORIES).join(', ')}`);
    if (item.title && item.title.length > 65) err(`title is ${item.title.length} characters (max 65)`);
    if (item.description && (item.description.length < 120 || item.description.length > 165)) {
      err(`description is ${item.description.length} characters (must be 120 to 165)`);
    }

    if (item.kind === 'article') {
      for (const field of ['published', 'updated']) {
        if (!DATE.test(String(item[field] ?? ''))) err(`"${field}" must be a quoted date like "2026-10-26"`);
      }
      if (DATE.test(item.published ?? '') && item.published > now) err(`published date ${item.published} is in the future`);
      if (item.updated < item.published) err('updated date is before published date');
    } else {
      if (!DATE.test(String(item.scheduled ?? ''))) err('"scheduled" must be a quoted date like "2026-10-26"');
      if (!['draft', 'approved'].includes(item.status)) err('"status" must be "draft" or "approved"');
    }

    const text = `${item.title}\n${item.h1}\n${item.description}\n${item.body}\n${JSON.stringify(item.faq ?? [])}`;
    if (text.includes('—')) err('contains an em dash; rewrite the sentence');
    if (/\s–\s/.test(text)) err('contains a spaced en dash used as a dash; rewrite the sentence');
    for (const phrase of SLOP) {
      if (new RegExp(`\\b${phrase.replace(/'/g, "['’]")}\\b`, 'i').test(item.body)) warn(`uses "${phrase}"`);
    }

    const h2s = (item.body.match(/^## /gm) ?? []).length;
    if (h2s < 2) err('needs at least two "## " subheadings');
    if (/^# /m.test(item.body)) err('body must not contain a "# " heading; the H1 comes from front matter');

    if (item.faq !== undefined) {
      if (!Array.isArray(item.faq) || item.faq.some((f) => !f?.q || !f?.a)) err('faq must be a list of { q, a }');
    }

    const linkable = new Set(published);
    if (item.kind === 'draft') {
      for (const d of drafts) if (d.scheduled < item.scheduled) linkable.add(d.slug);
    }
    const targets = [...internalBlogLinks(item.body), ...(item.related ?? [])];
    for (const target of targets) {
      if (target === item.slug) err('links to itself');
      else if (!linkable.has(target)) {
        err(`links to /blog/${target}/, which ${item.kind === 'draft' ? 'is not published or scheduled earlier' : 'is not published'}`);
      }
    }

    const words = wordCount(item.body);
    if (words < 1000) warn(`only ${words} words`);
  }

  return { errors, warnings };
}
