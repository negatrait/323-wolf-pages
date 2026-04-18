// Sivussa Audit Engine v4 — POST /api/audit { url }
// Point-based scoring on 0-100 scale
// 5-category model: Technical Foundation, Content & Keywords,
// Structure & Authority, Indexing & Visibility, Monitoring Setup
// Based on audit-engine-tech-docs.md specification

export const onRequestPost = async ({ request }) => {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }
  const url = body?.url;
  if (!url) return json({ error: 'Missing "url" field' }, 400);

  let parsed;
  try { parsed = new URL(url); } catch { return json({ error: 'Invalid URL' }, 400); }
  if (!['http:', 'https:'].includes(parsed.protocol)) return json({ error: 'Only HTTP(S) URLs allowed' }, 400);

  const findings = [];
  const recommendations = [];
  const metrics = { seo: {}, geo: {}, aeo: {} }; // Structured metrics for specialists

  // --- Fetch all resources in parallel ---
  const baseUrl = parsed.origin;
  const [htmlRes, robotsRes, sitemapRes, llmsRes, psiRes] = await Promise.allSettled([
    safeFetch(url, 'html'), safeFetch(`${baseUrl}/robots.txt`, 'text'),
    safeFetch(`${baseUrl}/sitemap.xml`, 'text'), safeFetch(`${baseUrl}/llms.txt`, 'text'),
    fetchPageSpeed(url).catch(() => null),
  ]);

  const html = htmlRes.status === 'fulfilled' ? htmlRes.value : null;
  const robotsTxt = robotsRes.status === 'fulfilled' ? robotsRes.value : null;
  const sitemapXml = sitemapRes.status === 'fulfilled' ? sitemapRes.value : null;
  const llmsTxt = llmsRes.status === 'fulfilled' ? llmsRes.value : null;
  const psiData = psiRes.status === 'fulfilled' ? psiRes.value : null;

  if (!html) { findings.push({ cat: 'critical', priority: 'critical', msg: 'Could not fetch homepage HTML' }); }

  // --- Parse HTML ---
  const meta = parseMeta(html);
  const headings = parseHeadings(html);
  const bodyText = extractBodyText(html);
  const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(html || '');
  const jsonLdBlocks = html ? (html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []) : [];

  // --- Detect Business Type ---
  const businessType = detectBusinessType(html, meta, bodyText, parsed.hostname);

  // ===== SEO SCORING (7.5 points → 0-75, then scale to 0-100) =====
  // Structure: Technical (25pts), On-Page (20pts), Schema (15pts), Content (20pts), CWV (20pts)
  let seoPoints = 0;
  let seoMaxPoints = 100;
  let lighthouse = null;

  // --- 1. Technical SEO (25 points) ---
  let technicalPoints = 0;

  // 1.1 Page Speed - LCP (10 points)
  // 1.2 Mobile Usability (5 points)
  // 1.3 HTTPS (5 points)
  // 1.4 Robots.txt (5 points)

  if (psiData && psiData.lighthouseResult) {
    const perf = psiData.lighthouseResult.categories?.performance?.score || 0;
    const acc = psiData.lighthouseResult.categories?.accessibility?.score || 0;
    lighthouse = { performance: Math.round(perf * 100), accessibility: Math.round(acc * 100) };

    // Core Web Vitals
    const audits = psiData.lighthouseResult.audits || {};
    const cwv = {};
    const lcpAudit = audits['largest-contentful-paint'];
    const inpAudit = audits['interaction-to-next-paint'];
    const clsAudit = audits['cumulative-layout-shift'];

    // LCP scoring (10 points)
    if (lcpAudit?.numericValue !== undefined) {
      cwv.lcp = Math.round(lcpAudit.numericValue);
      if (cwv.lcp < 1200) { technicalPoints += 10; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `LCP: ${(cwv.lcp / 1000).toFixed(1)}s (excellent <1.2s)` }); }
      else if (cwv.lcp < 2500) { technicalPoints += 5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: `LCP: ${(cwv.lcp / 1000).toFixed(1)}s (good <2.5s)` }); }
      else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `LCP: ${(cwv.lcp / 1000).toFixed(1)}s (target <2.5s)` }); recommendations.push({ priority: 'high', text: 'Optimize server response time, eliminate render-blocking resources, optimize images' }); }
      metrics.seo.lcp = cwv.lcp;
    }

    // Mobile usability (5 points)
    const viewportPresent = meta.viewport !== undefined;
    if (viewportPresent && acc >= 0.8) { technicalPoints += 5; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `Mobile usability: Good (${lighthouse.accessibility}/100)` }); }
    else if (viewportPresent) { technicalPoints += 2.5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: `Mobile viewport present, accessibility: ${lighthouse.accessibility}/100` }); }
    else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: 'Missing viewport meta tag' }); recommendations.push({ priority: 'high', text: 'Add <meta name="viewport"> for mobile' }); }
    metrics.seo.mobile_score = acc;

    // Store CWV
    if (inpAudit?.numericValue !== undefined) cwv.inp = Math.round(inpAudit.numericValue);
    if (clsAudit?.numericValue !== undefined) cwv.cls = Math.round(clsAudit.numericValue * 1000) / 1000;
    if (Object.keys(cwv).length > 0) lighthouse.cwv = cwv;
    metrics.seo.cwv = cwv;
  } else {
    findings.push({ cat: 'seo', priority: 'low', pass: null, msg: 'Performance data unavailable (Lighthouse quota or timeout)' });
    // Award partial points for checks we can do without PSI
    if (meta.viewport) technicalPoints += 2.5;
  }

  // HTTPS (5 points)
  if (parsed.protocol === 'https:') { technicalPoints += 5; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: 'HTTPS enforced' }); metrics.seo.https = true; }
  else { findings.push({ cat: 'seo', priority: 'critical', pass: false, msg: 'HTTP — no HTTPS redirect detected' }); recommendations.push({ priority: 'critical', text: 'Enable HTTPS immediately' }); metrics.seo.https = false; }

  // Robots.txt (5 points)
  if (robotsTxt) {
    technicalPoints += 3;
    findings.push({ cat: 'seo', priority: 'low', pass: true, msg: 'robots.txt exists' });
    if (/Sitemap:/i.test(robotsTxt)) { technicalPoints += 2; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: 'robots.txt references sitemap' }); }
    else { findings.push({ cat: 'seo', priority: 'medium', pass: false, msg: 'robots.txt does not reference sitemap' }); recommendations.push({ priority: 'medium', text: 'Add Sitemap: line to robots.txt' }); }
    metrics.seo.robots_txt = true;
  } else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: 'robots.txt missing' }); recommendations.push({ priority: 'high', text: 'Add a robots.txt file' }); metrics.seo.robots_txt = false; }

  metrics.seo.technical = Math.round(technicalPoints);
  seoPoints += technicalPoints;

  // --- 2. On-Page SEO (20 points) ---
  let onPagePoints = 0;

  // 2.1 Title Tag (7 points)
  const title = meta.title || '';
  if (title.length >= 30 && title.length <= 60) { onPagePoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `Title: "${title}" (${title.length} chars)` }); }
  else if (title.length > 0) { onPagePoints += 3.5; findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `Title: "${title}" (${title.length} chars — target 30-60)` }); recommendations.push({ priority: 'high', text: 'Optimize title tag to 30-60 characters' }); }
  else { findings.push({ cat: 'seo', priority: 'critical', pass: false, msg: 'Missing title tag' }); recommendations.push({ priority: 'critical', text: 'Add a descriptive title tag' }); }
  metrics.seo.title_length = title.length;

  // 2.2 Meta Description (7 points)
  const desc = meta.description || '';
  if (desc.length >= 120 && desc.length <= 160) { onPagePoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `Meta description present (${desc.length} chars)` }); }
  else if (desc.length > 0) { onPagePoints += 3.5; findings.push({ cat: 'seo', priority: 'medium', pass: false, msg: `Meta description ${desc.length} chars (target 120-160)` }); recommendations.push({ priority: 'medium', text: 'Optimize meta description to 120-160 characters' }); }
  else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: 'Missing meta description' }); recommendations.push({ priority: 'high', text: 'Add a meta description' }); }
  metrics.seo.meta_description_length = desc.length;

  // 2.3 Heading Structure (6 points)
  const h1s = headings.filter(h => h.level === 1);
  const h2s = headings.filter(h => h.level === 2);
  if (h1s.length === 1 && h2s.length >= 1) { onPagePoints += 6; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: 'Single H1 + proper hierarchy' }); }
  else if (h1s.length === 1) { onPagePoints += 3; findings.push({ cat: 'seo', priority: 'medium', pass: false, msg: 'Single H1 but no H2s' }); recommendations.push({ priority: 'medium', text: 'Add H2 headings for content structure' }); }
  else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `Found ${h1s.length} H1 tags` }); recommendations.push({ priority: 'high', text: 'Use exactly one H1 tag per page' }); }
  metrics.seo.h1_count = h1s.length;
  metrics.seo.h2_count = h2s.length;

  // Canonical (bonus, up to 2 points)
  if (meta.canonical) { onPagePoints = Math.min(20, onPagePoints + 2); findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `Canonical tag: ${meta.canonical}` }); }
  else { findings.push({ cat: 'seo', priority: 'medium', pass: false, msg: 'No canonical tag' }); recommendations.push({ priority: 'medium', text: 'Add self-referencing canonical tag' }); }

  metrics.seo.on_page = Math.round(onPagePoints);
  seoPoints += onPagePoints;

  // --- 3. Schema Markup (15 points) ---
  let schemaPoints = 0;
  const schemaTypes = [];
  jsonLdBlocks.forEach(block => {
    try {
      const data = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
      if (data['@type']) schemaTypes.push(data['@type']);
      if (Array.isArray(data)) data.forEach(d => { if (d['@type']) schemaTypes.push(d['@type']); });
    } catch {}
  });

  // 3.1 JSON-LD present (8 points)
  if (hasJsonLd && schemaTypes.length > 0) { schemaPoints += 8; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `JSON-LD schema found: ${schemaTypes.join(', ')}` }); }
  else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: 'No JSON-LD schema markup' }); recommendations.push({ priority: 'high', text: `Add JSON-LD schema (${getRecommendedSchema(businessType.type)})` }); }
  metrics.seo.jsonld = hasJsonLd;

  // 3.2 Organization schema (7 points)
  if (schemaTypes.some(t => t === 'Organization' || t === 'LocalBusiness')) { schemaPoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: 'Organization/LocalBusiness schema present' }); }
  else if (schemaTypes.length > 0) { schemaPoints += 3.5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: 'Other schema present (missing Organization)' }); recommendations.push({ priority: 'medium', text: 'Add Organization schema' }); }
  metrics.seo.has_organization_schema = schemaTypes.some(t => t === 'Organization' || t === 'LocalBusiness');

  metrics.seo.schema = Math.round(schemaPoints);
  seoPoints += schemaPoints;

  // --- 4. Content Quality (20 points) ---
  let contentPoints = 0;
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  // 4.1 Word Count (7 points)
  if (wordCount > 500) { contentPoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `${wordCount} words of content` }); }
  else if (wordCount >= 300) { contentPoints += 3.5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: `${wordCount} words (target >500)` }); }
  else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `Only ${wordCount} words — thin content` }); recommendations.push({ priority: 'high', text: 'Expand content to at least 300 words' }); }
  metrics.seo.word_count = wordCount;

  // 4.2 Keyword presence (7 points) - simplified check
  const titleWords = (meta.title || '').toLowerCase().split(/\s+/).filter(Boolean);
  const bodyLower = bodyText.toLowerCase();
  const keywordMatches = titleWords.filter(w => w.length > 3 && bodyLower.includes(w)).length;
  if (keywordMatches >= 2) { contentPoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `Primary keywords found in content` }); }
  else if (keywordMatches >= 1) { contentPoints += 3.5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: `Some keywords in content` }); }
  else { findings.push({ cat: 'seo', priority: 'medium', pass: false, msg: 'Title keywords not found in content' }); recommendations.push({ priority: 'medium', text: 'Include target keywords in page content' }); }
  metrics.seo.keyword_presence = keywordMatches;

  // 4.3 Image Alt Text (6 points)
  const imgs = html ? (html.match(/<img[^>]*>/gi) || []) : [];
  const imgsWithAlt = imgs.filter(i => /alt=["'][^"']+["']/i.test(i));
  if (imgs.length > 0) {
    const ratio = imgsWithAlt.length / imgs.length;
    if (ratio >= 0.8) { contentPoints += 6; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `${imgsWithAlt.length}/${imgs.length} images have alt text` }); }
    else if (ratio >= 0.5) { contentPoints += 3; findings.push({ cat: 'seo', priority: 'medium', pass: false, msg: `Only ${imgsWithAlt.length}/${imgs.length} images have alt text` }); recommendations.push({ priority: 'medium', text: 'Add alt text to all images' }); }
    else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `Only ${Math.round(ratio * 100)}% of images have alt text` }); recommendations.push({ priority: 'high', text: 'Add alt text to all images' }); }
    metrics.seo.alt_text_ratio = Math.round(ratio * 100);
  } else { contentPoints += 6; metrics.seo.alt_text_ratio = 100; } // No images = pass

  metrics.seo.content = Math.round(contentPoints);
  seoPoints += contentPoints;

  // --- 5. Core Web Vitals (20 points) ---
  let cwvPoints = 0;
  if (lighthouse?.cwv) {
    // INP (7 points)
    if (lighthouse.cwv.inp !== undefined) {
      if (lighthouse.cwv.inp < 100) { cwvPoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `INP: ${lighthouse.cwv.inp}ms (excellent <100ms)` }); }
      else if (lighthouse.cwv.inp < 200) { cwvPoints += 3.5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: `INP: ${lighthouse.cwv.inp}ms (good <200ms)` }); }
      else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `INP: ${lighthouse.cwv.inp}ms (target <200ms)` }); recommendations.push({ priority: 'high', text: 'Reduce JavaScript execution time' }); }
    }
    // CLS (7 points)
    if (lighthouse.cwv.cls !== undefined) {
      if (lighthouse.cwv.cls < 0.1) { cwvPoints += 7; findings.push({ cat: 'seo', priority: 'low', pass: true, msg: `CLS: ${lighthouse.cwv.cls} (excellent <0.1)` }); }
      else if (lighthouse.cwv.cls < 0.25) { cwvPoints += 3.5; findings.push({ cat: 'seo', priority: 'medium', pass: true, msg: `CLS: ${lighthouse.cwv.cls} (good <0.25)` }); }
      else { findings.push({ cat: 'seo', priority: 'high', pass: false, msg: `CLS: ${lighthouse.cwv.cls} (target <0.1)` }); recommendations.push({ priority: 'high', text: 'Set image dimensions, avoid layout shifts' }); }
    }
    // LCP bonus (6 points)
    if (lighthouse.cwv.lcp !== undefined) {
      if (lighthouse.cwv.lcp < 1200) { cwvPoints += 6; }
      else if (lighthouse.cwv.lcp < 2500) { cwvPoints += 3; }
    }
  } else {
    // No CWV data - don't penalize, but note it
    findings.push({ cat: 'seo', priority: 'low', pass: null, msg: 'Core Web Vitals unavailable (no Lighthouse data)' });
  }
  metrics.seo.cwv_score = Math.round(cwvPoints);
  seoPoints += cwvPoints;

  // Sitemap check (bonus)
  if (sitemapXml && /<urlset|<sitemapindex/i.test(sitemapXml)) {
    findings.push({ cat: 'seo', priority: 'low', pass: true, msg: 'sitemap.xml is valid XML' });
    metrics.seo.sitemap = true;
  } else {
    findings.push({ cat: 'seo', priority: 'high', pass: false, msg: 'sitemap.xml missing or invalid' });
    recommendations.push({ priority: 'high', text: 'Add a valid sitemap.xml' });
    metrics.seo.sitemap = false;
  }

  // Calculate SEO score (0-100)
  const seo = Math.round(seoPoints);

  // ===== GOOGLE INDEXING CHECK =====
  let indexedStatus = { indexed: null, pages: 0, error: null };
  try {
    if (sitemapXml) {
      const sitemapUrls = sitemapXml.match(/<loc>([^<]+)<\/loc>/gi) || [];
      indexedStatus.pages = sitemapUrls.length;
      indexedStatus.note = 'Sitemap URL count (actual indexing requires Search Console)';
    }
  } catch (e) {
    indexedStatus.error = e.message;
  }
  metrics.seo.indexed_pages = indexedStatus.pages;

  // ===== SCHEMA VALIDATION =====
  const schemaValidation = validateSchemas(jsonLdBlocks, baseUrl);
  if (schemaValidation.errors.length > 0) {
    schemaValidation.errors.forEach(err => {
      findings.push({ cat: 'geo', priority: err.severity, pass: false, msg: err.msg });
      if (err.severity === 'high' || err.severity === 'critical') {
        recommendations.push({ priority: err.severity, text: err.recommendation });
      }
    });
  }

  // ===== GEO SCORING (5.0 points base → 0-100) =====
  // Structure: Local Schema (30pts), NAP (20pts), Maps (20pts), Local Content (20pts), llms.txt (10pts)
  let geoPoints = 0;
  const isLocalBusiness = businessType.type === 'local_service';

  // --- 1. Local Business Schema (30 points) ---
  let localSchemaPoints = 0;
  if (schemaTypes.some(t => t === 'LocalBusiness')) { localSchemaPoints += 15; findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'LocalBusiness schema present' }); }
  else if (schemaTypes.some(t => t === 'Organization')) { localSchemaPoints += 7.5; findings.push({ cat: 'geo', priority: 'medium', pass: true, msg: 'Organization schema (consider LocalBusiness)' }); }
  else if (isLocalBusiness) { findings.push({ cat: 'geo', priority: 'high', pass: false, msg: 'No local business schema' }); recommendations.push({ priority: 'high', text: 'Add LocalBusiness schema' }); }
  else { findings.push({ cat: 'geo', priority: 'medium', pass: false, msg: 'No Organization schema' }); }
  metrics.geo.has_local_schema = schemaTypes.some(t => t === 'LocalBusiness' || t === 'Organization');

  // NAP in schema (15 points)
  const hasNap = /address|telephone|postalcode|locality/i.test(html || '') || schemaTypes.some(t => t === 'LocalBusiness');
  if (hasNap) { localSchemaPoints += 15; findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'NAP data detected' }); }
  else if (isLocalBusiness) { findings.push({ cat: 'geo', priority: 'high', pass: false, msg: 'No NAP (Name, Address, Phone) data' }); recommendations.push({ priority: 'high', text: 'Add address and phone to schema' }); }
  metrics.geo.has_nap = hasNap;

  geoPoints += localSchemaPoints;
  metrics.geo.local_schema = Math.round(localSchemaPoints);

  // --- 2. NAP Consistency (20 points) ---
  let napPoints = 0;
  const hasContactPage = /contact|about|reach/i.test(html || '');
  if (hasContactPage) { napPoints += 10; findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'Contact/about section detected' }); }
  const hasFooterNap = /footer|copyright|©/i.test(html || '') && hasNap;
  if (hasFooterNap) { napPoints += 10; findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'NAP in footer' }); }
  metrics.geo.contact_page = hasContactPage;
  metrics.geo.footer_nap = hasFooterNap;
  geoPoints += napPoints;
  metrics.geo.nap = Math.round(napPoints);

  // --- 3. Heading Hierarchy (20 points) ---
  const h3s = headings.filter(h => h.level === 3);
  if (h1s.length === 1 && h2s.length >= 1) {
    geoPoints += 20;
    findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'Clean heading hierarchy (H1→H2' + (h3s.length ? '→H3' : '') + ')' });
    metrics.geo.heading_hierarchy = 100;
  } else {
    findings.push({ cat: 'geo', priority: 'medium', pass: false, msg: 'Weak heading structure for AI parsing' });
    recommendations.push({ priority: 'medium', text: 'Use proper heading hierarchy' });
    metrics.geo.heading_hierarchy = 50;
  }

  // --- 4. Content Depth (20 points) ---
  if (wordCount > 500) { geoPoints += 20; findings.push({ cat: 'geo', priority: 'low', pass: true, msg: `${wordCount} words — sufficient for AI citations` }); metrics.geo.content_depth = 100; }
  else if (wordCount >= 300) { geoPoints += 10; findings.push({ cat: 'geo', priority: 'medium', pass: true, msg: `${wordCount} words (target >500)` }); metrics.geo.content_depth = 50; }
  else { findings.push({ cat: 'geo', priority: 'high', pass: false, msg: `Only ${wordCount} words — thin content` }); recommendations.push({ priority: 'high', text: 'Expand content for AI quotable passages' }); metrics.geo.content_depth = 0; }

  // --- 5. llms.txt (10 points) ---
  if (llmsTxt && llmsTxt.trim().length > 20) { geoPoints += 10; findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'llms.txt present' }); metrics.geo.llms_txt = true; }
  else { findings.push({ cat: 'geo', priority: 'high', pass: false, msg: 'llms.txt missing' }); recommendations.push({ priority: 'high', text: 'Add /llms.txt for LLM optimization' }); metrics.geo.llms_txt = false; }

  // Author attribution (bonus)
  const hasAuthor = /author|byline|written\s*by|<meta[^>]+name=["']author/i.test(html || '') || schemaTypes.some(t => t === 'Person');
  if (hasAuthor) { geoPoints = Math.min(100, geoPoints + 5); findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'Author attribution detected' }); }
  else { findings.push({ cat: 'geo', priority: 'medium', pass: false, msg: 'No author attribution' }); recommendations.push({ priority: 'medium', text: 'Add author bylines for E-E-A-T signals' }); }
  metrics.geo.has_author = hasAuthor;

  // Publication dates (bonus)
  const hasDate = /<time[^>]*>|datePublished|dateModified|article:published/i.test(html || '');
  if (hasDate) { geoPoints = Math.min(100, geoPoints + 5); findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'Publication date found' }); }
  else { findings.push({ cat: 'geo', priority: 'medium', pass: false, msg: 'No publication date' }); recommendations.push({ priority: 'medium', text: 'Add publication/modification dates' }); }
  metrics.geo.has_date = hasDate;

  // FAQ sections (bonus)
  const hasFaq = schemaTypes.some(t => t === 'FAQPage') || /faq|frequently\s+asked/i.test(html || '');
  if (hasFaq) { geoPoints = Math.min(100, geoPoints + 5); findings.push({ cat: 'geo', priority: 'low', pass: true, msg: 'FAQ section detected' }); }
  else { findings.push({ cat: 'geo', priority: 'medium', pass: false, msg: 'No FAQ section' }); recommendations.push({ priority: 'medium', text: 'Add FAQ section for AI citation' }); }
  metrics.geo.has_faq = hasFaq;

  // Paragraph length (penalty)
  const paragraphs = bodyText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const avgParaLen = paragraphs.length > 0 ? paragraphs.reduce((s, p) => s + p.trim().split(/\s+/).length, 0) / paragraphs.length : 0;
  if (avgParaLen > 80) {
    geoPoints = Math.max(0, geoPoints - 10);
    findings.push({ cat: 'geo', priority: 'medium', pass: false, msg: `Avg paragraph length: ${Math.round(avgParaLen)} words (target <80)` });
    recommendations.push({ priority: 'medium', text: 'Break long paragraphs for AI readability' });
  }
  metrics.geo.avg_paragraph_length = Math.round(avgParaLen);

  const geo = Math.min(100, Math.round(geoPoints));

  // ===== AEO SCORING (4.5 points base → 0-100) =====
  // Structure: Questions (30pts), Structured Answers (30pts), Voice (20pts), LLM Visibility (20pts)
  let aeoPoints = 0;

  // --- 1. Question-Based Content (30 points) ---
  const questionHeadings = headings.filter(h => /\?/.test(h.text));
  if (questionHeadings.length >= 5) { aeoPoints += 15; findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: `${questionHeadings.length} question-based headings` }); }
  else if (questionHeadings.length >= 3) { aeoPoints += 10; findings.push({ cat: 'aeo', priority: 'medium', pass: true, msg: `${questionHeadings.length} question headings (target 5+)` }); }
  else { findings.push({ cat: 'aeo', priority: 'medium', pass: false, msg: `${questionHeadings.length} question headings (target 5+)` }); recommendations.push({ priority: 'medium', text: 'Format headings as questions for voice search' }); }
  metrics.aeo.question_headings = questionHeadings.length;

  // FAQ schema (15 points)
  if (schemaTypes.some(t => t === 'FAQPage')) { aeoPoints += 15; findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: 'FAQPage schema present' }); }
  else if (hasFaq) { aeoPoints += 7.5; findings.push({ cat: 'aeo', priority: 'medium', pass: true, msg: 'FAQ section (add FAQPage schema)' }); recommendations.push({ priority: 'medium', text: 'Add FAQPage schema to FAQ section' }); }
  else { findings.push({ cat: 'aeo', priority: 'medium', pass: false, msg: 'No FAQ section' }); }
  metrics.aeo.has_faq_schema = schemaTypes.some(t => t === 'FAQPage');

  // --- 2. Structured Answers (30 points) ---
  // Lists/tables (15 points)
  const hasLists = /<[ou]l[^>]*>/i.test(html || '');
  const hasTables = /<table[^>]*>/i.test(html || '');
  if (hasLists || hasTables) { aeoPoints += 15; findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: 'Structured lists/tables for snippets' }); }
  else { findings.push({ cat: 'aeo', priority: 'medium', pass: false, msg: 'No lists or tables for featured snippets' }); recommendations.push({ priority: 'medium', text: 'Add structured lists/tables for snippet optimization' }); }
  metrics.aeo.has_lists = hasLists;
  metrics.aeo.has_tables = hasTables;

  // Speakable schema (15 points)
  const hasSpeakable = /SpeakableSpecification|speakable/i.test(html || '');
  if (hasSpeakable) { aeoPoints += 15; findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: 'SpeakableSpecification schema found' }); }
  else { findings.push({ cat: 'aeo', priority: 'low', pass: false, msg: 'No SpeakableSpecification schema' }); recommendations.push({ priority: 'low', text: 'Add SpeakableSpecification schema for voice search' }); }
  metrics.aeo.has_speakable = hasSpeakable;

  // --- 3. Voice Search (20 points) ---
  // Concise opening (10 points)
  const first60 = bodyText.split(/\s+/).slice(0, 60).join(' ');
  if (first60.split(/\s+/).length >= 40 && wordCount > 100) { aeoPoints += 10; findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: 'Concise opening content block' }); }
  else { findings.push({ cat: 'aeo', priority: 'medium', pass: false, msg: 'Opening content is thin' }); recommendations.push({ priority: 'medium', text: 'Add a strong opening paragraph' }); }
  metrics.aeo.opening_words = first60.split(/\s+/).length;

  // Natural language patterns (10 points)
  const naturalPhrases = /how do i|what is|why does|when should|where can|how to|what are/i.test(bodyText);
  if (naturalPhrases) { aeoPoints += 10; findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: 'Natural language phrases detected' }); }
  else { findings.push({ cat: 'aeo', priority: 'low', pass: false, msg: 'No natural language patterns' }); }
  metrics.aeo.natural_language = naturalPhrases;

  // --- 4. LLM Visibility (20 points) ---
  // llms.txt already checked in GEO, award points here too
  if (llmsTxt && llmsTxt.trim().length > 20) { aeoPoints += 10; }
  // Content depth
  if (wordCount >= 500) { aeoPoints += 10; }
  else if (wordCount >= 300) { aeoPoints += 5; }
  metrics.aeo.llm_ready = (llmsTxt && llmsTxt.trim().length > 20 && wordCount >= 500);

  // Local signals (bonus/penalty based on business type)
  const hasLocal = /address|locality|postalcode|telephone|geo\.lat|geo\.long/i.test(html || '') || schemaTypes.some(t => t === 'LocalBusiness' || t === 'Place');
  if (hasLocal) { aeoPoints = Math.min(100, aeoPoints + 5); findings.push({ cat: 'aeo', priority: 'low', pass: true, msg: 'Local business signals detected' }); }
  else if (isLocalBusiness) { findings.push({ cat: 'aeo', priority: 'high', pass: false, msg: 'No local business signals (address, phone)' }); recommendations.push({ priority: 'high', text: 'Add local business schema with address and phone' }); }
  metrics.aeo.has_local = hasLocal;

  const aeo = Math.min(100, Math.round(aeoPoints));

  // ===== 5-CATEGORY SCORE MAPPING =====
  // Derive new category scores from existing detailed checks

  // Technical Foundation: HTTPS, page speed (LCP/CWV), mobile, robots.txt, sitemap, technical SEO
  const technicalFoundation = Math.round(
    Math.min(100, (technicalPoints / 25) * 50 + // Technical SEO (0-25pts → 0-50%)
    (parsed.protocol === 'https:' ? 15 : 0) +    // HTTPS (15%)
    (sitemapXml && /<urlset|<sitemapindex/i.test(sitemapXml) ? 15 : 0) + // Sitemap (15%)
    (meta.viewport ? 10 : 0) +                   // Viewport (10%)
    (cwvPoints >= 15 ? 10 : cwvPoints >= 7 ? 5 : 0) // CWV bonus (10%)
    )
  );

  // Content & Keywords: title, meta desc, word count, keywords, alt text, questions
  const contentKeywords = Math.round(
    Math.min(100, (onPagePoints / 20) * 40 +    // On-page SEO (0-20pts → 0-40%)
    (contentPoints / 20) * 40 +                   // Content quality (0-20pts → 0-40%)
    (questionHeadings.length >= 5 ? 20 : questionHeadings.length >= 3 ? 10 : 0) // Questions (20%)
    )
  );

  // Structure & Authority: headings, schema, organization, FAQ, NAP, local
  const structureAuthority = Math.round(
    Math.min(100, (schemaPoints / 15) * 25 +     // Schema markup (0-15pts → 0-25%)
    (localSchemaPoints / 30) * 25 +               // Local schema (0-30pts → 0-25%)
    (h1s.length === 1 && h2s.length >= 1 ? 15 : h1s.length === 1 ? 7 : 0) + // Headings (15%)
    (hasNap ? 10 : 0) +                          // NAP (10%)
    (hasJsonLd ? 10 : 0) +                       // JSON-LD (10%)
    (schemaTypes.some(t => t === 'Organization' || t === 'LocalBusiness') ? 15 : schemaTypes.length > 0 ? 5 : 0) // Org schema (15%)
    )
  );

  // Indexing & Visibility: sitemap validity, robots directives, indexed pages, schema validation
  const indexingVisibility = Math.round(
    Math.min(100,
    (sitemapXml && /<urlset|<sitemapindex/i.test(sitemapXml) ? 25 : 0) + // Valid sitemap (25%)
    (robotsTxt ? (/User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(robotsTxt) ? 0 : 25) : 15) + // Robots not blocking (25%)
    Math.min(25, (indexedStatus.pages || 0) * 2.5) + // Indexed pages (25%)
    (schemaValidation.errors.length === 0 ? (jsonLdBlocks.length > 0 ? 25 : 5) : Math.max(0, 25 - schemaValidation.errors.length * 8)) // Schema valid (25%)
    )
  );

  // Monitoring Setup: analytics, llms.txt, author, dates, AEO signals
  const monitoringSetup = Math.round(
    Math.min(100,
    (llmsTxt && llmsTxt.trim().length > 20 ? 25 : 0) +   // llms.txt (25%)
    (hasAuthor ? 20 : 0) +                                  // Author (20%)
    (hasDate ? 20 : 0) +                                    // Dates (20%)
    (hasFaq ? 15 : 0) +                                    // FAQ (15%)
    (hasAnalytics ? 20 : 0)                                 // Analytics detection (20%)
    )
  );

  // Analytics detection (reused from baseline logic)
  const hasAnalytics = /google-analytics\.com|gtag|gtm\.google|googletagmanager|plausible|matomo|hotjar|clarity|umami|segment/i.test(html || '');

  // ===== OVERALL SCORE (weighted 5-category) =====
  const overall = Math.round(
    technicalFoundation * 0.25 +
    contentKeywords * 0.20 +
    structureAuthority * 0.20 +
    indexingVisibility * 0.20 +
    monitoringSetup * 0.15
  );

  // Legacy scores (deprecated, kept for backward compatibility)
  const legacyScores = { seo, geo, aeo };

  // Build prioritized recommendations
  const prioritizedRecommendations = {
    critical: recommendations.filter(r => r.priority === 'critical').map(r => r.text),
    high: recommendations.filter(r => r.priority === 'high').map(r => r.text),
    medium: recommendations.filter(r => r.priority === 'medium').map(r => r.text),
    low: recommendations.filter(r => r.priority === 'low').map(r => r.text),
  };

  // --- Keyword Extraction ---
  const keywords = extractKeywords(meta.title || '', headings, bodyText);

  // --- Link Analysis ---
  const links = analyzeLinks(html, parsed.origin);

  // --- Image Extraction ---
  const images = extractImages(html);

  // --- Social Profile Extraction ---
  const socialProfiles = extractSocialProfiles(html, parsed.origin);

  // --- Contact Info Extraction ---
  const contacts = extractContactInfo(html, parsed.origin);

  const response = {
    url,
    scoredAt: new Date().toISOString(),
    businessType,
    categories: {
      technicalFoundation: { score: technicalFoundation, max: 100 },
      contentKeywords: { score: contentKeywords, max: 100 },
      structureAuthority: { score: structureAuthority, max: 100 },
      indexingVisibility: { score: indexingVisibility, max: 100 },
      monitoringSetup: { score: monitoringSetup, max: 100 },
    },
    overall,
    scores: legacyScores, // Deprecated — use categories instead
    metrics, // Structured metrics for specialists
    findings,
    recommendations: prioritizedRecommendations,
    keywords,
    links,
    images,
    socialProfiles,
    contacts,
    indexedStatus,
    schemaValidation: {
      types: schemaValidation.schemaTypes,
      errors: schemaValidation.errors,
      warnings: schemaValidation.warnings,
      faqCount: schemaValidation.schemaDetails?.faqCount,
      hasPersonSchema: schemaValidation.schemaDetails?.hasPersonSchema || false,
    },
  };
  if (lighthouse) response.lighthouse = lighthouse;
  return json(response);
};

