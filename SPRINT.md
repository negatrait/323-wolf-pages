# Sprint 2 — TypeScript Safety & Preact Best Practices

**Goal:** Biome check zero errors/warnings. TypeScript strict mode zero errors. Content plugin modularized with full types. Proper Preact component types.

**Branch:** staging

---

## Phase 1 — Auto-fix

### T1.1 Format + organize imports
- `npx biome check --write .` — fixes 22 format/import issues

### T1.2 Remove unused variables
- 3 unused vars in content plugin (lines 590, 619, 622)

---

## Phase 2 — Modularize Content Plugin with Full Types

Extract 852-line monolith into typed modules. Each module is typed from extraction — no `any` migrations.

### Directory structure
```
vite-plugin/
├── index.ts              # Plugin entry (~80 lines)
├── types.ts              # All interfaces (~180 lines)
├── site-config.ts        # Site identity loader (~20 lines)
├── markdown-loader.ts    # loadMd + marked + HTML helpers (~80 lines)
├── parsers/
│   ├── home.ts           # HOME_* constants (~150 lines)
│   ├── about.ts          # ABOUT + section parsers (~100 lines)
│   ├── blog.ts           # BLOG_CONFIG + BLOG_POSTS_MAP (~60 lines)
│   ├── faq.ts            # FAQ_ITEMS (~15 lines)
│   ├── legal.ts          # PRIVACY_POLICY, TERMS, NOTICES (~30 lines)
│   ├── layout.ts         # NAV_CONFIG, FOOTER_* (~20 lines)
│   └── pricing.ts        # PRICING_* derived constants (~50 lines)
├── route-meta.ts         # buildRouteMeta() (~50 lines)
├── llms-generator.ts     # llms.txt + llms-*.md (~140 lines)
└── sitemap-generator.ts  # sitemap.xml (~50 lines)
```

### T2.1 `vite-plugin/types.ts`
All interfaces extracted and **tightened** — no `any`:

```typescript
// Site identity (from site.md)
export interface SiteConfig {
  name: string;
  url: string;
  email: string;
  tagline: string;
}

// Frontmatter interfaces (what gray-matter parses)
export interface HeroFrontmatter { ... }
export interface PricingFrontmatter { ... }
export interface FaqFrontmatter { ... }
// etc.

// Parsed content interfaces (what parsers output)
export interface HeroContent { ... }
export interface PricingContent { ... }
export interface AboutContent { ... }
export interface BlogPostContent { ... }
// etc.

// Route meta
export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
}

// Parsed FAQ item
export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

// Blog post (what components receive)
export interface BlogPost {
  title: string;
  description: string;
  seo_title?: string;
  seo_description?: string;
  date: string;
  category: string;
  readTime: string;
  html: string;
}
```

### T2.2 `vite-plugin/site-config.ts`
```typescript
import type { SiteConfig } from './types';
// loadMd imported from sibling module
export function loadSiteConfig(contentDir: string): SiteConfig { ... }
```

### T2.3 `vite-plugin/markdown-loader.ts`
```typescript
export function loadMd<T>(contentDir: string, filePath: string): 
  { frontmatter: T; html: string; raw: string } { ... }
// + all HTML helpers, typed inputs/outputs
// + marked setup
```

### T2.4 `vite-plugin/parsers/*.ts`
Each parser function:
- Takes typed inputs (`contentDir: string`, `loadMd` function)
- Returns typed constants using interfaces from `types.ts`
- Zero `any` — if frontmatter shape is uncertain, use optional fields

Example `parsers/home.ts`:
```typescript
import type { HeroFrontmatter, HeroContent, WhatYouGetFrontmatter, ... } from '../types';
export function parseHome(contentDir: string, loadMd: LoadMdFn): {
  HOME_HERO: HeroContent;
  HOME_WHAT_YOU_GET: WhatYouGetContent;
  // ... all home constants
} { ... }
```

### T2.5 `vite-plugin/route-meta.ts`
```typescript
import type { RouteMeta } from './types';
export function buildRouteMeta(
  contentDir: string,
  site: SiteConfig,
  hero: HeroFrontmatter,
  pricing: PricingFrontmatter,
  // ... typed params, no any
): Record<string, RouteMeta> { ... }
```

### T2.6 `vite-plugin/llms-generator.ts`
```typescript
import type { SiteConfig, HeroFrontmatter, ... } from './types';
export function generateLlmsFiles(
  site: SiteConfig,
  hero: HeroFrontmatter,
  // ... typed params
): Record<string, string> { ... }  // filename → content
```

### T2.7 `vite-plugin/sitemap-generator.ts`
```typescript
export function generateSitemap(
  contentDir: string,
  siteUrl: string,
): string { ... }  // XML string
```

