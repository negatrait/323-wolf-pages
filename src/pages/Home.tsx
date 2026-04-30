import { Accordion } from '../components/common/Accordion';
import { Section } from '../components/common/Section';
import { FeatureCard } from '../components/content/FeatureCard';
import { PricingCard } from '../components/content/PricingCard';
import { StepCard } from '../components/content/StepCard';
import { Head } from '../components/seo/Head';
import {
  FAQ_ITEMS,
  FEATURES,
  HOME_FAQ,
  HOME_FEATURES,
  HOME_FINAL_CTA,
  HOME_HERO,
  HOME_HOW_IT_WORKS,
  HOME_PRICING,
  HOME_PROBLEM,
  HOME_WHAT_YOU_GET,
  HOME_WHO_IS_THIS_FOR,
  PRICING_TIERS,
  SITE_CONFIG,
} from '../data/load-content';
import { getRouteMeta } from '../data/route-meta';

export function Home() {
  return (
    <>
      <Head
        title={getRouteMeta('/').title}
        description={getRouteMeta('/').description}
        canonical={getRouteMeta('/').canonical}
      />

      {/* Hero */}
      <section class="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        <img
          src="/sivussa-banner.webp"
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
          width="1536"
          height="850"
          loading="eager"
          aria-hidden="true"
        />
        <div class="absolute inset-0 bg-dark-900/70" />
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {HOME_HERO.title}{' '}
              <span class="text-primary">{HOME_HERO.subtitle}</span>
            </h1>
            <p
              class="text-lg md:text-xl text-dark-300 mb-10"
              dangerouslySetInnerHTML={{ __html: HOME_HERO.content }}
            />
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={HOME_HERO.cta_primary_href}
                target="_blank"
                rel="noopener"
                class="px-8 py-4 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary-dark transition-colors text-center"
              >
                {HOME_HERO.cta_primary}
              </a>
              <a
                href={HOME_HERO.cta_secondary_href}
                class="px-8 py-4 border border-dark-600 text-white font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors text-center"
              >
                {HOME_HERO.cta_secondary}
              </a>
            </div>
          </div>
        </div>
      </section>
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {HOME_WHAT_YOU_GET.title}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME_WHAT_YOU_GET.items.map((item, i) => (
              <div
                key={i}
                class="rounded-2xl p-6 bg-dark-800 border border-dark-600"
              >
                <div class="flex items-center gap-3 mb-4">
                  <span class="material-symbols-outlined text-primary text-2xl">
                    {item.icon}
                  </span>
                  <h3 class="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p class="text-dark-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div class="mt-12 p-6 rounded-2xl bg-primary/10 border border-primary/30">
            <p class="text-dark-300 text-center">
              <span class="text-primary font-semibold">
                {HOME_WHAT_YOU_GET.subscriberNote}
              </span>
            </p>
          </div>
        </div>
      </Section>

      {/* Problem */}
      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-6">
            {HOME_PROBLEM.title}
            <span class="text-primary">{HOME_PROBLEM.subtitle}</span>
          </h2>
          <p
            class="text-dark-300 text-center max-w-2xl mx-auto mb-12"
            dangerouslySetInnerHTML={{ __html: HOME_PROBLEM.intro }}
          />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOME_PROBLEM.sections.map((section, i) => (
              <div key={i}>
                <h3 class="text-lg font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul class="space-y-2 text-dark-300 text-sm">
                  {section.items.map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Solution / How It Works */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {HOME_HOW_IT_WORKS.title}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {HOME_HOW_IT_WORKS.steps.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
          <div class="rounded-2xl p-6 bg-dark-900 border border-dark-600">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-dark-400 mb-2">
                  <strong class="text-white">Other tools:</strong>{' '}
                  {HOME_HOW_IT_WORKS.comparison.other}
                </p>
              </div>
              <div>
                <p class="text-primary">
                  <strong>{SITE_CONFIG.name}:</strong>{' '}
                  {HOME_HOW_IT_WORKS.comparison.sivussa}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section dark={false}>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          {HOME_FEATURES.title}
          <span class="text-primary">{HOME_FEATURES.subtitle}</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </Section>

      {/* Who Is This For */}
      <Section>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          {HOME_WHO_IS_THIS_FOR.title}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOME_WHO_IS_THIS_FOR.cards.map((c, i) => (
            <div
              key={i}
              class="rounded-2xl p-6 bg-dark-800 border border-dark-600"
            >
              <h3 class="text-lg font-semibold text-white mb-3">{c.title}</h3>
              <p class="text-dark-300 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section dark={false}>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          {HOME_PRICING.title}
        </h2>
        <p class="text-dark-400 text-center mb-12">{HOME_PRICING.subtitle}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((t, i) => (
            <PricingCard key={i} {...t} />
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <h2 class="text-3xl font-bold text-white text-center mb-10">
          {HOME_FAQ.title}
        </h2>
        <div class="max-w-3xl mx-auto">
          {FAQ_ITEMS.slice(0, 8).map((item, i) => (
            <Accordion key={i} question={item.question} answer={item.answer} />
          ))}
          <div class="text-center mt-8">
            <a href="/faq" class="text-primary hover:underline font-medium">
              See all FAQ →
            </a>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section dark={false}>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {HOME_FINAL_CTA.title}
          </h2>
          <p class="text-dark-300 mb-8">{HOME_FINAL_CTA.subtitle}</p>
          <a
            href={HOME_FINAL_CTA.cta_href}
            target="_blank"
            rel="noopener"
            class="inline-block px-8 py-4 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            {HOME_FINAL_CTA.cta}
          </a>
        </div>
      </Section>
    </>
  );
}
