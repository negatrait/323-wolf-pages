import { Accordion } from '../components/common/Accordion';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { PRICING_TERMS } from '../data/load-content';

const STRIPE_URLS = {
  'one-shot': 'https://buy.stripe.com/cNi7sN0Kv3phb500GPcbC01',
  quarterly: 'https://buy.stripe.com/3cIdRbal52ld7SO4X5cbC02',
  monthly: 'https://buy.stripe.com/5kQ9AV64P5xpehc3T1cbC03',
};

const TIERS = [
  {
    name: 'One-shot',
    price: '€99',
    period: 'one-time',
    popular: false,
    ctaText: 'Get Started — €99',
    ctaHref: STRIPE_URLS['one-shot'],
    features: [
      'One-time audit',
    ],
  },
  {
    name: 'Quarterly',
    price: '€99',
    period: '/quarter',
    popular: false,
    ctaText: 'Get Started — €99/qtr',
    ctaHref: STRIPE_URLS.quarterly,
    features: [
      'Audit every 90 days',
    ],
  },
  {
    name: 'Monthly',
    price: '€89',
    period: '/month',
    popular: true,
    ctaText: 'Get Started — €89/mo',
    ctaHref: STRIPE_URLS.monthly,
    features: [
      'Audit every month',
    ],
  },
];

const PRICING_FAQ = [
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes. No contracts. Cancel and you won't be charged again. Your current period runs to completion.",
  },
  {
    question: 'Can I switch plans?',
    answer: 'Yes. Upgrade or downgrade anytime. Prorated billing applies.',
  },
  {
    question: 'Can I audit multiple sites?',
    answer:
      'Each site requires a separate subscription. Contact us for volume discounts.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Credit and debit cards via Stripe. Apple Pay and Google Pay supported.',
  },
  {
    question: 'What makes this different from Semrush or Ahrefs?',
    answer:
      'They audit. We audit AND provide prioritized recommendations. They give you a checklist — you figure out what to do. We give you expert guidance on what to fix first.',
  },
];

export function Pricing() {
  return (
    <>
      <Head
        title="Pricing — Simple Plans, No Hidden Fees"
        description="From €89/month. Full SEO + GEO + AEO audits with prioritized recommendations. Simple, transparent pricing."
        canonical="https://sivussa.com/pricing"
      />
      <Section>
        <BreadcrumbNav currentPage="Pricing" />
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple pricing. <span class="text-primary">No hidden fees.</span>
          </h1>
          <p class="text-xl text-dark-300 mb-16">
            AI specialists audit your site and provide expert recommendations.
            Get prioritized, actionable guidance.
          </p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TIERS.map((t) => (
            <div
              key={t.name}
              class={`relative rounded-2xl p-8 border flex flex-col ${t.popular ? 'border-primary shadow-glow bg-dark-800' : 'border-dark-600 bg-dark-800'}`}
            >
              {t.popular && (
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-dark-900 text-xs font-bold rounded-full">
                  MOST POPULAR
                </span>
              )}
              <h3 class="text-xl font-bold text-white mb-2">{t.name}</h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-white">{t.price}</span>
                {t.period && <span class="text-dark-300 ml-1">{t.period}</span>}
              </div>
              <ul class="space-y-3 mb-8 flex-1">
                {t.features.map((f, i) => (
                  <li key={i} class="flex items-start gap-2 text-dark-200">
                    <span class="material-symbols-outlined text-primary text-lg mt-0.5">
                      check_circle
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={t.ctaHref}
                target="_blank"
                rel="noopener"
                class="w-full block text-center px-8 py-4 bg-gradient-to-br from-primary to-[#6EDE69] text-dark-900 font-black uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all"
              >
                {t.ctaText}
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Legal Terms - EU right of withdrawal, must appear near purchase buttons */}
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div class="text-xs text-dark-500 space-y-1">
          {PRICING_TERMS.map((term, i) => (
            <p key={i}>
              {i === 3 ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: term.tos_pp
                      .replace(
                        'Terms of Service',
                        '<a href="/terms" class="text-primary hover:underline">Terms of Service</a>',
                      )
                      .replace(
                        'Privacy Policy',
                        ' <a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>',
                      ),
                  }}
                />
              ) : (
                term.timing || term.consumers || term.withdrawal
              )}
            </p>
          ))}
        </div>
      </div>

      {/* Feature comparison */}
      <Section>
        <h2 class="text-2xl font-bold text-white text-center mb-8">
          What you get
        </h2>
        <div class="max-w-4xl mx-auto overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-dark-600">
                <th class="text-left py-3 px-4 text-dark-300">Feature</th>
                <th class="text-center py-3 px-4 text-dark-300">
                  One-shot €99
                </th>
                <th class="text-center py-3 px-4 text-dark-300">
                  Quarterly €99/qtr
                </th>
                <th class="text-center py-3 px-4 text-primary font-semibold">
                  Monthly €89/mo
                </th>
              </tr>
            </thead>
            <tbody class="text-dark-200">
              {[
                ['Full visibility audit', true, true, true],
                ['Prioritized recommendations', true, true, true],
                ['Expert guidance', true, true, true],
                ['Specific recommendations for your site', true, true, true],
                ['Content suggestions', true, true, true],
                ['Schema markup guidance', true, true, true],
                ['Track your progress', false, true, true],
                ['PDF report', true, true, true],
                ['Email delivery', true, true, true],
                ['Support', 'Email', 'Email', 'Email'],
                ['Audit frequency', 'Once', 'Every 90 days', 'Every month'],
              ].map(([label, ...vals], i) => (
                <tr key={i} class="border-b border-dark-700">
                  <td class="py-3 px-4">{label}</td>
                  {vals.map((v, j) => (
                    <td key={j} class="py-3 px-4 text-center">
                      {v === true ? (
                        <span class="text-primary">✓</span>
                      ) : v === false ? (
                        <span class="text-dark-500">—</span>
                      ) : (
                        <span class="text-dark-300">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Competitor comparison */}
      <Section dark={false}>
        <h2 class="text-2xl font-bold text-white text-center mb-8">
          Why this is different
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: 'Semrush',
              price: '$1,428/yr',
              desc: 'Comprehensive audit. Zero prioritized recommendations. 200 issues and you figure out what to do.',
            },
            {
              name: 'Ahrefs',
              price: '$1,548/yr',
              desc: 'Great backlink data. No GEO. No AEO. No recommendations.',
            },
            {
              name: 'Sitebulb',
              price: '$336/yr',
              desc: 'Desktop tool. Technical SEO only. No local. No AI answers. No guidance.',
            },
            {
              name: 'Sivussa',
              price: '€89/mo',
              desc: 'Full SEO + GEO + AEO. Every issue comes with prioritized, expert recommendations by AI specialists.',
              highlight: true,
            },
          ].map((c, i) => (
            <div
              key={i}
              class={`rounded-2xl p-6 border ${c.highlight ? 'border-primary bg-dark-800' : 'border-dark-600 bg-dark-900'}`}
            >
              <h3
                class={`text-lg font-bold mb-1 ${c.highlight ? 'text-primary' : 'text-white'}`}
              >
                {c.name}
              </h3>
              <p class="text-dark-400 text-sm mb-3">{c.price}</p>
              <p class="text-dark-300 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <h2 class="text-2xl font-bold text-white text-center mb-8">
          Pricing FAQ
        </h2>
        <div class="max-w-3xl mx-auto">
          {PRICING_FAQ.map((item, i) => (
            <Accordion key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section dark={false}>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            Stop paying for checklists. Get recommendations.
          </h2>
          <a
            href={STRIPE_URLS['one-shot']}
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
