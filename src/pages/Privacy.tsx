import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
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
          <div
            class="prose prose-invert max-w-none text-dark-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY.html }}
          />
        </div>
      </Section>
    </>
  );
}
