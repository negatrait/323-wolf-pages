import { LocationProvider, Router } from 'preact-iso';
import { Layout } from './components/layout/Layout';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { FAQ } from './pages/FAQ';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { NotFound } from './pages/NotFound';
import { OpenSourceNotices } from './pages/OpenSourceNotices';
import { Pricing } from './pages/Pricing';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

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
