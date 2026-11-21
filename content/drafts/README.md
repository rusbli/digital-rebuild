# Article drafts

Drafts waiting to be published. Nothing in this folder is live, and commits that only touch this folder don't deploy.

Publishing is automatic, twice a day. `content/publishing.json` sets `requireApproval` to `false` and `perDay` to `2`, so each `npm run publish-next` publishes the earliest draft that is due, and no more than two go live on the same day.

- Supply the next Claude batch here on `main`. See the [daily publishing playbook](../../docs/hermes-daily-articles.md) for article format and checks.

## Commands

| Command | What it does |
|---|---|
| `npm run drafts` | Lists the queue with dates and word counts |
| `npm run publish-next` | Publishes the earliest due draft (one per run, two per day at most) |
| `npm run next-date` | Prints the scheduled date for a newly written draft |
| `npm run reschedule -- [YYYY-MM-DD]` | Re-dates every draft, two per day from today (or the given date), keeping their order |
| `npm run approve -- <slug>` | Marks a draft approved (only matters if approval is switched back on) |
| `npm run check` | Checks every article and draft against the rules |
| `npm run preview` then `npm run serve` | Shows drafts at http://localhost:8765/blog/ |
