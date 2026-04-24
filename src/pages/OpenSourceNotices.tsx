import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { getRouteMeta } from '../data/route-meta';
import { OPEN_SOURCE_NOTICES } from '../data/load-content';

const meta = getRouteMeta('/open-source-notices');

export function OpenSourceNotices() {
  return (
    <>
      <Head
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
      />

      <Section>
        <BreadcrumbNav currentPage="Open Source Notices" />
        <div class="max-w-3xl mx-auto">
          <div
            class="prose prose-invert max-w-none text-dark-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: OPEN_SOURCE_NOTICES.html }}
          />
        </div>
      </Section>
    </>
  );
}