// --- Business Type Detection ---
function detectBusinessType(html, meta, bodyText, hostname) {
  const text = (html || '').toLowerCase();
  const desc = (meta.description || '').toLowerCase();
  const combined = `${text} ${desc} ${bodyText}`.toLowerCase();
  
  const ecommerceSignals = [
    /add to cart|shopping cart|checkout|shop now|buy now|add-to-cart/i,
    /product.*price|price.*product|\$\d+|€\d+/i,
    /woocommerce|shopify|magento|bigcommerce/i,
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*"product"/i,
  ];
  const ecommerceScore = ecommerceSignals.filter(r => r.test(combined)).length;
  
  const saasSignals = [
    /pricing.*plan|plan.*pricing|free trial|start your free|sign up.*free/i,
    /dashboard|api.*documentation|developer.*portal|sdk/i,
    /software as a service|saas|cloud.*platform|web-based.*tool/i,
    /subscription|monthly|annual.*billing/i,
  ];
  const saasScore = saasSignals.filter(r => r.test(combined)).length;
  
  const localSignals = [
    /call now|phone|tel:|contact us.*address|visit our office/i,
    /service area|serving.*area|location|hours of operation/i,
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*"localbusiness"/i,
    /free estimate|quote|consultation|appointment/i,
  ];
  const localScore = localSignals.filter(r => r.test(combined)).length;
  
  const publisherSignals = [
    /blog|article|news|post|category|tag|author/i,
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*"article"/i,
    /subscribe.*newsletter|rss|feed/i,
    /published|byline|written by/i,
  ];
  const publisherScore = publisherSignals.filter(r => r.test(combined)).length;
  
  const agencySignals = [
    /agency|consulting|services|solutions|we help|our team/i,
    /portfolio|case stud(y|ies)|client|testimonial/i,
    /hire us|work with us|get in touch/i,
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*"professionalService"/i,
  ];
  const agencyScore = agencySignals.filter(r => r.test(combined)).length;

  const scores = [
    { type: 'ecommerce', label: 'E-commerce', score: ecommerceScore },
    { type: 'saas', label: 'SaaS', score: saasScore },
    { type: 'local_service', label: 'Local Service', score: localScore },
    { type: 'publisher', label: 'Publisher/Blog', score: publisherScore },
    { type: 'agency', label: 'Agency/Consulting', score: agencyScore },
  ];
  
  scores.sort((a, b) => b.score - a.score);
  const primary = scores[0];
  
  if (primary.score === 0) {
    if (hostname.includes('shop') || hostname.includes('store')) return { type: 'ecommerce', label: 'E-commerce', confidence: 0.3 };
    if (hostname.includes('blog') || hostname.includes('news')) return { type: 'publisher', label: 'Publisher/Blog', confidence: 0.3 };
    return { type: 'unknown', label: 'Unknown', confidence: 0 };
  }
  
  return { type: primary.type, label: primary.label, confidence: Math.min(1, primary.score / 3) };
}

