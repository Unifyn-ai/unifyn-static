'use client';

import { SHOW_BROKER_UI } from '../../app/config';

export function ConnectBrokerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70 sm:backdrop-blur-md" data-close-modal></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg border border-slate-200 dark:border-slate-700/50 sm:backdrop-blur-xl transition-all duration-300 sm:transform ${open ? 'sm:scale-100' : 'sm:scale-95'}`}>
          <button onClick={onClose} data-close-modal className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-slate-800/50 hover:bg-black/10 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex items-center justify-center group" aria-label="Close">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div className="relative px-8 py-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Connect your broker</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Secure, OAuth-style connection to your existing broker account. We never see your password.</p>
            </div>
            <div className="space-y-4">
              {SHOW_BROKER_UI ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 px-5 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">Broker connections are rolling out. Choose your broker in-app when available.</p>
                  <div className="mt-4 flex justify-end">
                    <button data-close-modal className="rounded-lg px-4 py-2 text-sm font-semibold bg-cyan-700 text-white hover:bg-cyan-800 transition-colors">OK</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 px-5 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">Broker integrations are coming soon. Join the early access list to get notified.</p>
                  <div className="mt-4 flex justify-end">
                    <button data-open-modal="signup" className="rounded-lg px-4 py-2 text-sm font-semibold bg-cyan-700 text-white hover:bg-cyan-800 transition-colors">Get early access</button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><svg className="w-5 h-5 text-cyan-500/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg></div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Your credentials are handled directly by your broker. Unifyn never has access to your password. Read our <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Privacy Policy</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










