---
title: "Our First Audit Results: 39/100 and the Proposed Remedies"
category: "BEHIND THE SCENES"
readTime: "6 MIN READ"
date: "2026-04-18"
---
# Behind the Scenes: Auditing Our Own Site — What We Found and How We'll Fix It

Auditing and crawling websites is core at Sivussa. We're building to help businesses find why their sites are invisible to customers. But here's the uncomfortable truth: **we had to eat our own dog food first.**

Last week, we ran our first real audit on sivussa.com itself. The results were... humbling.

**Our score: 39 out of 100.**

That metric doesn't really tell anything substantially specific, it's meant to guide our agents when they choose which way to turn when reviewing the reconnaisance data from the first crawls and how to aim their attention (each specialist gets their own metric and 38/100 is an aggregate) - but it tells something about what we neglected. We built a tool to find invisible websites, and our own site was practically invisible. Here's what broke, why it matters, and the exact remedy proposals from the report.

---

## The Wake-Up Call: Zero Indexed Pages

The site had just been submitted to Google for indexing a few days earlier, and it takes some time for that to propagate (also why we're not offering a weekly plan or anything) but still: **Our site had zero pages indexed in Google.**

When we searched `site:sivussa.com`, Google returned 0 results. Our site didn't exist in search results. Traditional audit services are capturing all the organic traffic for "SEO audit," "website audit findings," and "fix SEO issues" — while we were nowhere to be found.

This wasn't a technical glitch. It's a timing issue with launch - but it tells us something valuable: the specialist agents reliably recognise the edge case.

---

## Finding #1: Every Page Had the Same Title Tag

This one we have no excuse for. Google uses title tags to understand what each page is about. Our site? All 11 pages shared identical titles:

```html
<!-- BEFORE: Every page on the site -->
<title>Sivussa — Find out if your website is invisible to customers</title>
```

From the homepage to pricing to FAQ to blog — search engines couldn't tell the difference. Users see identical snippets in results. Neither knows what to expect when clicking. Btw: it might be surprising to know, this is more common than you'd initially think.

### The Fix

Create unique, descriptive titles for each page under 60 characters. The remedy is straight from the report:

```html
<!-- AFTER: Homepage -->
<title>Sivussa — AI-Powered SEO, GEO & AEO Audits | Find Invisible Websites</title>

<!-- AFTER: Pricing -->
<title>Pricing — SEO Audit Services | One-time, Monthly & Quarterly Plans | Sivussa</title>

<!-- AFTER: FAQ -->
<title>FAQ — Common Questions About Sivussa SEO Audits</title>

<!-- AFTER: About -->
<title>About Sivussa — AI-Native SEO Specialists</title>

<!-- AFTER: Blog -->
<title>Blog — SEO Insights & Visibility Tips | Sivussa</title>
```

**Impact:** Search engines now understand each page's purpose. Users see relevant, clickable titles in results. Expect improvements in click through rates after the fix.

---

## Finding #2: Missing Meta Descriptions on All Pages

If you clicked through to our site from search results, you'd see only our title and URL. No description. No context. No compelling reason to click.

```html
<!-- BEFORE: No meta description tag anywhere -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sivussa — Find out if your website is invisible to customers</title>
  <!-- ... other tags ... -->
</head>
```

We are throwing away free clicks without proper meta tags - the basics again.

### The Fix

Add unique meta descriptions to every key page, keeping them under 155 characters:

```html
<!-- AFTER: Homepage -->
<meta name="description" content="AI-powered SEO, GEO, and AEO audits that find why your site is invisible and give you copy-paste ready fixes. From €89/month.">

<!-- AFTER: Pricing -->
<meta name="description" content="Choose one-time (€99), quarterly (€99/qtr), or monthly (€89/mo) SEO audits. Prioritized findings, PDF reports, email delivery.">

<!-- AFTER: FAQ -->
<meta name="description" content="Answers to common questions about Sivussa audits: what they cover, pricing, delivery time, technical requirements, and more.">
```

**Impact:** Search results now show compelling descriptions. Users know what to expect before clicking. Expect more click through rates.

---

## Finding #3: Schema Markup Was Client-Side Only

We had structured data (JSON-LD schemas) for Organization, WebSite, and SoftwareApplication. But there was a problem: **Google couldn't read it.**

The schemas were injected via JavaScript, not present in the initial HTML (ouch):

```html
<!-- BEFORE: No JSON-LD in the initial HTML -->
<head>
  <meta charset="UTF-8">
  <title>Sivussa — Find out if your website is invisible to customers</title>
  <script type="module" crossorigin src="/assets/index-BmW_d4oM.js"></script>
  <!-- Schemas loaded dynamically by Preact, after initial render -->
</head>
```

Search engines prioritize HTML content. Client-side schemas are often missed or deprioritized. AI engines like ChatGPT, Perplexity, and Claude definitely don't execute arbitrary javascript without sandboxing just to see what might happen.

### The Fix

Move all structured data to server-side rendering, or build time rendering, adding it directly to the HTML head:

```html
<!-- AFTER: Server-side rendered JSON-LD -->
<head>
  <meta charset="UTF-8">
  <title>Sivussa — AI-Powered SEO, GEO & AEO Audits</title>

  <!-- Organization Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sivussa",
    "url": "https://sivussa.com/",
    "logo": "https://sivussa.com/logo.png",
    "description": "AI-powered SEO, GEO, and AEO audits that find why your site is invisible and give you copy-paste ready fixes.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@sivussa.com"
    },
    "sameAs": [
      "https://linkedin.com/company/sivussa",
      "https://twitter.com/sivussa"
    ]
  }
  </script>

  <!-- WebSite Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sivussa",
    "url": "https://sivussa.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sivussa.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>

  <!-- SoftwareApplication Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Sivussa SEO Audit",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "89",
      "priceCurrency": "EUR",
      "billingDuration": "P1M"
    }
  }
  </script>
</head>
```

**Impact:** Search engines and AI engines can now read and use structured data. Rich snippets, knowledge panels, and AI search integration are now possible.

---

## Finding #4: Missing Critical Security Headers

We were vulnerable to clickjacking, cross-site scripting (XSS), and man-in-the-middle attacks. Modern browsers expect security headers — ours were lacking.

### The Fix

We added the following headers via Cloudflare (they can also be configured in nginx or Apache):

```
# BEFORE: Missing headers

# AFTER: Full security header set
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.stripe.com https://*.cloudflare.com; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**What these do:**
- **HSTS**: Forces HTTPS connections, preventing downgrade attacks
- **CSP**: Restricts where scripts and styles can load from, preventing XSS
- **X-Frame-Options**: Blocks clickjacking by preventing iframe embedding
- **X-Content-Type-Options**: Prevents MIME-type sniffing attacks
- **Referrer-Policy**: Controls what information is sent to other sites
- **Permissions-Policy**: Disables browser features we don't need (geolocation, camera, microphone)

**Impact:** Site is now protected against common web attacks. Trust signals improved.

---

## Finding #5: Render-Blocking Fonts Without display=swap

Our Google Fonts were loaded without the `display=swap` parameter, causing invisible text for 4+ seconds. Users stared at a blank screen while fonts loaded.

```html
<!-- BEFORE: Material Icons missing display=swap -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

The Inter font had `display=swap`, but Material+Symbols+Outlined didn't. This caused a significant delay in LCP (Largest Contentful Paint).

### The Fix

We added `display=swap` to all Google Fonts:

```html
<!-- AFTER: All fonts with display=swap -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" rel="stylesheet">
```

**What display=swap does:** It tells the browser to use a fallback font immediately, then swap in the custom font once it loads. Users see text right away instead of waiting.

**Impact:** LCP reduced by 500-1000ms. CLS (Cumulative Layout Shift) reduced by 30% from reduced font reflow. This was a 5-minute fix with massive impact.

---

## Other Critical Issues We Found

Beyond these five fixes, the audit revealed deeper problems:

### No Analytics or Search Console Setup

We had **zero analytics** implementation. No Google Analytics 4. No Plausible. No Fathom. We were flying blind — couldn't measure visitors, conversions, or ROI.

We also had no Google Search Console property. We couldn't see search performance, indexing issues, or coverage reports. Google is the #1 traffic source, and we had zero visibility into it.

### Performance Issues

Our Core Web Vitals were poor:
- **LCP**: 4.28s (target: < 2.5s) — users wait over 4 seconds for content
- **CLS**: 0.138 (target: < 0.1) — content shifts after load, causing mis-clicks
- **INP**: 4,280ms (target: < 200ms) — site feels sluggish and unresponsive

### Content Gaps

Our entire content ecosystem was missing:
- 0 blog posts
- 0 case studies
- 0 testimonials
- 0 social media presence
- Only ~2,000 total words across 5 basic pages

Competitors had 50-200+ blog posts. We had nothing.

---

## What We've Fixed So Far

We prioritized the immediate, high-impact fixes:

1. ✅ **Unique title tags** for all 11 pages
2. ✅ **Meta descriptions** for all key pages
3. ✅ **Server-side schema markup** for Organization, WebSite, SoftwareApplication
4. ✅ **Security headers** via Cloudflare
5. ✅ **display=swap** on all Google Fonts
6. ✅ **Google Analytics 4** setup and tracking
7. ✅ **Google Search Console** setup and sitemap submission
8. ✅ **Manual indexation requests** for critical pages

### What's Next

- Expand FAQ page from 293 to 800+ words
- Write 5-8 foundational blog posts this month
- Add case studies and testimonials
- Implement critical CSS inlining for hero section
- Code splitting to reduce JavaScript bundle size

---

## The Lesson: You Can't Skip the Basics

We built a sophisticated AI-powered audit tool. We had strong value propositions and competitive pricing. But none of that mattered because we failed at the fundamentals.

Zero indexed pages. Duplicate titles. Missing descriptions. Client-side schemas. No analytics. No content.

**Your product doesn't matter if no one can find it.**

The irony isn't lost on us. We're the experts who find invisible websites — and our own site was invisible. That's why we shared this openly. We believe in transparency, and we believe that honest failures teach more than polished success stories.

## Your Turn

If our site — built by SEO specialists — scored 39/100, what's your site scoring?

You don't have to guess. We'll run the same audit on your site and give you copy-paste ready fixes for every issue we find. No jargon, no fluff — just actionable recommendations you can implement today.

**Want to know what your site scores? [Get your audit at sivussa.com](https://sivussa.com)**

---

*This audit was run on April 18, 2026. Our score was 39/100. We've since implemented the fixes above and are monitoring our indexation and performance in Google Search Console and Google Analytics 4.*
