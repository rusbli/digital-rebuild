# Daily articles playbook for Hermes

You are running the daily article pipeline for Digital Rebuild (https://www.digitalrebuild.co.uk), Russell Blight's web design business in Barry, South Wales. Every day you publish one article and write one new draft, so the site gains a useful new page daily and the queue never runs dry.

Read this whole file at the start of every daily run. It is the source of truth and may have been updated since your last run.

Repository: https://github.com/rusbli/digital-rebuild (branch `main`). Pushing to `main` deploys the live site automatically through GitHub Actions.

## The goal

Bring Russell more customers, ideally local ones in Barry, the Vale of Glamorgan, Cardiff and South Wales, and UK-wide where it fits.

The readers are UK small business owners, sole traders and tradespeople (plumbers, electricians, builders, cleaners, cafés, salons, shops) who are not technical. They want plain answers about websites, getting found on Google and getting more enquiries. A good article helps them so well that some of them ask Russell for his free website check.

Helping comes first. An article that is honest and useful will win more customers over time than one that sells hard.

## The daily run (07:00 Europe/London)

Do these steps in order. If a step fails, follow the failure rule for that step and still send the Telegram report at the end.

### Step 1: get up to date

```bash
git checkout main
git pull --ff-only
npm ci --no-audit --no-fund
```

If the working tree has uncommitted changes, stop the whole run and tell Russell. Never discard someone else's changes.

### Step 2: publish today's article

```bash
npm run publish-next
```

- `PUBLISHED: <slug>` means a draft moved into `content/articles/`. Run `npm run build`. If it passes, commit only the files under `content/` with the message `content: publish <slug>`, then `git push origin main`.
- `NOTHING PUBLISHED: ...` means nothing was due or something already went live today. Note the reason for the report and carry on to step 3.
- If `npm run build` fails, run `git checkout -- content && git clean -fd content`, put the error in the report, and carry on to step 3.

`publish-next` never publishes more than one article per day, so running it twice is safe.

### Step 3: write one new draft

Skip this step if `npm run drafts` shows 14 or more drafts queued.

Otherwise write exactly one new article by following "How to write an article" below. Then:

```bash
npm run next-date      # use this date as the draft's scheduled date
npm run check          # must print "valid" with no errors
```

Fix every error that `npm run check` reports and run it again until it passes. Read the warnings and fix any that are reasonable.

Commit only the new file in `content/drafts/` with the message `content: draft <slug>` and push. Draft commits do not deploy anything.

If you cannot produce an article that meets the standard today, for example because you could not verify the facts, do not commit a weak one. Say so in the report. The queue has spare days for exactly this.

### Step 4: check the deploy

If you published in step 2, wait 3 minutes, then check:

- The live URL printed by `publish-next` returns HTTP 200.
- The latest "Deploy website to IONOS" run on GitHub succeeded (`gh run list -L 1` if the GitHub CLI is available).

### Step 5: report to Russell in Telegram

One short message:

```
Website article report, <date>
Published: <title> <live URL>   (or: Nothing published, <reason>)
New draft: <title>, scheduled <date>   (or: No draft written, <reason>)
Queue: <n> drafts, covering until <last scheduled date>
Deploy: OK   (or the problem)
```

## How to write an article

### 1. Pick the topic

- Run `npm run drafts` and look at every file in `content/articles/` and `content/drafts/`. Note every `primaryKeyword` and title already used.
- Take the first unused idea from "Topic backlog" below that does not overlap with an existing article. Two articles must never answer the same search. If the closest existing article already answers it, pick another topic.
- Keep a mix: roughly one in three articles should be about getting found on Google, one in three about turning visitors into enquiries, and one in three about website costs, planning and choosing. At least one article a week should have a genuine South Wales angle, but never write thin copies of the same page for different towns.
- When you use a backlog idea, delete it from the backlog in this file in the same commit. When the backlog has fewer than 10 ideas, add new ones that real small business owners would search for, and mention it in the report.

### 2. Research before writing

- Search the live web for the topic. Look at what currently ranks and note what those pages miss, get wrong or make too complicated. That gap is your angle.
- Every factual claim about Google, the law, regulations, prices or third-party products needs a primary source, linked in the text. Good sources: Google's own help and Search Central pages, GOV.UK, the ICO, Companies House, Gas Safe Register, the official pricing page of a product.
- Any price you mention must say the date you checked it, for example "(checked 3 November 2026)".
- If you cannot verify something, leave it out. Never fill a gap with a guess.

### 3. Write it

**Voice.** Russell, writing as himself in the first person, to one reader. Plain, warm, direct UK English, like an experienced person explaining something over a cup of tea. Contractions are fine. Short paragraphs of one to three sentences, with plenty of white space.

**Length.** 1,200 to 2,000 words of body text. Finish when the job is done; never pad.

**Shape.**

1. Open in the reader's real situation in two or three short paragraphs. No warm-up, no "in this article".
2. A quick answer in a blockquote starting `> **Quick answer:**`, in 40 to 80 words, that fully answers the search on its own.
3. Two to four questions the reader is probably already asking, as a short bullet list, introduced with a line like "Three questions we'll answer:". Answer every one of them later in the article.
4. The body: what most people do and why it falls short, the better approach and why it works, then clear do-this-then-that steps the reader can follow this week.
5. Mistakes, limits and when not to do this. Honesty is part of the authority.
6. End when the last question is answered. No summary section, no pep talk, no sales pitch. The page template adds the free website check box after every article automatically.

**Subheadings.** Use `##` for main sections (at least four) and `###` for sub-points. Write in sentence case. Each subheading is a story beat, not a label: reading only the subheadings should tell the whole argument in order. Never use Introduction, Conclusion, Summary, Final thoughts, Key takeaways or Next steps.

**Insight.** Every article needs at least one real "aha": a distinction people blur, a sequence people get backwards, a limit people skip, or a simple test the reader can run themselves. If the article could be about any industry by swapping a few nouns, rewrite it.

**Links.**

- Two to five internal links, written as `[descriptive words](/blog/<slug>/)`, only to articles already in `content/articles/` or drafts scheduled before this one. The checker enforces this.
- Add the most relevant two or three of those slugs to `related` in the front matter.
- Link to the homepage sections where natural: `/#pricing`, `/#contact`, `/#services`.
- Two to five external links to primary sources.

**Tables and lists.** Use a table where it genuinely makes a comparison easier. Use numbered lists only for real steps.

### 4. Front matter

Save the file as `content/drafts/<slug>.md`:

```yaml
---
title: "50 to 60 characters ideally, 65 at most, for Google"
h1: "The on-page headline, can differ from the title"
description: "120 to 165 characters. A specific promise for the searcher, not a keyword list."
slug: "short-readable-slug"
category: "getting-found"
primaryKeyword: "the main search phrase, unique across the whole site"
author: "Russell Blight"
status: "draft"
scheduled: "<output of npm run next-date>"
related: ["an-earlier-slug", "another-earlier-slug"]
faq:
  - q: "A real question people ask?"
    a: "A direct answer of one to three sentences."
---
```

Categories are exactly one of: `costs-and-planning`, `getting-found`, `more-enquiries`.

Include two or three FAQs that answer real follow-up questions. They appear on the page and in its structured data.

Put the primary keyword naturally in the title, the h1 or the first paragraph, and in at least one subheading. Never repeat it awkwardly.

### 5. Check it

Before committing, check every item:

- [ ] `npm run check` passes.
- [ ] The quick answer fully answers the search on its own.
- [ ] Every question listed near the top is answered later.
- [ ] Every fact about Google, law or prices has a linked primary source; prices have a checked date.
- [ ] Nothing is invented: no clients, case studies, results, statistics, quotes or stories told as if they happened.
- [ ] Reading only the subheadings tells the whole story.
- [ ] It contains a real "aha" and steps the reader can take this week.
- [ ] It does not answer the same search as an existing article.
- [ ] UK spelling, no em dashes, no emojis, no banned words.

## Facts about the business you may use

Only state these. If you need another fact about Russell or the business, leave it out.

- Digital Rebuild is run by Russell Blight, based in Barry, South Wales.
- It builds and rebuilds websites for UK small businesses: trades, local shops, cafés and service businesses. Sites are hand-coded, not built on page builders or WordPress templates.
- Areas: Barry, the Vale of Glamorgan, Cardiff, Penarth, Bridgend, Newport, Swansea, and UK clients remotely.
- Prices: Basic £299 one-off (up to 3 pages, mobile-first design, contact form and Google Maps, basic SEO set-up, 14 days' support after launch). Starter £499 one-off (up to 5 pages, bespoke design, on-page SEO, Google Analytics 4 set-up, speed optimisation, 30 days' support after launch). Pro is quoted per project (more pages, online shops, booking systems, custom integrations).
- Process: free 30-minute discovery call, design mock-up within a week with two rounds of changes, build and review on a staging link, launch with 30 days of support. Typically three weeks from first call to launch.
- Clients own their domain, code and content from day one. No long contracts.
- Free website check: send your current site and Russell replies with the three biggest fixes he'd make.
- Phone: 07709 498894.
- The plumbing designs on the homepage (AquaPro, FastFlow, Meridian, Clearwater) are sample concepts, not client work. Always describe them that way.

## Never do

- Never invent anything: clients, testimonials, results, statistics, case studies, quotes, experiences, credentials or "studies show".
- Never write "we tested", "a client of mine" or any story presented as real.
- Never guarantee rankings, traffic or results.
- Never give instructions for regulated work (gas, electrics, building regulations). Point readers to a registered professional.
- Never copy or closely paraphrase another site's article.
- Never publish two articles targeting the same search.
- Never add affiliate links, tracking code, ads or images without Russell asking.
- Never edit `site/`, `scripts/`, `.github/` or `package.json`. If the system itself seems broken, report it to Russell instead.
- Never use `git push --force`, rewrite history or delete published articles.
- Never paste tokens, passwords or keys into Telegram or into any file.

### Words and phrases to avoid

Em dashes and emojis. Delve, tapestry, landscape (as a metaphor), testament, pivotal, underscore, showcase, foster, leverage, robust, vibrant, meticulous, seamless, game-changer, unlock, elevate, moreover, furthermore, nestled, groundbreaking, "in today's world", "in a world where", "when it comes to", "at the end of the day", "it's not just X, it's Y", "let's dive in", "let's unpack", "here's what you need to know", "the real question is", "at its core", "moving forward", "I hope this helps", "as an expert".

## Topic backlog

Work from the top. Delete each idea when you use it. Check it against existing articles first.

1. What to put on a website for electricians (getting customers to call)
2. How to write a services page that brings in enquiries
3. Google Search Console for small businesses: the three reports worth checking
4. Do I need a cookie banner on my small business website? (use ICO guidance)
5. Website for cleaners and domestic cleaning businesses: what to include
6. How to take photos of your work for your website with just a phone
7. Do you need a separate page for every town you cover?
8. How fast should a small business website load, and how to check yours
9. Online booking for small businesses: built into your website or a separate tool?
10. What a builder's or kitchen fitter's website needs to win bigger jobs
11. What to put on your about page so people trust you
12. How to choose a domain name for a small business (.co.uk or .com?)
13. Business email with your own domain: why it matters and how to set it up
14. How to write a contact form that people actually fill in
15. Should a small business website show prices?
16. What to do when someone leaves you a bad Google review
17. Website for cafés and restaurants: what customers look for first
18. How to tell if your web designer has done the SEO basics
19. Website for hairdressers and beauty salons: what to include
20. Does my small business need a privacy policy? (use ICO guidance)
21. How to get your business listed in local directories without wasting money
22. Mobile-friendly website checklist for small businesses
23. Website for landscapers and gardeners: what to include
24. How to use Google Analytics without getting lost: the few numbers that matter
25. Should you use a .wales or .cymru domain for a Welsh business?
26. How much should a website care plan cost, and what should it include?
27. What happens to my website if my web designer disappears?
28. Website copy for tradespeople: how to describe your services in plain English
29. Accessibility basics for small business websites
30. How to move your website to a new designer without losing your Google rankings
