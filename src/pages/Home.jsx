import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { AuditForm } from '../components/forms/AuditForm';
import { PricingCard } from '../components/content/PricingCard';
import { FeatureCard } from '../components/content/FeatureCard';
import { StepCard } from '../components/content/StepCard';
import { Accordion } from '../components/common/Accordion';
import { PRICING_TIERS } from '../data/pricing-data';
import { FEATURES } from '../data/features-data';
import { FAQ_ITEMS } from '../data/faq-data';
import { organizationJsonLd, websiteJsonLd, softwareAppJsonLd } from '../utils/seo';

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
              Your website is invisible. <span class="text-primary">We'll fix it.</span>
            </h1>
            <p class="text-lg md:text-xl text-dark-300 mb-10">
              AI specialists audit your site and write every fix for you. Review the plan, copy-paste, done. Starting at €89/month.
            </p>
          </div>
          <div id="audit-form" class="max-w-2xl mx-auto scroll-mt-20">
            <AuditForm variant="hero" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-6">Other tools give you homework. <span class="text-primary">We do the work.</span></h2>
          <p class="text-dark-300 text-center max-w-2xl mx-auto mb-12">
            Every SEO tool audits your site, hands you a checklist, and wishes you luck. <strong class="text-white">Sivussa is different.</strong> Our AI specialists don't just find the problems — they write the solutions. You get a copy-paste ready proposal on how to get more visibility.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">🔍 SEO — Search engines can't read your site</h3>
              <ul class="space-y-2 text-dark-300 text-sm">
                <li>• No structured data? We write the JSON-LD.</li>
                <li>• Missing meta descriptions? We draft them.</li>
                <li>• Slow pages? We identify the bottleneck.</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">📍 GEO — You're invisible locally</h3>
              <ul class="space-y-2 text-dark-300 text-sm">
                <li>• No Google Business Profile? We walk you through setup.</li>
                <li>• Inconsistent NAP data? We show you what to correct.</li>
                <li>• No local content? We write copy for your service areas.</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">🤖 AEO — AI assistants don't know you exist</h3>
              <ul class="space-y-2 text-dark-300 text-sm">
                <li>• No FAQ content? We write Q&A for your niche.</li>
                <li>• No structured answers? We build the schema.</li>
                <li>• No speakable markup? We generate it.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Solution / How It Works */}
      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">A junior SEO team in your pocket</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <StepCard number={1} title="Enter your URL" description="10 seconds. We start analyzing your site immediately." />
            <StepCard number={2} title="AI specialists go to work" description="AI agents crawl your site, check your Google Business Profile, evaluate content for AI readiness, and score SEO, GEO, AEO." />
            <StepCard number={3} title="Get your fix plan" description="Every issue comes with a copy-paste ready fix written specifically for your site. Code snippets, content, configuration changes." />
            <StepCard number={4} title="Copy-paste. Track. Repeat." description="Implement the fixes. Run another audit. Watch your score climb. New issues get new fix plans automatically." />
          </div>
          <div class="rounded-2xl p-6 bg-dark-900 border border-dark-600">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-dark-400 mb-2"><strong class="text-white">Other tools:</strong> "Your meta description is missing." (Your problem now.)</p>
              </div>
              <div>
                <p class="text-primary"><strong>Sivussa:</strong> "Your meta description is missing. Here's one written for your page, optimized for your target keyword. Copy this into your CMS."</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">Not an audit tool. <span class="text-primary">An AI SEO team.</span></h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </Section>

      {/* Who Is This For */}
      <Section dark={false}>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">Built for businesses that can't afford a full-time SEO team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Small Businesses', desc: 'Plumbers, restaurants, salons. You need customers to find you online. Sivussa is your junior SEO team.' },
            { title: 'Freelancers & Solopreneurs', desc: 'Designers, developers, consultants. Your portfolio is your resume. If clients can\'t find you, you don\'t exist.' },
            { title: 'Agencies & Consultants', desc: 'Manage 10-50 client sites. Run audits, get fix plans, deliver results without hiring more staff.' },
            { title: 'E-commerce Stores', desc: 'Product pages need to rank. Local store needs Maps presence. Products need to appear in AI answers.' },
          ].map((c, i) => (
            <div key={i} class="rounded-2xl p-6 bg-dark-900 border border-dark-600">
              <h3 class="text-lg font-semibold text-white mb-3">{c.title}</h3>
              <p class="text-dark-300 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-4">Your junior SEO team — for less than a gym membership</h2>
        <p class="text-dark-400 text-center mb-12">Simple plans. No hidden fees. Cancel anytime.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((t, i) => <PricingCard key={i} {...t} />)}
        </div>
      </Section>

      {/* Guarantee */}
      <Section dark={false}>
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-4">14-day money-back guarantee</h2>
          <p class="text-dark-300">Sign up. Get your fix plan. Implement it. If you're not satisfied within 14 days, email sivussa@sivussa.com for a full refund. No fine print. No questions asked.</p>
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
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Stop getting checklists. Start getting fix plans.</h2>
          <p class="text-dark-300 mb-8">Enter your URL. AI specialists write your remediation plan in 15 minutes.</p>
          <AuditForm variant="inline" />
        </div>
      </Section>
    </>
  );
}
