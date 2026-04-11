import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Accordion } from '../components/common/Accordion';
import { AuditForm } from '../components/forms/AuditForm';

const STRIPE_URLS = {
  'one-shot': 'https://buy.stripe.com/cNi7sN0Kv3phb500GPcbC01',
  'quarterly': 'https://buy.stripe.com/3cIdRbal52ld7SO4X5cbC02',
  'monthly': 'https://buy.stripe.com/5kQ9AV64P5xpehc3T1cbC03',
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
      'Full SEO/GEO/AEO audit',
      'AI-written remediation plan for every issue',
      'Code snippets, content, schema — ready to paste',
      'PDF report',
      'Email support',
    ],
  },
  {
    name: 'Quarterly',
    price: '€99',
    period: '/quarter',
    popular: false,
    ctaText: 'Get Started — €99/qtr',
    ctaHref: STRIPE_URLS['quarterly'],
    features: [
      'Audit + fix plan every 90 days',
      'AI-written fixes for every issue',
      'Progress tracking',
      'PDF and DOCX reports',
      'Priority support',
    ],
  },
  {
    name: 'Monthly',
    price: '€89',
    period: '/month',
    popular: true,
    ctaText: 'Get Started — €89/mo',
    ctaHref: STRIPE_URLS['monthly'],
    features: [
      'Audit + fix plan every month',
      'AI-written fixes for every issue',
      'Progress tracking with delta reports',
      'PDF and DOCX reports',
      'Priority support',
      'API access',
    ],
  },
];

const PRICING_FAQ = [
  { question: 'Can I cancel anytime?', answer: 'Yes. No contracts. Cancel and you won\'t be charged again. Your current period runs to completion.' },
  { question: 'Can I switch plans?', answer: 'Yes. Upgrade or downgrade anytime. Prorated billing applies.' },
  { question: 'Do you offer refunds?', answer: 'Full refund within 14 days. No questions asked. Email support@sivussa.com.' },
  { question: 'Can I audit multiple sites?', answer: 'Each site requires a separate subscription. Contact us for volume discounts.' },
  { question: 'What payment methods do you accept?', answer: 'Credit and debit cards via Stripe. Apple Pay and Google Pay supported.' },
  { question: 'What makes this different from Semrush or Ahrefs?', answer: 'They audit. We audit AND fix. They give you a checklist — you do the work. We give you copy-paste ready solutions — our AI does the work.' },
];

export function Pricing() {
  return (
    <>
      <Head
        title="Pricing — Simple Plans, No Hidden Fees"
        description="From €89/month. Full SEO + GEO + AEO audits with AI-written fix plans. Cheaper than Ahrefs, more complete than Semrush."
        canonical="https://sivussa.com/pricing"
      />
      <Section>
        <BreadcrumbNav currentPage="Pricing" />
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Your junior SEO team — for <span class="text-primary">€89/month</span></h1>
          <p class="text-xl text-dark-300 mb-16">AI specialists audit your site and write every fix. Review, copy-paste, done.</p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TIERS.map((t) => (
            <div key={t.name} class={`relative rounded-2xl p-8 border flex flex-col ${t.popular ? 'border-primary shadow-glow bg-dark-800' : 'border-dark-600 bg-dark-800'}`}>
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
                    <span class="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
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

      {/* Feature comparison */}
      <Section>
        <h2 class="text-2xl font-bold text-white text-center mb-8">What you get</h2>
        <div class="max-w-4xl mx-auto overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-dark-600">
                <th class="text-left py-3 px-4 text-dark-300">Feature</th>
                <th class="text-center py-3 px-4 text-dark-300">One-shot €99</th>
                <th class="text-center py-3 px-4 text-dark-300">Quarterly €99/qtr</th>
                <th class="text-center py-3 px-4 text-primary font-semibold">Monthly €89/mo</th>
              </tr>
            </thead>
            <tbody class="text-dark-200">
              {[
                ['Full SEO/GEO/AEO audit', true, true, true],
                ['AI-written fix plan', true, true, true],
                ['Code snippets ready to paste', true, true, true],
                ['Content suggestions', true, true, true],
                ['Schema markup written for you', true, true, true],
                ['Progress tracking', false, true, true],
                ['Delta reports (what changed)', false, false, true],
                ['PDF download', true, true, true],
                ['DOCX download', false, true, true],
                ['Support', 'Email', 'Priority', 'Priority'],
                ['API access', false, false, true],
                ['Audit frequency', 'Once', 'Every 90 days', 'Every month'],
              ].map(([label, ...vals], i) => (
                <tr key={i} class="border-b border-dark-700">
                  <td class="py-3 px-4">{label}</td>
                  {vals.map((v, j) => (
                    <td key={j} class="py-3 px-4 text-center">
                      {v === true ? <span class="text-primary">✓</span> : v === false ? <span class="text-dark-500">—</span> : <span class="text-dark-300">{v}</span>}
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
        <h2 class="text-2xl font-bold text-white text-center mb-8">Why this is different</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Semrush', price: '$1,428/yr', desc: 'Comprehensive audit. Zero AI-written fixes. 200 issues and you figure it out.' },
            { name: 'Ahrefs', price: '$1,548/yr', desc: 'Great backlink data. No GEO. No AEO. No fix plans.' },
            { name: 'Sitebulb', price: '$336/yr', desc: 'Desktop tool. Technical SEO only. No local. No AI answers. No solutions.' },
            { name: 'Sivussa', price: '€89/mo', desc: 'Full SEO + GEO + AEO. Every issue comes with a copy-paste ready fix by AI specialists.', highlight: true },
          ].map((c, i) => (
            <div key={i} class={`rounded-2xl p-6 border ${c.highlight ? 'border-primary bg-dark-800' : 'border-dark-600 bg-dark-900'}`}>
              <h3 class={`text-lg font-bold mb-1 ${c.highlight ? 'text-primary' : 'text-white'}`}>{c.name}</h3>
              <p class="text-dark-400 text-sm mb-3">{c.price}</p>
              <p class="text-dark-300 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Guarantee */}
      <Section>
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-4">14-day money-back guarantee</h2>
          <p class="text-dark-300">Get your fix plan. Implement it. If you're not satisfied within 14 days, email support@sivussa.com for a full refund within 24 hours. No fine print. No questions asked.</p>
        </div>
      </Section>

      {/* FAQ */}
      <Section dark={false}>
        <h2 class="text-2xl font-bold text-white text-center mb-8">Pricing FAQ</h2>
        <div class="max-w-3xl mx-auto">
          {PRICING_FAQ.map((item, i) => (
            <Accordion key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-white mb-4">Stop paying for checklists. Get fix plans.</h2>
          <AuditForm variant="inline" />
        </div>
      </Section>
    </>
  );
}
