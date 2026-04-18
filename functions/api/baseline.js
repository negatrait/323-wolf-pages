// Sivussa Baseline API v1 — POST /api/baseline { url }
// Lightweight pre-scan: no PSI, no AI, no specialists. Mechanical checks only.
// Returns 5-category scores: Technical Foundation, Content & Keywords,
// Structure & Authority, Indexing & Visibility, Monitoring Setup + Overall

export const onRequestPost = async ({ request, env }) => {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }
  const url = body?.url;
  if (!url) return json({ error: 'Missing "url" field' }, 400);

  let parsed;
  try { parsed = new URL(url); } catch { return json({ error: 'Invalid URL' }, 400); }
  if (!['http:', 'https:'].includes(parsed.protocol)) return json({ error: 'Only HTTP(S) URLs allowed' }, 400);

  const findings = [];
  const recommendations = [];
  const baseUrl = parsed.origin;

  // --- Fetch resources in parallel (no PSI — baseline is fast) ---
  const [htmlRes, robotsRes, sitemapRes, llmsRes] = await Promise.allSettled([
    safeFetch(url),
    safeFetch(`${baseUrl}/robots.txt`),
    safeFetch(`${baseUrl}/sitemap.xml`),
    safeFetch(`${baseUrl}/llms.txt`),
  ]);

  const html = htmlRes.status === 'fulfilled' ? htmlRes.value : null;
  const robotsTxt = robotsRes.status === 'fulfilled' ? robotsRes.value : null;
  const sitemapXml = sitemapRes.status === 'fulfilled' ? sitemapRes.value : null;
  const llmsTxt = llmsRes.status === 'fulfilled' ? llmsRes.value : null;

  if (!html) {
    return json({ error: 'Could not fetch page', url }, 502);
  }

  // --- Parse HTML ---
  const meta = parseMeta(html);
  const headings = parseHeadings(html);
  const bodyText = extractBodyText(html);
  const h1s = headings.filter(h => h.level === 1);
  const h2s = headings.filter(h => h.level === 2);
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  // Schema detection
  const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(html);
  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const schemaTypes = [];
  jsonLdBlocks.forEach(block => {
    try {
      const data = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
      if (data['@type']) schemaTypes.push(data['@type']);
      if (Array.isArray(data)) data.forEach(d => { if (d['@type']) schemaTypes.push(d['@type']); });
      if (data['@graph']) data['@graph'].forEach(d => { if (d['@type']) schemaTypes.push(d['@type']); });
    } catch {}
  });

  // ===================================================================
  // CATEGORY 1: Technical Foundation (0-100)
  // HTTPS (15), robots.txt (15), sitemap (15), mobile viewport (15),
  // page load (10), canonical (10), doctype (10), lang (10)
  // ===================================================================
  let techPoints = 0;
  const techMax = 100;

  // HTTPS (15 points)
  if (parsed.protocol === 'https:') {
    techPoints += 15;
    findings.push({ cat: 'technicalFoundation', pass: true, msg: 'HTTPS enforced' });
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'critical', msg: 'HTTP — no HTTPS' });
    recommendations.push({ priority: 'critical', text: 'Enable HTTPS immediately' });
  }

  // robots.txt (15 points)
  if (robotsTxt) {
    techPoints += 10;
    findings.push({ cat: 'technicalFoundation', pass: true, msg: 'robots.txt exists' });
    if (/Sitemap:/i.test(robotsTxt)) {
      techPoints += 5;
      findings.push({ cat: 'technicalFoundation', pass: true, msg: 'robots.txt references sitemap' });
    } else {
      findings.push({ cat: 'technicalFoundation', pass: false, priority: 'medium', msg: 'robots.txt missing Sitemap directive' });
    }
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'high', msg: 'robots.txt missing' });
    recommendations.push({ priority: 'high', text: 'Add a robots.txt file' });
  }

  // sitemap.xml (15 points)
  if (sitemapXml && /<urlset|<sitemapindex/i.test(sitemapXml)) {
    techPoints += 15;
    findings.push({ cat: 'technicalFoundation', pass: true, msg: 'sitemap.xml valid' });
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'high', msg: 'sitemap.xml missing or invalid' });
    recommendations.push({ priority: 'high', text: 'Add a valid sitemap.xml' });
  }

  // Mobile viewport (15 points)
  if (meta.viewport) {
    techPoints += 15;
    findings.push({ cat: 'technicalFoundation', pass: true, msg: 'Viewport meta tag present' });
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'high', msg: 'Missing viewport meta tag' });
    recommendations.push({ priority: 'high', text: 'Add <meta name="viewport"> for mobile' });
  }

  // Page fetched successfully (10 points)
  techPoints += 10;

  // Canonical tag (10 points)
  if (meta.canonical) {
    techPoints += 10;
    findings.push({ cat: 'technicalFoundation', pass: true, msg: `Canonical: ${meta.canonical}` });
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'medium', msg: 'No canonical tag' });
    recommendations.push({ priority: 'medium', text: 'Add self-referencing canonical tag' });
  }

  // Doctype (10 points)
  if (/<!doctype\s+html/i.test(html)) {
    techPoints += 10;
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'low', msg: 'Missing DOCTYPE declaration' });
  }

  // Lang attribute (10 points)
  if (/<html[^>]+lang=["'][^"']+["']/i.test(html)) {
    techPoints += 10;
  } else {
    findings.push({ cat: 'technicalFoundation', pass: false, priority: 'medium', msg: 'Missing lang attribute on <html>' });
    recommendations.push({ priority: 'medium', text: 'Add lang attribute to <html> tag' });
  }

  const technicalFoundation = Math.round((techPoints / techMax) * 100);

  // ===================================================================
  // CATEGORY 2: Content & Keywords (0-100)
  // Title (20), meta description (20), word count (20),
  // keyword presence (20), alt text (20)
  // ===================================================================
  let contentPoints = 0;
  const contentMax = 100;

  // Title tag (20 points)
  const title = meta.title || '';
  if (title.length >= 30 && title.length <= 60) {
    contentPoints += 20;
    findings.push({ cat: 'contentKeywords', pass: true, msg: `Title: "${title}" (${title.length} chars)` });
  } else if (title.length > 0) {
    contentPoints += 10;
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'medium', msg: `Title: "${title}" (${title.length} chars — target 30-60)` });
    recommendations.push({ priority: 'medium', text: 'Optimize title tag to 30-60 characters' });
  } else {
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'critical', msg: 'Missing title tag' });
    recommendations.push({ priority: 'critical', text: 'Add a descriptive title tag' });
  }

  // Meta description (20 points)
  const desc = meta.description || '';
  if (desc.length >= 120 && desc.length <= 160) {
    contentPoints += 20;
    findings.push({ cat: 'contentKeywords', pass: true, msg: `Meta description (${desc.length} chars)` });
  } else if (desc.length > 0) {
    contentPoints += 10;
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'medium', msg: `Meta description ${desc.length} chars (target 120-160)` });
    recommendations.push({ priority: 'medium', text: 'Optimize meta description to 120-160 characters' });
  } else {
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'high', msg: 'Missing meta description' });
    recommendations.push({ priority: 'high', text: 'Add a meta description' });
  }

  // Word count (20 points)
  if (wordCount > 500) {
    contentPoints += 20;
    findings.push({ cat: 'contentKeywords', pass: true, msg: `${wordCount} words` });
  } else if (wordCount >= 300) {
    contentPoints += 10;
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'medium', msg: `${wordCount} words (target >500)` });
  } else {
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'high', msg: `Only ${wordCount} words — thin content` });
    recommendations.push({ priority: 'high', text: 'Expand content to at least 300 words' });
  }

  // Keyword presence in body (20 points)
  const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const bodyLower = bodyText.toLowerCase();
  const keywordMatches = titleWords.filter(w => bodyLower.includes(w)).length;
  if (titleWords.length > 0 && keywordMatches >= 2) {
    contentPoints += 20;
    findings.push({ cat: 'contentKeywords', pass: true, msg: 'Title keywords found in content' });
  } else if (keywordMatches >= 1) {
    contentPoints += 10;
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'medium', msg: 'Some keywords in content' });
  } else if (titleWords.length > 0) {
    findings.push({ cat: 'contentKeywords', pass: false, priority: 'medium', msg: 'Title keywords not found in content' });
    recommendations.push({ priority: 'medium', text: 'Include target keywords in page content' });
  } else {
    contentPoints += 5;
  }

  // Image alt text (20 points)
  const imgs = html.match(/<img[^>]*>/gi) || [];
  const imgsWithAlt = imgs.filter(i => /alt=["'][^"']+["']/i.test(i));
  if (imgs.length > 0) {
    const ratio = imgsWithAlt.length / imgs.length;
    if (ratio >= 0.8) {
      contentPoints += 20;
      findings.push({ cat: 'contentKeywords', pass: true, msg: `${imgsWithAlt.length}/${imgs.length} images have alt text` });
    } else if (ratio >= 0.5) {
      contentPoints += 10;
      findings.push({ cat: 'contentKeywords', pass: false, priority: 'medium', msg: `Only ${imgsWithAlt.length}/${imgs.length} images have alt text` });
    } else {
      findings.push({ cat: 'contentKeywords', pass: false, priority: 'high', msg: `Only ${Math.round(ratio * 100)}% images have alt text` });
      recommendations.push({ priority: 'high', text: 'Add alt text to all images' });
    }
  } else {
    contentPoints += 20;
  }

  const contentKeywords = Math.round((contentPoints / contentMax) * 100);

  // ===================================================================
  // CATEGORY 3: Structure & Authority (0-100)
  // H1 (15), heading hierarchy (15), JSON-LD (20),
  // Organization schema (20), FAQ schema (15), NAP data (15)
  // ===================================================================
  let structPoints = 0;
  const structMax = 100;

  // H1 (15 points)
  if (h1s.length === 1) {
    structPoints += 15;
    findings.push({ cat: 'structureAuthority', pass: true, msg: `Single H1: "${h1s[0].text}"` });
  } else if (h1s.length > 1) {
    structPoints += 5;
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'medium', msg: `${h1s.length} H1 tags — use exactly one` });
    recommendations.push({ priority: 'medium', text: 'Use exactly one H1 tag per page' });
  } else {
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'high', msg: 'No H1 tag' });
    recommendations.push({ priority: 'high', text: 'Add an H1 heading' });
  }

  // Heading hierarchy (15 points)
  if (h1s.length === 1 && h2s.length >= 1) {
    structPoints += 15;
    findings.push({ cat: 'structureAuthority', pass: true, msg: `Good hierarchy: 1 H1, ${h2s.length} H2s` });
  } else if (h2s.length >= 1) {
    structPoints += 7;
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'low', msg: 'H2s present but H1 issue' });
  } else {
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'medium', msg: 'No heading structure' });
  }

  // JSON-LD present (20 points)
  if (hasJsonLd && schemaTypes.length > 0) {
    structPoints += 20;
    findings.push({ cat: 'structureAuthority', pass: true, msg: `JSON-LD schema: ${schemaTypes.join(', ')}` });
  } else {
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'high', msg: 'No JSON-LD schema markup' });
    recommendations.push({ priority: 'high', text: 'Add JSON-LD structured data' });
  }

  // Organization/LocalBusiness schema (20 points)
  if (schemaTypes.some(t => t === 'Organization' || t === 'LocalBusiness')) {
    structPoints += 20;
    findings.push({ cat: 'structureAuthority', pass: true, msg: 'Organization/LocalBusiness schema present' });
  } else if (schemaTypes.length > 0) {
    structPoints += 10;
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'medium', msg: 'Schema present but no Organization type' });
    recommendations.push({ priority: 'medium', text: 'Add Organization schema' });
  }

  // FAQ schema (15 points)
  if (schemaTypes.some(t => t === 'FAQPage')) {
    structPoints += 15;
    findings.push({ cat: 'structureAuthority', pass: true, msg: 'FAQPage schema present' });
  } else {
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'low', msg: 'No FAQPage schema' });
  }

  // NAP data (15 points)
  const hasNap = /address|telephone|postalcode|locality/i.test(html) || schemaTypes.some(t => t === 'LocalBusiness');
  if (hasNap) {
    structPoints += 15;
    findings.push({ cat: 'structureAuthority', pass: true, msg: 'NAP data detected' });
  } else {
    findings.push({ cat: 'structureAuthority', pass: false, priority: 'low', msg: 'No NAP data' });
  }

  const structureAuthority = Math.round((structPoints / structMax) * 100);

  // ===================================================================
  // CATEGORY 4: Indexing & Visibility (0-100)
  // Sitemap validity (25), robots.txt allow (25), sitemap URL count (25),
  // schema errors (25)
  // ===================================================================
  let indexPoints = 0;
  const indexMax = 100;

  // Sitemap validity (25 points)
  if (sitemapXml && /<urlset|<sitemapindex/i.test(sitemapXml)) {
    indexPoints += 25;
    findings.push({ cat: 'indexingVisibility', pass: true, msg: 'Valid sitemap.xml' });
  } else {
    findings.push({ cat: 'indexingVisibility', pass: false, priority: 'high', msg: 'sitemap.xml missing or invalid' });
    recommendations.push({ priority: 'high', text: 'Create and submit a sitemap.xml' });
  }

  // Robots.txt not blocking (25 points)
  if (robotsTxt) {
    const blockingSelf = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(robotsTxt);
    if (!blockingSelf) {
      indexPoints += 25;
      findings.push({ cat: 'indexingVisibility', pass: true, msg: 'robots.txt not blocking crawlers' });
    } else {
      findings.push({ cat: 'indexingVisibility', pass: false, priority: 'critical', msg: 'robots.txt blocks all crawlers' });
      recommendations.push({ priority: 'critical', text: 'Remove blanket Disallow from robots.txt' });
    }
  } else {
    indexPoints += 15;
    findings.push({ cat: 'indexingVisibility', pass: false, priority: 'medium', msg: 'No robots.txt — crawlers have no guidance' });
  }

  // Sitemap URL count (25 points)
  if (sitemapXml) {
    const sitemapUrls = sitemapXml.match(/<loc>[^<]+<\/loc>/gi) || [];
    const pageCount = sitemapUrls.length;
    if (pageCount >= 5) {
      indexPoints += 25;
      findings.push({ cat: 'indexingVisibility', pass: true, msg: `Sitemap has ${pageCount} URLs` });
    } else if (pageCount >= 1) {
      indexPoints += 15;
      findings.push({ cat: 'indexingVisibility', pass: false, priority: 'medium', msg: `Only ${pageCount} URLs in sitemap` });
    }
  }

  // Schema valid (no parse errors) (25 points)
  let schemaErrors = 0;
  jsonLdBlocks.forEach(block => {
    try {
      JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
    } catch {
      schemaErrors++;
    }
  });
  if (jsonLdBlocks.length === 0) {
    indexPoints += 5;
    findings.push({ cat: 'indexingVisibility', pass: false, priority: 'low', msg: 'No structured data to validate' });
  } else if (schemaErrors === 0) {
    indexPoints += 25;
    findings.push({ cat: 'indexingVisibility', pass: true, msg: 'All JSON-LD blocks parse correctly' });
  } else {
    indexPoints += 10;
    findings.push({ cat: 'indexingVisibility', pass: false, priority: 'high', msg: `${schemaErrors} JSON-LD block(s) have parse errors` });
    recommendations.push({ priority: 'high', text: 'Fix JSON-LD syntax errors' });
  }

  const indexingVisibility = Math.round((indexPoints / indexMax) * 100);

  // ===================================================================
  // CATEGORY 5: Monitoring Setup (0-100)
  // Analytics (25), llms.txt (25), author attribution (25),
  // publication dates (25)
  // ===================================================================
  let monitorPoints = 0;
  const monitorMax = 100;

  // Analytics detection (25 points)
  const hasAnalytics =
    /google-analytics\.com|gtag|gtm\.google|googletagmanager|plausible|matomo|hotjar|clarity|umami|segment|analytics/i.test(html);
  if (hasAnalytics) {
    monitorPoints += 25;
    findings.push({ cat: 'monitoringSetup', pass: true, msg: 'Analytics tracking detected' });
  } else {
    findings.push({ cat: 'monitoringSetup', pass: false, priority: 'high', msg: 'No analytics tracking detected' });
    recommendations.push({ priority: 'high', text: 'Add analytics tracking (e.g., Google Analytics or Plausible)' });
  }

  // llms.txt (25 points)
  if (llmsTxt && llmsTxt.trim().length > 20) {
    monitorPoints += 25;
    findings.push({ cat: 'monitoringSetup', pass: true, msg: 'llms.txt present' });
  } else {
    findings.push({ cat: 'monitoringSetup', pass: false, priority: 'high', msg: 'llms.txt missing' });
    recommendations.push({ priority: 'high', text: 'Add /llms.txt for LLM discoverability' });
  }

  // Author attribution (25 points)
  const hasAuthor = /author|byline|written\s*by|<meta[^>]+name=["']author/i.test(html) || schemaTypes.some(t => t === 'Person');
  if (hasAuthor) {
    monitorPoints += 25;
    findings.push({ cat: 'monitoringSetup', pass: true, msg: 'Author attribution detected' });
  } else {
    findings.push({ cat: 'monitoringSetup', pass: false, priority: 'medium', msg: 'No author attribution' });
    recommendations.push({ priority: 'medium', text: 'Add author bylines for E-E-A-T signals' });
  }

  // Publication dates (25 points)
  const hasDate = /<time[^>]*>|datePublished|dateModified|article:published/i.test(html);
  if (hasDate) {
    monitorPoints += 25;
    findings.push({ cat: 'monitoringSetup', pass: true, msg: 'Publication dates found' });
  } else {
    findings.push({ cat: 'monitoringSetup', pass: false, priority: 'medium', msg: 'No publication dates' });
    recommendations.push({ priority: 'medium', text: 'Add publication/modification dates' });
  }

  const monitoringSetup = Math.round((monitorPoints / monitorMax) * 100);

  // ===================================================================
  // OVERALL (weighted)
  // ===================================================================
  const overall = Math.round(
    technicalFoundation * 0.25 +
    contentKeywords * 0.20 +
    structureAuthority * 0.20 +
    indexingVisibility * 0.20 +
    monitoringSetup * 0.15
  );

  // Prioritize recommendations
  const prioritizedRecommendations = {
    critical: recommendations.filter(r => r.priority === 'critical').map(r => r.text),
    high: recommendations.filter(r => r.priority === 'high').map(r => r.text),
    medium: recommendations.filter(r => r.priority === 'medium').map(r => r.text),
  };

  return json({
    url,
    scoredAt: new Date().toISOString(),
    categories: {
      technicalFoundation: { score: technicalFoundation, max: 100 },
      contentKeywords: { score: contentKeywords, max: 100 },
      structureAuthority: { score: structureAuthority, max: 100 },
      indexingVisibility: { score: indexingVisibility, max: 100 },
      monitoringSetup: { score: monitoringSetup, max: 100 },
    },
    overall,
    findings,
    recommendations: prioritizedRecommendations,
  });
};

export const onRequestOptions = () => new Response(null, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});

// --- Helpers ---
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function safeFetch(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SivussaBaseline/1.0' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

function parseMeta(html) {
  const meta = {};
  if (!html) return meta;
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) meta.title = titleMatch[1].trim();
  for (const m of (html.match(/<meta[^>]*>/gi) || [])) {
    const name = m.match(/name=["']([^"']+)["']/i) || m.match(/property=["']([^"']+)["']/i);
    const content = m.match(/content=["']([^"']+)["']/i);
    if (name && content) meta[name[1].toLowerCase()] = content[1];
  }
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
  if (canonicalMatch) meta.canonical = canonicalMatch[1];
  return meta;
}

function parseHeadings(html) {
  const headings = [];
  if (!html) return headings;
  const re = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    headings.push({ level: parseInt(m[1][1]), text: m[2].replace(/<[^>]*>/g, '').trim() });
  }
  return headings;
}

function extractBodyText(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
