import { Footer } from './Footer';
import { Nav } from './Nav';

export function Layout({ children }) {
  return (
    <div class="min-h-screen flex flex-col bg-dark-900 text-dark-100">
      <Nav />
      <main class="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
