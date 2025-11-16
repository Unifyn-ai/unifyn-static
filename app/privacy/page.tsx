import { use } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Unifyn by Infigon Electric Pvt Ltd. How we collect, use, store, and share information across the website, web app, and mobile apps (iOS/Android), including Google user data, payments, analytics, and security practices.',
  keywords: [
    'Unifyn Privacy Policy',
    'Infigon Electric Pvt Ltd',
    'Google user data',
    'OAuth disclosure',
    'mobile app privacy',
    'payments privacy',
    'cookie policy',
    'data deletion',
  ],
  openGraph: {
    title: 'Privacy Policy | Unifyn',
    description: 'How Unifyn collects, uses, stores, and shares data across website, web app, and mobile apps.',
    url: 'https://unifyn.trade/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Unifyn',
    description: 'Learn how we protect your data and handle Google user data, payments, and analytics.',
  },
  alternates: {
    canonical: 'https://unifyn.trade/privacy',
  },
};

export default function PrivacyPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = props.searchParams ? use(props.searchParams) : {};
  const sourceParamRaw = Array.isArray(searchParams?.source) ? searchParams.source[0] : searchParams?.source;
  const hideChrome = typeof sourceParamRaw === 'string' && sourceParamRaw.toLowerCase() === 'mobile';
  return (
    <>
      {!hideChrome && <Header />}
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 lg:p-12 prose prose-invert prose-slate max-w-none" role="article" aria-labelledby="privacy-heading">
            <h1 id="privacy-heading" className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-300">
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Who We Are</h2><p>Unifyn is operated by <strong>Infigon Electric Pvt Ltd</strong> ("Unifyn", "we", "our", "us"). This Privacy Policy explains how we collect, use, store, and share information when you use our website, web application, and mobile applications (iOS and Android).</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Scope</h2><p>This policy applies to <a href="https://unifyn.trade" className="text-cyan-400 hover:text-cyan-300">unifyn.trade</a>, our web app, and our mobile apps available on the Apple App Store and Google Play Store. It also covers in-product notices and any integrations you choose to connect (e.g., brokers, Google services).</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Information We Collect</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Account Information:</strong> Name (if provided), email address, authentication identifiers, and settings.</li><li><strong>Payment & Billing:</strong> Billing name, email, and limited payment metadata. <em>Card details are processed by our payment processor (e.g., Stripe) and are not stored on Unifyn systems.</em></li><li><strong>Usage & Diagnostics:</strong> Device information, IP address, browser type, app version, pages viewed, and feature interactions.</li><li><strong>Cookies & Similar Technologies:</strong> Session cookies and, where enabled, analytics cookies (see Cookie Policy).</li><li><strong>Third‑Party Integrations You Connect:</strong> If you connect a broker or other integration, we process the data necessary to provide that feature (e.g., tokens, account identifiers, and relevant data retrieved via the integration).</li><li><strong>Google User Data (when you connect Google):</strong> See section 4 for detailed disclosures.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Google User Data Disclosure</h2><p>If you choose to connect your Google account, Unifyn uses Google OAuth to request the minimum permissions needed for the specific feature you enable (principle of least privilege). Depending on your selection, we may request access to your basic profile (email, name) and, if you explicitly enable a feature, limited access to Google services such as Drive, Calendar, or Gmail.</p><ul className="list-disc pl-6 space-y-2"><li><strong>How We Use Google Data:</strong> Solely to provide the feature you requested within Unifyn (e.g., reading files you select from Drive, syncing calendar events you opt‑in to, or processing messages you explicitly action in Gmail).</li><li><strong>Storage:</strong> We store OAuth tokens to maintain your connection and minimal metadata needed for sync. Where feasible, we process Google content in memory and avoid storing content bodies unless you explicitly save content in Unifyn.</li><li><strong>Sharing:</strong> We do <strong>not</strong> sell Google user data. We do not share it with advertisers or data brokers. We only share with subprocessors necessary to operate the service (e.g., secure hosting) under strict agreements.</li><li><strong>Human Access:</strong> Human access to Google user data is disallowed except when necessary for security, debugging, abuse prevention, or when you request support; access is limited, audited, and revoked after resolution.</li><li><strong>Compliance:</strong> Unifyn’s use and transfer of information received from Google APIs adheres to the <a className="text-cyan-400 hover:text-cyan-300" href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the <strong>Limited Use</strong> requirements.</li><li><strong>Revocation:</strong> You can revoke Unifyn’s access at any time via your Google Account permissions and within Unifyn’s settings.</li><li><strong>Notice of Changes:</strong> If we materially change how we use Google data, we will update this Policy and provide in‑product notice.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Legal Bases for Processing</h2><p>Where applicable (e.g., the EU/UK), we process personal data under one or more of the following legal bases: performance of a contract (to deliver requested features), legitimate interests (to secure and improve our services), consent (for optional integrations and analytics), and compliance with legal obligations.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. How We Use Information</h2><ul className="list-disc pl-6 space-y-2"><li>Provide, operate, and maintain Unifyn (web and mobile).</li><li>Authenticate users and secure accounts.</li><li>Process subscriptions and payments.</li><li>Provide support, communicate updates, and notify about changes.</li><li>Monitor performance, debug issues, and improve features.</li><li>Comply with applicable laws and enforce our Terms.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Data Sharing and Subprocessors</h2><p>We do <strong>not</strong> sell personal data. We share information only with:</p><ul className="list-disc pl-6 space-y-2"><li><strong>Hosting & Infrastructure:</strong> Cloud providers and edge networks (e.g., Cloudflare) to host and deliver our services.</li><li><strong>Payments:</strong> Processors such as Stripe to handle payments, billing, and invoicing.</li><li><strong>Analytics & Telemetry:</strong> Privacy‑respecting analytics (e.g., GA4 or Plausible) and logging to understand usage and reliability (where enabled).</li><li><strong>Customer Support & Communications:</strong> Tools used to respond to your requests.</li><li><strong>Legal & Compliance:</strong> When required by law or to protect rights, safety, or integrity.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Security</h2><p>We implement industry‑standard measures, including:</p><ul className="list-disc pl-6 space-y-2"><li>TLS/HTTPS encryption in transit.</li><li>Encryption at rest for sensitive data (e.g., tokens, secrets).</li><li>Least‑privilege access controls and audit logging.</li><li>Segregation of environments and regular reviews.</li></ul></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Data Retention</h2><p>We retain data only for as long as necessary to provide services and for legitimate business or legal purposes. You may request deletion at any time (see Section 12). OAuth tokens and integration metadata are deleted when you disconnect an integration or delete your account.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Cookies & Analytics</h2><p>We use essential cookies for authentication and security. Where enabled, we use analytics to understand product usage. You can manage preferences in your browser and via our Cookie Policy.</p><p>See our <a href="/cookie-policy" className="text-cyan-400 hover:text-cyan-300">Cookie Policy</a> for details.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Your Rights</h2><p>Depending on your location, you may have rights to access, correct, delete, or export your data; object to or restrict certain processing; and withdraw consent. California residents have additional rights under the CPRA. We do not sell or share personal information for cross‑context behavioral advertising.</p><p>Contact <a href="mailto:privacy@unifyn.trade" className="text-cyan-400 hover:text-cyan-300">privacy@unifyn.trade</a> to exercise rights or with questions.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Data Deletion</h2><p>You can request account and data deletion at any time. See <a href="/data-deletion" className="text-cyan-400 hover:text-cyan-300">Data Deletion</a> for step‑by‑step instructions. You can also revoke Google permissions in your Google Account settings.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. International Transfers</h2><p>Your information may be processed in locations where we and our providers operate. We use appropriate safeguards for cross‑border transfers where required by law.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">14. Children’s Privacy</h2><p>Unifyn is intended for individuals 18 years and older. We do not knowingly collect data from children. If you believe a child has provided us information, contact us and we will take appropriate action.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">15. Changes to This Policy</h2><p>We may update this Policy to reflect changes in our practices or legal obligations. If we materially change how we use Google user data or other sensitive data, we will provide in‑product notice and update the “Last updated” date.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">16. Contact</h2><p>For privacy questions or requests, email <a href="mailto:privacy@unifyn.trade" className="text-cyan-400 hover:text-cyan-300">privacy@unifyn.trade</a>. For legal notices, email <a href="mailto:legal@unifyn.trade" className="text-cyan-400 hover:text-cyan-300">legal@unifyn.trade</a>.</p></section>
              <section><h2 className="text-2xl font-semibold text-white mt-8 mb-4">17. Grievance Officer (India)</h2><p>If you have concerns regarding content or data use, contact our Grievance Officer at <a href="mailto:grievance@unifyn.trade" className="text-cyan-400 hover:text-cyan-300">grievance@unifyn.trade</a>. We will acknowledge and address complaints in accordance with applicable laws.</p></section>
            </div>
          </article>
        </div>
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}


