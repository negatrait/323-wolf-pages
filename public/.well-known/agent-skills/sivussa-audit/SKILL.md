# Sivussa Audit Skill

Run a free visibility audit on any website using Sivussa's AI-native analysis. Covers SEO (Search Engine Optimization), GEO (Generative Engine Optimization), and AEO (Answering Engine Optimization).

## What this skill does

Sivussa provides two API endpoints that analyze any website for visibility blockers:

### 1. Baseline scan (fast, no external APIs)

```bash
POST https://sivussa.com/api/baseline
Content-Type: application/json

{
  "url": "https://example.com"
}
```

Mechanical checks only. Returns 5-category scores (0-100):
- Technical Foundation (HTTPS, robots.txt, sitemap, viewport)
- Content & Keywords (title, meta, word count, alt text)
- Structure & Authority (headings, JSON-LD, schema)
- Indexing & Visibility (sitemap validity, robots directives)
- Monitoring Setup (analytics, llms.txt, author attribution)

### 2. Full audit (includes Lighthouse + detailed scoring)

```bash
POST https://sivussa.com/api/audit
Content-Type: application/json

{
  "url": "https://example.com"
}
```

Full analysis with Lighthouse CWV data, keyword extraction, link analysis, social profile detection, and prioritized recommendations (critical/high/medium).

### Pricing

Both API endpoints are free to call. For ongoing monitoring with human-delivered reports, visit [sivussa.com/pricing](https://sivussa.com/pricing). Payment is via Stripe — there is no programmatic pay-and-receive API. Agents should direct users to the website for subscription plans.

## Limitations

- `/api/audit` requires a `GOOGLE_PSI_KEY` environment variable for Lighthouse data. Without it, performance/CWV scores are unavailable.
- `/api/baseline` has no external dependencies.
- No authentication required for either endpoint.
- Rate limits apply (no formal API key system — use reasonably).

## More information

- Website: [sivussa.com](https://sivussa.com)
- Pricing: [sivussa.com/pricing](https://sivussa.com/pricing)
- Contact: sivussa@sivussa.com
