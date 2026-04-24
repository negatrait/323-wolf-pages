# Sivussa.com

AI-native website visibility audit service. Preact SPA with build-time prerendering, deployed on Cloudflare Pages.

## Architecture

```mermaid
graph TD
    subgraph Build Time
        MD["src/content/*.md<br/>(Markdown + frontmatter)"]
        VCP["vite-content-plugin.ts<br/>(gray-matter → marked → JS)"]
        VP["vite-sitemap-plugin.ts<br/>(git dates → sitemap.xml)"]
        PR["src/prerender.tsx<br/>(renderToString per route)"]
        VITE["vite.config.ts<br/>(Vite 8 + Preact preset)"]
    end

    subgraph Runtime — Static Assets
        DIST["dist/<br/>(prerendered HTML + CSS + JS)"]
        STATIC["public/<br/>(robots.txt, _headers, llms*, .well-known/)"]
    end

    subgraph Runtime — Cloudflare Pages Functions
        MW["functions/_middleware.ts<br/>(Accept: text/markdown → llms-*.md)"]
    end

    subgraph Pages
        HOME["Home /"]
        HIW["How It Works"]
        PRICE["Pricing"]
        ABOUT["About"]
        FAQ["FAQ"]
        BLOG["Blog + Blog Posts"]
        LEGAL["Privacy / Terms / Notices"]
    end

    MD --> VCP
    VCP --> |"virtual:content"| HOME
    VCP --> PRICE
    VCP --> FAQ
    VCP --> ABOUT
    VCP --> BLOG
    VP --> DIST
    PR --> DIST
    VITE --> PR
    STATIC --> DIST
    MW --> |"content negotiation"| STATIC

    style VCP fill:#57AE7B,color:#071F16
    style PR fill:#57AE7B,color:#071F16
    style MW fill:#FF9037,color:#071F16
```

## How It Works

### Content Pipeline

1. **Author content** in `src/content/` as markdown files with YAML frontmatter
2. **Build time**: `vite-content-plugin.ts` reads all markdown, parses frontmatter (gray-matter), renders HTML (marked), and emits a `virtual:content` module with typed JS constants
3. **Page components** import constants from `virtual:content` via `src/data/load-content.ts`
4. **Prerender**: `@preact/preset-vite` calls `src/prerender.tsx` for each route, producing static HTML with full SEO metadata
5. **Deploy**: Cloudflare Pages auto-builds from `main` branch

### Agent Accessibility

- **Content negotiation**: `functions/_middleware.ts` serves markdown versions when `Accept: text/markdown` is sent
- **llms.txt + llms-*.md**: Generated at build time by `vite-content-plugin.ts` from the same `src/content/` markdown files — no manual editing needed, one source of truth
- **Agent Skills**: `/.well-known/agent-skills/` provides navigation skill for agents
- **Content Signals**: `robots.txt` declares AI content preferences

### SEO

- **Prerendered HTML**: Every page is pre-rendered with full meta tags, JSON-LD, and canonical URLs
- **`src/data/route-meta.ts`**: Single source of truth for per-route title/description/canonical
- **`src/components/seo/Head.tsx`**: Client-side head mutations for SPA navigation
- **JSON-LD**: Organization, WebSite, SoftwareApplication schemas on homepage
- **Sitemap**: Auto-generated from content markdown files with git last-modified dates

## Project Structure

```
├── functions/                    # Cloudflare Pages Functions
│   └── _middleware.ts            # Markdown content negotiation for AI agents
├── public/                       # Static assets (copied to dist/)
│   ├── _headers                  # Cloudflare response headers
│   ├── _redirects                # Cloudflare redirect rules
│   ├── robots.txt                # Crawler directives + Content Signals
│   ├── sivussa-banner.webp       # Hero banner image
│   └── .well-known/
│       └── agent-skills/         # Agent Skills index + SKILL.md
├── src/
│   ├── app.tsx                   # Router — all routes defined here
│   ├── index.tsx                 # Entry point (hydrate)
│   ├── index.css                 # Tailwind theme + global styles
│   ├── prerender.tsx             # Build-time prerender contract
│   ├── components/
│   │   ├── common/               # Accordion, Button, Section
│   │   ├── content/              # FeatureCard, PricingCard, StepCard, TestimonialCard
│   │   ├── layout/               # Layout, Nav, Footer, BreadcrumbNav
│   │   └── seo/                  # Head (client-side meta mutations)
│   ├── content/                  # Markdown content (single source of truth)
│   │   ├── about.md
│   │   ├── faq.md
│   │   ├── footer.md
│   │   ├── nav.md
│   │   ├── home/                 # Homepage sections
│   │   │   ├── hero.md           #   Title, subtitle, CTAs
│   │   │   ├── problem.md        #   Problem statement
│   │   │   ├── how-it-works.md   #   Process steps
│   │   │   ├── features.md       #   Feature cards
│   │   │   ├── pricing.md        #   Pricing tiers
│   │   │   ├── what-you-get.md   #   Deliverables
│   │   │   ├── who-is-this-for.md
│   │   │   └── *.md              #   Legal pages
│   │   └── blog/
│   │       ├── index.md          #   Blog index config
│   │       └── posts/            #   Blog posts (slug = filename)
│   ├── data/
│   │   ├── load-content.ts       # Re-exports from virtual:content
│   │   └── route-meta.ts         # Per-route SEO metadata
│   ├── pages/                    # Page components (one per route)
│   ├── styles/
│   │   └── highlight.css         # Syntax highlighting theme
│   └── utils/
│       ├── routes.ts             # Nav links + route labels
│       └── seo.ts                # JSON-LD schema builders
├── vite-content-plugin.ts        # Markdown → typed JS (556 lines)
├── vite-sitemap-plugin.ts        # Sitemap generator
└── vite.config.ts                # Build config
```