function getRecommendedSchema(businessType) {
  const schemas = {
    ecommerce: 'Product, Organization',
    saas: 'SoftwareApplication, Organization',
    local_service: 'LocalBusiness, Organization',
    publisher: 'Article, Organization, Person',
    agency: 'ProfessionalService, Organization',
    unknown: 'Organization',
  };
  return schemas[businessType] || 'Organization';
}

function validateSchemas(jsonLdBlocks, baseUrl) {
  const errors = [];
  const warnings = [];
  const schemaTypes = [];
  const schemaDetails = {};

  for (const block of jsonLdBlocks) {
    try {
      const jsonStr = block.replace(/<\/?script[^>]*>/gi, '');
      const data = JSON.parse(jsonStr);
      const schemas = Array.isArray(data) ? data : (data['@graph'] || [data]);
      
      for (const schema of schemas) {
        if (!schema['@type']) continue;
        const type = schema['@type'];
        schemaTypes.push(type);
        schemaDetails[type] = schema;

        if (type === 'Organization') {
          if (schema.logo) {
            const logoUrl = typeof schema.logo === 'string' ? schema.logo : schema.logo.url;
            if (logoUrl) {
              warnings.push({ severity: 'low', msg: `Organization.logo URL should be validated: ${logoUrl}`, recommendation: 'Ensure logo URL returns an image (not HTML)' });
            }
          }
          if (!schema.sameAs || schema.sameAs.length === 0) {
            warnings.push({ severity: 'medium', msg: 'Organization schema missing sameAs (social profiles)', recommendation: 'Add sameAs array with social profile URLs' });
          }
          if (!schema['@id']) {
            warnings.push({ severity: 'low', msg: 'Organization schema missing @id for entity linking', recommendation: 'Add @id for schema graph linking' });
          }
        }

        if (type === 'FAQPage') {
          const mainEntity = schema.mainEntity || [];
          if (mainEntity.length === 0) {
            errors.push({ severity: 'high', msg: 'FAQPage schema has no mainEntity (no questions)', recommendation: 'Add questions to FAQPage mainEntity' });
          }
          schemaDetails.faqCount = mainEntity.length;
        }

        if (type === 'Person') schemaDetails.hasPersonSchema = true;
        if (!schemaDetails.hasPersonSchema) {
          const nestedPersonProps = ['author', 'creator', 'editor', 'founder', 'member', 'employee', 'contributor', 'reviewer'];
          for (const prop of nestedPersonProps) {
            const val = schema[prop];
            if (!val) continue;
            const items = Array.isArray(val) ? val : [val];
            for (const item of items) {
              if (item && item['@type'] === 'Person') { schemaDetails.hasPersonSchema = true; break; }
            }
            if (schemaDetails.hasPersonSchema) break;
          }
        }

        if (type === 'WebSite' && schema.potentialAction?.['@type'] === 'SearchAction') {
          warnings.push({ severity: 'low', msg: 'WebSite has SearchAction — verify search actually works', recommendation: 'Remove SearchAction if site has no search functionality' });
        }

        if (type === 'SpeakableSpecification' && (!schema.cssSelector || schema.cssSelector.length === 0)) {
          errors.push({ severity: 'medium', msg: 'SpeakableSpecification missing cssSelector', recommendation: 'Add cssSelector targeting speakable content' });
        }
      }
    } catch (e) {
      errors.push({ severity: 'high', msg: `Invalid JSON-LD: ${e.message}`, recommendation: 'Fix JSON-LD syntax errors' });
    }
  }

  if (!schemaDetails.hasPersonSchema) {
    warnings.push({ severity: 'medium', msg: 'No Person schema found — weak E-E-A-T signals', recommendation: 'Add Person schema for founder/author' });
  }

  return { errors, warnings, schemaTypes, schemaDetails };
}

