import { Section } from '../components/common/Section';
import { StepCard } from '../components/content/StepCard';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { HOME_HOW_IT_WORKS } from '../data/load-content';
import { getRouteMeta } from '../data/route-meta';

const HW = HOME_HOW_IT_WORKS;
const meta = getRouteMeta('/how-it-works');

export function HowItWorks() {
  return (
    <>
      <Head
        title={meta!.title}
        description={meta!.description}
        canonical={meta!.canonical}
      />
      <Section>
        <BreadcrumbNav currentPage="How It Works" />
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            {HW.heading} <span class="text-primary">{HW.headingHighlight}</span>
          </h1>
          <p class="text-xl text-dark-300 mb-16">{HW.intro}</p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto space-y-16">
          {HW.steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </Section>

      {/* Comparison table */}
      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white text-center mb-8">
            {HW.comparisonHeading}{' '}
            <span class="text-primary">{HW.comparisonHeadingHighlight}</span>
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-dark-600">
                  {HW.comparisonTable?.headers.map((h, i) => (
                    <th
                      key={i}
                      class={`py-3 px-4 ${i === 0 ? 'text-left text-dark-300' : 'text-center text-dark-300'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody class="text-dark-200">
                {HW.comparisonTable?.rows.map((row, i) => {
                  const cells = Object.values(row);
                  return (
                    <tr key={i} class="border-b border-dark-700">
                      {cells.map((cell, j) => (
                        <td
                          key={j}
                          class={`py-3 px-4 ${j === 0 ? '' : 'text-center'} ${j === cells.length - 1 ? 'text-primary font-medium' : j > 0 && j < cells.length - 1 ? 'text-dark-400' : ''}`}
                        >
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
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
          {HW.whatYouGet?.map((t, i) => (
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
          <h2 class="text-3xl font-bold text-white mb-4">{HW.ctaTitle}</h2>
          <p class="text-dark-300 mb-8">{HW.ctaSubtitle}</p>
          <a
            href={HW.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-8 py-4 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            {HW.ctaText}
          </a>
        </div>
      </Section>
    </>
  );
}
