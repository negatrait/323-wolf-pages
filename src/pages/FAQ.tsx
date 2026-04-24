import { Accordion } from '../components/common/Accordion';
import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { FAQ_ITEMS } from '../data/load-content';
import { faqPageJsonLd } from '../utils/seo';

const CATEGORIES = ['General', 'Pricing', 'How It Works', 'Technical'];

export function FAQ() {
  return (
    <>
      <Head
        title="FAQ — Frequently Asked Questions"
        description="Common questions about Sivussa audits, pricing, data security, and more."
        canonical="https://sivussa.com/faq"
        structuredData={faqPageJsonLd(FAQ_ITEMS)}
      />

      <Section>
        <BreadcrumbNav currentPage="FAQ" />
        <div class="max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently asked questions
          </h1>
          <p class="text-lg text-dark-300">
            Everything you need to know about Sivussa. Can't find your answer?
            Email{' '}
            <a
              href="mailto:sivussa@sivussa.com"
              class="text-primary hover:underline"
            >
              sivussa@sivussa.com
            </a>
            .
          </p>
        </div>
      </Section>

      {CATEGORIES.map((cat) => {
        const items = FAQ_ITEMS.filter((f) => f.category === cat);
        if (!items.length) return null;
        return (
          <Section key={cat} dark={cat === 'General' || cat === 'How It Works'}>
            <div class="max-w-3xl mx-auto">
              <h2 class="text-xl font-bold text-white mb-6">{cat}</h2>
              {items.map((item, i) => (
                <Accordion
                  key={i}
                  question={item.question}
                  answer={item.answer}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </Section>
        );
      })}

      <Section>
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-dark-300">
            Still have questions?{' '}
            <a
              href="mailto:sivussa@sivussa.com"
              class="text-primary hover:underline"
            >
              sivussa@sivussa.com
            </a>
            . We respond within 24 hours.
          </p>
        </div>
      </Section>
    </>
  );
}
