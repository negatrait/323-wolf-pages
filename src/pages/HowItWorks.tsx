import { Section } from '../components/common/Section';
import { StepCard } from '../components/content/StepCard';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';

const STRIPE_ONE_SHOT = 'https://buy.stripe.com/cNi7sN0Kv3phb500GPcbC01';

export function HowItWorks() {
  return (
    <>
      <Head
        title="How Sivussa Works — 4 Simple Steps"
        description="Purchase your audit, AI specialists analyze your site, get a scored PDF report with copy-paste ready remedies. Starting at EUR 99."
        canonical="https://sivussa.com/how-it-works"
      />
      <Section>
        <BreadcrumbNav currentPage="How It Works" />
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            We audit your site.{' '}
            <span class="text-primary">Then we tell you what to fix.</span>
          </h1>
          <p class="text-xl text-dark-300 mb-16">
            AI specialists analyze your site and provide expert recommendations.
            You review and implement. That's it.
          </p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto space-y-16">
          <StepCard
            number={1}
            title="Purchase your audit"
            description="Choose a one-time audit or subscribe for recurring audits. Payment is secure via Stripe. No setup required."
          />
          <StepCard
            number={2}
            title="AI specialists analyze"
            description="AI agents crawl your website, analyze your Google Business Profile, evaluate your content for optimization. Time: 30-60 minutes."
          />
          <StepCard
            number={3}
            title="Get your report"
            description="Receive a detailed PDF audit report with scored findings and prioritized, actionable recommendations. Each issue explains the problem and provides specific guidance on how to fix it."
          />
          <StepCard
            number={4}
            title="Implement and improve"
            description="Use the recommendations to fix issues. Run follow-up audits to see your scores improve. Track your progress over time with recurring audits."
          />
        </div>
      </Section>

      {/* Comparison table */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white text-center mb-8">
            Other tools: "Here's what's wrong."{' '}
            <span class="text-primary">Sivussa: "Here's what to do."</span>
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-dark-600">
                  <th class="text-left py-3 px-4 text-dark-300">
                    What happens
                  </th>
                  <th class="text-center py-3 px-4 text-dark-300">
                    Other Tools
                  </th>
                  <th class="text-center py-3 px-4 text-primary">Sivussa</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                {[
                  ['Analyse for search engines', 'Yes', 'Yes'],
                  ['Analyse for AI agents', 'Rarely', 'Yes'],
                  ['Analyse for direct answers', 'Never', 'Yes'],
                  ['Prioritized recommendations', 'No', 'Yes'],
                  [
                    'Specific guidance for your site',
                    'Sometimes generic',
                    'Tailored to your content',
                  ],
                  ['Content suggestions', 'No', 'AI-generated for your niche'],
                  [
                    'Schema markup guidance',
                    '"You should add it"',
                    'Explained with examples',
                  ],
                  ['Ongoing audits', 'No', 'Yes, on schedule'],
                ].map(([label, other, sivussa], i) => (
                  <tr key={i} class="border-b border-dark-700">
                    <td class="py-3 px-4">{label}</td>
                    <td class="py-3 px-4 text-center text-dark-400">{other}</td>
                    <td class="py-3 px-4 text-center text-primary font-medium">
                      {sivussa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* What you get */}
      <Section dark={false}>
        <h2 class="text-2xl font-bold text-white text-center mb-10">
          What you get
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Full visibility audit',
              desc: 'Comprehensive analysis across search engines, geolocation services, etc.',
            },
            {
              title: 'Prioritized findings',
              desc: 'Issues ranked by impact so you know what to fix first.',
            },
            {
              title: 'Expert recommendations',
              desc: 'AI-powered guidance for every issue found.',
            },
            {
              title: 'Competitor comparison',
              desc: 'See how you perform against top-ranking competitors.',
            },
            {
              title: 'Performance analysis',
              desc: 'Core Web Vitals and performance metrics.',
            },
            {
              title: 'PDF report',
              desc: 'Delivered to your email. Share with your team.',
            },
            {
              title: 'Recurring audits',
              desc: 'Monthly or quarterly audits for subscribers.',
            },
            {
              title: 'Track progress',
              desc: 'See your scores improve over time.',
            },
            {
              title: 'Email delivery',
              desc: 'Reports delivered directly to your inbox.',
            },
          ].map((t, i) => (
            <div
              key={i}
              class="rounded-xl p-5 bg-dark-900 border border-dark-600"
            >
              <h3 class="text-white font-semibold mb-2">{t.title}</h3>
              <p class="text-dark-300 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            Ready for a real audit with actionable recommendations?
          </h2>
          <p class="text-dark-300 mb-8">
            Get a comprehensive visibility audit with prioritized guidance.
          </p>
          <a
            href={STRIPE_ONE_SHOT}
            target="_blank"
            rel="noopener"
            class="inline-block px-8 py-4 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Get Your Audit — €99
          </a>
        </div>
      </Section>
    </>
  );
}
