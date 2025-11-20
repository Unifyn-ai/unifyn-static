'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verify2FA } from '../../lib/auth';
import { useUser } from '../UserProvider';
import { logger } from '../../utils/logger';

export function VerifyMpinModal({ 
  open, 
  onClose 
}: { 
  open: boolean; 
  onClose: () => void;
}) {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [mpin, setMpin] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Ref for MPIN first input auto-focus
  const firstMpinInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first MPIN input when modal opens
  useEffect(() => {
    if (open && firstMpinInputRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        firstMpinInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const onVerify2FA = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      setVerifying2FA(true);
      
      const resp = await verify2FA(mpin);
      logger.log('Verify 2FA response:', resp);
      
      setStatusMsg('2FA verification complete.');
      
      // Refresh user state after successful authentication
      await refreshUser();
      
      // Close modal and redirect to trade page
      onClose();
      router.push('/trade');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to verify MPIN.');
    } finally {
      setVerifying2FA(false);
    }
  }, [mpin, refreshUser, onClose, router]);

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
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Security Verification</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Enter your 6-digit MPIN to continue</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onVerify2FA(); }}>
              <div>
                <label htmlFor="mpin-input" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Enter Your MPIN
                </label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={index === 0 ? firstMpinInputRef : undefined}
                      id={index === 0 ? 'mpin-input' : undefined}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={mpin[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 1) {
                          const newMpin = mpin.split('');
                          newMpin[index] = value;
                          setMpin(newMpin.join(''));
                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = e.target.nextElementSibling as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === 'Backspace' && !mpin[index] && index > 0) {
                          const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                        setMpin(pastedData);
                        // Focus the last filled input or the last input
                        const targetIndex = Math.min(pastedData.length, 5);
                        const inputs = e.currentTarget.parentElement?.querySelectorAll('input');
                        (inputs?.[targetIndex] as HTMLInputElement)?.focus();
                      }}
                      className="w-12 h-14 text-center rounded-xl border-2 border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-lg font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={verifying2FA || mpin.length !== 6} 
                className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {verifying2FA ? 'Verifying...' : 'Verify MPIN'}
              </button>
            </form>

            <div className="mt-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><svg className="w-5 h-5 text-cyan-500/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg></div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">For your security, we need to verify your identity using your MPIN.</p>
              </div>
              {(errorMsg || statusMsg) && (
                <div className="mt-3 text-xs">
                  {errorMsg && <p className="text-red-600 dark:text-red-400">{errorMsg}</p>}
                  {statusMsg && <p className="text-emerald-700 dark:text-emerald-400">{statusMsg}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

