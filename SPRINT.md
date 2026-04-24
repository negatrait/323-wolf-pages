# Sprint 2 — TypeScript Safety & Preact Best Practices

**Goal:** Biome check passes with zero errors/warnings. Full TypeScript strict mode. Proper Preact component types.

**Branch:** staging
**Duration estimate:** 4-6h engineering time

---

## Phase 1 — Auto-fix (low risk, high volume)

### T1.1 Format + organize imports
- `npx biome check --write .` — fixes 22 format/import issues automatically
- Verify build still passes

### T1.2 Remove unused variables in content plugin
- Lines 590, 619, 622: `noUnusedVariables` in `vite-content-plugin.ts`
- 3 variables declared but never read

---

## Phase 2 — TypeScript Infrastructure

### T2.1 Add `tsconfig.json`
- `strict: true`, `noUncheckedIndexedAccess`, `noImplicitReturns`
- `jsx: "react-jsx"`, `jsxImportSource: "preact"`
- Include `src/`, `vite-content-plugin.ts`, `vite.config.ts`
- Exclude `node_modules/`, `dist/`
- May need `@tsconfig/biome` or Vite-compatible base

### T2.2 Add `typecheck` script to package.json
- `"typecheck": "tsc --noEmit"`
- Must pass with zero errors

### T2.3 Install type dependencies
- `@types/node` (for vite plugin)
- Verify existing: `preact`, `@preact/preset-vite` types

---

## Phase 3 — Type All Component Props

### T3.1 Define interfaces for every component
Current state — all props are untyped:
```
Accordion({ question, answer, defaultOpen })
BlogPost({ slug })
BreadcrumbNav({ currentPage, extraLink })
Button({ children, href, variant, class })
FeatureCard({ title, description })
Head({ title, description, canonical, ogImage, structuredData })
Layout({ children })
PricingCard({ tier, price, period, features, cta, ctaHref, popular })
Section({ children, dark, class })
StepCard({ number, title, description })
TestimonialCard({ quote, name, role })
```

Each gets a typed `Props` interface and `FunctionalComponent` signature.

### T3.2 Type page component props
- `BlogPost` receives `{ slug: string }` from router
- All other pages take no props — type as `() => VNode`

### T3.3 Type all hooks and event handlers
- `Head.tsx` uses `useEffect` with deps array
- `Accordion.tsx` uses `useState`
- Ensure proper Preact hook types

---

## Phase 4 — Eliminate `any` in Content Plugin

### T4.1 Replace `any` with proper types (15 instances)
Current `any` usage in `vite-content-plugin.ts`:
- `buildRouteMeta` params (6×)
- `blogPostsMap` entries (5×)
- `generateBundle` helper functions (4×)

Fix: define interfaces for parsed markdown results (`ParsedHero`, `ParsedPricing`, etc.) and use them instead of `any`.

### T4.2 Type the virtual module exports
- `load-content.ts` re-exports are untyped
- Add type declarations so consumers get autocomplete
- Consider a `types.d.ts` or `vite-env.d.ts` for the virtual module

---

## Phase 5 — Content Plugin Type Safety

### T5.1 Type `loadMd` return values
- Currently generic with `Record<string, unknown>` default
- Each call site should specify its frontmatter interface
- Verify all 15+ `loadMd` calls use typed interfaces

### T5.2 Type `parseAboutSections` and other parsers
- `parseAboutSections` returns `RawAboutSection[]` (already has interface)
- Verify all parser return types match their consumers

### T5.3 Type `generateBundle` sitemap and llms generation
- Sitemap entries, llms file maps — all typed

---

## Phase 6 — Preact Best Practices

### T6.1 Proper component signatures
- All components: `FunctionalComponent<Props>` or arrow functions with typed props
- No bare `export function Comp({ prop })` without types

### T6.2 `class` prop → `className` where appropriate
- Preact supports `class` but TypeScript + React types expect `className`
- Decide: keep Preact-native `class` (with custom types) or switch to `className`
- Document the decision

### T6.3 Key props on mapped elements
- Verify all `.map()` calls have proper `key` props
- No array index keys where data has unique IDs

---

## Phase 7 — Final Verification

### T7.1 `npx biome check .` — zero errors, zero warnings
### T7.2 `npx tsc --noEmit` — zero errors
### T7.3 `npx vite build` — still passes
### T7.4 Update README with TypeScript requirements
### T7.5 Update `.pages.yml` if any content file changes

---

## Scope Boundaries

**In scope:** src/, vite-content-plugin.ts, vite.config.ts
**Out of scope:** index.html (minimal JS), functions/ (plain JS, not TS), public/ (static files), design/UX changes, new features

## Risk Notes

- Adding `tsconfig.json` strict mode will surface many implicit-any errors in existing code
- The content plugin is ~800 lines with heavy `any` usage — biggest refactor target
- Preact `class` vs `className` decision affects every component
- All changes must pass `vite build` — type errors that don't affect runtime still block the sprint
