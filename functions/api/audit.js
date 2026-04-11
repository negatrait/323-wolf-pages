export async function onRequestPost(context) {
  try {
    const { url, email } = await context.request.json();

    if (!url || !email) {
      return new Response(JSON.stringify({ error: 'URL and email are required' }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(url)) {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Connect to actual audit pipeline
    // For now return mock response
    return new Response(JSON.stringify({
      scores: { seo: 7.2, geo: 5.3, aeo: 4.8, overall: 5.9 },
      findings: [
        { cat: 'seo', priority: 'high', pass: false, msg: 'Missing meta description on homepage' },
        { cat: 'seo', priority: 'high', pass: false, msg: 'No JSON-LD structured data found' },
        { cat: 'geo', priority: 'medium', pass: false, msg: 'Google Business Profile not linked' },
        { cat: 'aeo', priority: 'medium', pass: false, msg: 'No FAQ schema markup' },
        { cat: 'seo', priority: 'low', pass: true, msg: 'HTTPS is enabled' },
      ],
      lighthouse: { performance: 78, accessibility: 92 },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