// --- Helpers ---
function decodeEntities(str) {
  if (!str) return str;
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}

async function safeFetch(url, type = 'html') {
  const res = await fetch(url, { headers: { 'User-Agent': 'SivussaAudit/1.0' }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status}`);
  return type === 'html' ? res.text() : res.text();
}

function parseMeta(html) {
  const meta = {};
  if (!html) return meta;
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) meta.title = titleMatch[1].trim();
  for (const m of (html.match(/<meta[^>]*>/gi) || [])) {
    const name = m.match(/name=["']([^"']+)["']/i) || m.match(/property=["']([^"']+)["']/i);
    const content = m.match(/content=["']([^"']+)["']/i);
    if (name && content) meta[name[1].toLowerCase()] = decodeEntities(content[1]);
  }
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
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
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export const onRequestOptions = () => new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });

async function fetchPageSpeed(url) {
  const apiKey = process.env.GOOGLE_PSI_KEY;
  if (!apiKey) throw new Error('No PSI key');
  const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&key=${apiKey}`;
  const res = await fetch(psiUrl, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`PSI ${res.status}`);
  return res.json();
}

function extractKeywords(title, headings, bodyText) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'as', 'if', 'then', 'than', 'so', 'such', 'no', 'not', 'only', 'own', 'same', 'into', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'any', 'about', 'which', 'what', 'who', 'whom', 'we', 'you', 'your', 'our', 'their', 'them', 'they', 'he', 'she', 'him', 'her', 'his', 'i', 'me', 'my', 'get', 'got', 'use', 'using', 'used', 'uses', 'make', 'made', 'see', 'seen', 'go', 'went', 'come', 'came', 'take', 'took', 'give', 'gave', 'find', 'found', 'tell', 'told', 'ask', 'asked', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'keep', 'let', 'begin', 'seems', 'says', 'said', 'say', 'says', 'saying', 'want', 'wants', 'wanted', 'need', 'needs', 'needed', 'like', 'likes', 'liked', 'know', 'knows', 'knew']);
  const headingText = headings.map(h => h.text).join(' ');
  const bodySample = bodyText.split(/\s+/).slice(0, 500).join(' ');
  const allText = `${title} ${headingText} ${bodySample}`.toLowerCase();
  const words = allText.match(/[a-z0-9]{2,}/g) || [];
  const freq = {};
  for (const word of words) {
    if (!stopWords.has(word) && !/^\d+$/.test(word)) freq[word] = (freq[word] || 0) + 1;
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([term, count]) => ({ term, count }));
  const phrases = [];
  for (const h of headings) {
    const hWords = h.text.toLowerCase().match(/[a-z0-9]{2,}/g) || [];
    for (let i = 0; i < hWords.length - 1; i++) {
      if (!stopWords.has(hWords[i]) || !stopWords.has(hWords[i + 1])) phrases.push(`${hWords[i]} ${hWords[i + 1]}`);
      if (i < hWords.length - 2 && !stopWords.has(hWords[i]) && !stopWords.has(hWords[i + 2])) phrases.push(`${hWords[i]} ${hWords[i + 1]} ${hWords[i + 2]}`);
    }
  }
  const phraseFreq = {};
  for (const p of phrases) phraseFreq[p] = (phraseFreq[p] || 0) + 1;
  const topPhrases = Object.entries(phraseFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([phrase, count]) => ({ phrase, count }));
  return { top: sorted, phrases: topPhrases };
}

