import { LocationProvider, Router } from 'preact-iso';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { OpenSourceNotices } from './pages/OpenSourceNotices';
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
          <Blog path="/blog" />
          <BlogPost path="/blog/:slug" />
          <Privacy path="/privacy" />
          <Terms path="/terms" />
          <OpenSourceNotices path="/open-source-notices" />
          <NotFound default />
        </Router>
      </Layout>
    </LocationProvider>
  );
}
