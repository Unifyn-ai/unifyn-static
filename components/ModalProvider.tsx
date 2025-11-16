"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SHOW_BROKER_UI } from '../app/config';

type ModalName = 'login' | 'signup' | 'connect-broker' | null;

type ModalContextValue = {
  open: (name: Exclude<ModalName, null>) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState<ModalName>(null);

  const open = useCallback((name: Exclude<ModalName, null>) => setOpenName(name), []);
  const close = useCallback(() => setOpenName(null), []);

  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', !!openName);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openName, close]);

  // Also support data-open-modal / data-close-modal for convenience
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const openEl = target.closest('[data-open-modal]') as HTMLElement | null;
      const closeEl = target.closest('[data-close-modal]') as HTMLElement | null;
      if (openEl && openEl.getAttribute('data-open-modal')) {
        e.preventDefault();
        const name = openEl.getAttribute('data-open-modal') as 'login' | 'signup' | 'connect-broker' | null;
        if (name) open(name);
        return;
      }
      if (closeEl) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Login Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${openName === 'login' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={openName !== 'login'}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 sm:backdrop-blur-md" data-close-modal></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg border border-slate-200 dark:border-slate-700/50 sm:backdrop-blur-xl transition-all duration-300 sm:transform ${openName === 'login' ? 'sm:scale-100' : 'sm:scale-95'}`}>
            <button data-close-modal className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-slate-800/50 hover:bg-black/10 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex items-center justify-center group" aria-label="Close">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className="relative px-8 py-8">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sign in to your account to continue trading</p>
              </div>
              
              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <button className="group w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 hover:border-cyan-500/50 px-5 py-3.5 transition-all duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Continue with Google</span>
                </button>

                <button className="group w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 hover:border-cyan-500/50 px-5 py-3.5 transition-all duration-200">
                  <svg className="w-5 h-5 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Continue with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or</span>
                </div>
              </div>

              {/* Mobile + OTP Login */}
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
                <div>
                  <label htmlFor="login-mobile" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">+91</span>
                    </div>
                    <input 
                      id="login-mobile" 
                      name="mobile" 
                      type="tel" 
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required 
                      placeholder="Enter 10-digit mobile number" 
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 pl-14 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all" 
                    />
                  </div>
                </div>
                <button type="submit" className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 duration-200">
                  Send OTP
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account? <button data-open-modal="signup" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors font-medium">Sign up</button>
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><svg className="w-5 h-5 text-cyan-500/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg></div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">We use secure authentication. Your data is protected. Read our <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Privacy Policy</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Broker Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${openName === 'connect-broker' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={openName !== 'connect-broker'}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 sm:backdrop-blur-md" data-close-modal></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg border border-slate-200 dark:border-slate-700/50 sm:backdrop-blur-xl transition-all duration-300 sm:transform ${openName === 'connect-broker' ? 'sm:scale-100' : 'sm:scale-95'}`}>
            <button data-close-modal className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-slate-800/50 hover:bg-black/10 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex items-center justify-center group" aria-label="Close">
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

      {/* Signup Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${openName === 'signup' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={openName !== 'signup'}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 sm:backdrop-blur-md" data-close-modal></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg border border-slate-200 dark:border-slate-700/50 sm:backdrop-blur-xl transition-all duration-300 sm:transform ${openName === 'signup' ? 'sm:scale-100' : 'sm:scale-95'}`}>
            <button data-close-modal className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-slate-800/50 hover:bg-black/10 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex items-center justify-center group" aria-label="Close">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className="relative px-8 py-8">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get early access</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Be among the first to experience our global unified trading hub. No spam, unsubscribe anytime.</p>
              </div>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); close(); }}>
                <div>
                  <label htmlFor="signup-name" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Name (Optional)</label>
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
    </ModalContext.Provider>
  );
}