function analyzeLinks(html, origin) {
  if (!html) return { internal: 0, external: 0, nofollow: 0, total: 0, anchors: [] };
  const linkMatches = html.match(/<a[^>]*>[\s\S]*?<\/a>/gi) || [];
  const originDomain = new URL(origin).hostname;
  let internal = 0, external = 0, nofollow = 0;
  const anchors = [];
  for (const match of linkMatches) {
    const hrefMatch = match.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    const anchorText = match.replace(/<a[^>]*>/i, '').replace(/<\/a>/i, '').replace(/<[^>]*>/g, '').trim();
    const isNofollow = /rel=["'][^"']*\bnofollow\b[^"']*["']/i.test(match);
    if (isNofollow) nofollow++;
    let isInternal = false;
    if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) { internal++; isInternal = true; }
    else if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        const hrefDomain = new URL(href).hostname;
        if (hrefDomain === originDomain || hrefDomain === `www.${originDomain}` || `www.${hrefDomain}` === originDomain) { internal++; isInternal = true; } else { external++; }
      } catch {}
    } else if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (anchors.length < 50 && anchorText.length > 0 && anchorText.length < 200) anchors.push({ text: anchorText, href, is_internal: isInternal, nofollow: isNofollow });
  }
  return { internal, external, nofollow, total: internal + external, anchors };
}

