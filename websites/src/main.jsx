import { render, h } from 'preact';
import { Header, Hero, Section, SectionHeader, Cards, Steps, Pricing, ValueBox, LeadForm, Footer } from '../../shared/components.jsx';
import '../../shared/styles.css';

function App() {
  return (
    <div>
      <Header
        ctaText="Tilaa sivut"
        links={[
          { href: '/', label: 'Etusivu' },
          { href: '#ongelmat', label: 'Ongelmat' },
          { href: '#hinnasto', label: 'Hinnasto' },
        ]}
      />
      <Hero
        badge="Kotisivut yritykselle"
        title="Kotisivut jotka <span class='gradient-text'>tuottavat asiakkaita.</span> Valmiina viikossa."
        subtitle="Ammattimaiset, hakukoneoptimoit verkkosivut pienyrityksille. Rakennamme, ylläpidämme, päivitämme — sinä vastaanotat asiakaspyyntöjä."
        ctaText="Tilaa sivut €499 alkuun"
        stats={[
          { num: '1vko', label: 'Sivut valmiina' },
          { num: '100%', label: 'Mobiiliystävälliset' },
          { num: '€39', label: '/kk ylläpito' },
        ]}
      />
      <Section id="ongelmat" alt>
        <SectionHeader title="Tunnistatko nämä?" subtitle="Yleisimmät ongelmat ilman ammattimaisia sivuja" />
        <Cards items={[
          { icon: '🔍', title: 'Nykyiset sivut eivät näy haussa', desc: 'Ilman hakukoneoptimointia asiakkaat eivät löydä sinua Googlesta. Kilpailija näkyy sinun sijasta.' },
          { icon: '😩', title: 'Wix/Squarespace jää kesken', desc: 'Aloitit itse, mutta sivut jäi kesken kuukausiksi. Projektin viimeistely vaatii aikaa jota sinulla ei ole.' },
          { icon: '📱', title: 'Mobiilissa näyttää huonolta', desc: '70% paikallishauista tulee puhelimesta. Jos sivusi ei toimi kunnolla mobiilissa, menetät asiakkaita.' },
          { icon: '📝', title: 'Ei varauslomaketta', desc: 'Ilman verkkolomaketta asiakkaan pitää soittaa. Moni ei soita — he täyttävät lomakkeen kilpailijan sivuilla.' },
          { icon: '⏰', title: 'Sivut ovat vanhentuneet', desc: 'Palvelut, hinnat ja yhteystiedot muuttuvat. Ilman ylläpitoa sivustosi näyttää laiminlyödyltä.' },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Näin se toimii" subtitle="Sivut valmiina 5 päivässä" />
        <Steps items={[
          { num: '01', title: 'Täytä lomake', desc: 'Kerro yrityksestäsi, palveluistasi ja kohderyhmästäsi. 5 minuuttia.' },
          { num: '02', title: 'Luonnos', desc: 'Rakennamme sivujen pohjan 48 tunnissa. Näytämme sen sinulle ennen julkaisua.' },
          { num: '03', title: 'Hienosäätö', desc: 'Korjaamme mitä haluat muuttaa. 1-2 kierrosta muutoksia sisältyy.' },
          { num: '04', title: 'Julkaisu', desc: 'Sivut menevät liveen omalla domainilla. SSL, nopeusoptimointi ja mobiili valmiina.' },
          { num: '05', title: 'Ylläpito', desc: 'Päivitämme sisältöä kuukausittain. Sinä lähetät viestin, me hoidamme.' },
        ]} />
      </Section>
      <Section id="hinnasto" alt>
        <SectionHeader title="Hinnasto" subtitle="Sivut maksavat itsensä takaisin ensimmäisestä asiakaspyynnöstä" />
        <Pricing tiers={[
          {
            name: 'Basic',
            setup: '€499',
            price: '39',
            features: ['1-sivuiset sivut', 'Yhteystiedot + palvelut', 'Google Maps', 'Mobiili + SSL', '1 sisältöpäivitys/kk'],
          },
          {
            name: 'Plus',
            setup: '€999',
            price: '69',
            featured: true,
            features: ['Kaikki Basic:ssa', 'Varauslomake', 'Testimoniaalit', 'SEO-optimointi', 'Sosiaalisen median linkit', '2 päivitystä/kk'],
          },
          {
            name: 'Pro',
            setup: '€1,999',
            price: '99',
            features: ['Kaikki Plus:ssa', 'Blogi/ajankohtaissivu', 'Useat sivut (max 5)', 'Google Analytics', 'Sähköpostilista-integraatio', 'Rajoittamaton päivitykset'],
          },
        ]} />
        <ValueBox text="Yksi uusi asiakas kuussa kattaa kuukausimaksun useimmissa palveluissa." />
      </Section>
      <LeadForm
        title="Tilaa sivut"
        subtitle="Kerro yrityksestäsi — rakennamme luonnoksen 48 tunnissa."
        perks={['✓ Luonnos 48 tunnissa', '✓ 1-2 muutoskierrosta sisältyy', '✓ Ei riskiä — maksu vasta hyväksynnän jälkeen']}
        ctaText="Tilaa sivut"
        successTitle="Kiesti tilauksesta!"
        successMessage="Aloitamme rakentamaan sivujasi. Näytämme luonnoksen 48 tunnissa."
        messageLabel="Kerro yrityksestäsi"
        messagePlaceholder="Esim. siivousyritys Helsinki, palvelut: kotisiivous, toimitilasiivous..."
        source="websites"
      />
      <Footer />
    </div>
  );
}

render(<App />, document.getElementById('app'));
