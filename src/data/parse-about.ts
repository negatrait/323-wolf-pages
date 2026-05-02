/**
 * About page section parser.
 * Parses about.md raw markdown body into structured sections by ## headings.
 *
 * The about page has a specific structure:
 * - Text before first ## = intro
 * - ## heading = new section
 * - ### heading = sub-item (agent, timeline entry, or generic subsection)
 * - 01. **Title** pattern = numbered values
 * - Lines starting with - = list items (preserved in content)
 * - Lines containing site email = email section
 */

import { marked } from './parse-markdown';
import type { AboutSection } from './types';

interface RawAboutSection {
  title: string;
  content: string;
  subtitle: string;
  agents: Array<{ title: string; desc: string }>;
  values: Array<{ num: string; title: string; desc: string }>;
  timeline: Array<{ title: string; content: string }>;
  email: string;
}

/** Parse about.md raw markdown into intro text + structured sections */
export function parseAbout(
  raw: string,
  siteEmail: string,
): { intro: string; introHtml: string; sections: AboutSection[] } {
  const lines = raw.split('\n');
  let current: RawAboutSection | null = null;
  const sections: RawAboutSection[] = [];
  const introLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Push previous section, start new one
      if (current) sections.push(current);
      current = {
        title: line.replace('## ', '').trim(),
        content: '',
        subtitle: '',
        agents: [],
        values: [],
        timeline: [],
        email: '',
      };
    } else if (!current) {
      // Lines before first ## heading = intro
      if (line.trim()) introLines.push(line);
    } else if (line.startsWith('### ')) {
      const sub = line.replace('### ', '').trim();
      if (['Short term', 'Medium term', 'Long term'].includes(sub)) {
        current.timeline.push({ title: sub, content: '' });
      } else {
        // All ### subsections become agents (search opt, geo opt, AI opt, etc.)
        current.agents.push({ title: sub, desc: '' });
      }
    } else if (line.match(/^\d{2}\.\s/)) {
      // Numbered values: "01. **Title**"
      const m = line.match(/^(\d{2})\.\s+\*\*([^*]+)\*\*/);
      if (m) current.values.push({ num: m[1]!, title: m[2]!, desc: '' });
    } else if (line.trim()) {
      const text = line.trim();
      if (current.timeline.length > 0) {
        // Append to last timeline entry
        current.timeline[current.timeline.length - 1]!.content += `${text} `;
      } else if (current.agents.length > 0) {
        // Append to last agent desc — include all lines (fix: was dropping lines starting with -)
        current.agents[current.agents.length - 1]!.desc += `${text} `;
      } else if (current.values.length > 0) {
        // Append to last value desc
        current.values[current.values.length - 1]!.desc += `${text} `;
      } else if (text.includes(siteEmail)) {
        current.email = siteEmail;
      } else {
        // General section content — include all lines (fix: was dropping lines starting with -)
        current.content += `${line}\n`;
      }
    }
  }
  if (current) sections.push(current);

  // Render markdown → HTML for all text fields
  const mappedSections: AboutSection[] = sections.map((s) => {
    const content = s.content.trim();
    const contentHtml = content ? (marked.parse(content) as string) : '';
    const base: AboutSection = { title: s.title };

    // Sections with agents get subtitle + intro from the section content
    if (s.agents.length > 0) {
      return {
        ...base,
        subtitle: s.subtitle || undefined,
        intro: content || undefined,
        contentHtml: contentHtml || undefined,
        agents: s.agents.map((a) => ({
          title: a.title,
          desc: a.desc.trim(),
          descHtml: marked.parse(a.desc.trim()) as string,
        })),
      };
    }

    if (s.values.length > 0) {
      return {
        ...base,
        values: s.values.map((v) => ({
          num: v.num,
          title: v.title,
          desc: v.desc.trim(),
          descHtml: marked.parse(v.desc.trim()) as string,
        })),
      };
    }

    if (s.timeline.length > 0) {
      return {
        ...base,
        timeline: s.timeline.map((t) => ({
          title: t.title,
          content: t.content.trim(),
          contentHtml: marked.parse(t.content.trim()) as string,
        })),
      };
    }

    if (s.email) {
      return { ...base, email: s.email };
    }

    return { ...base, content, contentHtml };
  });

  const introText = introLines.join('\n').trim();
  return {
    intro: introText,
    introHtml: introText ? (marked.parse(introText) as string) : '',
    sections: mappedSections,
  };
}