function extractImages(html) {
  if (!html) return [];
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  return imgMatches.slice(0, 50).map(match => {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    const altMatch = match.match(/alt=["']([^"']*)["']/i);
    const loadingMatch = match.match(/loading=["']([^"']+)["']/i);
    return srcMatch ? { src: srcMatch[1], alt: altMatch ? altMatch[1] : null, has_alt: !!altMatch && altMatch[1].length > 0, lazy: loadingMatch ? loadingMatch[1] === 'lazy' : false } : null;
  }).filter(Boolean);
}

function extractSocialProfiles(html, origin) {
  if (!html) return [];
  const socialPatterns = [
    { platform: 'facebook', pattern: /facebook\.com\/([a-zA-Z0-9._-]+)/i },
    { platform: 'twitter', pattern: /(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i },
    { platform: 'linkedin', pattern: /linkedin\.com\/(company|in)\/([a-zA-Z0-9_-]+)/i },
    { platform: 'instagram', pattern: /instagram\.com\/([a-zA-Z0-9._]+)/i },
    { platform: 'youtube', pattern: /youtube\.com\/(channel|user|c)\/([a-zA-Z0-9_-]+)/i },
    { platform: 'tiktok', pattern: /tiktok\.com\/@([a-zA-Z0-9._]+)/i },
    { platform: 'github', pattern: /github\.com\/([a-zA-Z0-9_-]+)/i },
    { platform: 'mastodon', pattern: /mastodon\.social\/@([a-zA-Z0-9_]+)/i },
  ];
  const profiles = [];
  const seen = new Set();
  const linkMatches = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
  for (const match of linkMatches) {
    const hrefMatch = match.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    for (const { platform, pattern } of socialPatterns) {
      const found = href.match(pattern);
      if (found) {
        const key = `${platform}:${found[1] || found[2]}`;
        if (!seen.has(key)) { seen.add(key); profiles.push({ platform, url: href, handle: found[1] || found[2] }); }
      }
    }
  }
  const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of jsonLdMatches) {
    try {
      const data = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
      if (data.sameAs && Array.isArray(data.sameAs)) {
        for (const url of data.sameAs) {
          for (const { platform, pattern } of socialPatterns) {
            const found = url.match(pattern);
            if (found) {
              const key = `${platform}:${found[1] || found[2]}`;
              if (!seen.has(key)) { seen.add(key); profiles.push({ platform, url, handle: found[1] || found[2] }); }
            }
          }
        }
      }
    } catch {}
  }
  return profiles;
}

