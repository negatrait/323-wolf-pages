import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';

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

          <div class="prose prose-invert max-w-none space-y-8 text-dark-300 leading-relaxed">
            <div>
              <h2 class="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>Sivussa ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our SEO/GEO/AEO audit service ("the Service").</p>
              <p class="mt-2"><strong>Controller:</strong> Sivussa<br /><strong>Business ID:</strong> 2101028-3<br /><strong>Email:</strong> sivussa@sivussa.com<br /><strong>Website:</strong> https://sivussa.com</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">2. Data We Collect</h2>
              <p>We collect minimal data necessary to provide the Service:</p>
              <ul class="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Account Data:</strong> Email address (used as account identifier)</li>
                <li><strong>Audit Data:</strong> Website URLs you submit for auditing</li>
                <li><strong>Usage Data:</strong> Audit results, scores, and remediation plans generated</li>
                <li><strong>Technical Data:</strong> Browser type, IP address (for security and analytics only)</li>
              </ul>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
              <ul class="list-disc pl-6 space-y-1">
                <li>To provide SEO/GEO/AEO audit services</li>
                <li>To generate remediation plans and reports</li>
                <li>To send service-related emails (audit results, plan updates)</li>
                <li>To improve our AI models and service quality</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
              <p>We do not sell your data. We share data only with:</p>
              <ul class="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Stripe</strong> — Payment processing (PCI DSS compliant)</li>
                <li><strong>Cloudflare</strong> — Hosting and CDN</li>
                <li><strong>AI Providers</strong> — To generate audit analyses and fix plans</li>
              </ul>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">5. Data Security</h2>
              <p>All data encrypted in transit (TLS 1.3) and at rest (AES-256). We follow industry best practices for data protection.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">6. Your Rights (GDPR)</h2>
              <p>Under GDPR, you have the right to:</p>
              <ul class="list-disc pl-6 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p class="mt-2">Contact <a href="mailto:sivussa@sivussa.com" class="text-primary hover:underline">sivussa@sivussa.com</a> to exercise these rights.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
              <p>We retain your data for as long as your account is active. Upon account deletion, data is removed within 30 days. Audit results are retained for 12 months for reference, then deleted.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">8. Cookies</h2>
              <p>We use essential cookies for authentication and session management. Analytics cookies (if enabled) require your consent. We do not use advertising cookies.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
              <p>We may update this policy periodically. Significant changes will be communicated via email. Continued use constitutes acceptance.</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-white mb-3">10. Contact</h2>
              <p>For privacy inquiries: <a href="mailto:sivussa@sivussa.com" class="text-primary hover:underline">sivussa@sivussa.com</a></p>
              <p class="mt-1">Sivussa, Helsinki, Finland</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
