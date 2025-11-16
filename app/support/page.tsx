import { use } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with Unifyn: contact support, billing, refunds, and app store assistance.',
  openGraph: {
    title: 'Support | Unifyn',
    description: 'Contact Unifyn support for technical help, billing, refunds, and app store inquiries.',
    url: 'https://unifyn.trade/support',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Support | Unifyn',
    description: 'How to get help with Unifyn across web and mobile apps.',
  },
  alternates: {
    canonical: 'https://unifyn.trade/support',
  },
};

export default function SupportPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = props.searchParams ? use(props.searchParams) : {};
  const sourceParamRaw = Array.isArray(searchParams?.source) ? searchParams.source[0] : searchParams?.source;
  const hideChrome = typeof sourceParamRaw === 'string' && sourceParamRaw.toLowerCase() === 'mobile';
  return (
    <>
      {!hideChrome && <Header />}
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="p-8 lg:p-12 max-w-none" role="article" aria-labelledby="support-heading">
            <h1 id="support-heading" className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Support</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Contact Us</h2><ul className="list-disc pl-6 space-y-2"><li><strong>General Support:</strong> <a href="mailto:support@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">support@unifyn.trade</a></li><li><strong>Billing & Refunds:</strong> <a href="mailto:billing@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">billing@unifyn.trade</a></li><li><strong>Privacy:</strong> <a href="mailto:privacy@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">privacy@unifyn.trade</a></li><li><strong>Legal:</strong> <a href="mailto:legal@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">legal@unifyn.trade</a></li></ul><p>Address: Bengaluru, Karnataka</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">App Store & Google Play Support</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Apple App Store:</strong> For subscriptions purchased via Apple, manage your subscription and request refunds via your Apple ID settings. Apple handles refunds under its policies.</li><li><strong>Google Play:</strong> For subscriptions via Google Play, manage your subscription and request refunds via your Google account. Google handles refunds under its policies.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Self‑Service Links</h2><ul className="list-disc pl-6 space-y-2"><li><a href="/refund-policy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Refund & Billing Policy</a></li><li><a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Privacy Policy</a></li><li><a href="/terms" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Terms of Use</a></li><li><a href="/data-deletion" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Data Deletion</a></li><li><a href="/cookie-policy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Cookie Policy</a></li><li><a href="/eula" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Mobile App EULA</a></li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">Grievance Redressal (India)</h2><p>If you have concerns about content or use of your data, please email our Grievance Officer at <a href="mailto:grievance@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">grievance@unifyn.trade</a>. We will acknowledge and address complaints in accordance with applicable laws.</p></section>
            </div>
          </article>
        </div>
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}


