import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { TERMS_OF_SERVICE } from '../data/load-content';

export function Terms() {
  return (
    <>
      <Head
        title="Terms of Service"
        description="Terms and conditions for using Sivussa SEO/GEO/AEO audit service."
        canonical="https://sivussa.com/terms"
      />

      <Section>
        <BreadcrumbNav currentPage="Terms of Service" />
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p class="text-dark-400 text-sm mb-10">Effective Date: March 26, 2026 • Last Updated: March 26, 2026</p>

          <div class="prose prose-invert max-w-none text-dark-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: TERMS_OF_SERVICE.html }} />
        </div>
      </Section>
    </>
  );
}
