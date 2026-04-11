import { NAV_LINKS } from '../../utils/routes';

export function Footer() {
  return (
    <footer class="bg-dark-900 border-t border-dark-600 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 class="text-white font-semibold mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-dark-300">
              <li><a href="/how-it-works" class="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/pricing" class="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-dark-300">
              <li><a href="/about" class="hover:text-primary transition-colors">About</a></li>
              <li><a href="/faq" class="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="https://blog.sivussa.com" class="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-dark-300">
              <li><a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" class="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Contact</h4>
            <ul class="space-y-2 text-sm text-dark-300">
              <li><a href="mailto:sivussa@sivussa.com" class="hover:text-primary transition-colors">sivussa@sivussa.com</a></li>
              <li>Helsinki, Finland</li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-dark-600 text-center text-sm text-dark-400">
          © 2026 Sivussa Oy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
