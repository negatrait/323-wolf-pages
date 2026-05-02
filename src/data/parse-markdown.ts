/**
 * Markdown parsing utilities.
 * Wraps gray-matter + marked + highlight.js into a single API.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { Marked } from 'marked';

/**
 * Custom Marked instance: escapes only HTML-significant chars (& < >).
 * Default Marked also escapes quotes/apostrophes, which causes double-encoding
 * when preact-render-to-string processes the output.
 */
export const marked = new Marked({
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : undefined;
      const { value } = language
        ? hljs.highlight(text, { language })
        : hljs.highlightAuto(text);
      const langClass = language ? ` language-${language}` : '';
      return `<pre><code class="hljs${langClass}">${value}</code></pre>`;
    },
    text({ text }) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
  },
});

export interface ParsedMd<T = Record<string, unknown>> {
  frontmatter: T;
  html: string;
  raw: string;
}

/** Load and parse a markdown file. Single pass per file. */
export function loadMd<T = Record<string, unknown>>(
  contentDir: string,
  filePath: string,
): ParsedMd<T> {
  const raw = fs.readFileSync(path.join(contentDir, filePath), 'utf-8');
  const { data, content } = matter(raw);
  return {
    frontmatter: data as T,
    html: marked.parse(content) as string,
    raw: content,
  };
}

// ─── HTML helpers (operate on marked output) ───────────────────

/** Strip all HTML tags and trim */
export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

/** Extract text content from <li> elements */
export function extractLiText(html: string): string[] {
  return [...html.matchAll(/<li>(.+?)<\/li>/g)].map((m) => stripTags(m[1]!));
}

/** Find the first <p> whose text starts with prefix (case-insensitive) */
export function findParagraph(
  html: string,
  prefix: string,
): string | undefined {
  for (const m of html.matchAll(/<p>(.+?)<\/p>/gs)) {
    if (stripTags(m[1]!).toLowerCase().startsWith(prefix)) return m[1];
  }
  return undefined;
}

/** Extract <h2> + following <ul> sections from HTML */
export function extractH2UlSections(
  html: string,
): Array<{ title: string; items: string[] }> {
  const sections: Array<{ title: string; items: string[] }> = [];
  const re = /<h2>([^<]+)<\/h2>\s*<ul>(.+?)<\/ul>/gs;
  for (const m of html.matchAll(re)) {
    sections.push({ title: m[1]!.trim(), items: extractLiText(m[2]!) });
  }
  return sections;
}
