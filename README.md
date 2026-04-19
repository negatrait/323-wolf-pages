# 323-Wolf Pages on Cloudflare

## Overview

Sivussa.com is a Preact site with build-time prerendering, deployed on Cloudflare Pages via CI/CD from `origin/main`.

## Stack (Current)

| Package | Role | Installed | Latest | Status |
|---------|------|-----------|--------|--------|
| `preact` | UI framework | ^10.19.0 | 10.29.1 | ⚠️ minor behind |
| `preact-iso` | Isomorphic routing/hydration | ^2.0.0 | 2.11.1 | ⚠️ minor behind |
| `preact-render-to-string` | SSR render | ^6.3.0 | 6.6.7 | ⚠️ minor behind |
| `vite` | Build tool | ^5.0.0 | **8.0.8** | 🔴 3 major behind |
| `@preact/preset-vite` | Preact + prerender for Vite | ^2.8.0 | 2.10.5 | ⚠️ minor behind |
| `tailwindcss` | Utility CSS | ^3.4.1 | **4.2.2** | 🔴 1 major behind |
| `@tailwindcss/typography` | Prose styling | ^0.5.19 | see note (1) | ⚠️ v3-only API |
| `postcss` | CSS processing | ^8.4.33 | — | ❌ removable with TW4 |
| `autoprefixer` | Vendor prefixes | ^10.4.17 | — | ❌ removable with TW4 |
| `marked` | Markdown parser | ^18.0.1 | 18.0.0 | ✅ current |
| `gray-matter` | Frontmatter parser | ^4.0.3 | 4.0.3 | ✅ current |
| `highlight.js` | Syntax highlighting | ^11.11.1 | 11.11.1 | ✅ current |
| `@astrojs/markdown-remark` | — | ^7.1.0 | 7.0.0 | ❌ **dead dependency** — never imported |

### Missing

| Tool | Role |
|------|------|
| `@biomejs/biome` | Linter + formatter (replaces ESLint + Prettier) |
| `@tailwindcss/vite` | Vite plugin for Tailwind v4 (replaces PostCSS pipeline) |

### Notes

1. **@tailwindcss/typography**: The `^0.5.x` line is the Tailwind v3 plugin. For Tailwind v4, the typography plugin is loaded via `@plugin '@tailwindcss/typography'` in CSS — same package name, but usage changes.

---

## Modernization Plan

### Phase 1: Toolchain upgrade (zero visual change)

**Goal**: Get everything current without touching application code.

