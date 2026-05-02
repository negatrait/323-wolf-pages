# Sprint 3 — Replace Content Plugin with Typed Loader Architecture

**Goal:** Eliminate the 1001-line `vite-content-plugin.ts` monolith. Replace it with a thin content loader library that components import directly, producing the same build output with fewer bugs, consistent naming, and a module structure that CMS editors can't accidentally break.

**Branch:** staging  
**PR target:** main  
**Constraint:** zero visible changes to the live site — every route must produce identical HTML before and after.

---

## Why

The current plugin is a single Vite virtual module (`virtual:content`) that:

1. Reads 18 markdown files, parses frontmatter + body
2. Applies **inconsistent** field renames (snake_case in `HOME_HERO`, camelCase in `PRICING_TIERS`, mixed in `HOME_FINAL_CTA`)
3. Hand-parses HTML with regex for `HOME_PROBLEM`, `HOME_WHAT_YOU_GET`, and `ABOUT` sections
4. Hardcodes strings (`HOME_FINAL_CTA.title`, `ABOUT.intro`, icon names)
5. Emits 28 named exports as one serialized virtual module
6. Separately generates sitemap.xml + llms.txt files in `generateBundle`
7. Has confirmed bugs (`SITE_CONFIG.tagline` always `undefined`, `BLOG_POSTS_MAP` missing `seo_title`/`seo_description`)
8. Duplicates file reads (how-it-works.md, blog/index.md, site.md each read twice)

Every CMS content edit passes through this plugin — a single typo in the 1001-line file breaks the entire build.

---

## Architecture: Before vs After

### Before (current)
```
src/content/*.md
  → vite-content-plugin.ts (1001 lines, Vite plugin)
    → virtual:content (1 giant serialized module)
      → src/data/load-content.ts (re-export barrel)
        → 13 page/component consumers
```

### After (target)
```
src/content/*.md
  → src/data/content.ts (thin Node loader, ~200 lines)
    → src/data/types.ts (all content interfaces)
    → src/data/[section].ts (one file per content area)
      → page/component consumers import directly

src/data/content.ts
  → also used by src/prerender.tsx
  → also used by vite-static-gen.ts (sitemap + llms files)
```

**Key insight:** Preact's prerender runs in Node at build time. Components can use `fs` via a thin loader — they just need the data to be available when `renderToString` runs. A virtual module isn't necessary; regular imports from a content loader work if the loader is synchronous and the data is build-time static.

However, for Vite's dev server (HMR), we still need the content available without a full rebuild. The simplest approach: a **lightweight Vite plugin** that only does two things:
1. Provides `virtual:content` by calling the typed loader
2. Watches `src/content/` and triggers HMR on changes

The actual parsing, typing, and transformation lives in normal TypeScript files that both the plugin and prerender can import.

---

## Phases

### Phase 1 — Content Type Contracts (~30 min)

Create `src/data/types.ts` with interfaces for every content shape. Normalize all naming to **camelCase** (the convention used by 80% of current exports). Document every field.

**Files:**
- `src/data/types.ts` — all content interfaces

