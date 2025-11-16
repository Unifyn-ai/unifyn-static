import { use } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for Unifyn by Infigon Electric Pvt Ltd. Learn what cookies we use, why we use them, and how you can control your preferences.',
  openGraph: {
    title: 'Cookie Policy | Unifyn',
    description: 'Details on cookies and similar technologies used by Unifyn and how to manage your preferences.',
    url: 'https://unifyn.trade/cookie-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | Unifyn',
    description: 'What cookies we use and how to control your preferences.',
  },
  alternates: {
    canonical: 'https://unifyn.trade/cookie-policy',
  },
};

export default function CookiePolicyPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = props.searchParams ? use(props.searchParams) : {};
  const sourceParamRaw = Array.isArray(searchParams?.source) ? searchParams.source[0] : searchParams?.source;
  const hideChrome = typeof sourceParamRaw === 'string' && sourceParamRaw.toLowerCase() === 'mobile';
  return (
    <>
      {!hideChrome && <Header />}
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 lg:p-12 prose prose-invert prose-slate max-w-none" role="article" aria-labelledby="cookie-heading">
            <h1 id="cookie-heading" className="text-4xl font-bold text-white mb-2">Cookie Policy</h1>
            <p className="text-sm text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-300">
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. What Are Cookies?</h2><p>Cookies are small text files placed on your device by websites and apps you visit. They are widely used to make websites work, improve efficiency, and provide information to service owners.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How Unifyn Uses Cookies</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Strictly Necessary Cookies:</strong> Required for core functionality such as authentication and session management.</li><li><strong>Preference Cookies:</strong> Remember your theme and locale settings.</li><li><strong>Analytics Cookies:</strong> Help us understand usage patterns to improve our products (enabled only with your consent where required).</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Analytics</h2><p>We may use privacy‑respecting analytics (e.g., GA4 or Plausible). Where required, analytics cookies are only set after your consent. You can withdraw consent at any time by adjusting your browser settings or opting out within our app (if available).</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Managing Cookies</h2><ul className="list-disc pl-6 space-y-2"><li>Browser controls allow you to block or delete cookies. Note that disabling essential cookies may affect core functionality.</li><li>For Google Analytics, you can use the opt‑out browser add‑on provided by Google.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Changes</h2><p>We may update this Cookie Policy to reflect changes in our practices or legal requirements. Material changes will be communicated via in‑product notice where appropriate.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Contact</h2><p>Questions? Contact <a href="mailto:privacy@unifyn.trade" className="text-cyan-400 hover:text-cyan-300">privacy@unifyn.trade</a>.</p></section>
            </div>
          </article>
        </div>
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}


