import { FOOTER_COPYRIGHT, FOOTER_SECTIONS } from '../../data/load-content';

interface FooterLink {
  href?: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const sections = FOOTER_SECTIONS as FooterSection[];
  return (
    <footer class="bg-dark-900 border-t border-dark-600 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section: FooterSection, i: number) => (
            <div key={i}>
              <h4 class="text-white font-semibold mb-4">{section.title}</h4>
              <ul class="space-y-2 text-sm text-dark-300">
                {section.links.map((link: FooterLink, j: number) => (
                  <li key={j}>
                    {link.href ? (
                      <a
                        href={link.href}
                        class="hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div class="mt-8 pt-8 border-t border-dark-600 text-center text-sm text-dark-400">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
