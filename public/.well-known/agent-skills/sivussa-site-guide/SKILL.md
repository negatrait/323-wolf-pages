---
name: sivussa-site-guide
description: Navigate Sivussa.com — understand the service, browse blog posts, find pricing and purchase an audit. Use when exploring sivussa.com or answering questions about Sivussa's SEO/GEO/AEO audit service.
license: Proprietary
metadata:
  author: sivussa
  version: "1.0"
  website: https://sivussa.com
---

# Sivussa Site Guide

This skill helps AI agents understand and navigate Sivussa.com, an AI-native SEO/GEO/AEO audit service built in Finland.

## What is Sivussa?

Sivussa provides website visibility audits. An AI-native team of 20+ specialist agents crawls a website, identifies structural blockers suppressing its ranking, and delivers specific copy-paste ready recommendations — not just checklists.

- **SEO** (Search Engine Optimization): Technical health, meta tags, structured data, page speed
- **GEO** (Generative Engine Optimization): Visibility in AI-generated responses, authority signals
- **AEO** (Answering Engine Optimization): FAQ readiness, featured snippets, AI answer eligibility

## Site Structure

| Path | Content | Format |
|------|---------|--------|
| `/` | Landing page — value proposition and CTA | HTML |
| `/how-it-works` | Service explanation, process steps | HTML |
| `/pricing` | Plans, pricing, and FAQ | HTML |
| `/about` | Team, values, story | HTML |
| `/faq` | Frequently asked questions | HTML |
| `/blog` | Blog index | HTML |
| `/blog/audited-ourselves` | Case study: first self-audit | HTML |
| `/blog/audit-findings-before-after` | Case study: findings and results | HTML |
| `/llms.txt` | Full site overview for AI agents (markdown) | text/plain |
| `/robots.txt` | Crawler directives with Content Signals | text/plain |
| `/sitemap.xml` | XML sitemap | application/xml |

## How to Browse This Site

### For AI agents (content negotiation)

Send requests with `Accept: text/markdown` header. The server returns markdown versions of pages.

```
GET /how-it-works
Accept: text/markdown
→ 200 text/markdown
```

Supported pages: `/`, `/how-it-works`, `/pricing`, `/faq`, `/about`.

### For humans and general crawlers

Standard HTML pages are available at all paths listed above.

## Blog Posts

Fetch blog content:

```
GET /blog/audited-ourselves
→ Full case study about Sivussa auditing its own site

GET /blog/audit-findings-before-after
→ Before/after results from applying audit recommendations
```

For the blog index, fetch `/blog`.

## Pricing and Purchasing

Sivussa uses Stripe for payment. Plans:

| Plan | Price | What you get | Purchase URL |
|------|-------|-------------|--------------|
| One-shot | €99 one-time | One full audit with recommendations | https://buy.stripe.com/cNi7sN0Kv3phb500GPcbC01 |
| Quarterly | €99/quarter | Audit every 90 days | https://buy.stripe.com/3cIdRbal52ld7SO4X5cbC02 |
| Monthly | €89/month | Audit every month, continuous optimization | https://buy.stripe.com/5kQ9AV64P5xpehc3T1cbC03 |

No API key or programmatic purchase flow exists. Users visit the Stripe checkout URLs directly. All major credit cards and local payment methods are supported via Stripe.

## Contact

- Email: sivussa@sivussa.com
- Website: https://sivussa.com