## Brand Colors

| Role | Value | Usage |
|------|-------|-------|
| Primary | `#57AE7B` | CTAs, links, accents |
| Primary dark | `#3d8a5e` | Hover states |
| Primary light | `#7bc99a` | Gradient endpoints |
| Accent | `#FF9037` | Orange highlights |
| Off-black | `#071F16` | Background (`dark-900`) |
| Off-white | `#FFF7E3` | Light text (`dark-50`) |

Defined in `src/index.css` `@theme` block. All Tailwind utilities (`text-primary`, `bg-dark-900`, etc.) derive from these.

## Deployment

### Rules
- **`wrangler pages deploy` is FORBIDDEN** — push to `origin/main`, Cloudflare Pages auto-builds
- **Staging** (`origin/staging`) auto-deploys as a password-protected preview site
- **Production** (`origin/main`) auto-deploys to sivussa.com

### Branch workflow
1. Work on `staging` branch
2. Push → Cloudflare deploys preview (password-protected)
3. Review on staging preview
4. Create PR: `staging` → `main`
5. Merge → auto-deploys to production

### CMS
Content can be edited via [Pages CMS](https://pagescms.org) connected to the repository. The `.pages.yml` file at the repository root configures the editor for every content file, organized into groups:

**What's editable via CMS:**
- All homepage sections (hero, problem, how-it-works, features, pricing, who-is-this-for, what-you-get)
- About page, FAQ page, blog posts
- Navigation, footer, legal pages (privacy, terms, notices)
- Agent content (llms.txt, llms-*.md)
- Config files (robots.txt, _headers, _redirects)

**How to use:**
1. Open Pages CMS connected to the `negatrait/323-wolf-pages` repo
2. Select the `main` branch (or `staging` for preview)
3. Edit content through the visual editor
4. Save — CMS commits directly to the branch
5. Cloudflare auto-deploys

**What's NOT in the CMS:** Code files (components, plugins, styles) and auto-generated files (llms.txt, llms-*.md — generated at build time from the same content). Those require git/PR workflow.

## Adding Content

### New page
1. Create component in `src/pages/`
2. Add route in `src/app.tsx`
3. Add SEO metadata in `src/data/route-meta.ts`
4. Add route to `additionalPrerenderRoutes` in `vite.config.ts`
5. Add sitemap entry in `vite-sitemap-plugin.ts`

### New blog post
1. Create `src/content/blog/posts/<slug>.md` with frontmatter (`title`, `date`, `author`, etc.)
2. The content plugin auto-discovers it, the sitemap plugin includes it

### Updating existing content
Edit the markdown in `src/content/`. Frontmatter fields are documented in `vite-content-plugin.ts` interfaces. SEO metadata lives in `src/data/route-meta.ts`.

## Development

```bash
npm install
npm run dev        # Local dev server with HMR
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run check      # Biome lint + format check
```

## Active Sprint

See [SPRINT.md](./SPRINT.md) for current work-in-progress: content de-jargon, hardcoded text removal, and code quality fixes.

## What Not To Do

- Don't inject HTML into `dist/` post-build — use the prerender pipeline
- Don't load JSON-LD via client-side JavaScript — must be in prerendered HTML
- Don't hardcode titles/descriptions in JSX — use content frontmatter or `route-meta.ts`
- Don't leave dead code or disabled files — delete, don't rename to `.disabled`
- Don't use `pip install` or `sudo apt` for project dependencies — use `npm`
- Don't run `wrangler pages deploy` — Cloudflare auto-deploys from git

## References

These repositories are relevant for understanding the technologies used:

- [Preact](https://github.com/preactjs/preact) — UI framework (3KB React alternative)
- [Preact ISO](https://github.com/preactjs/preact-iso) — Isomorphic routing/hydration
- [@preact/preset-vite](https://github.com/preactjs/preset-vite) — Vite integration + prerender
- [Vite](https://github.com/vitejs/vite) — Build tool
- [Tailwind CSS v4](https://github.com/tailwindlabs/tailwindcss) — Utility CSS with CSS-first config
- [Marked](https://github.com/markedjs/marked) — Markdown parser
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — YAML frontmatter parser
- [highlight.js](https://github.com/highlightjs/highlight.js) — Syntax highlighting
- [Biome](https://github.com/biomejs/biome) — Linter + formatter
- [Cloudflare Pages](https://developers.cloudflare.com/pages/) — Hosting + CDN + Functions
- [Agent Skills](https://github.com/agentskills/agentskills) — Agent skill specification
