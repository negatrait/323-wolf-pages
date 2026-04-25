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
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <Home path="/" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <HowItWorks path="/how-it-works" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <Pricing path="/pricing" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <About path="/about" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <FAQ path="/faq" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <Blog path="/blog" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <BlogPost path="/blog/:slug" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <Privacy path="/privacy" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <Terms path="/terms" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <OpenSourceNotices path="/open-source-notices" />
          {/* @ts-expect-error preact-iso Router injects path/default props at runtime */}
          <NotFound default />
        </Router>
      </Layout>
    </LocationProvider>
  );
}
