# Article drafts

Drafts waiting to be published. Nothing in this folder is live, and commits that only touch this folder don't deploy.

Publishing is automatic and daily. `content/publishing.json` sets `requireApproval` to `false`, so `npm run publish-next` publishes the earliest draft that is due, at most one per day.

- Hermes's full instructions, including how to write new articles: [docs/hermes-daily-articles.md](../../docs/hermes-daily-articles.md)
- The one-time message that sets Hermes up: [docs/hermes-setup-message.md](../../docs/hermes-setup-message.md)

## Commands

| Command | What it does |
|---|---|
| `npm run drafts` | Lists the queue with dates and word counts |
| `npm run publish-next` | Publishes the earliest due draft (one per day at most) |
| `npm run next-date` | Prints the scheduled date for a newly written draft |
| `npm run reschedule` | Re-dates every draft one per day from today, keeping their order |
| `npm run approve -- <slug>` | Marks a draft approved (only matters if approval is switched back on) |
| `npm run check` | Checks every article and draft against the rules |
| `npm run preview` then `npm run serve` | Shows drafts at http://localhost:8765/blog/ |