function extractContactInfo(html, origin) {
  if (!html) return [];
  const contacts = [];
  const seen = new Set();
  const phonePatterns = [/\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g, /\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, /tel:([+0-9]+)/gi];
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailLinkPattern = /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  for (const pattern of phonePatterns) {
    const matches = html.match(pattern) || [];
    for (const phone of matches) {
      const cleaned = phone.replace(/[^\d+]/g, '');
      if (cleaned.length >= 8 && !seen.has(`phone:${cleaned}`)) { seen.add(`phone:${cleaned}`); contacts.push({ type: 'phone', value: phone.trim() }); }
    }
  }
  const emails = html.match(emailPattern) || [];
  for (const email of emails) {
    if (email.includes('example.com') || email.includes('domain.com') || email.includes('youremail')) continue;
    if (!seen.has(`email:${email}`)) { seen.add(`email:${email}`); contacts.push({ type: 'email', value: email }); }
  }
  let match;
  while ((match = emailLinkPattern.exec(html)) !== null) {
    const email = match[1];
    if (!seen.has(`email:${email}`)) { seen.add(`email:${email}`); contacts.push({ type: 'email', value: email }); }
  }
  const addressPatterns = [/\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl)\.?(?:,?\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s*\d{5})?/gi];
  for (const pattern of addressPatterns) {
    const matches = html.match(pattern) || [];
    for (const addr of matches.slice(0, 3)) {
      const cleaned = addr.trim();
      if (cleaned.length > 10 && !seen.has(`address:${cleaned}`)) { seen.add(`address:${cleaned}`); contacts.push({ type: 'address', value: cleaned }); }
    }
  }
  return contacts.slice(0, 10);
}
