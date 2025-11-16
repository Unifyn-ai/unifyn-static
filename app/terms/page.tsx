import { use } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms of Use for Unifyn by Infigon Electric Pvt Ltd. Read the terms governing your use of our website, web app, subscriptions, payments, mobile apps (iOS/Android), and integrations.',
  keywords: [
    'Unifyn Terms of Use',
    'Infigon Electric Pvt Ltd',
    'subscriptions and billing',
    'mobile app EULA',
    'acceptable use',
    'refund policy',
  ],
  openGraph: {
    title: 'Terms of Use | Unifyn',
    description: 'Terms governing use of Unifyn across web and mobile, including payments and integrations.',
    url: 'https://unifyn.trade/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Use | Unifyn',
    description: 'Terms for using Unifyn, subscriptions, payments, mobile apps, and integrations.',
  },
  alternates: {
    canonical: 'https://unifyn.trade/terms',
  },
};

export default function TermsPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = props.searchParams ? use(props.searchParams) : {};
  const sourceParamRaw = Array.isArray(searchParams?.source) ? searchParams.source[0] : searchParams?.source;
  const hideChrome = typeof sourceParamRaw === 'string' && sourceParamRaw.toLowerCase() === 'mobile';
  return (
    <>
      {!hideChrome && <Header />}
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="p-8 lg:p-12 max-w-none" role="article" aria-labelledby="terms-heading">
            <h1 id="terms-heading" className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Terms & Conditions</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">1. Acceptance of Terms</h2><p>These Terms govern your access to and use of Unifyn’s website, web application, and mobile apps (iOS/Android) operated by <strong>Infigon Electric Pvt Ltd</strong> ("Unifyn", "we", "our", "us"). By accessing or using Unifyn, you agree to these Terms. If you do not agree, do not use our services.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">2. Our Services</h2><p>Unifyn provides a unified interface that may connect to third‑party services you choose (e.g., stock brokers or productivity integrations). Unifyn is <strong>not</strong> a stock broker and does not execute trades itself; any trades occur via your linked broker under their terms.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">3. Accounts & Eligibility</h2><ul className="list-disc pl-6 space-y-2"><li>You must be at least 18 years old to use Unifyn.</li><li>You are responsible for the security of your account and for any activity under it.</li><li>Provide accurate, current information and keep it updated.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">4. Subscriptions, Payments & Billing</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Subscriptions:</strong> Some features require a paid subscription that auto‑renews until cancelled.</li><li><strong>Billing:</strong> You authorize us and our payment processor (e.g., Stripe) to charge your payment method for subscription fees, applicable taxes, and any in‑app purchases permitted by your platform.</li><li><strong>Trials:</strong> If offered, trials convert to paid unless you cancel before the trial ends.</li><li><strong>Cancellation:</strong> You can cancel at any time; access continues until the end of the billing period.</li><li><strong>Refunds:</strong> Refunds are governed by our <a href="/refund-policy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Refund & Billing Policy</a>. For purchases made via the Apple App Store or Google Play, refunds are handled by those platforms under their policies.</li><li><strong>Taxes:</strong> Fees are exclusive of taxes; you are responsible for applicable taxes.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">5. Third‑Party Services & Integrations</h2><p>When you connect third‑party services (e.g., brokers or Google), you authorize Unifyn to access and process data as permitted by you to provide the requested features. Third‑party terms and privacy policies apply to their services.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">6. Acceptable Use</h2><ul className="list-disc pl-6 space-y-2"><li>Do not misuse, reverse engineer, disrupt, or attempt unauthorized access to Unifyn.</li><li>Do not use Unifyn to violate laws, infringe rights, or transmit harmful or unlawful content.</li><li>Comply with any applicable third‑party terms when using integrations.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">7. Intellectual Property</h2><p>Unifyn and its content are protected by intellectual property laws. Subject to your compliance with these Terms, we grant you a limited, non‑exclusive, non‑transferable, revocable license to use Unifyn. All rights not expressly granted are reserved by Unifyn.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">8. No Investment Advice</h2><p>Unifyn does not provide investment, legal, or tax advice. Information may be for informational purposes only. You are solely responsible for your decisions and use of information.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">9. Disclaimers</h2><p>Unifyn is provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non‑infringement. We do not warrant uninterrupted, secure, or error‑free operation.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">10. Limitation of Liability</h2><p>To the maximum extent permitted by law, Unifyn and its affiliates shall not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, data, or use, arising from your use of Unifyn. Our aggregate liability shall not exceed the amount you paid to Unifyn in the 3 months preceding the event giving rise to the claim.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">11. Indemnification</h2><p>You agree to defend, indemnify, and hold harmless Unifyn from claims arising from your use of Unifyn or violation of these Terms, except to the extent caused by our willful misconduct.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">12. Termination</h2><p>We may suspend or terminate access if you violate these Terms or for other legitimate reasons (e.g., security risks, non‑payment). Upon termination, your right to use Unifyn ends, but sections that by their nature should survive will survive (e.g., IP, disclaimers, limitations, indemnity).</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">13. Mobile Apps & App Store Terms</h2><ul className="list-disc pl-6 space-y-2"><li><strong>License:</strong> Subject to these Terms, we grant a limited, non‑transferable license to install and use our mobile apps on devices you own or control.</li><li><strong>Apple:</strong> If you download from the App Store, you agree to Apple’s terms; Apple is not responsible for support or warranties except as required by law. You acknowledge Apple’s standard EULA applies to your use.</li><li><strong>Google:</strong> If you download from Google Play, you agree to Google Play’s terms; Google is not responsible for support or warranties except as required by law.</li><li>See our dedicated <a href="/eula" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Mobile App EULA</a> for additional end‑user license terms.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">14. Changes to Terms</h2><p>We may update these Terms to reflect changes to our services or legal requirements. If changes are material, we will provide reasonable notice (e.g., in‑product notice). Your continued use after changes take effect constitutes acceptance.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">15. Governing Law & Disputes</h2><p>These Terms are governed by applicable laws. Courts with appropriate jurisdiction will have exclusive jurisdiction over disputes, subject to any mandatory consumer rights under applicable law.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">16. Contact</h2><p>For questions about these Terms, email <a href="mailto:legal@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">legal@unifyn.trade</a>. For privacy matters, see our <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Privacy Policy</a>.</p></section>
            </div>
          </article>
        </div>
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}


