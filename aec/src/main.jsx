import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import './styles.css';

function Header() {
  return (
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <a href="/" class="logo">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">AI Native Consulting</span>
          </a>
          <nav class="nav">
            <a href="/#services">All Services</a>
            <a href="#use-cases">Use Cases</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact" class="nav-cta">Get Started</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section class="hero">
      <div class="container">
        <span class="badge">AEC Tech AI</span>
        <h1>AI-powered automation for <span class="gradient">architecture, engineering & construction.</span></h1>
        <p class="hero-sub">
          Document automation, cost estimation, and compliance checking built specifically
          for AEC firms. Streamline RFIs, submittals, and project documentation.
        </p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-primary">Start Automating</a>
          <a href="#use-cases" class="btn btn-secondary">See Use Cases</a>
        </div>
        <div class="hero-metrics">
          <div class="metric">
            <span class="metric-num">40%</span>
            <span class="metric-label">Faster documentation</span>
          </div>
          <div class="metric">
            <span class="metric-num">€12-14T</span>
            <span class="metric-label">Global AEC market</span>
          </div>
          <div class="metric">
            <span class="metric-num">15-17%</span>
            <span class="metric-label">AEC AI CAGR</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    {
      icon: '📄',
      title: 'Document Automation',
      desc: 'Automated RFI and submittal processing. NLP-powered extraction, categorization, and routing.',
      impact: '60% faster response time',
    },
    {
      icon: '💰',
      title: 'Cost Estimation',
      desc: 'ML-enhanced takeoff and estimation. Historical data analysis for more accurate bids.',
      impact: '15-25% more accurate bids',
    },
    {
      icon: '✅',
      title: 'Compliance Checking',
      desc: 'Automated building code verification. Instant flag potential violations before they become costly.',
      impact: '90% fewer code violations',
    },
    {
      icon: '📅',
      title: 'Schedule Optimization',
      desc: 'AI-based CPM scheduling. Constraint solving for optimal project timelines.',
      impact: '10-20% shorter schedules',
    },
    {
      icon: '🔍',
      title: 'Clash Detection',
      desc: 'Computer vision + BIM integration. Automated detection of design conflicts.',
      impact: '70% fewer RFIs',
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      desc: 'Computer vision on site cameras. Real-time progress vs. schedule comparison.',
      impact: 'Automated daily reports',
    },
  ];
  return (
    <section id="use-cases" class="section pains">
      <div class="container">
        <div class="section-header">
          <h2>AI Use Cases for AEC</h2>
          <p>Domain-specific automation that understands your workflows.</p>
        </div>
        <div class="pains-grid">
          {cases.map(c => (
            <div class="pain-card">
              <span class="pain-icon">{c.icon}</span>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
              <span class="pain-impact">{c.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Assessment', desc: 'We analyze your current workflows, data quality, and pain points. Identify the highest-ROI automation opportunities.' },
    { num: '02', title: 'Integrate', desc: 'Connect to your existing BIM, project management, and document management systems. API-first approach.' },
    { num: '03', title: 'Deploy', desc: 'Roll out AI models trained on your domain. Start with document automation, expand to cost estimation and compliance.' },
    { num: '04', title: 'Optimize', desc: 'Continuous improvement based on your data. Models get more accurate with every project.' },
  ];
  return (
    <section class="section how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>Implementation</h2>
          <p>From assessment to production in 4-8 weeks.</p>
        </div>
        <div class="steps">
          {steps.map(s => (
            <div class="step">
              <span class="step-num">{s.num}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Document Automation',
      setup: '€4,999',
      monthly: '€499/mo',
      features: ['RFI/submittal processing', 'Document categorization', 'Auto-routing & alerts', '1-2 document types', 'Integration with 1 system'],
      highlight: false,
    },
    {
      name: 'Estimation + Docs',
      setup: '€9,999',
      monthly: '€899/mo',
      features: ['Everything in Document', 'Cost estimation AI', 'Historical data analysis', 'BIM integration', '5 document types', 'Priority support'],
      highlight: true,
    },
    {
      name: 'Full AEC Suite',
      setup: '€24,999',
      monthly: '€1,999/mo',
      features: ['Everything above', 'Compliance checking', 'Schedule optimization', 'Clash detection', 'Progress tracking', 'Dedicated success manager'],
      highlight: false,
    },
  ];
  return (
    <section id="pricing" class="section pricing">
      <div class="container">
        <div class="section-header">
          <h2>Pricing</h2>
          <p>Enterprise-grade AI at consulting-firm prices. Not Big-4 rates.</p>
        </div>
        <div class="pricing-grid">
          {tiers.map(t => (
            <div class={`pricing-card ${t.highlight ? 'highlight' : ''}`}>
              {t.highlight && <span class="popular-badge">Recommended</span>}
              <h4>{t.name}</h4>
              <div class="price">
                <span class="setup">{t.setup} setup</span>
                <span class="monthly">{t.monthly}</span>
              </div>
              <ul class="features">
                {t.features.map(f => <li>{f}</li>)}
              </ul>
              <a href="#contact" class="btn btn-primary">Get Started</a>
            </div>
          ))}
        </div>
        <p class="pricing-note">ROI typically 3-10x within the first year. Revenue-share model available for qualified partners.</p>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/webhook/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service: 'aec' }),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', message: '' }); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
  };
  return (
    <section id="contact" class="section contact">
      <div class="container">
        <div class="section-header">
          <h2>Ready to Modernize Your AEC Workflow?</h2>
          <p>Tell us about your firm and your biggest documentation pain point.</p>
        </div>
        <form class="contact-form" onSubmit={handleSubmit}>
          <div class="form-row">
            <input type="text" placeholder="Your name" value={form.name} onInput={e => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email address" value={form.email} onInput={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <textarea placeholder="Your firm size, current tools (Revit, Procore, etc.), and biggest pain point..." rows={4} value={form.message} onInput={e => setForm({ ...form, message: e.target.value })} />
          <button type="submit" class="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Schedule Assessment'}
          </button>
          {status === 'success' && <p class="form-success">Thanks! We'll schedule a discovery call within 48 hours.</p>}
          {status === 'error' && <p class="form-error">Something went wrong. Email us directly at hello@aict.fi</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer class="footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-brand"><span class="logo-icon">⚡</span><span>AI Native Consulting</span></div>
          <p class="footer-copy">AI-powered automation for architecture, engineering & construction.</p>
          <p class="footer-legal">© 2026 AI Native Consulting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (<><Header /><Hero /><UseCases /><HowItWorks /><Pricing /><Contact /><Footer /></>);
}

render(<App />, document.getElementById('app'));
