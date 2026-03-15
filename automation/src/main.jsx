import { render, h } from 'preact';
import { Header, Hero, Section, SectionHeader, Cards, Steps, Pricing, ValueBox, LeadForm, Footer } from '../../shared/components.jsx';
import '../../shared/styles.css';

function App() {
  return (
    <div>
      <Header
        ctaText="Vara konsultaatio"
        links={[
          { href: '/', label: 'Etusivu' },
          { href: '#ongelmat', label: 'Ongelmat' },
          { href: '#hinnasto', label: 'Hinnasto' },
        ]}
      />
      <Hero
        badge="Työnkulkuautomaatio"
        title="Yhdistä työkalusi. <span class='gradient-text'>Vapauta aikasi.</span>"
        subtitle="Suunnittelemme ja toteutamme automaatioita jotka yhdistävät CRM:si, sähköpostin, laskutuksen ja kalenterin yhdeksi sujuvaksi järjestelmäksi. Ei enää manuaalista datansiirtoa."
        ctaText="Kartoita automaatiomahdollisuudet"
        stats={[
          { num: '1h+', label: 'Säästettyä/päivä' },
          { num: '1-3kk', label: 'Takaisinmaksu' },
          { num: '50+', label: 'Integraatiota' },
        ]}
      />
      <Section id="ongelmat" alt>
        <SectionHeader title="Tunnistatko nämä?" subtitle="Yleisimmät ongelmat ilman automaatiota" />
        <Cards items={[
          { icon: '📁', title: 'Sama data monessa paikassa', desc: 'Asiakastiedot CRM:ssä, sähköpostit Gmailissa, ajanvaraukset eri järjestelmässä. Kopioit tietoja käsin välillä.' },
          { icon: '🔄', title: 'Toistuvat manuaaliset tehtävät', desc: 'Lähetät samanlaista sähköpostia kymmeniä kertoja kuussa. Päivität taulukoita. Kopioit laskut.' },
          { icon: '🧠', title: 'Ihmisiä unohtuu', desc: 'Muistutuksia, seurantasähköposteja, deadlineja — ilman automaatiota jotkut jäävät tekemättä.' },
          { icon: '🔌', title: 'Työkalut eivät puhu keskenään', desc: 'Ostit parhaat työkalut, mutta ne eivät ole integroitu. Data ei liiku automaattisesti.' },
          { icon: '📈', title: 'Kasvua ei voi skaalata', desc: 'Kun asiakasmäärä kasvaa, hallinnollinen työ kasvaa samassa suhteessa. Ilman automaatiota kasvu = enemmän tunteja.' },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Näin se toimii" subtitle="Käyttöön 1-2 viikossa" />
        <Steps items={[
          { num: '01', title: 'Prosessikartoitus', desc: 'Käymme läpi nykyiset työnkulkusi. Missä menee aikaa? Mitä toistetaan? 1-2 tuntia.' },
          { num: '02', title: 'Automaattisuunnitelma', desc: 'Esitämme mitä automaatioita voisimme rakentaa, mitä ne säästävät, ja mitä ne maksavat.' },
          { num: '03', title: 'Rakennus ja testaus', desc: 'Toteutamme automaatiot n8n-alustalla. Testataan perusteellisesti ennen käyttöönottoa.' },
          { num: '04', title: 'Käyttöönotto ja koulutus', desc: 'Otamme automaatiot käyttöön ja koulutamme tiimisi. Me hoidamme tekniikan.' },
        ]} />
      </Section>
      <Section alt>
        <SectionHeader title="Tuetut integraatiot" subtitle="Yli 50 palvelua käytettävissä" />
        <Cards items={[
          { icon: '💼', title: 'CRM', desc: 'HubSpot, Pipedrive, Salesforce, Google Sheets' },
          { icon: '✉️', title: 'Viestintä', desc: 'Gmail, Slack, Microsoft Teams, Telegram' },
          { icon: '📅', title: 'Ajanvaraus', desc: 'Calendly, Cal.com, Google Calendar' },
          { icon: '💳', title: 'Maksut', desc: 'Stripe, Maksuturva, Visma' },
          { icon: '📣', title: 'Markkinointi', desc: 'Mailchimp, Brevo, Facebook Ads, Google Ads' },
          { icon: '🧾', title: 'Laskutus', desc: 'Visma, Procountor, Netvisor' },
        ]} />
      </Section>
      <Section id="hinnasto" alt>
        <SectionHeader title="Hinnasto" subtitle="Tunti säästettyä aikaa päivässä = €5,000-15,000/vuosi säästöä" />
        <Pricing tiers={[
          {
            name: 'Starter',
            setup: '€999',
            price: '149',
            features: ['1-3 automaatiota', 'Perusintegraatiot (2-3 palvelua)', 'Kuukausittainen tarkistus', 'Sähköpostituki'],
          },
          {
            name: 'Pro',
            setup: '€2,999',
            price: '399',
            featured: true,
            features: ['5-10 automaatiota', 'Laajennetut integraatiot', 'Leadipisteytys', 'CRM-synkkaus', 'Slack-ilmoitukset', 'Viikkoraportti'],
          },
          {
            name: 'Enterprise',
            setup: '€4,999+',
            price: '799',
            features: ['Rajoittamaton automaatiot', 'Kaikki integraatiot', 'Dedikoitu ylläpitäjä', 'Prioriteettituki', '4h/vko konsultointi'],
          },
        ]} />
        <ValueBox text="Automaatiomme maksavat itsensä takaisin 1-3 kuukaudessa." />
      </Section>
      <LeadForm
        title="Kartoita automaatiomahdollisuudet"
        subtitle="Ilmainen konsultaatio — selvitämme missä automaatio säästää eniten aikaa."
        perks={['✓ Ilmainen 1h konsultaatio', '✓ Prosessikartoitus mukaan lukien', '✓ Konkreettinen ehdotus automaatioille']}
        ctaText="Vara ilmainen konsultaatio"
        successTitle="Kiesti!"
        successMessage="Otamme yhteyttä 24 tunnissa sopimaan ajan."
        messageLabel="Mitä haluat automatisoida?"
        messagePlaceholder="Esim. asiakasseuranta, laskutus, ajanvaraus..."
        source="automation"
      />
      <Footer />
    </div>
  );
}

render(<App />, document.getElementById('app'));
