# Message to send to Hermes: switch to twice-daily publishing

Send everything between the lines below to Hermes in the Website Articles Telegram topic. It adds a second daily run of the publisher you already have, so two articles go live each day.

---

I've added 60 new article drafts to my website repository, https://github.com/rusbli/digital-rebuild, on main. They're scheduled two per day from 22 November to 21 December 2026, and content/publishing.json now allows two articles a day ("perDay": 2). I want two articles published every day, automatically, with no approval needed.

Please update the website publishing job like this:

1. In your checkout at /opt/data/digital-rebuild-site, run git pull --ff-only on main, then read docs/hermes-daily-articles.md in full. It now describes two runs a day.
2. Keep the existing 07:00 Europe/London job exactly as it is. It runs ops/digital-rebuild-daily-publish.py.
3. Add a second scheduled job at 17:00 Europe/London that runs the same script, in the same way, with no changes to the script, and delivers its report to the same Website Articles Telegram topic.
4. Don't edit the script, the site, scripts/, .github/ or package.json. The publish command already limits itself to two articles a day, so if both runs happen to fall on the same day after two have been published, the second one will simply report that today's limit is reached.
5. Show me both jobs, their schedules and their next run times.
6. Run the publisher once now as a test. The first new drafts are due on 22 November, so it should report "Nothing published" with the reason. Show me the report.

From 22 November I expect two Telegram reports a day, each naming the article that went live with its link. If a run fails, tell me what went wrong in the report rather than trying to fix the code yourself.

Remember: I never want em dashes in anything you write for me.

---

## After this

- **Two reports a day** from 22 November to 21 December 2026, one at about 07:00 and one at about 17:00.
- **The queue runs out on 21 December.** The 07:00 report starts warning when 3 or fewer drafts are left. Ask Claude for the next batch before then; the topic ideas waiting are at the bottom of `docs/hermes-daily-articles.md`.
- **To go back to one a day:** change `perDay` to `1` in `content/publishing.json`, run `npm run reschedule`, and remove the 17:00 job.
- **To pause:** tell Hermes to pause both website publishing jobs.
