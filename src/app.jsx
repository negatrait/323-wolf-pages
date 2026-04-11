import { LocationProvider, Router } from 'preact-iso';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Blog } from './pages/Blog';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Home path="/" />
          <HowItWorks path="/how-it-works" />
          <Pricing path="/pricing" />
          <About path="/about" />
          <FAQ path="/faq" />
          <Privacy path="/privacy" />
          <Terms path="/terms" />
          <Blog path="/blog" />
          <NotFound default />
        </Router>
      </Layout>
    </LocationProvider>
  );
}
