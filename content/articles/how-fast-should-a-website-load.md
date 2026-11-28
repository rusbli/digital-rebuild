---
title: "How fast should a small business website load?"
h1: "How fast should your website load, and how do you check?"
description: "What 'fast enough' means for a small business website, how to test yours for free on mobile, and the common fixes that make the biggest difference."
slug: "how-fast-should-a-website-load"
category: "getting-found"
primaryKeyword: "how fast should a website load"
author: "Russell Blight"
related: ["website-not-getting-enquiries", "signs-your-website-needs-a-rebuild", "google-search-console-for-small-business"]
faq:
  - q: "What is a good page load time for a small business website?"
    a: "Google's Core Web Vitals give a useful benchmark: the main content should appear within about 2.5 seconds for most visitors, the page should respond to taps quickly, and the layout shouldn't jump around. Test on mobile, where most problems show up."
  - q: "How can I test my website speed for free?"
    a: "Use Google's PageSpeed Insights at pagespeed.web.dev. Enter your web address and look at the mobile results, which show real-visitor data where available and a list of suggested improvements."
  - q: "What usually slows down a small business website?"
    a: "Oversized images are the most common cause. Others include lots of plugins or third-party scripts, heavy page builders, slow hosting and embedded videos or widgets loading on every page."
published: "2026-11-28"
updated: "2026-11-28"
---
You open your website on your office Wi-Fi and it appears instantly. Job done.

Then a customer opens it on their phone, in a car park, on a patchy signal. They see a white screen for a few seconds. Then half a page. Then the layout jumps just as they try to tap your phone number.

They give up and tap the next result.

Speed isn't about impressing anyone. It's about whether people on real phones, on real connections, get to see your website at all.

> **Quick answer:** A good benchmark is Google's Core Web Vitals: the main content should appear within about 2.5 seconds, the page should respond quickly when tapped, and the layout shouldn't jump around. Test your site free with Google's PageSpeed Insights, looking at the mobile results. The most common fix for small business sites is shrinking oversized images, followed by removing unnecessary plugins and scripts.

Three questions we'll answer:

- What does "fast enough" actually mean?
- How do I test it properly?
- What's usually slowing a small site down?

## What "fast enough" means

Here's the first question. "Fast" is vague, so it helps to use the same measures Google uses.

Google's **Core Web Vitals** measure three things about how a page feels to a real visitor. The thresholds for a "good" experience, explained on [web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds), are:

| Measure | What it means | Good |
| --- | --- | --- |
| Largest Contentful Paint (LCP) | How long until the main content appears | 2.5 seconds or less |
| Interaction to Next Paint (INP) | How quickly the page responds when someone taps or clicks | 200 milliseconds or less |
| Cumulative Layout Shift (CLS) | How much the layout jumps around while loading | 0.1 or less |

You don't need to remember the names. The plain-English version: the important bit shows up quickly, buttons respond straight away, and nothing moves as you're about to tap it.

## How to test it properly

Here's the second question.

1. Go to [PageSpeed Insights](https://pagespeed.web.dev/).
2. Enter your web address.
3. Look at the **mobile** results first.

You'll see two kinds of information:

- **Real-visitor data** (if your site has enough visitors), showing how the page actually performs for people.
- **A lab test**, with a score and a list of suggestions.

Don't obsess over the score out of 100. Look at whether the Core Web Vitals pass, and read the top suggestions. They usually point straight at the problem.

Test your home page and your most important service page. They're the ones customers land on.

If your site is in Google Search Console, its experience reports also show Core Web Vitals across your pages. My [Search Console guide](/blog/google-search-console-for-small-business/) explains where to find them.

## What's usually slowing a small site down

Here's the third question. On small business websites, the same culprits come up again and again.

### Oversized images

This is the big one. A photo straight from a modern phone can be several megabytes. Shown on a phone screen, it only needs to be a fraction of that size.

The fix:

- Resize images to roughly the size they're displayed.
- Save them in a modern format such as WebP.
- Let images further down the page load only when needed (often called "lazy loading").

This alone often makes the biggest difference.

### Too many plugins and scripts

Every plugin, chat widget, social feed, tracking tag and embedded tool adds code that has to load. Some slow the page a lot.

Make a list of everything on your site and ask: do I actually use this? Removing what you don't need is free and often very effective.

### Heavy page builders and themes

Some website builders and themes load a lot of code to make drag-and-drop editing possible. You may not be able to fix this without changing how the site is built.

### Slow hosting

Very cheap hosting can be slow to respond, especially at busy times. If the very first response from your server is slow, better hosting can help.

### Videos and maps on every page

Embedded videos and maps are heavy. Use them where they genuinely help, not on every page.

## The aha: it's the first screen that counts

Visitors don't wait for the whole page. They judge you on how quickly the **top** of the page appears and becomes usable.

So prioritise what's at the top: your headline, your main image and your phone number. A huge background video or slider at the top of the page often does more harm than everything else put together.

## Does speed help with Google?

Google's guidance on [page experience](https://developers.google.com/search/docs/appearance/page-experience) says its systems reward good page experience, but that relevant, helpful content matters more. A fast page with little useful information won't beat a slightly slower page that answers the search properly.

The bigger reason to care is people. A slow page loses visitors before they've read a word. My guide to [websites that get visitors but no enquiries](/blog/website-not-getting-enquiries/) covers the other leaks to check.

## When speed is a sign of a bigger problem

If your site is slow, built on a heavy theme with lots of plugins, and hard to change, speed might be one symptom of a wider issue. My guide on [whether your website needs a rebuild](/blog/signs-your-website-needs-a-rebuild/) helps you decide whether fixing it is worth it.

## A quick routine

1. Test your home page and main service page on PageSpeed Insights (mobile).
2. Fix oversized images first.
3. Remove plugins, widgets and scripts you don't use.
4. Retest.
5. Check again whenever you add something new to the site.
