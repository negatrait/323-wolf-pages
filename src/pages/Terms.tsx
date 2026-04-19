import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
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
          <div
            class="prose prose-invert max-w-none text-dark-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: TERMS_OF_SERVICE.html }}
          />
        </div>
      </Section>
    </>
  );
}
