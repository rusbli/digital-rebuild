# Message to send to Hermes (one time)

Copy everything between the lines below and send it to Hermes in Telegram, ideally in a topic called "Website Articles". Hermes will set itself up, run the job once as a test and then repeat it every day.

---

I want you to run a fully automatic daily article pipeline for my website, digitalrebuild.co.uk. Every day you publish one article and write one new draft. I do not need to approve them.

Everything you need is in my GitHub repository https://github.com/rusbli/digital-rebuild, in the file docs/hermes-daily-articles.md. Read that whole file first. It is your standing instructions and overrides anything general you'd normally do.

SETUP (do this once, now):

1. Check whether you already have a clone of https://github.com/rusbli/digital-rebuild. If not, clone it into your persistent working directory. Tell me the path.
2. Check Node.js 20 or newer and npm are available. Then run npm ci --no-audit --no-fund and npm run drafts in the repository.
3. Check you can push to the repository without pushing anything: git push --dry-run origin main. If you can't, stop and walk me through giving you access the safest way, using a fine-grained GitHub token or deploy key limited to this one repository with contents read and write. Never ask me to paste a token into this chat; give me the exact command to enter it directly where it needs to go.
4. Create a daily cron job at 07:00 Europe/London that runs in a fresh session with this exact prompt:

   "Run today's article pipeline for digitalrebuild.co.uk. Go to your clone of https://github.com/rusbli/digital-rebuild, run git pull --ff-only, read docs/hermes-daily-articles.md in full, then follow its 'The daily run' section exactly, steps 1 to 5. Send the step 5 report to Russell in the Website Articles Telegram topic. Never skip the report, even if a step failed."

5. Show me the cron job, its schedule and its next run time.
6. Run the job once now as a test. Today's draft is already due, so it should publish one article and write one new draft. Show me the report.

RULES:
- Follow docs/hermes-daily-articles.md exactly, especially "Never do" and "Facts about the business you may use".
- Never invent clients, results, statistics or stories.
- Never change anything outside content/ and the topic backlog in docs/hermes-daily-articles.md.
- If anything in the system looks broken, tell me instead of fixing code yourself.
- Remember: I never want em dashes in anything you write for me.

Begin with step 1.

---

## After setup

- You'll get one Telegram report every morning. If the reports stop, the job has stopped. Ask Hermes to "list my cron jobs and show the last run of the website articles job".
- To pause publishing: tell Hermes to pause the website articles cron job.
- To go back to approving drafts before they go live: change `requireApproval` to `true` in `content/publishing.json`, or ask Claude to. Drafts then need `npm run approve -- <slug>` before they publish.
- To read an upcoming draft: https://github.com/rusbli/digital-rebuild/tree/main/content/drafts
