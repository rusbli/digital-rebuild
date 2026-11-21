---
title: "Why does my website say 'Not secure'? How to fix it"
h1: "Why your website says 'Not secure', and how to fix it"
description: "If browsers show 'Not secure' next to your website, customers notice. What it means, why it happens, and how to fix it, usually quickly and often for free."
slug: "website-says-not-secure"
category: "costs-and-planning"
primaryKeyword: "website says not secure"
author: "Russell Blight"
status: "draft"
scheduled: "2026-12-08"
related: ["web-designer-disappeared", "website-care-plan-cost", "signs-your-website-needs-a-rebuild"]
faq:
  - q: "What does 'Not secure' mean on my website?"
    a: "It usually means the page is loading over HTTP rather than HTTPS, so information sent between the visitor and your site isn't encrypted. Browsers like Chrome warn visitors about this."
  - q: "How much does an SSL certificate cost?"
    a: "Basic certificates can be free. Let's Encrypt, a non-profit certificate authority, provides free certificates, and many hosting companies include them. Paid certificates exist but most small business websites don't need them."
  - q: "Will fixing 'Not secure' affect my Google rankings?"
    a: "Using HTTPS is part of Google's page experience considerations, but the bigger benefit is trust. Make sure old HTTP addresses redirect permanently to the HTTPS versions so nothing is lost."
---
A customer clicks through to your website and the address bar says "Not secure".

Most people don't know exactly what it means. But they know it sounds bad. Some will leave. Some will go ahead but feel uneasy about filling in your contact form.

The good news: it's usually one of the quickest website problems to fix, and often free.

> **Quick answer:** "Not secure" usually means your site loads over HTTP instead of HTTPS, so it doesn't have a working SSL/TLS certificate. Fix it by installing a certificate (often free from your hosting company or Let's Encrypt), making the site load over HTTPS, and redirecting every HTTP address permanently to the HTTPS version. Then check for "mixed content" and update Google Search Console.

Three questions we'll answer:

- What does "Not secure" actually mean?
- Why has it suddenly appeared?
- How do I fix it properly?

## What it means

Here's the first question. Websites can load in two ways:

- **HTTP**: information travels between the visitor and your website unencrypted.
- **HTTPS**: information is encrypted, using a certificate (often called an SSL or TLS certificate).

Browsers such as Chrome show warnings for pages that aren't loaded securely. Google's help page on [checking whether a site's connection is secure](https://support.google.com/chrome/answer/95617) explains what the different icons mean.

For a small business website, the risk isn't usually dramatic. But a contact form sending someone's name and phone number unencrypted is not something you want, and the warning puts people off either way.

## Why it suddenly appeared

Here's the second question. Common reasons:

- **The certificate expired.** Certificates have expiry dates. Free ones often renew automatically, but renewals can fail.
- **The site never had a certificate**, and you're only noticing now.
- **A change at the host or domain** stopped the certificate working.
- **Some pages load insecure content**, like images or scripts from HTTP addresses, which can trigger warnings on otherwise secure pages.
- **The site can be reached on both HTTP and HTTPS**, and some links point to the HTTP version.

## How to fix it properly

Here's the third question.

### 1. Get a certificate

Most hosting companies offer free certificates, and many install them automatically. [Let's Encrypt](https://letsencrypt.org/) is a non-profit that provides free certificates, used by many hosts.

For a typical small business site, a free certificate is all you need.

If you don't manage your own hosting, ask your host or web designer: "Is there a valid SSL certificate on my site, and does it renew automatically?"

### 2. Make the site load on HTTPS

Once the certificate is installed, your site should load at `https://yourbusiness.co.uk`.

### 3. Redirect HTTP to HTTPS

This is the step that's often missed. Every old HTTP address should redirect **permanently** to its HTTPS version. That way:

- Old links and bookmarks still work.
- Google transfers its understanding of your pages to the new addresses.
- Nobody lands on the insecure version.

### 4. Fix mixed content

If a secure page loads an image or script over HTTP, browsers may still flag it. Update any links to images, scripts and fonts so they use HTTPS.

### 5. Update your listings and Search Console

- Update your website address on your Google Business Profile, social media and directory listings to the HTTPS version.
- In Google Search Console, make sure you've verified the property that covers HTTPS. A "Domain" property covers both.

## The aha: check the renewal, not just the padlock

Many people fix the warning once and forget about it. Then, a year later, the certificate fails to renew and the warning is back, often without anyone noticing for weeks.

Ask whoever manages your hosting to confirm the certificate renews automatically, and set yourself a reminder to check the padlock every few months. A care plan, if you have one, should include this. My guide to [website care plans](/blog/website-care-plan-cost/) covers what to expect.

## If nobody can fix it

If you can't get into your hosting, or your web designer has gone quiet, that's a bigger problem than the certificate. My guide on [what to do if your web designer has disappeared](/blog/web-designer-disappeared/) explains how to regain control.

And if "Not secure" is one of several problems with an old site, it may be a sign it's time for a fresh start. My guide on [whether your website needs a rebuild](/blog/signs-your-website-needs-a-rebuild/) helps you decide.

## A quick checklist

1. Does your site load at https:// with a padlock?
2. Do all HTTP addresses redirect permanently to HTTPS?
3. Are there no mixed content warnings?
4. Does the certificate renew automatically?
5. Are your listings and Search Console using the HTTPS address?
