import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Header({ logo = '⚙️', brand = 'AEC Tech', links = [], ctaText, ctaHref = '#contact' }) {
  return (
    <header class="header">
      <div class="container header-inner">
        <a href="/" class="logo">{logo} <span>{brand}</span></a>
        <nav class="nav">
          {links.map(l => <a href={l.href} key={l.href}>{l.label}</a>)}
          {ctaText && <a href={ctaHref} class="btn btn-primary btn-sm">{ctaText}</a>}
        </nav>
      </div>
    </header>
  );
}

export function Hero({ badge, title, subtitle, ctaText, ctaHref = '#contact', stats }) {
  return (
    <section class="hero">
      <div class="container">
        {badge && <div class="hero-badge">{badge}</div>}
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {subtitle && <p class="hero-sub">{subtitle}</p>}
        <div class="hero-actions">
          {ctaText && <a href={ctaHref} class="btn btn-primary btn-lg">{ctaText}</a>}
        </div>
        {stats && (
          <div class="hero-stats">
            {stats.map(s => (
              <div class="stat" key={s.label}>
                <span class="stat-num">{s.num}</span>
                <span class="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Section({ children, alt = false, id }) {
  return <section class={`section${alt ? ' section-alt' : ''}`} id={id}><div class="container">{children}</div></section>;
}

export function SectionHeader({ title, subtitle }) {
  return (
    <div class="section-header">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function Cards({ items }) {
  return (
    <div class="cards">
      {items.map(c => (
        <div class="card" key={c.title}>
          {c.icon && <div class="card-icon">{c.icon}</div>}
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return (
    <div class="steps">
      {items.map(s => (
        <div class="step" key={s.num}>
          <div class="step-num">{s.num}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function Pricing({ tiers }) {
  return (
    <div class="pricing-grid">
      {tiers.map(t => (
        <div class={`pricing-card${t.featured ? ' featured' : ''}`} key={t.name}>
          {t.featured && <div class="pricing-badge">Suositeltu</div>}
          <h3>{t.name}</h3>
          <div class="pricing-setup">Aloitus: {t.setup}</div>
          <div class="pricing-amount">{t.price} <span>€/kk</span></div>
          <div class="pricing-period">{t.period || ''}</div>
          <ul class="pricing-features">
            {t.features.map(f => <li key={f}>{f}</li>)}
          </ul>
          <a href="#contact" class="btn btn-primary btn-full">Aloita</a>
        </div>
      ))}
    </div>
  );
}

export function ValueBox({ text }) {
  return (
    <div class="value-box">
      <p>{text}</p>
    </div>
  );
}

export function LeadForm({ title, subtitle, perks, ctaText = 'Lähetä', successTitle, successMessage, messageLabel, messagePlaceholder, source }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) { setStatus('error'); setErrorMsg('Nimi ja sähköposti vaaditaan.'); return; }
    setStatus('sending');
    try {
      const res = await fetch('/webhook/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); setForm({ name: '', email: '', phone: '', message: '' }); }
      else { setStatus('error'); setErrorMsg(data.message || 'Jokin meni pieleen.'); }
    } catch { setStatus('error'); setErrorMsg('Verkkovirhe. Yritä uudelleen tai soita meille.'); }
  }

  return (
    <Section id="contact" alt>
      <div class="contact-grid">
        <div class="contact-info">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <ul class="contact-perks">{perks.map(p => <li key={p}>{p}</li>)}</ul>
        </div>
        <div class="contact-form-wrapper">
          {status === 'success' ? (
            <div class="form-success">
              <div class="success-icon">✅</div>
              <h3>{successTitle}</h3>
              <p>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div class="form-group">
                <label>Nimi *</label>
                <input type="text" placeholder="Nimesi" value={form.name} onInput={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div class="form-group">
                <label>Sähköposti *</label>
                <input type="email" placeholder="sinä@yritys.fi" value={form.email} onInput={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div class="form-group">
                <label>Puhelin</label>
                <input type="tel" placeholder="Puhelinnumero" value={form.phone} onInput={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div class="form-group">
                <label>{messageLabel || 'Viesti'}</label>
                <textarea rows="3" placeholder={messagePlaceholder || 'Kerro meille tarpeistasi...'} value={form.message} onInput={e => setForm({ ...form, message: e.target.value })} />
              </div>
              {status === 'error' && <div class="form-error">{errorMsg}</div>}
              <button type="submit" class="btn btn-primary btn-lg btn-full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Lähetetään...' : ctaText}
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer class="footer">
      <div class="container footer-inner">
        <div>
          <div class="footer-brand">⚙️ AEC Tech</div>
          <div class="footer-contact">
            info@aectech.ai<br />
            Helsinki, Suomi
          </div>
        </div>
        <div class="footer-links">
          <a href="/">Etusivu</a>
          <a href="/leadgen/">Leadigenerointi</a>
          <a href="/websites/">Kotisivut</a>
          <a href="/automation/">Automaatio</a>
        </div>
      </div>
    </footer>
  );
}
