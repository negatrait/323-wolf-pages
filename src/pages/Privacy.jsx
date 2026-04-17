import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { PRIVACY_POLICY } from '../data/load-content';

export function Privacy() {
  return (
    <>
      <Head
        title="Privacy Policy"
        description="How Sivussa collects, uses, and protects your data. GDPR compliant."
        canonical="https://sivussa.com/privacy"
      />

      <Section>
        <BreadcrumbNav currentPage="Privacy Policy" />
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p class="text-dark-400 text-sm mb-10">Effective Date: March 26, 2026 • Last Updated: March 26, 2026</p>

          <div class="prose prose-invert max-w-none text-dark-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY.html }} />
        </div>
      </Section>
    </>
  );
}
