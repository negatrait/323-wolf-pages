import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { StepCard } from '../components/content/StepCard';
import { AuditForm } from '../components/forms/AuditForm';

export function HowItWorks() {
  return (
    <>
      <Head
        title="How Sivussa Works — 3 Simple Steps"
        description="Enter your URL, get your free SEO/GEO/AEO audit, and watch your visibility improve. No credit card required."
        canonical="https://sivussa.com/how-it-works"
      />
      <Section>
        <BreadcrumbNav currentPage="How It Works" />
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">We audit your site. <span class="text-primary">Then we fix it for you.</span></h1>
          <p class="text-xl text-dark-300 mb-16">AI specialists analyze your site and write every fix. You review and copy-paste. That's it.</p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto space-y-16">
          <StepCard number={1} title="10 seconds to start" description="Enter your website URL. We immediately start analyzing your SEO, GEO, and AEO. No signup required. AI agents crawl your website, analyze your Google Business Profile, evaluate your content for AI answer optimization, and generate scores. Time: 2-5 minutes." />
          <StepCard number={2} title="Not a checklist. A remediation plan." description="This is where Sivussa is different. Other tools tell you what's wrong. Sivussa's AI specialists write the fixes for you. Missing JSON-LD? We write the complete schema. No meta description? We write one optimized for your keyword. No FAQ content? We draft questions and answers for your niche. You get a review-and-copy-paste ready proposal on how to get more visibility." />
          <StepCard number={3} title="Implement fixes in minutes, not hours" description="Open your fix plan. Find the issue. Copy the solution. Paste it into your CMS or send it to your developer. Run another audit to see your score improve. Copy-paste fixes yourself, send the plan to your developer, share branded reports, track score improvements." />
          <StepCard number={4} title="Stay on autopilot" description="Subscribe for monthly or quarterly audits. AI specialists run audits on schedule, find new issues, and write new fix plans. Delivered to your inbox. Your visibility keeps improving. You never fall behind." />
        </div>
      </Section>

      {/* Comparison table */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white text-center mb-8">Other tools: "Here's what's wrong." <span class="text-primary">Sivussa: "Here's the fix."</span></h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-dark-600">
                  <th class="text-left py-3 px-4 text-dark-300">What happens</th>
                  <th class="text-center py-3 px-4 text-dark-300">Other Tools</th>
                  <th class="text-center py-3 px-4 text-primary">Sivussa</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                {[
                  ['Find SEO issues', 'Yes', 'Yes'],
                  ['Find GEO issues', 'Rarely', 'Yes'],
                  ['Find AEO issues', 'Never', 'Yes'],
                  ['Write the fixes for you', 'No', 'Yes'],
                  ['Code snippets ready to paste', 'Sometimes generic', 'Written for your site'],
                  ['Content suggestions', 'No', 'AI-drafted for your niche'],
                  ['Schema markup', '"You should add it"', 'Written and ready'],
                  ['Ongoing fix plans', 'No', 'Yes, on schedule'],
                ].map(([label, other, sivussa], i) => (
                  <tr key={i} class="border-b border-dark-700">
                    <td class="py-3 px-4">{label}</td>
                    <td class="py-3 px-4 text-center text-dark-400">{other}</td>
                    <td class="py-3 px-4 text-center text-primary font-medium">{sivussa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section dark={false}>
        <h2 class="text-2xl font-bold text-white text-center mb-10">What to expect</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { day: 'Day 1', desc: 'Enter URL. AI analyzes your site. First fix plan arrives.' },
            { day: 'Day 2-7', desc: 'Copy-paste critical fixes. Schema markup. Meta descriptions. GBP setup.' },
            { day: 'Day 14', desc: 'Run another audit. Score improving. Next-priority fix plan arrives.' },
            { day: 'Day 30', desc: 'Monthly audit. Score up significantly. Local pack appearance. More organic traffic.' },
          ].map((t, i) => (
            <div key={i} class="rounded-xl p-5 bg-dark-900 border border-dark-600">
              <div class="text-primary font-bold mb-2">{t.day}</div>
              <p class="text-dark-300 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-white mb-4">Ready for fix plans instead of checklists?</h2>
          <p class="text-dark-300 mb-8">Enter your URL. Get your first remediation plan in 15 minutes.</p>
          <AuditForm variant="inline" />
        </div>
      </Section>
    </>
  );
}
