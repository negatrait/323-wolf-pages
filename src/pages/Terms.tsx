import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { getRouteMeta } from '../data/route-meta';
import { TERMS_OF_SERVICE } from '../data/load-content';

const meta = getRouteMeta('/terms');

export function Terms() {
  return (
    <>
      <Head
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
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
