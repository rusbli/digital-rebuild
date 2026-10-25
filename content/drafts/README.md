# Article drafts: handoff for Hermes

This folder holds finished article drafts for digitalrebuild.co.uk. Nothing in this folder is published. The live site only builds articles from `content/articles/`, and commits that only touch this folder do not deploy.

Written 25 October 2026 by Claude for Russell Blight.

## How publishing works

1. Claude writes drafts into this folder, each with `status: "draft"` and a `scheduled` date.
2. Russell reads them and approves the ones he's happy with. Approving sets `status: "approved"`.
3. On Monday, Wednesday and Friday, Hermes runs `npm run publish-next`. It moves the earliest approved draft that is due into `content/articles/`, sets its dates and checks every rule.
4. Hermes commits and pushes to `main`. GitHub Actions builds the site and uploads it to IONOS. The article is live a minute or two later.

Russell approves every draft for the first month (until 20 November 2026). After that he may switch to automatic approval; until he says so in writing, never publish an unapproved draft.

## The schedule

| Date | Day | Slug | Category |
|---|---|---|---|
| 2026-10-26 | Mon | `small-business-website-cost-uk` | costs-and-planning |
| 2026-10-28 | Wed | `business-not-showing-on-google` | getting-found |
| 2026-10-30 | Fri | `website-not-getting-enquiries` | more-enquiries |
| 2026-11-02 | Mon | `google-business-profile-for-trades` | getting-found |
| 2026-11-04 | Wed | `do-i-need-a-website-if-i-have-facebook` | costs-and-planning |
| 2026-11-06 | Fri | `plumber-website-what-to-include` | more-enquiries |
| 2026-11-09 | Mon | `how-to-get-more-google-reviews` | getting-found |
| 2026-11-11 | Wed | `wix-squarespace-or-custom-website` | costs-and-planning |
| 2026-11-13 | Fri | `small-business-homepage-what-to-include` | more-enquiries |
| 2026-11-16 | Mon | `who-owns-my-website` | costs-and-planning |
| 2026-11-18 | Wed | `hiring-a-web-designer-cardiff` | costs-and-planning |
| 2026-11-20 | Fri | `signs-your-website-needs-a-rebuild` | costs-and-planning |

Later drafts link to earlier ones, so the order matters. If a draft is approved late, the queue simply slides: each run publishes the earliest approved draft that is due. The validator refuses to publish a draft whose links point to an article that isn't live yet, and puts it back untouched.

## Commands

Run these from the repository root. Run `npm ci` once after cloning.

| Command | What it does |
|---|---|
| `npm run drafts` | Lists every draft with its date, status and word count, and flags anything due |
| `npm run approve -- <slug>` | Marks a draft as approved |
| `npm run publish-next` | Publishes the earliest approved draft that is due today or earlier, or prints `NOTHING PUBLISHED` and why |
| `npm run check` | Checks every article and draft against the rules without building |
| `npm run build` | Builds the full site into `dist/` (the deploy does this itself) |
| `npm run preview` then `npm run serve` | Builds drafts into `preview/` and serves them at http://localhost:8765/blog/ for reading |

## Hermes job 1: publish (Monday, Wednesday, Friday, 08:00 Europe/London)

Use this as the complete cron prompt. It must be self-contained because each cron run starts fresh.

```text
You are publishing the next scheduled article on Russell Blight's website, digitalrebuild.co.uk.

Repository: the local clone of https://github.com/rusbli/digital-rebuild on branch main.

Steps:
1. In the repository, run: git checkout main && git pull --ff-only. If the working tree has uncommitted changes, stop and tell Russell instead of continuing.
2. Run: npm ci --no-audit --no-fund
3. Run: npm run publish-next
4. If the output starts with "NOTHING PUBLISHED", do not commit anything. Send Russell the output line in Telegram and stop.
5. If it starts with "PUBLISHED", run: npm run build. If the build fails, run git checkout -- . && git clean -fd content, tell Russell the error, and stop.
6. Commit only the changed files under content/ with the message:
   content: publish <slug>
7. Push to origin main.
8. Wait 3 minutes, then check that the URL printed by publish-next returns HTTP 200. Also check the latest "Deploy website to IONOS" run on GitHub succeeded.
9. Send Russell in Telegram: the article title, its live URL, and whether the deploy check passed.

Rules:
- Never edit the wording, facts or prices of an article. If something looks wrong, tell Russell and do not publish.
- Never publish a draft whose status is not "approved". Only npm run publish-next decides what goes live.
- Never use git push --force, never rewrite history, never touch files outside content/.
- Never add affiliate links, tracking code or images.
```

