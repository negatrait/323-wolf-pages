# Sprint Plan — Content De-jargon & Code Quality

> Status: **Review Ready**
> Branch: `staging`
> Last updated: 2026-04-24

## Goals

1. **Zero SEO/GEO/AEO jargon on customer-facing pages.** Replace with plain-language descriptions of what happens and why it matters.
2. **Zero hardcoded text in components.** All visible text sourced from markdown content files.
3. **Fix all code quality findings** from the full codebase review.

## Rules

- **No three-letter acronyms** (SEO, GEO, AEO) visible to site visitors. These may appear in `seo_title`, `seo_description` frontmatter (meta tags only), internal code comments, `route-meta.ts` titles (browser tabs), and agent-skills files (machine audience).
- **Brand voice**: explain what happens, not what the technique is called. "Your site shows up when people search" not "improves SEO."
- **Single source of truth**: if data exists in content markdown, components must import from `virtual:content`, not redefine it locally.

## Completed Tasks

### Phase 1 — Content De-jargon

- [x] **T1.1** `src/content/home/problem.md` — "SEO" → "Search engines can't find you", "GEO" → "AI assistants skip over you", "AEO" → "Voice search and chatbots miss your answers"
- [x] **T1.2** `src/content/about.md` — "SEO specialists" → "visibility specialists", "AI SEO team" → "AI visibility team"
- [x] **T1.3** `src/content/home/features.md` — "SEO specialists" → "visibility specialists"
- [x] **T1.4** `src/content/home/who-is-this-for.md` — "SEO Professionals" → "Visibility Professionals", "SEO troubleshooting" → "visibility troubleshooting"
- [x] **T1.5** `src/content/home/pricing.md` — No visible jargon (seo_title/seo_description kept for meta)
- [x] **T1.6** `src/content/faq.md` — "SEO specialists" → "visibility team/professionals"
- [x] **T1.7** `src/content/blog/index.md` — "GEO era" → "AI search era"
- [x] **T1.8** `public/llms-*.md` — Rewrote SEO/GEO/AEO references in plain language
- [x] **T1.9** `src/content/about.md` "Our approach" — verified, already plain language

### Phase 2 — Kill Hardcoded Text

- [x] **T2.1** `src/pages/HowItWorks.tsx` — All text now from `HOME_HOW_IT_WORKS` content import (heading, intro, steps, comparison table, what-you-get grid, CTA)
- [x] **T2.2** `src/pages/Pricing.tsx` — Deleted local `TIERS`, `PRICING_FAQ`, `STRIPE_URLS`, competitor cards, feature table. All sourced from content plugin via `PRICING_TIERS`, `PRICING_FAQ`, `PRICING_FEATURE_TABLE`, `PRICING_COMPETITORS`, `PRICING_CTA`
- [x] **T2.3** `src/pages/Home.tsx` — Removed unused `_STRIPE_ONE_SHOT` import
- [x] **T2.4** `src/pages/Blog.tsx` — Verified, already content-driven

### Phase 3 — Code Quality Fixes

- [x] **T3.1** `index.html` — Updated `theme-color` to `#071F16`, removed 3 duplicate JSON-LD blocks (Organization, Speakable, FAQ), fixed stale org description
- [x] **T3.2** All external links — `rel="noopener noreferrer"` on all `target="_blank"` links (Pricing, HowItWorks CTAs)
- [x] **T3.3** `BreadcrumbNav.tsx` — Added `aria-label="breadcrumb"`
- [x] **T3.4** `Nav.tsx` — Added `target="_blank" rel="noopener noreferrer"` to external nav links
- [x] **T3.5** `About.tsx` — Replaced fragile `contentHtml.split('</p>')` with direct `dangerouslySetInnerHTML`
- [x] **T3.6** `route-meta.ts` + page `description` props — Removed jargon from titles and descriptions

### Phase 4 — Agent/Machine Files (No changes needed)

- [x] **T4.1** `public/.well-known/agent-skills/index.json` — Kept SEO/GEO/AEO (machine audience)
- [x] **T4.2** `public/.well-known/agent-skills/sivussa-site-guide/SKILL.md` — Kept SEO/GEO/AEO (machine audience)
- [x] **T4.3** `public/robots.txt` — No changes needed
- [x] **T4.4** `public/_headers` — No changes needed

## Not In Scope

- Adding TypeScript types / TSDoc (separate sprint)
- `_redirects` 404 handling (requires Cloudflare Functions change)
- `marked` HTML sanitization (content is first-party, low risk)
- Blog post content (`audit-findings-before-after.md`) — historical document
- `src/utils/seo.ts` JSON-LD — machine-readable, not customer-visible
- `src/content/home/sivussa_terms_of_service.md` — legal text, technical terms appropriate
