'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { googleSignIn } from '../../utils/google';
import { appleSignIn } from '../../utils/apple';
import {
  authWithApple,
  authWithGoogle,
  initEmailAuth,
  initMobileAuth,
  resendEmailOtp,
  resendMobileOtp,
  verifyEmailOtp,
  verifyMobileOtp,
} from '../../lib/auth';
import { logger } from '../../utils/logger';
import { useUser } from '../UserProvider';
import { CompleteProfileModal } from './CompleteProfileModal';
import { VerifyMpinModal } from './VerifyMpinModal';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPhase, setOtpPhase] = useState(false);
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Modal states for 2FA and profile completion
  const [showVerifyMpinModal, setShowVerifyMpinModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  
  // Ref for OTP first input auto-focus
  const firstOtpInputRef = useRef<HTMLInputElement>(null);

  // Reset all state when modal is closed
  useEffect(() => {
    if (!open) {
      // Reset all form states
      setMethod('mobile');
      setMobile('');
      setEmail('');
      setOtp('');
      setOtpPhase(false);
      setSending(false);
      setResending(false);
      setVerifying(false);
      setStatusMsg(null);
      setErrorMsg(null);
      setResendTimer(0);
      setGoogleLoading(false);
      setAppleLoading(false);
    }
  }, [open]);

  const onGoogle = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      setGoogleLoading(true);
      
      logger.log('[LoginModal] Starting Google sign-in...');
      setStatusMsg('Opening Google sign-in...');
      
      const idToken = await googleSignIn();
      logger.log('[LoginModal] Google ID Token received:', idToken?.substring(0, 50) + '...');
      
      setStatusMsg('Google sign-in successful. Exchanging with backend...');
      const resp = await authWithGoogle(idToken);
      logger.log('[LoginModal] Backend /auth/google response:', resp);
      
      setStatusMsg('Google authentication complete.');
      
      // Refresh user state after successful authentication
      await refreshUser();
      
      // Close modal and redirect to trade page
      onClose();
      router.push('/trade');
    } catch (e: any) {
      logger.error('[LoginModal] Google sign-in error:', {
        message: e?.message,
        stack: e?.stack,
        error: e
      });
      setErrorMsg(e?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  }, [refreshUser, onClose, router]);

  const onApple = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      setAppleLoading(true);
      const idToken = await appleSignIn();
      logger.log('Apple ID Token:', idToken);
      setStatusMsg('Apple sign-in successful. Exchanging with backend...');
      const resp = await authWithApple(idToken);
      logger.log('Backend /auth/apple response:', resp);
      setStatusMsg('Apple authentication complete.');
      
      // Refresh user state after successful authentication
      await refreshUser();
      
      // Close modal and redirect to trade page
      onClose();
      router.push('/trade');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Apple sign-in failed.');
    } finally {
      setAppleLoading(false);
    }
  }, [refreshUser, onClose, router]);

  // Timer effect for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus first OTP input when OTP phase starts
  useEffect(() => {
    if (otpPhase && open && firstOtpInputRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        firstOtpInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [otpPhase, open]);

  const onSendOtp = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      setSending(true);
      if (method === 'mobile') {
        const resp = await initMobileAuth(mobile, 'login');
        logger.log('Init Mobile OTP response:', resp);
      } else {
        const resp = await initEmailAuth(email, 'login');
        logger.log('Init Email OTP response:', resp);
      }
      setOtpPhase(true);
      setResendTimer(30);
      setStatusMsg('OTP sent.');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to send OTP.');
    } finally {
      setSending(false);
    }
  }, [method, mobile, email]);

  const onResendOtp = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      setResending(true);
      if (method === 'mobile') {
        const resp = await resendMobileOtp(mobile, 'login');
        logger.log('Resend Mobile OTP response:', resp);
      } else {
        const resp = await resendEmailOtp(email, 'login');
        logger.log('Resend Email OTP response:', resp);
      }
      setResendTimer(30);
      setStatusMsg('OTP resent.');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  }, [method, mobile, email]);

  const onVerifyOtp = useCallback(async () => {
    try {
      setErrorMsg(null);
      setStatusMsg(null);
      setVerifying(true);
      
      let resp: any;
      if (method === 'mobile') {
        resp = await verifyMobileOtp(mobile, otp, 'login');
        logger.log('Verify Mobile OTP response:', resp);
      } else {
        resp = await verifyEmailOtp(email, otp, 'login');
        logger.log('Verify Email OTP response:', resp);
      }
      
      // Check response structure
      const responseData = resp?.d || resp;
      
      // Scenario 1: New user - needs profile completion
      if (responseData?.isNewUser === true) {
        setStatusMsg(responseData.message || 'Please complete your profile.');
        onClose(); // Close login modal
        setTimeout(() => setShowCompleteProfileModal(true), 300); // Open profile modal
        return;
      }
      
      // Scenario 2: Existing user - needs 2FA
      if (responseData?.requires_2fa === true) {
        setStatusMsg(responseData.message || 'Please enter your MPIN.');
        onClose(); // Close login modal
        setTimeout(() => setShowVerifyMpinModal(true), 300); // Open MPIN modal
        return;
      }
      
      // Scenario 3: Fully authenticated
      setStatusMsg('Verification complete.');
      
      // Refresh user state after successful authentication
      await refreshUser();
      
      // Close modal and redirect to trade page
      onClose();
      router.push('/trade');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to verify OTP.');
    } finally {
      setVerifying(false);
    }
  }, [method, mobile, email, otp, refreshUser, onClose, router]);

  return (
    <>
      {/* Main Login Modal */}
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Unifyn</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Login to your account or register as a new user</p>
            </div>

            <div className="space-y-3 mb-6">
              <button onClick={onGoogle} disabled={googleLoading} className="group w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 hover:border-cyan-500/50 px-5 py-3.5 transition-all duration-200 disabled:opacity-60">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
              </button>

              <button onClick={onApple} disabled={appleLoading} className="group w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 hover:border-cyan-500/50 px-5 py-3.5 transition-all duration-200 disabled:opacity-60">
                <svg className="w-5 h-5 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{appleLoading ? 'Signing in with Apple...' : 'Continue with Apple'}</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); otpPhase ? onVerifyOtp() : onSendOtp(); }}>
              {!otpPhase && (
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="login-method"
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                      checked={method === 'mobile'}
                      onChange={() => setMethod('mobile')}
                    />
                    <span>Mobile</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="login-method"
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                      checked={method === 'email'}
                      onChange={() => setMethod('email')}
                    />
                    <span>Email</span>
                  </label>
                </div>
              )}
              <div>
                <label htmlFor="login-input" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  {otpPhase ? 'Enter OTP' : method === 'mobile' ? 'Mobile Number' : 'Email Address'}
                </label>
                {!otpPhase ? (
                  <div className="relative">
                    {method === 'mobile' && (
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">+91</span>
                      </div>
                    )}
                    <input
                      id="login-input"
                      name={method === 'mobile' ? 'mobile' : 'email'}
                      type={method === 'mobile' ? 'tel' : 'email'}
                      pattern={method === 'mobile' ? '[0-9]{10}' : undefined}
                      maxLength={method === 'mobile' ? 10 : undefined}
                      required
                      value={method === 'mobile' ? mobile : email}
                      onChange={(e) => {
                        method === 'mobile' ? setMobile(e.target.value) : setEmail(e.target.value);
                      }}
                      placeholder={method === 'mobile' ? 'Enter 10-digit mobile number' : 'you@example.com'}
                      className={`w-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 ${method === 'mobile' ? 'pl-14' : 'pl-4'} pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all`}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={index === 0 ? firstOtpInputRef : undefined}
                        id={index === 0 ? 'login-input' : undefined}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 1) {
                            const newOtp = otp.split('');
                            newOtp[index] = value;
                            setOtp(newOtp.join(''));
                            // Auto-focus next input
                            if (value && index < 5) {
                              const nextInput = e.target.nextElementSibling as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace to go to previous input
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                            prevInput?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                          setOtp(pastedData);
                          // Focus the last filled input or the last input
                          const targetIndex = Math.min(pastedData.length, 5);
                          const inputs = e.currentTarget.parentElement?.querySelectorAll('input');
                          (inputs?.[targetIndex] as HTMLInputElement)?.focus();
                        }}
                        className="w-12 h-14 text-center rounded-xl border-2 border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-lg font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      />
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={otpPhase ? (verifying || otp.length !== 6) : sending} 
                className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {otpPhase ? (verifying ? 'Verifying...' : 'Verify OTP') : (sending ? 'Sending...' : 'Send OTP')}
              </button>
              {otpPhase && (
                <div className="flex justify-center">
                  <button 
                    type="button" 
                    onClick={onResendOtp} 
                    disabled={resending || resendTimer > 0} 
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {resending ? 'Resending...' : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><svg className="w-5 h-5 text-cyan-500/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg></div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">New users will be automatically registered. Existing users can login with the same flow. Your data is protected. Read our <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Privacy Policy</a>.</p>
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
      
      {/* Separate modals for profile completion and 2FA - rendered outside LoginModal wrapper */}
      <CompleteProfileModal 
        open={showCompleteProfileModal} 
        onClose={() => setShowCompleteProfileModal(false)} 
      />
      <VerifyMpinModal 
        open={showVerifyMpinModal} 
        onClose={() => setShowVerifyMpinModal(false)} 
      />
    </>
  );
}


