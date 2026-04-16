import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { PricingCard } from '../components/content/PricingCard';
import { FeatureCard } from '../components/content/FeatureCard';
import { StepCard } from '../components/content/StepCard';
import { Accordion } from '../components/common/Accordion';
import { PRICING_TIERS } from '../data/pricing-data';
import { FEATURES } from '../data/features-data';
import { FAQ_ITEMS } from '../data/faq-data';
import { organizationJsonLd, websiteJsonLd, softwareAppJsonLd } from '../utils/seo';

const STRIPE_ONE_SHOT = 'https://buy.stripe.com/cNi7sN0Kv3phb500GPcbC01';

export function Home() {
  const structuredData = [organizationJsonLd(), websiteJsonLd(), softwareAppJsonLd()];

  return (
    <>
      <Head
        title="Sivussa — Find out if your website is invisible to customers"
        description="Sivussa scans your website and shows you exactly why customers can't find you — and what to fix first. Built for small businesses."
        canonical="https://sivussa.com/"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section class="py-20 lg:py-32 bg-dark-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your website is invisible. <span class="text-primary">We'll show you why.</span>
            </h1>
            <p class="text-lg md:text-xl text-dark-300 mb-10">
              AI specialists audit your site and provide expert recommendations. Get a prioritized, actionable fix plan. Starting at €99.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={STRIPE_ONE_SHOT}
                target="_blank"
                rel="noopener"
                class="px-8 py-4 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary-dark transition-colors text-center"
              >
                Get Your Audit — €99
              </a>
              <a
                href="/pricing"
                class="px-8 py-4 border border-dark-600 text-white font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors text-center"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">What you get</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'search', title: 'Full SEO/GEO/AEO audit', desc: 'Comprehensive analysis of your site\'s visibility across search engines, local maps, and AI answers.' },
              { icon: 'assignment', title: 'Prioritized findings', desc: 'Issues ranked by impact. Know what to fix first for maximum visibility gains.' },
              { icon: 'psychology', title: 'Expert recommendations', desc: 'AI-powered audit report with specific, actionable guidance for every issue found.' },
              { icon: 'compare', title: 'Competitor comparison', desc: 'See how your site performs against top-ranking competitors in your niche.' },
              { icon: 'speed', title: 'Performance analysis', desc: 'Core Web Vitals and performance metrics that affect search rankings.' },
              { icon: 'email', title: 'PDF report', desc: 'Detailed audit report delivered to your email. Share with your team or developer.' },
            ].map((item, i) => (
              <div key={i} class="rounded-2xl p-6 bg-dark-800 border border-dark-600">
                <div class="flex items-center gap-3 mb-4">
                  <span class="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                  <h3 class="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p class="text-dark-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div class="mt-12 p-6 rounded-2xl bg-primary/10 border border-primary/30">
            <p class="text-dark-300 text-center">
              <span class="text-primary font-semibold">For subscribers:</span> Monthly or quarterly audits to track progress and catch new issues automatically.
            </p>
          </div>
        </div>
      </Section>

      {/* Problem */}
      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-6">Other tools give you homework. <span class="text-primary">We give you direction.</span></h2>
          <p class="text-dark-300 text-center max-w-2xl mx-auto mb-12">
            Every SEO tool audits your site, hands you a checklist, and wishes you luck. <strong class="text-white">Sivussa is different.</strong> Our AI specialists identify issues and provide expert recommendations. You get a prioritized, actionable plan on how to get more visibility.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">SEO — Search engines can't read your site</h3>
              <ul class="space-y-2 text-dark-300 text-sm">
                <li>• No structured data? We explain what you need.</li>
                <li>• Missing meta descriptions? We tell you where.</li>
                <li>• Slow pages? We identify the bottleneck.</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">GEO — You're invisible locally</h3>
              <ul class="space-y-2 text-dark-300 text-sm">
                <li>• No Google Business Profile? We walk you through setup.</li>
                <li>• Inconsistent NAP data? We show you what to correct.</li>
                <li>• No local content? We provide recommendations.</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">AEO — AI assistants don't know you exist</h3>
              <ul class="space-y-2 text-dark-300 text-sm">
                <li>• No FAQ content? We recommend questions for your niche.</li>
                <li>• No structured answers? We show you what schema to add.</li>
                <li>• No speakable markup? We explain the approach.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Solution / How It Works */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">How it works</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <StepCard number={1} title="Purchase your audit" description="Choose a one-time audit or subscribe for recurring audits. Payment via Stripe." />
            <StepCard number={2} title="AI specialists analyze" description="AI agents crawl your site, check your Google Business Profile, evaluate content for AI readiness, and score SEO, GEO, AEO." />
            <StepCard number={3} title="Get your report" description="Receive a detailed PDF report with scored findings and prioritized, actionable recommendations." />
            <StepCard number={4} title="Implement and improve" description="Use the recommendations to fix issues. Run follow-up audits to track your progress." />
          </div>
          <div class="rounded-2xl p-6 bg-dark-900 border border-dark-600">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-dark-400 mb-2"><strong class="text-white">Other tools:</strong> "Your meta description is missing." (Your problem now.)</p>
              </div>
              <div>
                <p class="text-primary"><strong>Sivussa:</strong> "Your meta description is missing on these pages. Here's why it matters and how to write an effective one for your target keyword."</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section dark={false}>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">Not an audit tool. <span class="text-primary">An AI-powered audit report.</span></h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </Section>

      {/* Who Is This For */}
      <Section>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">Built for businesses that can't afford a full-time SEO team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Small Businesses', desc: 'Plumbers, restaurants, salons. You need customers to find you online. Sivussa provides the audit and recommendations.' },
            { title: 'Freelancers & Solopreneurs', desc: 'Designers, developers, consultants. Your portfolio is your resume. If clients can\'t find you, you don\'t exist.' },
            { title: 'Agencies & Consultants', desc: 'Manage 10-50 client sites. Run audits, get recommendations, deliver results without hiring more staff.' },
            { title: 'E-commerce Stores', desc: 'Product pages need to rank. Local store needs Maps presence. Products need to appear in AI answers.' },
          ].map((c, i) => (
            <div key={i} class="rounded-2xl p-6 bg-dark-800 border border-dark-600">
              <h3 class="text-lg font-semibold text-white mb-3">{c.title}</h3>
              <p class="text-dark-300 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section dark={false}>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-4">Simple pricing. No hidden fees.</h2>
        <p class="text-dark-400 text-center mb-12">Choose what works for you.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((t, i) => <PricingCard key={i} {...t} />)}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <h2 class="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div class="max-w-3xl mx-auto">
          {FAQ_ITEMS.slice(0, 8).map((item, i) => (
            <Accordion key={i} question={item.question} answer={item.answer} />
          ))}
          <div class="text-center mt-8">
            <a href="/faq" class="text-primary hover:underline font-medium">See all FAQ →</a>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section dark={false}>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Stop guessing. Start with a real audit.</h2>
          <p class="text-dark-300 mb-8">Get a comprehensive SEO/GEO/AEO audit with prioritized recommendations.</p>
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
