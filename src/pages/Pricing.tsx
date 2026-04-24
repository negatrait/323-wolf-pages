import { Accordion } from '../components/common/Accordion';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import {
  PRICING_CTA,
  PRICING_COMPETITORS,
  PRICING_FAQ,
  PRICING_FEATURE_TABLE,
  PRICING_TERMS,
  PRICING_TIERS,
} from '../data/load-content';
import { getRouteMeta } from '../data/route-meta';

const PT = PRICING_FEATURE_TABLE;
const meta = getRouteMeta('/pricing');

export function Pricing() {
  return (
    <>
      <Head
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
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
          {PRICING_TIERS.map((t) => (
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
                rel="noopener noreferrer"
                class="w-full block text-center px-8 py-4 bg-gradient-to-br from-primary to-primary-light text-dark-900 font-black uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(87,174,123,0.15)] transition-all"
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
                {PT.headers.map((h, i) => (
                  <th
                    key={i}
                    class={`py-3 px-4 ${i === 0 ? 'text-left text-dark-300' : i === PT.headers.length - 1 ? 'text-center text-primary font-semibold' : 'text-center text-dark-300'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="text-dark-200">
              {PT.rows.map((row, i) => (
                <tr key={i} class="border-b border-dark-700">
                  {row.map((cell, j) => (
                    <td key={j} class={`py-3 px-4 ${j === 0 ? '' : 'text-center'}`}>
                      {cell === true ? (
                        <span class="text-primary">✓</span>
                      ) : cell === false ? (
                        <span class="text-dark-500">—</span>
                      ) : (
                        <span class={j === row.length - 1 ? 'text-primary font-medium' : j > 0 ? 'text-dark-300' : ''}>{String(cell)}</span>
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
          {PRICING_COMPETITORS.map((c, i) => (
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
            {PRICING_CTA.title}
          </h2>
          <a
            href={PRICING_CTA.href}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-8 py-4 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            {PRICING_CTA.text}
          </a>
        </div>
      </Section>
    </>
  );
}