### T2.8 `vite-plugin/index.ts` — thin orchestrator
```typescript
import type { Plugin } from 'vite';
// Import all parsers, generators
export default function contentPlugin(): Plugin {
  return {
    name: 'vite-content-plugin',
    resolveId(id) { ... },
    load(id) {
      // Call each parser, assemble export map
      // ~80 lines of orchestration
    },
    generateBundle() {
      // Call llms + sitemap generators, emit files
    },
  };
}
```

### T2.9 Update `vite.config.ts` import
- Change `./vite-content-plugin.ts` → `./vite-plugin/index.ts`

### T2.10 Verify build passes
- `npx vite build` — zero behavior change
- All pages render identically

**Checkpoint: Harri reviews module structure before proceeding.**

---

## Phase 3 — TypeScript Infrastructure

### T3.1 Add `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ES2022",
    "skipLibCheck": true
  },
  "include": ["src", "vite-plugin", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### T3.2 Declare virtual module
```typescript
// src/vite-env.d.ts
declare module 'virtual:content' {
  export const SITE_CONFIG: import('../vite-plugin/types').SiteConfig;
  export const ROUTE_META: Record<string, import('../vite-plugin/types').RouteMeta>;
  export const HOME_HERO: import('../vite-plugin/types').HeroContent;
  // ... all exports
}
```

### T3.3 Add scripts to package.json
- `"typecheck": "tsc --noEmit"`

### T3.4 Install type deps
- `@types/node` for vite plugin files

### T3.5 `tsc --noEmit` — fix any remaining errors
- Content plugin already typed from Phase 2
- Expect: Preact JSX type mismatches, component prop issues

---

## Phase 4 — Type All Component Props

### T4.1 Component prop interfaces (14 components)
Each gets a `Props` interface:
```
Accordion → { question: string; answer: string; defaultOpen?: boolean }
BreadcrumbNav → { currentPage: string; extraLink?: { href: string; label: string } }
Button → { children: ComponentChildren; href?: string; variant?: string; class?: string }
FeatureCard → { title: string; description: string }
Head → { title: string; description: string; canonical: string; ogImage?: string }
Layout → { children: ComponentChildren }
PricingCard → { tier: string; price: string; period: string; features: string[]; cta: string; ctaHref: string; popular?: boolean }
Section → { children: ComponentChildren; dark?: boolean; class?: string }
StepCard → { number: string; title: string; description: string }
TestimonialCard → { quote: string; name: string; role: string }
Nav → {} (no props)
Footer → {} (no props)
```

### T4.2 Page component types (11 pages)
- `BlogPost({ slug }: { slug: string })`
- All others: `() => VNode` (no props)

### T4.3 Hook types
- `Head.tsx` uses Preact `useEffect` — type deps array properly
- `Accordion.tsx` uses `useState<boolean>` — type state

### T4.4 `class` vs `className` decision
- Preact accepts both. With TypeScript + JSX, `className` is the React-compatible typed path.
- Decision: **keep `class`** (Preact-native) but add JSX namespace declaration to satisfy TS
- Add to `vite-env.d.ts`:
  ```typescript
  declare namespace JSX {
    interface HTMLAttributes<T> {
      class?: string;
      for?: string;
    }
  }
  ```

---

## Phase 5 — Preact Best Practices

### T5.1 FunctionalComponent signatures
- Components use `FunctionalComponent<Props>` where it adds value
- Simple components can stay as typed functions — don't over-ceremony

### T5.2 Key props audit
- All `.map()` calls have proper `key` props
- No array index keys where stable IDs exist

### T5.3 Event handler types
- Any click/submit handlers get proper Preact event types

---

## Phase 6 — Final Verification

### T6.1 `npx biome check .` — zero errors, zero warnings
### T6.2 `npx tsc --noEmit` — zero errors
### T6.3 `npx vite build` — passes
### T6.4 Update README (module structure, typecheck command)
### T6.5 Sync main ← staging

---

## Execution Order

```
T1.1-T1.2  Auto-fix (10 min)
    ↓
T2.1-T2.10 Modularize with types (2-3h) ← CHECKPOINT
    ↓
T3.1-T3.5 TypeScript infra (30 min)
    ↓
T4.1-T4.4 Component types (1h)
    ↓
T5.1-T5.3 Preact patterns (30 min)
    ↓
T6.1-T6.5 Verify (15 min)
```

## Scope
- **In:** src/, vite-plugin/, vite.config.ts, tsconfig.json, biome.json
- **Out:** functions/ (plain JS), public/ (static), design/UX, new features