## Hermes job 2: review reminder (Sunday, 18:00 Europe/London)

```text
You are reminding Russell Blight to review upcoming article drafts for digitalrebuild.co.uk.

1. In the local clone of https://github.com/rusbli/digital-rebuild, run git pull --ff-only, then npm ci --no-audit --no-fund, then npm run drafts.
2. Find the drafts scheduled in the next 7 days whose status is "draft".
3. Send Russell one Telegram message listing each one: scheduled date, title, and a link to read it at
   https://github.com/rusbli/digital-rebuild/blob/main/content/drafts/<slug>.md
4. Tell him to reply "approve <slug>" for each one he's happy with, or tell you what to change.
5. If there are 3 or fewer drafts left in total, add: "The queue is running low. Ask Claude to write the next batch."
Do not approve anything yourself.
```

## When Russell replies "approve <slug>"

1. `git pull --ff-only`
2. `npm run approve -- <slug>`
3. `npm run check` must pass.
4. Commit `content/drafts/<slug>.md` with the message `content: approve <slug>` and push. This does not deploy anything.
5. Confirm in Telegram.

If Russell asks for a change to a draft instead, don't rewrite it yourself. Note the change and tell him to pass it to Claude, or make only the exact wording change he gave you, then run `npm run check`.

## Rules every article must follow

These are enforced by `scripts/content.mjs` where possible. They apply to every future batch too.

- UK English. No em dashes, and no spaced en dashes used as dashes. The build fails on them.
- Author is always "Russell Blight", writing as himself, in the first person where natural.
- Never invent clients, case studies, results, statistics, reviews or stories told as if they happened. The plumbing designs on the homepage are sample concepts and must be described that way.
- Every fact about Google, prices or regulations needs a primary source linked in the text. Prices need the date they were checked.
- One primary keyword per article, never reused. The validator rejects duplicates.
- Internal links use `/blog/<slug>/` and may only point to articles that are already live, or drafts scheduled earlier.
- Every article ends with the free website check box. The template adds it, so don't write your own sign-off sales pitch.
- Help first. No pressure selling, no fake urgency, no guarantees of rankings.

## Front matter reference

```yaml
---
title: "Up to 65 characters, used in the browser tab and Google"
h1: "The on-page headline"
description: "120 to 165 characters for Google's snippet"
slug: "matches-the-file-name"
category: "costs-and-planning"   # or getting-found, more-enquiries
primaryKeyword: "unique across all articles"
author: "Russell Blight"
status: "draft"                  # drafts only: draft or approved
scheduled: "2026-11-23"          # drafts only
related: ["earlier-slug"]        # optional
faq:                             # optional, shown on the page
  - q: "Question?"
    a: "Answer."
---
```

`publish-next` removes `status` and `scheduled` and adds `published` and `updated`.

## Ideas for the next batch

Not yet written. Check each against live search results before writing.

- Website for electricians: what to include
- How to write a services page that gets enquiries
- What is Google Search Console, and what should a small business look at in it?
- Do I need a cookie banner on my small business website? (needs ICO sources)
- Website for cleaners and domestic services
- How to take photos of your work for your website
- Local landing pages: do you need a page for every town?
- How fast should a small business website load?
- Booking systems for small businesses: built in or a separate tool?
- Website for builders and kitchen fitters
- What to put on an about page
- How to choose a domain name for a small business
