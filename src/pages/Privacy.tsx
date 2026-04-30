import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { PRIVACY_POLICY } from '../data/load-content';
import { getRouteMeta } from '../data/route-meta';

const meta = getRouteMeta('/privacy');

export function Privacy() {
  return (
    <>
      <Head
        title={meta!.title}
        description={meta!.description}
        canonical={meta!.canonical}
      />

      <Section>
        <BreadcrumbNav currentPage="Privacy Policy" />
        <div class="max-w-3xl mx-auto">
          <div
            class="prose prose-invert max-w-none text-dark-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY.html }}
          />
        </div>
      </Section>
    </>
  );
}
