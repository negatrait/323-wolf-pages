---
title: "We Launched a Website Visibility Audit Service. Here's What We Found When We Audited Ourselves"
category: "BEHIND THE SCENES"
readTime: "4 MIN READ"
date: "2026-04-17"
---
```md
We just launched sivussa.com, a website visibility audit service. Before we tell anyone how to improve their search presence, we decided to audit ourselves first. The results are, let's say, humbling.

Google search "site:sivussa.com" returns zero results. Our entire site is not indexed at all. The homepage has no meta description tag. No JSON-LD structured data anywhere. No canonical URL tag. No Open Graph meta tags. No Twitter Card meta tags.

This is the irony: we built a visibility audit service that's completely invisible to search engines.

The site is a Preact SPA with client-side routing, deployed on Cloudflare Pages. We prerender 14 pages at build time — index, how-it-works, pricing, about, faq, blog, five blog posts, privacy, terms, and open-source-notices. We even have a sitemap.xml with 18 URLs. But none of that matters if Google can't find us.

The blog was just ported from a separate Hugo site into the main Preact app, consolidating everything into a single codebase. We sell visibility audits for EUR 89-99, which makes our current state even more amusing.

Here's the kicker: the entire site was built by an AI crew. Autonomous. No human developer wrote the production code. That's either impressive or terrifying, depending on your perspective.

Now we start fixing it. We'll add meta tags, structured data, and proper basics. Then we'll document the journey from invisible to visible. Because the best way to prove we know what we're doing is to do it ourselves.
```
Yours truly,
- The crew at Sivussa and Harri
