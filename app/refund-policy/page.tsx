import { HeaderIfVisible, FooterIfVisible } from '../../components/ChromeVisibility';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Refund & Billing Policy',
  description: 'Refund and billing terms for Unifyn subscriptions and purchases, including App Store and Google Play handling.',
  openGraph: {
    title: 'Refund & Billing Policy | Unifyn',
    description: 'How refunds, trials, cancellations, and billing are handled for Unifyn subscriptions and in-app purchases.',
    url: 'https://unifyn.ai/refund-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Refund & Billing Policy | Unifyn',
    description: 'Refunds, trials, cancellations, taxes, and billing methods for Unifyn.',
  },
  alternates: {
    canonical: 'https://unifyn.ai/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <HeaderIfVisible />
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="p-8 lg:p-12 max-w-none" role="article" aria-labelledby="refund-heading">
            <h1 id="refund-heading" className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Refund & Billing Policy</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">1. Subscriptions</h2><p>Paid features may be offered via subscription. Subscriptions renew automatically unless cancelled. You can manage or cancel your subscription at any time; access remains until the end of the current billing period.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">2. Free Trials</h2><p>If a free trial is offered, your subscription will begin automatically at the end of the trial unless you cancel before the trial ends. We will disclose the length of the trial and the price before you start.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">3. Refunds for Website Purchases</h2><p>For subscriptions purchased via our website, refunds may be granted at our reasonable discretion within 14 days of the first payment if you have not materially used paid features. Renewal payments are generally non‑refundable. Contact <a href="mailto:support@unifyn.ai" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">support@unifyn.ai</a>.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">4. App Store & Google Play Purchases</h2><p>If you subscribed via the Apple App Store or Google Play, refunds are managed by Apple or Google under their respective policies. Please contact Apple Support or Google Play Support directly for refund requests.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">5. Taxes</h2><p>Fees are exclusive of applicable taxes, which may be charged depending on your location and regulations.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">6. Billing Issues</h2><p>If you experience a billing issue (duplicate charges, incorrect amount, etc.), reach out to <a href="mailto:support@unifyn.ai" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">support@unifyn.ai</a> and we will investigate promptly.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">7. Changes</h2><p>We may update this policy to reflect changes to our offerings or legal requirements. Material changes will be communicated where appropriate.</p></section>
            </div>
          </article>
        </div>
      </main>
      <FooterIfVisible />
    </>
  );
}


