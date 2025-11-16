import { HeaderIfVisible, FooterIfVisible } from '../../components/ChromeVisibility';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Mobile App EULA',
  description: 'End User License Agreement (EULA) for Unifyn mobile apps on iOS and Android.',
  openGraph: {
    title: 'Mobile App EULA | Unifyn',
    description: 'License terms for using Unifyn mobile apps on Apple iOS and Google Android.',
    url: 'https://unifyn.trade/eula',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Mobile App EULA | Unifyn',
    description: 'End User License Agreement for Unifyn mobile apps.',
  },
  alternates: {
    canonical: 'https://unifyn.trade/eula',
  },
};

export default function EulaPage() {
  return (
    <>
      <HeaderIfVisible />
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="p-8 lg:p-12 max-w-none" role="article" aria-labelledby="eula-heading">
            <h1 id="eula-heading" className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Mobile App End User License Agreement (EULA)</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">1. Agreement</h2><p>This EULA is between you and <strong>Infigon Electric Pvt Ltd</strong> ("Unifyn") and governs your use of Unifyn’s mobile applications for Apple iOS and Google Android (the "Apps").</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">2. License</h2><p>Subject to the Terms of Use and this EULA, Unifyn grants you a limited, non‑exclusive, non‑transferable, non‑sublicensable, revocable license to install and use the Apps on devices you own or control for personal or internal business purposes.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">3. Restrictions</h2><ul className="list-disc pl-6 space-y-2"><li>Do not copy, modify, reverse engineer, or create derivative works of the Apps except as permitted by law.</li><li>Do not rent, lease, lend, sell, redistribute, or sublicense the Apps.</li><li>Use of the Apps must comply with applicable laws and third‑party terms.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">4. App Store/Google Play Terms</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Apple:</strong> If you obtained the App from the Apple App Store, you acknowledge that this EULA is between you and Unifyn, not Apple. Apple is not responsible for the App or its content, provides no warranty obligations beyond those required by law, and has no obligation to provide maintenance or support. In the event of a failure to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price (if any). Apple has no other warranty obligations. You must comply with the App Store Terms of Service.</li><li><strong>Google:</strong> If you obtained the App from Google Play, you must comply with the Google Play Terms of Service. Google is not responsible for support or warranty obligations except as required by law.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">5. Privacy</h2><p>Your use of the Apps is also governed by our <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Privacy Policy</a>, including disclosures about integrations and Google user data (if you choose to connect Google).</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">6. Updates</h2><p>We may from time to time provide updates or upgrades to the Apps, which may be automatically downloaded and installed. Updates are subject to this EULA unless accompanied by a separate license.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">7. Termination</h2><p>This EULA is effective until terminated. Your rights will terminate automatically if you breach the Terms of Use or this EULA. Upon termination, you must cease all use and delete the Apps from your devices.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">8. Disclaimer; Limitation of Liability</h2><p>The Apps are provided "as is" without warranties of any kind. To the maximum extent permitted by law, Unifyn disclaims all liability arising from your use of the Apps. See our <a href="/terms" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">Terms of Use</a> for more details.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">9. Contact</h2><p>Questions? Contact <a href="mailto:legal@unifyn.trade" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">legal@unifyn.trade</a>.</p></section>
            </div>
          </article>
        </div>
      </main>
      <FooterIfVisible />
    </>
  );
}


