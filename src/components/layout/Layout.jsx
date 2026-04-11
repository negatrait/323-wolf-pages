import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout({ children }) {
  return (
    <div class="min-h-screen flex flex-col bg-dark-900 text-dark-100">
      <Nav />
      <main class="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
