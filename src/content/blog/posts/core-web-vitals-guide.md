---
title: "How Fast Should Your Website Load? A Core Web Vitals Guide"
description: "Page speed directly affects your search rankings. Here are the targets and the fixes for common performance issues."
date: "2026-04-07"
category: "SEO BASICS"
readTime: "6 MIN READ"
---

Google measures your page speed with three metrics called Core Web Vitals. They directly affect your search rankings.

## The Three Metrics

### Largest Contentful Paint (LCP) — Target: under 2.5 seconds

How long it takes for the main content to appear. This is usually a hero image, heading, or main text block.

**Common causes of slow LCP:**

- Unoptimized images (too large, wrong format)
- Render-blocking JavaScript
- Slow server response time

### Interaction to Next Paint (INP) — Target: under 200ms

How quickly your page responds to user interactions (clicks, taps, keyboard). Replaced FID in March 2024.

**Common causes of slow INP:**

- Heavy JavaScript
- Third-party scripts
- Main thread blocking

### Cumulative Layout Shift (CLS) — Target: under 0.1

How much the page layout shifts while loading. Annoying for users and a ranking signal.

**Common causes of high CLS:**

- Images without width/height attributes
- Late-loading ads or embeds
- Dynamic content pushing layout down

## Quick Performance Wins

1. **Compress images** — Use WebP format. Resize to actual display size. Lazy-load below the fold.
2. **Minimize JavaScript** — Remove unused scripts. Defer non-critical scripts. Use code splitting.
3. **Use a CDN** — Serve static assets from edge servers close to your visitors.
4. **Set cache headers** — Tell browsers to cache static assets. Reduces repeat load times.
5. **Preload critical resources** — Fonts, hero images, above-the-fold CSS.

## How to Measure

Run your site through Google PageSpeed Insights. It scores your site on all Core Web Vitals and gives specific recommendations.

Or use Sivussa — we audit performance as part of every visibility scan and write the exact fixes you need.