**Interfaces needed:**
- `SiteConfig` — `{ name, url, email, tagline }`
- `HeroContent` — `{ title, subtitle, ctaPrimary, ctaPrimaryHref, ctaSecondary, ctaSecondaryHref, contentHtml, seoTitle?, seoDescription? }`
- `WhatYouGetContent` — `{ title, items: WhatYouGetItem[], subscriberNote }`
- `ProblemContent` — `{ title, subtitle, introHtml, sections: ProblemSection[] }`
- `HowItWorksContent` — `{ title, heading, headingHighlight, intro, steps: Step[], comparison, comparisonHeading, comparisonHeadingHighlight, comparisonTable?, whatYouGet?, cta? }`
- `FeaturesContent` — `{ title, subtitle, items: Feature[] }` (merge HOME_FEATURES + FEATURES)
- `WhoIsThisForContent` — `{ title, cards: Card[] }`
- `PricingContent` — `{ title, subtitle, tiers: PricingTier[], faq: FaqItem[], featureTable?, competitors?: Competitor[], cta?, terms: PricingTerm[] }`
- `PricingTier` — `{ name, price, period, popular, ctaText, ctaHref, features: string[] }`
- `FaqContent` — `{ title, items: FaqItem[] }` (merge HOME_FAQ + FAQ_ITEMS)
- `FinalCta` — `{ title, subtitle, ctaText, ctaHref }` (derive from content, not hardcoded)
- `AboutContent` — `{ title, subtitle?, intro, sections: AboutSection[], email }`
- `BlogConfig` — `{ title, description, categories, searchPlaceholder, loadMoreText, loadMoreLink }`
- `BlogPost` — `{ slug, title, description, seoTitle?, seoDescription?, date, category, readTime, html, excerpt }`
- `NavConfig` — `{ logoText, links: NavLink[] }` (camelCase `logoText`)
- `FooterContent` — `{ sections: FooterSection[], copyright: string }`
- `LegalPage` — `{ html: string }`
- `RouteMeta` — `{ title, description, canonical }`

**Rules:**
- All field names camelCase
- HTML content fields end in `Html` suffix (e.g., `contentHtml`, `introHtml`)
- No `Record<string, string>` — use named interfaces (e.g., `PricingTerm` with explicit fields)
- Comparison table rows are `string[][]` (convert from YAML objects at parse time, not in components)

**Exit criteria:** `types.ts` compiles, all interfaces documented.

---

### Phase 2 — Content Loader Library (~1 hour)

Create `src/data/content.ts` — a pure TypeScript module that reads markdown files from disk and returns typed content objects. This is the core of the refactor.

**Files:**
- `src/data/content.ts` — main loader (reads fs, returns all content)
- `src/data/parse-markdown.ts` — `gray-matter` + `marked` + `highlight.js` wrapper
- `src/data/parse-about.ts` — about.md section parser (extracted from plugin)
- `src/data/parse-problem.ts` — problem.md section parser (extracted from plugin)

**Responsibilities of `content.ts`:**
- `loadAllContent(contentDir: string): AllContent` — synchronous, returns every content piece
- Normalizes ALL field names to camelCase at the boundary (parse time)
- Converts comparison table rows from `Record<string, string>` → `string[][]` here, not in components
- Fixes the `SITE_CONFIG.tagline` bug (access `frontmatter.seo_title` correctly)
- Fixes `BLOG_POSTS_MAP` missing `seoTitle`/`seoDescription`
- Computes `ROUTE_META` for all routes
- No hardcoded strings — derive `HOME_FINAL_CTA` from frontmatter

**Rules:**
- Pure functions, no global mutable state
- Single pass per file (no duplicate reads)
- Every transformation documented with inline comment
- Content dir path passed as argument (testable)

**Exit criteria:** `loadAllContent()` returns typed data matching Phase 1 interfaces. Unit-testable with sample markdown files.

---

### Phase 3 — Slim Virtual Module Plugin (~30 min)

Replace the 1001-line `vite-content-plugin.ts` with a ~50-line Vite plugin that:
1. Calls `loadAllContent()` on `resolveId`/`load` hooks
2. Serializes the result as `export const X = ...` for the `virtual:content` module
3. Watches `src/content/**/*.md` for HMR in dev mode
4. Generates sitemap.xml + llms files in `generateBundle` (extracted to `src/data/static-gen.ts`)

**Files:**
- `vite-content-plugin.ts` — rewritten, ~50 lines
- `src/data/static-gen.ts` — sitemap.xml + llms.txt generation

**Exit criteria:** `npm run dev` works with HMR on content changes. `npm run build` produces identical `dist/` output.

---

### Phase 4 — Update Consumers (~1 hour)

Update every page and component to use the normalized camelCase field names.

**Changes by file:**

