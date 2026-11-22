---
title: "Google Search Console for small businesses: what to check"
h1: "Google Search Console for small businesses: the three reports worth your time"
description: "Search Console is free and shows how Google sees your website. Here are the three reports a small business owner should check, and what to do with each."
slug: "google-search-console-for-small-business"
category: "getting-found"
primaryKeyword: "google search console for small business"
author: "Russell Blight"
related: ["business-not-showing-on-google", "website-not-getting-enquiries"]
faq:
  - q: "Is Google Search Console free?"
    a: "Yes. Google Search Console is a free tool from Google. You need a Google account and a way to prove you own the website, such as adding a record to your domain settings or a file to your site."
  - q: "What is the difference between Search Console and Google Analytics?"
    a: "Search Console shows what happens before someone reaches your site: which Google searches showed your pages and how many people clicked. Google Analytics shows what visitors do once they arrive. Most small businesses benefit from both."
  - q: "How often should I check Search Console?"
    a: "Once a month is plenty for most small businesses. Check sooner if you've just launched a new site, added important pages, or Google emails you about a problem."
published: "2026-11-22"
updated: "2026-11-22"
---
Most small business owners have heard of Google Search Console. Very few open it.

That's a shame, because it's the only place Google tells you directly how it sees your website. Which searches you appear for. Which pages it has found. Which ones it has quietly decided to ignore.

It also looks intimidating the first time. Lots of charts, lots of menus, lots of words like "canonical".

The good news is you can ignore nearly all of it. Three reports do the heavy lifting for a small business, and you can check them in ten minutes a month.

> **Quick answer:** Set up Google Search Console (free) and verify your website. Then check three things once a month: the Performance report, to see which searches show your site and how many people click; the Pages report, to see which pages Google has and hasn't indexed; and the Sitemaps report, to make sure Google has your list of pages. Ignore the rest unless something breaks.

Three questions we'll answer:

- What does Search Console tell me that nothing else does?
- Which numbers actually matter for a small business?
- What do I do when a report shows a problem?

## What Search Console is, and what it isn't

Search Console is a free tool from Google for website owners. You'll find it at [search.google.com/search-console](https://search.google.com/search-console).

It shows what happens **before** someone visits your site: when your pages appeared in Google, for which searches, and whether people clicked.

It doesn't show what visitors do once they arrive. That's Google Analytics, a separate tool.

Here's the first question answered. Search Console is the only place you can see the actual words people typed into Google before they found you. No other tool gets that from Google directly.

## Setting it up in one sitting

You'll need a Google account and access to either your domain settings or your website.

1. Go to Search Console and add a **property**. The "Domain" option covers every version of your site (with and without www, http and https) in one go, so choose that if you can.
2. Google gives you a verification record to add to your domain's DNS settings. If you don't manage your domain yourself, send the record to whoever does. It's a two-minute job for them.
3. Once verified, Google starts collecting data. Some reports take a few days to fill in.

If your web designer set Search Console up for you, ask them to make you an **owner**, not just a user. My guide on [checking who owns your website](/blog/who-owns-my-website/) explains why that matters.

## Report one: Performance, where the useful numbers live

Open **Performance** (sometimes shown as "Search results"). You'll see four numbers along the top:

| Number | What it means |
| --- | --- |
| Total clicks | How many times someone clicked through to your site from Google |
| Total impressions | How many times your site appeared in someone's results |
| Average CTR | The share of impressions that became clicks |
| Average position | Roughly where you appeared, on average |

Below that, the **Queries** tab lists the searches that showed your site.

This is the bit to read slowly.

### What to look for in the queries

- **Your business name.** If it's at the top, most of your Google visitors already knew you. That's normal for newer sites.
- **Searches for what you do and where.** "Plumber Barry", "website designer Penarth", "wedding cakes Cardiff". These are new customers finding you. You want more of these over time.
- **Searches you didn't expect.** Sometimes a page ranks for something you never planned. That can be a hint about a service people want, or a page worth improving.

### The aha: impressions with no clicks

Sort the queries by impressions. Look for searches where you appear a lot but get very few clicks.

That usually means one of two things. Either you're appearing too far down the page to be seen, or your page title and description don't persuade people to click.

The second one is fixable in an afternoon. Rewrite the page's title so it says plainly what the page offers and where. That's often the cheapest win in the whole tool.

## Report two: Pages, where Google tells you what it ignored

Open **Pages** (under Indexing). It splits your pages into **Indexed** and **Not indexed**.

Indexed pages can appear in Google. Not indexed pages can't.

It's normal to have some pages not indexed. Old addresses that redirect, duplicate versions of the same page, and pages you've deliberately hidden all show up here.

What you're looking for is an **important** page that isn't indexed: your home page, a main service page, or a new article.

Click each reason in the list to see which pages it affects. Google's [Page indexing report help](https://support.google.com/webmasters/answer/7440203) explains what each reason means.

If an important page is missing, paste its address into the **URL Inspection** bar at the top. Google will tell you what it knows about that page, and you can ask it to index the page. [Google's URL Inspection help](https://support.google.com/webmasters/answer/9012289) is clear that requesting indexing doesn't guarantee it, and there's a daily limit, so do it once and give it time.

If you're not appearing at all, my guide to [why a business might not show up on Google](/blog/business-not-showing-on-google/) walks through the checks in order.

## Report three: Sitemaps, Google's list of your pages

A sitemap is a simple file that lists the pages on your website. It's often at `yourbusiness.co.uk/sitemap.xml`.

Open **Sitemaps**, type in your sitemap address and press submit. Then check the status says "Success".

Google's own [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) says a sitemap isn't required, but it's a free and easy way to help Google find everything, especially on a newer site with few links pointing to it.

## What you can safely ignore for now

Here's the second question. For most small businesses, the numbers that matter are clicks, the queries list, and whether important pages are indexed.

You can safely leave these alone until you have a specific reason:

- **Links.** Interesting, but not something to act on monthly.
- **Experience reports.** Worth a glance once in a while, but speed is easier to check with [PageSpeed Insights](https://pagespeed.web.dev/).
- **Average position** on its own. It's an average across every search, so it can move for reasons that don't matter.

Don't chase daily wobbles. Small sites see big percentage swings from small numbers. Look at the trend over three months.

## When Search Console shows a problem

Here's the third question. A simple rule of thumb:

1. **Google emails you about a security issue or manual action.** Act straight away, or ask your web designer to. These are rare but serious.
2. **An important page isn't indexed.** Inspect it, fix the reason given, and request indexing once.
3. **Clicks have dropped sharply over several weeks.** Check whether a page was removed, renamed or changed. If you've recently rebuilt your site, old addresses may not be redirecting.
4. **Lots of impressions, few clicks.** Rewrite page titles and descriptions to be clearer and more specific.

Most months, you'll open it, see the trend, notice one useful query, and close it again. That's fine. The value is in spotting problems early and learning the words your customers actually use.

## A ten-minute monthly routine

1. Open Performance, set the date range to the last three months, and compare with the previous period.
2. Read the top 20 queries. Note any new searches for what you do and where.
3. Find one query with lots of impressions and few clicks, and improve that page's title.
4. Open Pages and check your important pages are indexed.
5. Check Sitemaps shows "Success".

Those search terms are also worth feeding back into your website. If people keep finding you for a service you only mention in passing, it probably deserves its own page. My guide to [websites that get visitors but no enquiries](/blog/website-not-getting-enquiries/) shows what to do once those visitors arrive.
