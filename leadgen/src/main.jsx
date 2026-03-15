import { render, h } from 'preact';
import { Header, Hero, Section, SectionHeader, Cards, Steps, Pricing, ValueBox, LeadForm, Footer } from '../../shared/components.jsx';
import '../../shared/styles.css';

function App() {
  return (
    <div>
      <Header
        ctaText="Aloita ilmaiseksi"
        links={[
          { href: '/', label: 'Etusivu' },
          { href: '#ongelmat', label: 'Ongelmat' },
          { href: '#hinnasto', label: 'Hinnasto' },
        ]}
      />
      <Hero
        badge="Leadigenerointi"
        title="Asiakaspyyntöjä suoraan puhelimeen. <span class='gradient-text'>24/7. Automaattisesti.</span>"
        subtitle="Rakennamme järjestelmän joka kerää, pisteyttää ja välittää asiakaspyyntöjä ilman että teet itse mitään. Siivousyrityksistä hammaslääkäreihin — samat tulokset."
        ctaText="Aloita ilmaisella suunnittelulla"
        stats={[
          { num: '24/7', label: 'Liidien keräys' },
          { num: '<2h', label: 'Vastausaika' },
          { num: '3-5pv', label: 'Käyttöönottovaihe' },
        ]}
      />
      <Section id="ongelmat" alt>
        <SectionHeader title="Tunnistatko nämä?" subtitle="Yleisimmät ongelmat ilman automaatiota" />
        <Cards items={[
          { icon: '💨', title: 'Liidejä lipsuu ohi', desc: 'Ilman automaatiota potentiaaliset asiakkaat menevät kilpailijalle, koska et vastaa tarpeeksi nopeasti.' },
          { icon: '📋', title: 'Manuaalinen seuranta on hidasta', desc: 'Kopioit sähköpostit taulukkoon, soitat perään, unohdat puolet. Sama aika menisi asiakastyöhön.' },
          { icon: '📊', title: 'Et tiedä mistä asiakkaat tulevat', desc: 'Ilman seurantaa et voi optimoida — mistä tulee parhaat liidit, mikä kanava toimii.' },
          { icon: '🌙', title: 'Yöllä ja viikonloppuisin kukaan ei vastaa', desc: 'Potentiaaliset asiakkaat etsivät palvelua silloin kun sinä et ole töissä.' },
          { icon: '🔀', title: 'Useita kanavia, ei yhtä näkymää', desc: 'Facebook, Google, verkkosivu, puhelut — tiedot hajallaan eri paikoissa.' },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Näin se toimii" subtitle="Käyttöön 3-5 päivässä" />
        <Steps items={[
          { num: '01', title: 'Kartoitus', desc: 'Kerromme mitä kanavia asiakkaasi käyttävät ja missä he ovat. 30 min keskustelu riittää.' },
          { num: '02', title: 'Rakennus', desc: 'Asetamme verkkolomakkeet, mainosintegraatiot ja sähköpostiseurannan. Valmis 3-5 päivässä.' },
          { num: '03', title: 'Automatiikka', desc: 'Liidit pisteytyvät, kategorisoituvat ja ohjautuvat suoraan sinulle — sähköpostiin, puhelimeen tai CRM:ään.' },
          { num: '04', title: 'Optimointi', desc: 'Seuraamme mitä kanavia tuottaa ja optimoimme jatkuvasti. Kuukausiraportti sisältyy.' },
        ]} />
      </Section>
      <Section id="hinnasto" alt>
        <SectionHeader title="Hinnasto" subtitle="Yksi asiakas maksaa järjestelmän" />
        <Pricing tiers={[
          {
            name: 'Starter',
            setup: '€499',
            price: '79',
            features: ['Verkkolomake', 'Sähköposti-ilmoitukset', 'Google Sheets -loki', '1 kanava'],
          },
          {
            name: 'Pro',
            setup: '€1,499',
            price: '199',
            featured: true,
            features: ['Useat kanavat', 'Leadipisteytys', 'CRM-integraatio', 'Automaattiset seurantasähköpostit', 'Viikkoraportti'],
          },
          {
            name: 'Enterprise',
            setup: '€3,499',
            price: '449',
            features: ['Kaikki Pro:ssa', 'Monikanavainen myyntiputki', 'Ajanvaraus', 'Tarjousautomaatio', 'A/B-testaus', 'Kuukausittainen optimointi'],
          },
        ]} />
        <ValueBox text="Yksi asiakas maksaa järjestelmän. Keskimääräinen siivousasiakas tuottaa €50-100/käynti. 2-3 uutta asiakasta kuussa kattaa kuukausimaksun." />
      </Section>
      <LeadForm
        title="Aloita ilmainen suunnittelu"
        subtitle="30 minuutissa selviää mitä automaatiota sinulle kannattaa rakentaa."
        perks={['✓ Ilmainen 30 min suunnittelu', '✓ Ei sitoutumista', '✓ Saat konseptin heti']}
        ctaText="Vara suunnittelu"
        successTitle="Kiesti!"
        successMessage="Otamme yhteyttä 24 tunnissa sopimaan ajan."
        messageLabel="Kerro yrityksestäsi"
        messagePlaceholder="Esim. siivousyritys, 5 työntekijää, Helsinki..."
        source="leadgen"
      />
      <Footer />
    </div>
  );
}

render(<App />, document.getElementById('app'));
