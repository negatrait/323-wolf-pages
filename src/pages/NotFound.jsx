import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';

export function NotFound() {
  return (
    <>
      <Head title="Page Not Found" description="The page you're looking for doesn't exist." canonical="https://sivussa.com/404" />
      <Section>
        <div class="max-w-xl mx-auto text-center py-20">
          <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
          <p class="text-xl text-dark-300 mb-8">Page not found. The page you're looking for doesn't exist.</p>
          <a href="/" class="px-6 py-3 bg-primary text-dark-900 font-semibold rounded-lg hover:bg-primary-dark transition-colors inline-block">Go Home</a>
        </div>
      </Section>
    </>
  );
}
