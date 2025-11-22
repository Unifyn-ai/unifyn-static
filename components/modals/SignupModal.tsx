'use client';

export function SignupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get early access</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Be among the first to experience our global unified trading hub. No spam, unsubscribe anytime.</p>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              <div>
                <label htmlFor="signup-name" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Full Name</label>
                <input id="signup-name" name="name" type="text" placeholder="Enter your name" className="w-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all" />
              </div>
              <div>
                <label htmlFor="signup-email" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Email Address *</label>
                <input id="signup-email" name="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all" />
              </div>
              <div>
                <label htmlFor="signup-usecase" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Primary Use Case (Optional)</label>
                <select id="signup-usecase" name="usecase" className="w-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all">
                  <option value="">Select use case</option>
                  <option value="intraday">Intraday trading</option>
                  <option value="swing">Swing trading</option>
                  <option value="options">Options trading</option>
                  <option value="investing">Long-term investing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500/50 bg-white dark:bg-slate-800" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">I agree to receive product updates and newsletters from Unifyn. No spam, unsubscribe anytime.</span>
                </label>
              </div>
              <button type="submit" className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 duration-200">Request early access</button>
              <div className="text-sm text-center" role="status" aria-live="polite"></div>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">By signing up, you agree to our <a href="/terms" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Terms</a> and <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Privacy Policy</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



