# 323-Wolf Pages on Cloudflare

## Overview

Sivussa.com is a Preact SPA with build-time prerendering, deployed on Cloudflare Pages via CI/CD from `origin/main`.

## Stack

- **Framework**: Preact 10 + Preact ISO (client-side routing with SSR-like prerender)
- **Build**: Vite + `@preact/preset-vite`
- **Content**: Markdown files in `src/content/` loaded via `vite-content-plugin.mjs`
- **Deploy**: Cloudflare Pages (auto-builds from `origin/main` push)
- **API**: Cloudflare Pages Functions in `functions/api/`

## Prerender Pipeline

This is the single source of truth for what HTML search engines see.

### How it works

1. **Vite config** (`vite.config.js`) enables prerender via `@preact/preset-vite` with `prerenderScript: '/src/prerender.jsx'`
2. **Prerender script** (`src/prerender.jsx`) renders the full `<App />` to string
3. **`additionalPrerenderRoutes`** in vite.config.js lists all routes to prerender
4. Build output in `dist/` contains static HTML for each route — this is what crawlers get

### Rules

- **All SEO metadata MUST be in the prerender pipeline** (page components, content frontmatter, or Layout). NOT in post-build scripts, NOT in client-side JS.
- **JSON-LD schemas MUST be in prerendered HTML** — not loaded via JavaScript after hydration.
- **Titles and descriptions come from content frontmatter** (`seo_title`, `seo_description` fields), hardcoded in JS/JSX is forbidden.
- **The prerender script renders the entire app tree** — Layout wraps all pages, so global meta changes go in Layout

## Content System

All page content lives in `src/content/` as Markdown with frontmatter:
- `home/hero.md`, `home/pricing.md`, `home/faq.md` — homepage sections
- `about.md` — about page
- `blog/posts/*.md` — blog posts
- `faq.md`, `nav.md`, `footer.md` — shared UI data

`vite-content-plugin.mjs` parses all markdown at build time and exports typed constants. Page components import from `virtual:content`.

## Adding a new page

1. Create the page component in `src/pages/`
2. Add the route in `src/app.jsx`
3. Add content markdown in `src/content/` if needed
4. Add the route to `additionalPrerenderRoutes` in `vite.config.js`
5. Add `seo_title` and `seo_description` in content frontmatter

## What to avoid

- Post-build scripts that inject HTML into dist/ (use prerender pipeline)
- Client-side-only JSON-LD (must be in prerendered HTML)
- `wrangler pages deploy dist` (push to origin/main, CF Pages builds CI/CD)
- Untracked files in the repo (commit or delete)
- Dead code / disabled files (delete, don't rename to .disabled)
