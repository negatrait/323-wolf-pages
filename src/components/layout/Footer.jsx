import { FOOTER_SECTIONS, FOOTER_COPYRIGHT } from '../../data/load-content';

export function Footer() {
  return (
    <footer class="bg-dark-900 border-t border-dark-600 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FOOTER_SECTIONS.map((section, i) => (
            <div key={i}>
              <h4 class="text-white font-semibold mb-4">{section.title}</h4>
              <ul class="space-y-2 text-sm text-dark-300">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.href ? (
                      <a href={link.href} class="hover:text-primary transition-colors">{link.label}</a>
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
