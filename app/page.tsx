'use client';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SHOW_BROKER_UI } from './config';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [hideChrome, setHideChrome] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check regular query string first
      let params = new URLSearchParams(window.location.search);
      let sourceParam = params.get('source')?.toLowerCase();
      
      // If not found, check hash for query parameters (e.g., #contact?source=mobile)
      if (!sourceParam && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        params = new URLSearchParams(hashQuery);
        sourceParam = params.get('source')?.toLowerCase();
      }
      
      setHideChrome(sourceParam === 'mobile');
    }
  }, []);

  // FAQ Structured Data for AEO
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a unified finance superapp?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A unified finance superapp like Unifyn brings together multiple financial services into one seamless platform. It is designed to connect your existing broker accounts and manage trading, analytics, and portfolio from a single, unified interface.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does broker agnostic trading mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Broker agnostic trading means you can use a single platform regardless of which stock broker you use. Unifyn is a broker agnostic trading app that connects to multiple brokers simultaneously, giving you freedom to choose any broker while enjoying a consistent trading experience.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Unifyn enable unified finance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Unifyn is designed to securely connect to your existing broker accounts via OAuth-style authentication. You can trade, view analytics, manage your portfolio, and access consolidated reports from one unified interface.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which brokers does this broker agnostic platform support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Support for leading brokers worldwide is planned. Specific broker integrations will be announced after they go live. No broker integrations are live yet.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Unifyn a stock broker?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, Unifyn is not a stock broker. We are a unified finance superapp and broker agnostic trading platform that connects to your existing broker accounts. All trades are executed through your registered broker\'s API under their terms and regulations.',
        },
      },
      {
        '@type': 'Question',
        name: 'How secure is the unified finance platform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Unifyn uses industry-leading security practices including OAuth-based authentication (we never store broker passwords), end-to-end encryption, HTTPS for all communications, and scoped permissions. Your data is encrypted at rest and we follow strict privacy-first principles for our unified finance platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the benefits of using a broker agnostic trading app?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Benefits include: unified view of all your portfolios across brokers, consolidated P&L and analytics, single interface for trading, better portfolio management, simplified tax reporting, and freedom to choose brokers based on features rather than being locked into one app.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--hero-radial-from)] via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--hero-glow-from)] to-[var(--hero-glow-to)] blur-3xl"></div>
        </div>
        <div className="absolute top-20 left-1/4 w-1 h-1 bg-[var(--hero-star)] rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-[var(--hero-star)] rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[var(--hero-star-accent)] rounded-full"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[var(--hero-star)] rounded-full"></div>
      </div>
      {!hideChrome && <Header />}
      <main id="content" className="relative pt-20 md:pt-24" role="main">
        <section aria-labelledby="hero-heading" className="min-h-screen flex items-center justify-center pb-12">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-badge-border)] bg-[var(--hero-badge-bg)] px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-[var(--hero-badge-text)] mb-6 sm:mb-8 backdrop-blur-sm" role="banner">
              <span aria-label="Global unified finance platform" className="leading-tight">Global unified finance platform - broker‑agnostic</span>
            </div>
            <h1 id="hero-heading" className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-heading)] mb-4 sm:mb-6 leading-tight">
              Unified Finance Superapp<br/>
              <span className="text-[var(--hero-accent)]">Broker Agnostic Trading</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-muted)] mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Experience <strong>unified finance</strong> with a global, <strong>broker agnostic trading app</strong>. Connect your existing broker accounts in one seamless interface for trading, analytics and ledger management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4" role="group" aria-label="Call to action buttons">
              {SHOW_BROKER_UI && (
                <button 
                  data-open-modal="connect-broker" 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                  aria-label="Connect your broker to unified finance platform"
                >
                  Connect your broker
                </button>
              )}
              <button 
                data-open-modal="signup" 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold border border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)] backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                aria-label="Get early access to broker agnostic trading app"
              >
                Get early access
              </button>
            </div>
            <p className="mt-6 sm:mt-8 text-xs text-[var(--color-muted)] max-w-2xl mx-auto px-4 leading-relaxed" role="note">
              <strong>Disclaimer:</strong> Unifyn is not a stock broker. Market investments are subject to risks. No broker integrations are live yet.
            </p>
            <div className="mt-12 sm:mt-16">
              <p className="text-xs sm:text-sm text-[var(--color-muted)] mb-3 sm:mb-4 px-4">Built for everyone. Broker-agnostic unified finance app.</p>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="pt-24 md:pt-28 pb-10 sm:pb-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-6 sm:mb-8">
              <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-heading)] mb-3 sm:mb-4 px-2">
                Unified Finance Platform Features
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed px-2">
                Experience <strong>broker agnostic trading</strong> with our <strong>unified finance superapp</strong>. Designed to connect your existing broker accounts in one app. Get unified trading analytics with fast, keyboard‑first execution.
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-3" role="img" aria-label="Unified Login Icon">🔗</div>
                <h3 className="font-semibold text-[var(--color-heading)] mb-2 text-base sm:text-lg">Unified Login</h3>
                <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Connect multiple brokers through our <strong>broker agnostic platform</strong> and use a single, consistent interface for all your trading needs.</p>
              </article>
              <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-3" role="img" aria-label="Smart Trading Icon">⚡</div>
                <h3 className="font-semibold text-[var(--color-heading)] mb-2 text-base sm:text-lg">Smart Trading</h3>
                <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Lightning-fast, keyboard‑first order entry and quick actions for seamless <strong>unified finance</strong> trading experience.</p>
              </article>
              <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-3" role="img" aria-label="Analytics Icon">📊</div>
                <h3 className="font-semibold text-[var(--color-heading)] mb-2 text-base sm:text-lg">Deep Analytics</h3>
                <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Comprehensive P&L tracking, win/loss analysis, heatmaps, and segment insights across all connected brokers.</p>
              </article>
              <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-3" role="img" aria-label="Ledger Icon">📑</div>
                <h3 className="font-semibold text-[var(--color-heading)] mb-2 text-base sm:text-lg">Ledger & Taxes</h3>
                <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Broker‑synced ledger statements with CSV export for easy tax filing and portfolio management.</p>
              </article>
              <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-3" role="img" aria-label="Alerts Icon">🔔</div>
                <h3 className="font-semibold text-[var(--color-heading)] mb-2 text-base sm:text-lg">Real-time Alerts</h3>
                <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Customizable price and event alerts via email or push notifications to never miss trading opportunities.</p>
              </article>
              <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-3" role="img" aria-label="Customization Icon">🎛️</div>
                <h3 className="font-semibold text-[var(--color-heading)] mb-2 text-base sm:text-lg">Full Customization</h3>
                <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Personalize themes, layouts, and keyboard shortcuts to create your perfect <strong>unified finance</strong> workspace.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="security" aria-labelledby="security-heading" className="pt-24 md:pt-28 pb-10 sm:pb-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-6 sm:mb-8">
              <h2 id="security-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-heading)] mb-3 sm:mb-4 px-2">
                Security & Compliance
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-2xl mx-auto px-2 leading-relaxed">
                Your security is our top priority. Our <strong>unified finance platform</strong> uses industry-leading security practices to keep your data safe.
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
              <article className="flex gap-3 sm:gap-4">
                <div className="text-cyan-400 text-xl sm:text-2xl shrink-0" aria-hidden="true">✓</div>
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] mb-1 sm:mb-2 text-base sm:text-lg">Zero Password Storage</h3>
                  <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">You log in directly at your broker via secure OAuth authentication. We never store your broker passwords.</p>
                </div>
              </article>
              <article className="flex gap-3 sm:gap-4">
                <div className="text-cyan-400 text-xl sm:text-2xl shrink-0" aria-hidden="true">✓</div>
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] mb-1 sm:mb-2 text-base sm:text-lg">Scoped Permissions</h3>
                  <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Only read/write trading access that you explicitly approve through our <strong>broker agnostic platform</strong>.</p>
                </div>
              </article>
              <article className="flex gap-3 sm:gap-4">
                <div className="text-cyan-400 text-xl sm:text-2xl shrink-0" aria-hidden="true">✓</div>
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] mb-1 sm:mb-2 text-base sm:text-lg">End-to-End Encryption</h3>
                  <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">HTTPS encryption in transit and AES-256 encryption at rest for all stored data and artifacts.</p>
                </div>
              </article>
              <article className="flex gap-3 sm:gap-4">
                <div className="text-cyan-400 text-xl sm:text-2xl shrink-0" aria-hidden="true">✓</div>
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] mb-1 sm:mb-2 text-base sm:text-lg">Privacy-First Analytics</h3>
                  <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">Analytics only with your explicit consent. No invasive tracking or data selling in our <strong>unified finance superapp</strong>.</p>
                </div>
              </article>
            </div>
            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[var(--color-muted)] px-4 leading-relaxed" role="note">
              <strong>Disclaimer:</strong> Unifyn is not a stock broker and does not provide investment advice. Market investments are subject to risks.
            </p>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-heading" className="py-10 sm:py-12 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-6 sm:mb-8">
              <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-heading)] mb-3 sm:mb-4 px-2">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-muted)] px-2 leading-relaxed">
                Everything you need to know about our <strong>unified finance superapp</strong> and <strong>broker agnostic trading platform</strong>.
              </p>
            </header>
            <div className="space-y-3 sm:space-y-4">
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>What is a unified finance superapp?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  A <strong>unified finance superapp</strong> like Unifyn brings together multiple financial services and brokers into one seamless platform. It allows you to connect different stock brokers (Angel One, Zerodha, Upstox, etc.) and manage all your trading, analytics, and portfolio from a single, unified interface.
                </p>
              </details>
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>What does broker agnostic trading mean?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  <strong>Broker agnostic trading</strong> means you can use a single platform regardless of which stock broker you use. Unifyn is a <strong>broker agnostic trading app</strong> that connects to multiple brokers simultaneously, giving you freedom to choose any broker while enjoying a consistent trading experience.
                </p>
              </details>
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>How does Unifyn enable unified finance?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  Unifyn enables <strong>unified finance</strong> by securely connecting to your existing broker accounts via OAuth authentication. You can then trade, view analytics, manage your portfolio, and access consolidated reports all from one unified interface, eliminating the need to switch between different broker apps.
                </p>
              </details>
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>Which brokers does this broker agnostic platform support?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  Unifyn plans to support major brokers across regions. As a <strong>broker agnostic trading app</strong>, we continue to add more integrations to provide comprehensive <strong>unified finance</strong> coverage. Specific broker integrations will be announced after they go live.
                </p>
              </details>
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>Is Unifyn a stock broker?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  No, Unifyn is not a stock broker. We are a <strong>unified finance superapp</strong> and <strong>broker agnostic trading platform</strong> that connects to your existing broker accounts. All trades are executed through your registered broker's API under their terms and regulations.
                </p>
              </details>
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>How secure is the unified finance platform?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  Unifyn uses industry-leading security practices including OAuth-based authentication (we never store broker passwords), end-to-end encryption, HTTPS for all communications, and scoped permissions. Your data is encrypted at rest and we follow strict privacy-first principles for our <strong>unified finance platform</strong>.
                </p>
              </details>
              <details className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-6 hover:border-cyan-500/30 transition-colors group">
                <summary className="font-semibold text-[var(--color-heading)] text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>What are the benefits of using a broker agnostic trading app?</span>
                  <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  Benefits include: unified view of all your portfolios across brokers, consolidated P&L and analytics, single interface for trading, better portfolio management, simplified tax reporting, and freedom to choose brokers based on features rather than being locked into one app.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="pt-24 md:pt-28 pb-10 sm:pb-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <header className="text-center mb-6 sm:mb-8">
                <h2 id="contact-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-heading)] mb-3 sm:mb-4 px-2">Contact Us</h2>
                <p className="text-base sm:text-lg text-[var(--color-muted)] px-2 leading-relaxed">Support, partnerships, media — we're here to help.</p>
              </header>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm p-5 sm:p-8">
                <form className="space-y-4 sm:space-y-5" aria-label="Contact form">
                  <div>
                    <label htmlFor="name" className="block text-sm sm:text-base font-medium text-[var(--color-muted)] mb-2">
                      Name <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input 
                      id="name" 
                      name="name" 
                      type="text"
                      required
                      aria-required="true"
                      className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm sm:text-base font-medium text-[var(--color-muted)] mb-2">
                      Email <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email"
                      required
                      aria-required="true"
                      className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm sm:text-base font-medium text-[var(--color-muted)] mb-2">
                      Message <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      required
                      aria-required="true"
                      className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all resize-none" 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full rounded-full px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                    aria-label="Send message to Unifyn"
                  >
                    Send message
                  </button>
                </form>
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[var(--card-border)]">
                  <p className="text-sm sm:text-base text-[var(--color-muted)]">
                    Prefer email? <a href="mailto:support@unifyn.ai" className="text-[var(--hero-accent)] hover:opacity-90 transition-colors underline break-all">support@unifyn.ai</a>
                  </p>
                  {/* <address className="mt-2 not-italic text-sm sm:text-base text-[var(--color-muted)]">
                    Bengaluru, Karnataka
                  </address> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}