| File | Changes |
|---|---|
| `src/types/global.d.ts` | Rewrite to match Phase 1 types |
| `src/data/load-content.ts` | Keep as barrel re-export (unchanged API) |
| `src/pages/Home.tsx` | `cta_primary` → `ctaPrimary`, `cta_primary_href` → `ctaPrimaryHref`, `cta_secondary` → `ctaSecondary`, `cta_secondary_href` → `ctaSecondaryHref`, `cta_href` → `ctaHref` |
| `src/pages/HowItWorks.tsx` | Remove `Object.values(row)` — rows already `string[][]` |
| `src/pages/Pricing.tsx` | Remove `Object.values(row)` — rows already `string[][]`. `tos_pp` → `tosPp` |
| `src/components/layout/Nav.tsx` | `logo_text` → `logoText` |
| `src/pages/About.tsx` | No change if section structure unchanged |
| `src/components/content/FeatureCard.tsx` | No change (already uses `description`) |
| `src/components/content/PricingCard.tsx` | No change (already uses `ctaText`/`ctaHref`) |

**Also:**
- Merge `HOME_FEATURES` + `FEATURES` into single `FEATURES_CONTENT` export (or keep separate — decide based on consumer convenience)
- Merge `HOME_FAQ` + `FAQ_ITEMS` into single `FAQ_CONTENT` export
- Remove `src/utils/routes.ts` hardcoded `NAV_LINKS` — use `NAV_CONFIG.links` from content

**Exit criteria:** `npx tsc --noEmit` passes. `npx biome ci .` passes. All pages render identically.

---

### Phase 5 — Snapshot Tests + Cleanup (~30 min)

Add build output snapshot tests to prevent future regressions.

**Files:**
- `scripts/snapshot-test.sh` — builds, then diffs prerendered HTML against committed snapshots
- `snapshots/` — committed HTML snapshots for each route

**Steps:**
1. Build with current code, save `dist/*.html` as baseline snapshots
2. Create `npm run test:snapshots` script
3. Delete `tsconfig.build.json` (no longer needed — `vite-content-plugin.ts` is now trivial)
4. Remove the old 1001-line plugin backup
5. Update `SPRINT.md` with completion notes

**Exit criteria:** `npm run test:snapshots` passes. PR to main with all checks green.

---

## Risk Mitigation

- **Phase 2 is the critical path.** The about.md and problem.md parsers are fragile regex-over-HTML — port them carefully, add comments explaining what they match.
- **CMS table rows** (`comparison_table`, `feature_table`) use YAML objects `{"0": ..., "1": ...}` — convert to arrays in the loader, not in components. This removes the `Object.values()` workaround.
- **Hardcoded HOME_FINAL_CTA** — add `final_cta` section to `hero.md` frontmatter so CMS can edit it. Or create a `final-cta.md` file.
- **About page positional indexing** (`[s0, s1, s2, ...]`) — consider keying sections by slug derived from title. But this is a presentation concern, not a data concern — defer to a later sprint.

## File Count Estimate

| Phase | New/Modified Files | Lines Changed |
|---|---|---|
| 1 | 1 new | ~150 |
| 2 | 4 new | ~400 |
| 3 | 2 modified | -950 / +50 |
| 4 | ~10 modified | ~100 |
| 5 | 2 new, 1 deleted | ~50 |
| **Total** | ~20 files | ~750 net reduction |

## Definition of Done

- [ ] `vite-content-plugin.ts` < 60 lines
- [ ] All content interfaces in `src/data/types.ts`
- [ ] All field names camelCase (no snake_case in consumer code)
- [ ] Table rows are `string[][]` (no `Object.values()` in components)
- [ ] `SITE_CONFIG.tagline` bug fixed
- [ ] `BLOG_POSTS_MAP` includes `seoTitle`/`seoDescription`
- [ ] No hardcoded content strings in TypeScript
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `npx biome ci .` — 0 errors
- [ ] `npx vite build` — 10 pages prerendered
- [ ] Visual diff of all pages: no regressions
- [ ] PR to main, all CI checks green
