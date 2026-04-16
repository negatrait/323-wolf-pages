import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { NAV_LINKS } from '../../utils/routes';

export function Nav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.url]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href) => {
    if (href === '/') return location.url === '/';
    return location.url?.startsWith(href);
  };

  return (
    <>
      <nav class={`sticky top-0 z-40 transition-all ${scrolled ? 'bg-dark-900/95 backdrop-blur-sm border-b border-dark-600' : 'bg-dark-900'}`}>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" class="text-xl font-bold text-primary">Sivussa</a>

          {/* Desktop nav */}
          <div class="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                class={`text-sm font-medium transition-colors ${isActive(link.href) ? 'text-primary' : 'text-dark-200 hover:text-white'}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            class="md:hidden text-dark-200 hover:text-white p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span class="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div class="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
          <div class="fixed top-0 right-0 h-full w-[300px] bg-dark-900 border-l border-dark-600 z-50 animate-slide-in-right p-6">
            <button
              onClick={() => setMobileOpen(false)}
              class="absolute top-4 right-4 text-dark-300 hover:text-white"
              aria-label="Close menu"
            >
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
            <nav class="mt-12 flex flex-col gap-2">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  class={`text-lg py-3 border-b border-dark-600 ${isActive(link.href) ? 'text-primary' : 'text-dark-200 hover:text-white'}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
