import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import './styles.css';

const services = [
  {
    id: 'leadgen',
    title: 'Lead Generation Automation',
    subtitle: 'Automated pipelines that find and qualify your customers',
    description: 'We build AI-powered lead generation systems that work 24/7. Automated outreach, qualification, and CRM integration — so you focus on closing deals, not chasing contacts.',
    icon: '🎯',
    metrics: ['3-5x more qualified leads', '80% less manual prospecting', 'Payback in 30 days'],
    href: '/leadgen/',
    color: '#2563eb',
  },
  {
    id: 'websites',
    title: 'Website Building',
    subtitle: 'Professional one-page sites for local businesses',
    description: 'Modern, mobile-first landing pages for small businesses. SEO-optimized, fast, and professionally designed — at a fraction of agency prices. We handle everything from content to hosting.',
    icon: '🌐',
    metrics: ['From €499 setup', 'Mobile-first design', 'SEO-optimized'],
    href: '/websites/',
    color: '#10b981',
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    subtitle: 'Connect your tools. Automate your busywork.',
    description: 'Custom n8n-powered automations that connect your CRM, email, scheduling, invoicing, and more. Stop copy-pasting between tabs — let workflows handle the repetitive work.',
    icon: '⚡',
    metrics: ['Save 10-20 hrs/week', 'Custom integrations', 'Self-hosted & private'],
    href: '/automation/',
    color: '#f59e0b',
  },
  {
    id: 'aec',
    title: 'AEC Tech AI',
    subtitle: 'AI-powered automation for architecture, engineering & construction',
    description: 'Document automation, cost estimation, and compliance checking built for AEC firms. Streamline RFIs, submittals, and project documentation with domain-specific AI workflows.',
    icon: '🏗️',
    metrics: ['40% faster documentation', 'Reduced rework costs', 'BIM integration'],
    href: '/aec/',
    color: '#6366f1',
  },
];

function Header() {
  return (
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <div class="logo">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">AI Native Consulting</span>
          </div>
          <nav class="nav">
            <a href="#services">Services</a>
            <a href="#about">About</a>
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
        <h1>AI that works for your business — <span class="gradient">not the other way around.</span></h1>
        <p class="hero-sub">
          We build intelligent automation systems for small and medium businesses.
          Lead generation, websites, workflows, and industry-specific solutions —
          powered by AI, delivered with clarity.
        </p>
        <div class="hero-actions">
          <a href="#services" class="btn btn-primary">Explore Services</a>
          <a href="#contact" class="btn btn-secondary">Free Consultation</a>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }) {
  return (
    <a href={service.href} class="service-card" style={{ '--card-accent': service.color }}>
      <div class="card-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p class="card-subtitle">{service.subtitle}</p>
      <p class="card-desc">{service.description}</p>
      <ul class="card-metrics">
        {service.metrics.map(m => <li>{m}</li>)}
      </ul>
      <span class="card-cta">Learn more →</span>
    </a>
  );
}

function Services() {
  return (
    <section id="services" class="section services">
      <div class="container">
        <div class="section-header">
          <h2>What We Build</h2>
          <p>Four service lines. One mission: make AI accessible and profitable for real businesses.</p>
        </div>
        <div class="services-grid">
          {services.map(s => <ServiceCard service={s} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Discovery', desc: 'We learn your business, your pain points, and where automation delivers the biggest ROI.' },
    { num: '02', title: 'Build', desc: 'Our crew designs and implements the solution — AI models, workflows, integrations, content.' },
    { num: '03', title: 'Deploy', desc: 'Go live with full documentation and handoff. We stay on for support and iteration.' },
    { num: '04', title: 'Optimize', desc: 'Ongoing refinement based on real data. Your system gets smarter over time.' },
  ];
  return (
    <section class="section how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>How It Works</h2>
          <p>From first call to live system — clarity at every step.</p>
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
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" class="section contact">
      <div class="container">
        <div class="section-header">
          <h2>Let's Talk</h2>
          <p>Tell us about your business and we'll show you where AI can make the biggest impact.</p>
        </div>
        <form class="contact-form" onSubmit={handleSubmit}>
          <div class="form-row">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onInput={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onInput={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <textarea
            placeholder="Tell us about your business and what you'd like to automate..."
            rows={5}
            value={form.message}
            onInput={e => setForm({ ...form, message: e.target.value })}
          />
          <button type="submit" class="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Get a Free Consultation'}
          </button>
          {status === 'success' && <p class="form-success">Thanks! We'll be in touch within 24 hours.</p>}
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
          <div class="footer-brand">
            <span class="logo-icon">⚡</span>
            <span>AI Native Consulting</span>
          </div>
          <p class="footer-copy">Intelligent automation for modern business.</p>
          <p class="footer-legal">© 2026 AI Native Consulting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <Contact />
      <Footer />
    </>
  );
}

render(<App />, document.getElementById('app'));
