# Sprint 2 — TypeScript Safety & Preact Best Practices

**Goal:** Biome check zero errors/warnings. TypeScript strict mode zero errors. Proper Preact component types.

**Branch:** staging

---

## Phase 1 — Auto-fix ✅
- `npx biome check --write .` — fixed 22 format/import issues
- Commit: `16c9b95`

## Phase 2 — Eliminate `any` in Content Plugin ✅
- Replaced all 15 `any` with proper interfaces
- Added: `SiteConfig`, `StepItem`, `PricingTier`, `PricingFaqItem`, `CompetitorItem`, `FaqItemWithCategory`, `BlogPostParsed`, `SeoFrontmatter`
- `buildRouteMeta()` params now typed: `HeroFrontmatter`, `PricingFrontmatter`, `FaqFrontmatter`, `PageFrontmatter`, `Record<string, BlogPostParsed>`
- LLM generator casts typed: `StepItem`, `PricingTier`, `PricingFaqItem`, `FaqItemWithCategory`
- `blogPostsMap` type: `Record<string, unknown>` → `Record<string, BlogPostParsed>`
- **Biome: 0 errors, 0 warnings**
- **Build: passes**

### Design Decision: Single File
Vite 8's config bundler (rolldown) cannot resolve relative imports between plugin files in a directory. Multi-file plugin structure doesn't work. Content plugin stays as single `vite-content-plugin.ts` with clear section headers and full type safety. Interfaces are defined inline, organized by section.

---

## Phase 3 — TypeScript Infrastructure (next)

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
  "include": ["src", "vite-content-plugin.ts", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### T3.2 Declare virtual module
```typescript
// src/vite-env.d.ts
declare module 'virtual:content' {
  // all exported constants with types
}
```

### T3.3 Add scripts
- `"typecheck": "tsc --noEmit"` in package.json

### T3.4 Install type deps
- `@types/node`

### T3.5 `tsc --noEmit` — fix errors until zero

---

## Phase 4 — Type All Component Props (next)

### T4.1 Component prop interfaces (14 components)
### T4.2 Page component types (11 pages)
### T4.3 Hook types (useEffect, useState)
### T4.4 `class` vs `className` — keep Preact `class`, add JSX namespace declaration

---

## Phase 5 — Preact Best Practices (next)

### T5.1 FunctionalComponent signatures
### T5.2 Key props audit
### T5.3 Event handler types

---

## Phase 6 — Final Verification

### T6.1 `npx biome check .` — zero
### T6.2 `npx tsc --noEmit` — zero
### T6.3 `npx vite build` — passes
### T6.4 Update README
### T6.5 Sync main

---

## Scope
- **In:** src/, vite-content-plugin.ts, vite.config.ts, tsconfig.json
- **Out:** functions/ (plain JS), public/ (static), design/UX, new features