#### 1.1 Vite 8
- `npm install vite@latest @preact/preset-vite@latest`
- Rename `vite.config.js` → `vite.config.ts` (Vite 8 supports TS config natively)
- **Breaking changes to audit**: Vite 6+ changed environment API, dropped Node.js <18, changed `resolve.alias` behavior. Vite 8 may have further changes. Check [vite.dev/releases](https://vite.dev/releases) changelog.
- Verify `vite-content-plugin.mjs` compatibility (it uses raw Node.js `fs`/`path` — should be fine).
- **Risk**: `@preact/preset-vite` must be compatible with Vite 8. If not, pin Vite 7 and open upstream issue.

#### 1.2 Preact ecosystem
- `npm install preact@latest preact-iso@latest preact-render-to-string@latest`
- Drop direct `preact-render-to-string` import from `prerender.jsx` if `@preact/preset-vite`'s built-in prerender handles it (see Phase 2).
- No breaking changes expected (all within 10.x / 2.x / 6.x).

#### 1.3 Tailwind v4
- Remove: `tailwindcss`, `postcss`, `autoprefixer` (v3 packages)
- Install: `tailwindcss@latest @tailwindcss/vite @tailwindcss/typography`
- Delete `tailwind.config.js` and `postcss.config.js`
- Move theme configuration to CSS using `@theme` directive in `src/index.css`:
  ```css
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";

  @theme {
    --color-primary: #00FF41;
    --color-primary-dark: #00cc33;
    --color-primary-light: #33ff66;
    --color-primary-dim: rgba(0,255,65,0.15);
    --color-dark: #131313;
    --color-dark-50: #f5f5f5;
    /* ... etc */
    --font-sans: "Inter", system-ui, -apple-system, sans-serif;
    --font-mono: "JetBrains Mono", "Fira Code", monospace;
  }
  ```
- Add `@tailwindcss/vite` to `vite.config.ts` plugins array.
- **Custom keyframes/animations**: Move from `tailwind.config.js` to `@theme` or `@keyframes` in CSS.
- **Breaking changes to audit**: TW4 uses CSS-first config, different color scale format, removed `extend` key, changed class name behavior for some utilities. Run `npx @tailwindcss/upgrade` for automated migration.
- **Typography plugin**: Works in TW4 via `@plugin` directive. Verify prose class styling hasn't drifted.

#### 1.4 Biome
- Install: `npm install -D @biomejs/biome`
- Initialize: `npx @biomejs/biome init`
- Configure `biome.json`:
  ```json
  {
    "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
    "organizeImports": { "enabled": true },
    "linter": {
      "enabled": true,
      "rules": {
        "recommended": true,
        "correctness": { "noUnusedVariables": "warn" },
        "style": { "noNonNullAssertion": "off" }
      }
    },
    "formatter": {
      "enabled": true,
      "indentStyle": "space",
      "indentWidth": 2
    },
    "javascript": {
      "formatter": {
        "quoteStyle": "single",
        "semicolons": "always"
      }
    }
  }
  ```
- Add scripts:
  - `"lint": "biome lint ."`
  - `"format": "biome format --write ."`
  - `"check": "biome check ."`
- Add to CI (or at minimum, run before every commit).

#### 1.5 Dead dependency cleanup
- Remove `@astrojs/markdown-remark` — never imported, adds weight to `node_modules` and `npm audit` noise.
- Verify nothing in the codebase touches it (confirmed: only present in `node_modules/`).

---

### Phase 2: Prerender consolidation ✅ COMPLETE

**Goal**: Refactor `prerender.jsx` from a 149-line monolith into lean, separated concerns.

#### What was done
- `src/prerender.jsx` trimmed from 149 → 37 lines (plugin contract only)
- `src/data/route-meta.js` — single source of truth for per-route metadata
- `src/components/seo/Head.jsx` — client-side head mutations for SPA navigation
- `src/utils/seo.js` — JSON-LD schema builders (Organization, WebSite, SoftwareApplication, FAQPage)
- `vite-content-plugin.mjs` — regex while-loops refactored to `matchAll()`, `node:` protocol imports

#### Why the prerender script is still needed
`@preact/preset-vite` requires a prerender script — it calls your `prerender()` function. The script is the plugin's API contract, not optional. The preset handles route walking and HTML file generation; the script provides the rendered HTML and head elements per route.

#### Note on `preact-render-to-string`
Still in dependencies because the prerender script imports it directly. This is correct — the preset does not bundle it for you.

---

### Phase 3: Optional improvements (not blocking)

| Item | Why | Effort |
|------|-----|--------|
| **TypeScript migration** | `vite.config.ts` already hints at TS. Full `.jsx` → `.tsx` gives type safety for props/data. | Medium |
| **Content plugin refactor** | `vite-content-plugin.mjs` is ~200 lines of imperative parsing. Could be simplified with a schema/validation layer. | Low |
| **highlight.js → Shiki** | Shiki produces TypeScript-compatible highlighting, used by Astro/Starlight. But highlight.js works fine and is lighter. | Low priority |
| **Blog post code blocks** | Currently using custom marked renderer. Works. No change needed unless switching markdown pipeline. | None |

---

## Deployment

### Rules
- **`wrangler pages deploy dist` is FORBIDDEN** — push to `origin/main`, CF Pages auto-builds.
- All SEO metadata MUST be in the prerender pipeline (page components, content frontmatter, or Layout).
- JSON-LD schemas MUST be in prerendered HTML — not loaded via JavaScript after hydration.
- Titles and descriptions come from content frontmatter (`seo_title`, `seo_description` fields). Hardcoded in JS/JSX is forbidden.

### Adding a new page
1. Create the page component in `src/pages/`
2. Add the route in `src/app.jsx`
3. Add content markdown in `src/content/` if needed
4. Add `seo_title` and `seo_description` in content frontmatter
5. (Phase 2 onward: no route list to maintain — router auto-discovers)

### What to avoid
- Post-build scripts that inject HTML into `dist/` (use prerender pipeline)
- Client-side-only JSON-LD (must be in prerendered HTML)
- Untracked files in the repo (commit or delete)
- Dead code / disabled files (delete, don't rename to `.disabled`)

---

## References

Before modifying existing codebase or generating new code, read the correct references:

- [Preact](https://github.com/preactjs/preact) — UI framework
- [Preact ISO](https://github.com/preactjs/preact-iso) — isomorphic routing
- [@preact/preset-vite](https://github.com/preactjs/preset-vite) — Vite integration + prerender
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs) — current utility CSS
- [Biome](https://biomejs.dev/) — linter + formatter
- [Vite](https://vite.dev/) — build tool

This is strict: we avoid unnecessary dependency bloat and sprawling codebase.
