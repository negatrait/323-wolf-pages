import { render, h } from 'preact';
import { Header, Hero, Section, SectionHeader, Cards, LeadForm, Footer } from '../shared/components.jsx';
import '../shared/styles.css';

const services = [
  {
    icon: '🎯',
    title: 'Asiakaspyyntöjä ilman vaivaa',
    desc: 'Automatisoimme asiakashankinnan — verkkolomakkeet, mainokset ja sähköpostit keräävät asiakkaita 24/7 suoraan puhelimeesi.',
    href: '/leadgen/',
  },
  {
    icon: '🌐',
    title: 'Ammattimaiset sivut viikossa',
    desc: 'Nopeasti valmistuvat, hakukoneoptimoit sivut jotka näyttävät hyvältä puhelimessa. Ylläpito sisältyy.',
    href: '/websites/',
  },
  {
    icon: '⚙️',
    title: 'Vapauta aikaa automaatiolla',
    desc: 'Yhdistämme työkalusi — CRM, sähköposti, laskutus, kalenteri — yhdeksi sujuvaksi kokonaisuudeksi.',
    href: '/automation/',
  },
];

function App() {
  return (
    <div>
      <Header
        ctaText="Ota yhteyttä"
        links={[
          { href: '/leadgen/', label: 'Leadigenerointi' },
          { href: '/websites/', label: 'Kotisivut' },
          { href: '/automation/', label: 'Automaatio' },
        ]}
      />
      <Hero
        badge="Automaatiota pienyrityksille"
        title="Automaatiota jotka <span class='gradient-text'>tuottavat asiakkaita.</span>"
        subtitle="Rakennamme verkkosivut, leadigeneroinnin ja työnkulut pienyrityksille. Sinä keskityät työhön, me hoidamme tekniikan."
        ctaText="Katso palvelut"
        ctaHref="#palvelut"
        stats={[
          { num: '24/7', label: 'Automaattinen asiakashankinta' },
          { num: 'viikossa', label: 'Sivut valmiina' },
          { num: '€€€', label: 'Säästöä kuukaudessa' },
        ]}
      />
      <Section id="palvelut" alt>
        <SectionHeader
          title="Palvelumme"
          subtitle="Kolme tapaa kasvattaa yritystäsi automaatiolla"
        />
        <div class="cards">
          {services.map(s => (
            <a href={s.href} class="card" key={s.title} style="text-decoration:none;color:inherit;">
              <div class="card-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <p style="margin-top:12px;color:var(--c-primary);font-weight:600;font-size:0.9rem;">Katso lisää →</p>
            </a>
          ))}
        </div>
      </Section>
      <LeadForm
        title="Aloitetaan"
        subtitle="Kerro meille yrityksestäsi — otamme yhteyttä 24 tunnissa."
        perks={['✓ Ilmainen konsultaatio', '✓ Ei sitoutumista', '✓ Nopea vastaus']}
        ctaText="Ota yhteyttä"
        successTitle="Kiesti viestistä!"
        successMessage="Otamme yhteyttä pian."
        messageLabel="Miten voimme auttaa?"
        messagePlaceholder="Kerro yrityksestäsi ja tarpeistasi..."
        source="index"
      />
      <Footer />
    </div>
  );
}

render(<App />, document.getElementById('app'));
