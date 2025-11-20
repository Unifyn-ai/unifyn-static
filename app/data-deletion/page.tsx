import { HeaderIfVisible, FooterIfVisible } from '../../components/ChromeVisibility';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Data Deletion Instructions',
  description: 'How to delete your Unifyn account and data, and how to revoke Google access.',
  openGraph: {
    title: 'Data Deletion | Unifyn',
    description: 'Step-by-step instructions to delete your data and revoke integrations (including Google).',
    url: 'https://unifyn.ai/data-deletion',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Data Deletion | Unifyn',
    description: 'Instructions for deleting your account and revoking Google permissions.',
  },
  alternates: {
    canonical: 'https://unifyn.ai/data-deletion',
  },
};

export default function DataDeletionPage() {
  return (
    <>
      <HeaderIfVisible />
      <main id="content" className="relative pt-28 pb-12" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="p-8 lg:p-12 max-w-none" role="article" aria-labelledby="deletion-heading">
            <h1 id="deletion-heading" className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Data Deletion Instructions</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8" role="contentinfo">Last updated: November 16, 2025</p>
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">1. Delete Your Unifyn Account</h2><ol className="list-decimal pl-6 space-y-2"><li>Sign in to your Unifyn account.</li><li>Navigate to Settings → Account.</li><li>Select <strong>Delete Account</strong> and follow the confirmation steps.</li></ol><p>Account deletion permanently removes your personal data, access tokens, and associated records, subject to limited retention required by law.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">2. Disconnect Integrations</h2><p>Before deletion, disconnect any integrations you enabled (e.g., brokers, Google). Go to Settings → Integrations and select <strong>Disconnect</strong> for each integration.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">3. Revoke Google Access</h2><ol className="list-decimal pl-6 space-y-2"><li>Visit <a href="https://myaccount.google.com/permissions" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">myaccount.google.com/permissions</a>.</li><li>Find <strong>Unifyn</strong> in the list of third‑party apps.</li><li>Select <strong>Remove Access</strong> to revoke permissions.</li></ol><p>Revoking access invalidates Unifyn’s tokens and prevents further access to your Google data.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">4. Export Your Data (Optional)</h2><p>Before deletion, you may export your data (e.g., ledger CSV). Go to Settings → Export and follow the prompts.</p></section>
              <section><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">5. Need Help?</h2><p>If you cannot access your account or need assistance, email <a href="mailto:legal@unifyn.ai" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">legal@unifyn.ai</a>. We will verify your identity and process your request.</p></section>
            </div>
          </article>
        </div>
      </main>
      <FooterIfVisible />
    </>
  );
}


