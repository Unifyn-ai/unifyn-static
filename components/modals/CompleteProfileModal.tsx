'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { completeProfile } from '../../lib/auth';
import { useUser } from '../UserProvider';

export function CompleteProfileModal({ 
  open, 
  onClose 
}: { 
  open: boolean; 
  onClose: () => void;
}) {
  const { refreshUser } = useUser();
  const [name, setName] = useState('');
  const [profileMpin, setProfileMpin] = useState('');
  const [repeatMpin, setRepeatMpin] = useState('');
  const [completingProfile, setCompletingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Ref for name input auto-focus
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus name input when modal opens
  useEffect(() => {
    if (open && nameInputRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const onCompleteProfile = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      
      // Validate MPIN match
      if (profileMpin !== repeatMpin) {
        setErrorMsg('MPINs do not match. Please try again.');
        return;
      }
      
      // Validate MPIN length
      if (profileMpin.length !== 6) {
        setErrorMsg('MPIN must be 6 digits.');
        return;
      }
      
      // Validate name
      if (!name.trim()) {
        setErrorMsg('Please enter your name.');
        return;
      }
      
      setCompletingProfile(true);
      
      const resp = await completeProfile(name.trim(), profileMpin);
      console.log('Complete profile response:', resp);
      
      setStatusMsg('Profile completed successfully!');
      
      // Refresh user state after successful profile completion
      await refreshUser();
      
      // Close modal after successful completion
      setTimeout(() => onClose(), 500);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to complete profile.');
    } finally {
      setCompletingProfile(false);
    }
  }, [name, profileMpin, repeatMpin, refreshUser, onClose]);

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
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete Your Profile</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Please provide your details to continue</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onCompleteProfile(); }}>
              <div>
                <label htmlFor="profile-name" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  ref={nameInputRef}
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label htmlFor="profile-mpin" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Create MPIN (6 digits)
                </label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={index === 0 ? 'profile-mpin' : undefined}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={profileMpin[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 1) {
                          const newMpin = profileMpin.split('');
                          newMpin[index] = value;
                          setProfileMpin(newMpin.join(''));
                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = e.target.nextElementSibling as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === 'Backspace' && !profileMpin[index] && index > 0) {
                          const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center rounded-xl border-2 border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-lg font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="repeat-mpin" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Confirm MPIN
                </label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={index === 0 ? 'repeat-mpin' : undefined}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={repeatMpin[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 1) {
                          const newMpin = repeatMpin.split('');
                          newMpin[index] = value;
                          setRepeatMpin(newMpin.join(''));
                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = e.target.nextElementSibling as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === 'Backspace' && !repeatMpin[index] && index > 0) {
                          const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center rounded-xl border-2 border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-lg font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={completingProfile || !name.trim() || profileMpin.length !== 6 || repeatMpin.length !== 6} 
                className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {completingProfile ? 'Completing Profile...' : 'Complete Profile'}
              </button>
            </form>

            <div className="mt-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><svg className="w-5 h-5 text-cyan-500/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg></div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Your MPIN will be used for secure transactions. Keep it safe and don't share it with anyone.</p>
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

