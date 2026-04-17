import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { OPEN_SOURCE_NOTICES } from '../data/load-content';

export function OpenSourceNotices() {
  return (
    <>
      <Head
        title="Open Source Notices"
        description="Third-party software licenses and acknowledgments for Sivussa."
        canonical="https://sivussa.com/open-source-notices"
      />

      <Section>
        <BreadcrumbNav currentPage="Open Source Notices" />
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-2">Open Source Notices</h1>
          <p class="text-dark-400 text-sm mb-10">Third-party software licenses and acknowledgments</p>

          <div class="prose prose-invert max-w-none text-dark-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: OPEN_SOURCE_NOTICES.html }} />
        </div>
      </Section>
    </>
  );
}
