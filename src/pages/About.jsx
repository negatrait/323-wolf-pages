import { Head } from '../components/seo/Head';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { organizationJsonLd } from '../utils/seo';
import { ABOUT } from '../data/load-content';

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
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">{ABOUT.title}<span class="text-primary">{ABOUT.subtitle}</span></h1>
          <p class="text-xl text-dark-300">{ABOUT.intro}</p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">{ABOUT.sections[0].title}</h2>
          <div class="prose prose-invert max-w-none">
            <p class="text-dark-300 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: ABOUT.sections[0].contentHtml.split('</p>')[0] + '</p>' }} />
            <p class="text-dark-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: ABOUT.sections[0].contentHtml.split('</p>').slice(1).join('</p>') }} />
          </div>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">{ABOUT.sections[1].title}<span class="text-primary">{ABOUT.sections[1].subtitle}</span></h2>
          <p class="text-dark-300 leading-relaxed mb-8">
            {ABOUT.sections[1].intro}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {ABOUT.sections[1].agents.map((a, i) => (
              <div key={i} class="rounded-xl p-5 bg-dark-800 border border-dark-600">
                <h3 class="text-primary font-semibold mb-2">{a.title}</h3>
                <p class="text-dark-300 text-sm" dangerouslySetInnerHTML={{ __html: a.descHtml }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">{ABOUT.sections[2].title}</h2>
          <div class="prose prose-invert max-w-none">
            {ABOUT.sections[2].contentHtml.split('</p>').reduce((acc, chunk, i, arr) => {
              if (i < arr.length - 1) acc.push(<p key={i} class="text-dark-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: chunk + '</p>' }} />);
              return acc;
            }, [])}
          </div>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-8">{ABOUT.sections[3].title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT.sections[3].values.map((v, i) => (
              <div key={i} class="flex gap-4">
                <span class="text-primary font-bold text-lg">{v.num}</span>
                <div>
                  <h3 class="text-white font-semibold mb-1">{v.title}</h3>
                  <p class="text-dark-300 text-sm" dangerouslySetInnerHTML={{ __html: v.descHtml }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-8">{ABOUT.sections[4].title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT.sections[4].timeline.map((item, i) => (
              <div key={i}>
                <h3 class="text-primary font-semibold mb-2">{item.title}</h3>
                <p class="text-dark-300 text-sm" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-4">{ABOUT.sections[5].title}</h2>
          <a href={`mailto:${ABOUT.sections[5].email}`} class="text-primary hover:underline text-lg">{ABOUT.sections[5].email}</a>
        </div>
      </Section>
    </>
  );
}
