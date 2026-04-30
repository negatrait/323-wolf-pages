import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { ABOUT } from '../data/load-content';
import { getRouteMeta } from '../data/route-meta';

const meta = getRouteMeta('/about');

export function About() {
  const [s0, s1, s2, s3, s4, s5] = ABOUT.sections;
  return (
    <>
      <Head
        title={meta!.title}
        description={meta!.description}
        canonical={meta!.canonical}
      />

      <Section>
        <BreadcrumbNav currentPage="About" />
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            {ABOUT.title}
            <span class="text-primary">{ABOUT.subtitle}</span>
          </h1>
          <p class="text-xl text-dark-300">{ABOUT.intro}</p>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">{s0!.title}</h2>
          <div
            class="prose prose-invert max-w-none text-dark-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: s0!.contentHtml! }}
          />
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">
            {s1!.title}
            <span class="text-primary">{s1!.subtitle}</span>
          </h2>
          <p class="text-dark-300 leading-relaxed mb-8">{s1!.intro}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {s1!.agents!.map((a, i) => (
              <div
                key={i}
                class="rounded-xl p-5 bg-dark-800 border border-dark-600"
              >
                <h3 class="text-primary font-semibold mb-2">{a.title}</h3>
                <p
                  class="text-dark-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: a.descHtml! }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">{s2!.title}</h2>
          <div
            class="prose prose-invert max-w-none text-dark-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: s2!.contentHtml! }}
          />
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-8">{s3!.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s3!.values!.map((v, i) => (
              <div key={i} class="flex gap-4">
                <span class="text-primary font-bold text-lg">{v.num}</span>
                <div>
                  <h3 class="text-white font-semibold mb-1">{v.title}</h3>
                  <p
                    class="text-dark-300 text-sm"
                    dangerouslySetInnerHTML={{ __html: v.descHtml! }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark={false}>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-8">{s4!.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {s4!.timeline!.map((item, i) => (
              <div key={i}>
                <h3 class="text-primary font-semibold mb-2">{item.title}</h3>
                <p
                  class="text-dark-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: item.contentHtml! }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-4">{s5!.title}</h2>
          <a
            href={`mailto:${s5!.email}`}
            class="text-primary hover:underline text-lg"
          >
            {s5!.email}
          </a>
        </div>
      </Section>
    </>
  );
}
