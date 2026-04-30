// Cloudflare Pages Functions middleware
// Handles Markdown content negotiation for AI agents
// When a client sends Accept: text/markdown, serve markdown content

const MARKDOWN_PATHS: Record<string, string> = {
  '/': '/llms.txt',
  '/how-it-works': '/llms-how-it-works.md',
  '/pricing': '/llms-pricing.md',
  '/faq': '/llms-faq.md',
  '/about': '/llms-about.md',
};

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  // Check if client wants markdown
  const accept = request.headers.get('Accept') || '';
  if (accept.includes('text/markdown')) {
    const mdPath = MARKDOWN_PATHS[path];
    if (mdPath) {
      const asset = await context.env.ASSETS?.fetch(
        new Request(new URL(mdPath, url.origin), {
          headers: { Accept: 'text/markdown' },
        }),
      );
      if (asset && asset.status === 200) {
        return new Response(asset.body, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            Vary: 'Accept',
          },
        });
      }
    }
  }

  return next();
};
