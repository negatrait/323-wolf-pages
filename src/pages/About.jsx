import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { organizationJsonLd } from '../utils/seo';

export function About() {
  return (
    <>
      <Head
        title="About Sivussa — Visibility Upgrades on Autopilot"
        description="Sivussa democratizes online visibility for small businesses. Built in Finland."
        canonical="https://sivussa.com/about"
        structuredData={organizationJsonLd()}
      />

      <Section>
        <BreadcrumbNav currentPage="About" />
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Your junior SEO team, <span class="text-primary">powered by AI</span></h1>
          <p class="text-xl text-dark-300">We believe every business deserves visibility — not just the ones with €5,000/month agency budgets.</p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">SEO tools give you homework. We think that's broken.</h2>
          <p class="text-dark-300 leading-relaxed mb-6">
            Every product on the market does the same thing: audit your site, generate a list of issues, and leave you to figure out the fixes. That works if you're an SEO professional. It doesn't work if you're a restaurant owner, a plumber, or a small e-commerce store.
          </p>
          <p class="text-dark-300 leading-relaxed">
            Small businesses stay invisible. Not because they don't know what's wrong — because they don't have the time or expertise to fix it.
          </p>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">AI specialists that don't just audit — <span class="text-primary">they fix</span></h2>
          <p class="text-dark-300 leading-relaxed mb-8">
            We built Sivussa to solve one problem: the gap between finding SEO issues and actually fixing them.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'SEO Agent', desc: 'Technical health, meta tags, structured data, page speed, content optimization' },
              { title: 'GEO Agent', desc: 'Google Business Profile, local pack rankings, NAP consistency, local citations' },
              { title: 'AEO Agent', desc: 'FAQ content, featured snippets, voice search, AI answer readiness' },
            ].map((a, i) => (
              <div key={i} class="rounded-xl p-5 bg-dark-800 border border-dark-600">
                <h3 class="text-primary font-semibold mb-2">{a.title}</h3>
                <p class="text-dark-300 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">Built in Finland</h2>
          <p class="text-dark-300 leading-relaxed mb-4">
            Sivussa is built by a small team based in Finland. We're bootstrapped, not VC-backed. We believe in minimal infrastructure, AI-powered automation, and direct relationships with customers.
          </p>
          <p class="text-dark-300 leading-relaxed mb-4">
            The name "Sivussa" is Finnish — it means "alongside" or "beside." We're alongside the businesses that need visibility but can't afford enterprise tools or agency retainers.
          </p>
          <p class="text-dark-300 leading-relaxed">
            We started Sivussa because we kept seeing the same pattern: small businesses running free SEO audits, getting overwhelmed by the results, and doing nothing. The tools weren't helping — they were just generating homework. We built something that actually does the work.
          </p>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-8">Our Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: '01', title: 'Do the work, don\'t just point at it', desc: 'Every issue should come with a solution. That\'s our minimum standard.' },
              { num: '02', title: 'Simplicity over complexity', desc: 'You don\'t need 100 metrics. You need copy-paste ready fixes. We deliver those.' },
              { num: '03', title: 'Transparency always', desc: 'No hidden fees. No surprise charges. No selling your data. What you see is what you get.' },
              { num: '04', title: 'Privacy first', desc: 'Your data is yours. We use it to provide our service. Period.' },
              { num: '05', title: 'No BS', desc: 'We don\'t promise #1 rankings. We don\'t say you\'ll "dominate Google in 24 hours." We write honest fixes and track real progress.' },
            ].map((v, i) => (
              <div key={i} class="flex gap-4">
                <span class="text-primary font-bold text-lg">{v.num}</span>
                <div>
                  <h3 class="text-white font-semibold mb-1">{v.title}</h3>
                  <p class="text-dark-300 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-8">What we're building</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-primary font-semibold mb-2">Short term</h3>
              <p class="text-dark-300 text-sm">Launch. Help the first businesses get fix plans. Prove that AI-written remediation works better than checklists.</p>
            </div>
            <div>
              <h3 class="text-primary font-semibold mb-2">Medium term</h3>
              <p class="text-dark-300 text-sm">Expand specialist agents. Add competitor analysis. Build CMS integrations so fixes can be applied with one click.</p>
            </div>
            <div>
              <h3 class="text-primary font-semibold mb-2">Long term</h3>
              <p class="text-dark-300 text-sm">Become the go-to AI SEO team for small businesses globally. Make visibility fixes as easy as spell-check.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Questions? Want to say hello?</h2>
          <a href="mailto:sivussa@sivussa.com" class="text-primary hover:underline text-lg">sivussa@sivussa.com</a>
        </div>
      </Section>
    </>
  );
}
