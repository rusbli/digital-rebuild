// Draft queue commands, so the publishing agent runs fixed steps instead of
// editing files by hand.
//
//   npm run drafts                 list drafts with their schedule and status
//   npm run approve -- <slug>      mark a draft as approved
//   npm run publish-next           publish the earliest due draft (approved only, if
//                                  content/publishing.json requires approval)
//   npm run next-date              print the date a newly written draft should use
//   npm run reschedule             re-date every draft one per day from today, keeping order
//
// At most one article is published per day, however often publish-next runs.

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, ARTICLES_DIR, DRAFTS_DIR, loadContent, validate, today, wordCount } from './content.mjs';

const [command, slug] = process.argv.slice(2);
const content = loadContent();
const { requireApproval } = JSON.parse(readFileSync(join(ROOT, 'content/publishing.json'), 'utf8'));
const drafts = [...content.drafts].sort((a, b) => a.scheduled.localeCompare(b.scheduled));

function fail(message) {
  console.error(message);
  process.exit(1);
}

function addDays(date, days) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function setFields(path, fields) {
  let raw = readFileSync(path, 'utf8');
  const end = raw.indexOf('\n---\n', 4);
  let fm = raw.slice(4, end);
  const rest = raw.slice(end);
  for (const [key, value] of Object.entries(fields)) {
    const line = new RegExp(`^${key}:.*$`, 'm');
    if (value === null) fm = fm.replace(new RegExp(`^${key}:.*\\n?`, 'm'), '');
    else if (line.test(fm)) fm = fm.replace(line, `${key}: "${value}"`);
    else fm = `${fm}\n${key}: "${value}"`;
  }
  raw = `---\n${fm.replace(/\n+$/, '')}${rest}`;
  writeFileSync(path, raw);
}

if (command === 'list') {
  const now = today();
  console.log(`Today: ${now}. Published articles: ${content.articles.length}. Drafts queued: ${drafts.length}. Approval ${requireApproval ? 'required' : 'not required'}.\n`);
  if (!drafts.length) console.log('No drafts left. Write the next one.');
  for (const d of drafts) {
    const due = d.scheduled <= now ? (d.status === 'approved' || !requireApproval ? 'DUE' : 'DUE, NOT APPROVED') : '';
    console.log(`${d.scheduled}  ${d.status.padEnd(8)}  ${String(wordCount(d.body)).padStart(5)} words  ${d.slug}  ${due}`);
  }
} else if (command === 'approve') {
  if (!slug) fail('Usage: npm run approve -- <slug>');
  const draft = drafts.find((d) => d.slug === slug);
  if (!draft) fail(`No draft called "${slug}". Run npm run drafts to see the list.`);
  setFields(draft.path, { status: 'approved' });
  console.log(`Approved ${slug} (scheduled ${draft.scheduled}).`);
} else if (command === 'publish-next') {
  const now = today();
  const already = content.articles.find((a) => a.published === now);
  if (already) {
    console.log(`NOTHING PUBLISHED: "${already.slug}" already went live today.`);
    process.exit(0);
  }
  const next = drafts.find((d) => (d.status === 'approved' || !requireApproval) && d.scheduled <= now);
  if (!next) {
    const waiting = drafts.find((d) => d.scheduled <= now);
    console.log(waiting
      ? `NOTHING PUBLISHED: "${waiting.slug}" was due ${waiting.scheduled} but is not approved yet.`
      : 'NOTHING PUBLISHED: no draft is due today.');
    process.exit(0);
  }
  const target = join(ARTICLES_DIR, next.file);
  if (existsSync(target)) fail(`content/articles/${next.file} already exists.`);
  renameSync(next.path, target);
  setFields(target, { published: now, updated: now, status: null, scheduled: null });

  const { errors } = validate(loadContent());
  if (errors.length) {
    renameSync(target, join(DRAFTS_DIR, next.file));
    setFields(join(DRAFTS_DIR, next.file), { published: null, updated: null, status: next.status, scheduled: next.scheduled });
    fail(`Publishing ${next.slug} would break validation, so it was put back:\n${errors.join('\n')}`);
  }
  console.log(`PUBLISHED: ${next.slug}`);
  console.log(`URL: https://www.digitalrebuild.co.uk/blog/${next.slug}/`);
} else if (command === 'next-date') {
  // The day after the last queued draft, or today if the queue is empty or behind.
  const last = drafts.at(-1)?.scheduled;
  const candidate = last ? addDays(last, 1) : today();
  console.log(candidate < today() ? today() : candidate);
} else if (command === 'reschedule') {
  drafts.forEach((d, i) => setFields(d.path, { scheduled: addDays(today(), i) }));
  console.log(`Rescheduled ${drafts.length} draft(s), one per day from ${today()}.`);
} else {
  fail('Usage: node scripts/drafts.mjs list | approve <slug> | publish-next | next-date | reschedule');
}
