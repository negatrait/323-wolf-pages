# Sprint 2 — TypeScript Safety & Preact Best Practices

**Goal:** Biome check passes with zero errors/warnings. Full TypeScript strict mode. Proper Preact component types. Content plugin modularized.

**Branch:** staging

---

## Phase 1 — Auto-fix (low risk, high volume)

### T1.1 Format + organize imports
- `npx biome check --write .` — fixes 22 format/import issues
- Verify build still passes

### T1.2 Remove unused variables
- 3 unused variables in `vite-content-plugin.ts` (lines 590, 619, 622)
- Delete or wire them up

---

## Phase 2 — Modularize Content Plugin

Current state: `vite-content-plugin.ts` is 852 lines — a monolith doing 5 jobs. Must split before typing.

### T2.1 Create `vite-plugin/` directory structure
```
vite-plugin/
├── index.ts              # Plugin entry (load + generateBundle hooks, imports parsers)
├── types.ts              # All interfaces (frontmatter, parsed content, site config)
├── site-config.ts        # loadSiteConfig() + SITE constant
├── markdown-loader.ts    # loadMd(), marked setup, HTML helpers
├── parsers/
│   ├── home.ts           # HOME_HERO, HOME_WHAT_YOU_GET, HOME_PROBLEM, HOME_HOW_IT_WORKS, HOME_FEATURES, HOME_WHO_IS_THIS_FOR, HOME_PRICING, HOME_FAQ, HOME_FINAL_CTA
│   ├── about.ts          # ABOUT, parseAboutSections, mapAboutSection
│   ├── blog.ts           # BLOG_CONFIG, BLOG_POSTS_MAP
│   ├── faq.ts            # FAQ_ITEMS
│   ├── legal.ts          # PRIVACY_POLICY, TERMS_OF_SERVICE, OPEN_SOURCE_NOTICES
│   ├── layout.ts         # NAV_CONFIG, FOOTER_SECTIONS, FOOTER_COPYRIGHT
│   └── pricing.ts        # PRICING_TIERS, PRICING_FAQ, PRICING_FEATURE_TABLE, PRICING_COMPETITORS, PRICING_CTA, PRICING_TERMS
├── route-meta.ts         # buildRouteMeta()
├── llms-generator.ts     # generateBundle llms section
└── sitemap-generator.ts  # generateBundle sitemap section
```

### T2.2 Extract `types.ts`
- Move all 130 lines of interfaces out of the monolith
- Re-export from single file

### T2.3 Extract `markdown-loader.ts`
- `loadMd()`, marked setup, `stripTags()`, `extractLiText()`, `findParagraph()`, `extractH2UlSections()`
- ~60 lines, pure utility functions

### T2.4 Extract `site-config.ts`
- `loadSiteConfig()`, `SITE` variable
- ~15 lines

### T2.5 Extract parsers into `parsers/`
- Each parser function takes `contentDir` + `loadMd` + helpers, returns its constants
- `home.ts` is the biggest (~140 lines) — handles hero, what-you-get, problem, how-it-works, features, who-is-this-for, pricing
- Each parser: ~20-80 lines

### T2.6 Extract `route-meta.ts`
- `buildRouteMeta()` — 47 lines
- Takes parsed frontmatters, returns route map

### T2.7 Extract `llms-generator.ts`
- All llms.txt + llms-*.md template building from generateBundle
- ~130 lines

### T2.8 Extract `sitemap-generator.ts`
- Sitemap XML generation from generateBundle
- ~40 lines

### T2.9 Rewrite `index.ts` as thin orchestrator
- `load()` hook: calls parsers, assembles export map
- `generateBundle()` hook: calls llms-generator + sitemap-generator
- Target: ~80 lines (imports + plugin skeleton + emit)

### T2.10 Verify build passes after modularization
- `npx vite build` — zero behavior change
- All pages render identically
- Update `vite.config.ts` import path

---

## Phase 3 — TypeScript Infrastructure

### T3.1 Add `tsconfig.json`
- `strict: true`, `noUncheckedIndexedAccess`, `noImplicitReturns`
- `jsx: "react-jsx"`, `jsxImportSource: "preact"`
- Include `src/`, `vite-plugin/`, `vite.config.ts`
- Paths alias for `virtual:content` module declaration

### T3.2 Add `typecheck` script
- `"typecheck": "tsc --noEmit"` in package.json
- Must pass with zero errors

### T3.3 Add type dependencies
- `@types/node` if not present
- Verify all imports resolve

---

## Phase 4 — Type All Component Props

### T4.1 Define interfaces for every component (14 components)
- Accordion, BreadcrumbNav, Button, FeatureCard, Head, Layout
- Nav, PricingCard, Section, StepCard, TestimonialCard
- All get typed `Props` interfaces

### T4.2 Type page component props (11 pages)
- `BlogPost({ slug }: { slug: string })` — only page with props
- Others: no-arg functions returning JSX

### T4.3 Type all hooks and event handlers
- `useEffect` in Head.tsx
- `useState` in Accordion.tsx

---

## Phase 5 — Eliminate `any` (now feasible after modularization)

### T5.1 Type `vite-plugin/parsers/*.ts`
- Each parser already has its own file — type the inputs and outputs
- Replace `any` with proper frontmatter interfaces from `types.ts`

### T5.2 Type `vite-plugin/llms-generator.ts`
- Template functions take typed parsed content, not `any`

### T5.3 Type `vite-plugin/route-meta.ts`
- Frontmatter params already typed from parsers

### T5.4 Declare virtual module types
- `src/vite-env.d.ts` or `types.d.ts` declaring `virtual:content` module
- Gives autocomplete to all importers

---

## Phase 6 — Preact Best Practices

### T6.1 FunctionalComponent signatures
- All components use `FunctionalComponent<Props>` or typed arrow functions

### T6.2 `class` vs `className` decision
- Document choice, apply consistently

### T6.3 Key props on mapped elements
- Audit all `.map()` calls

---

## Phase 7 — Final Verification

### T7.1 `npx biome check .` — zero errors, zero warnings
### T7.2 `npx tsc --noEmit` — zero errors
### T7.3 `npx vite build` — passes
### T7.4 Update README
### T7.5 Force-push main if needed

---

## Dependency Chain

```
Phase 1 (auto-fix)
  ↓
Phase 2 (modularize) ← Harri reviews the structure before proceeding
  ↓
Phase 3 (tsconfig) ← needs modular files to be incremental
  ↓
Phase 4 (component types) ← independent of plugin
  ↓
Phase 5 (eliminate any) ← only possible after Phase 2+3
  ↓
Phase 6 (Preact patterns) ← after Phase 4
  ↓
Phase 7 (verify)
```

**Checkpoint:** After Phase 2, request review. The module structure determines how clean Phases 3-5 can be.

## Scope Boundaries

**In scope:** src/, vite-plugin/, vite.config.ts, tsconfig.json, biome.json
**Out of scope:** functions/ (plain JS), public/ (static), design/UX changes, new features
