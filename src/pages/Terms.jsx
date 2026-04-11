import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';

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

          <div class="prose prose-invert max-w-none space-y-8 text-dark-300 leading-relaxed">
            <div>
              <h2 class="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Sivussa ("the Service"), operated by Sivussa ("we", "us", or "our"), you agree to be bound by these Terms of Service. If you disagree with any part, you must not access the Service.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p>Sivussa is an automated SEO/GEO/AEO audit SaaS that analyzes websites and provides visibility optimization recommendations.</p>
              <p class="mt-3"><strong>Subscription Tiers:</strong></p>
              <ul class="list-disc pl-6 mt-1 space-y-1">
                <li><strong>One-shot Plan (€99):</strong> Single audit + remediation plan</li>
                <li><strong>Quarterly Plan (€89/quarter):</strong> Audit + fix plan every 90 days</li>
                <li><strong>Monthly Plan (€79/month):</strong> Audit + fix plan every month</li>
              </ul>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p>You must provide a valid email address to create an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">4. Payment Terms</h2>
              <p>Payments are processed via Stripe. Subscriptions auto-renew at the end of each billing period. You may cancel anytime — your current period runs to completion.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">5. Refund Policy</h2>
              <p>Full refund within 14 days of purchase. No questions asked. Contact <a href="mailto:sivussa@sivussa.com" class="text-primary hover:underline">sivussa@sivussa.com</a>.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
              <p>Audit results and remediation plans generated for your site are yours to use. The Sivussa platform, AI models, and underlying technology remain the property of Sivussa.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">7. Acceptable Use</h2>
              <p>You agree not to: use the Service for illegal purposes, submit URLs you don't own or have permission to audit, attempt to reverse-engineer the platform, or abuse the API.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
              <p>Sivussa provides automated audit analysis and recommendations. We do not guarantee specific search engine rankings or business outcomes. Use recommendations at your own discretion.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">9. Termination</h2>
              <p>We may suspend or terminate accounts that violate these Terms. You may delete your account at any time by contacting support.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">10. Governing Law</h2>
              <p>These Terms are governed by Finnish law. Disputes shall be resolved in the courts of Helsinki, Finland.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">11. Changes to Terms</h2>
              <p>We may update these Terms periodically. Significant changes will be communicated via email. Continued use constitutes acceptance.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">12. Contact</h2>
              <p>For questions about these Terms: <a href="mailto:sivussa@sivussa.com" class="text-primary hover:underline">sivussa@sivussa.com</a></p>
              <p class="mt-1">Sivussa, Helsinki, Finland</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
