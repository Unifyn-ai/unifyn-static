'use client';
import { useState, FormEvent } from 'react';
import { CONTACT_ENDPOINTS } from '../app/config';

// Response envelope
type ApiResponse<T = any> = { s: 'ok'; d: T } | { s: 'error'; d: { message: string } };

export function ContactForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 'done'>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [otpError, setOtpError] = useState('');

  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  const baseUrl = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : '';

  // Validation helpers
  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const validateName = (val: string) => {
    return val.length >= 2 && val.length <= 100;
  };

  const validateMessage = (val: string) => {
    return val.length >= 1 && val.length <= 5000;
  };

  const validateOtp = (val: string) => {
    return /^\d{6}$/.test(val);
  };

  // Step 1: Init
  const handleInit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNameError('');
    setEmailError('');
    setMessageError('');
    setAttemptsLeft(null);

    let valid = true;
    if (!validateName(name)) {
      setNameError('Name must be 2-100 characters.');
      valid = false;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      valid = false;
    }
    if (!validateMessage(message)) {
      setMessageError('Message must be 1-5000 characters.');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}${CONTACT_ENDPOINTS.INIT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, message, mobile: mobile || undefined }),
      });
      const json: ApiResponse = await res.json();
      if (res.ok && json.s === 'ok') {
        setSuccessMsg(json.d.message || 'OTP sent! Check your email.');
        setStep(2);
      } else {
        setError(json.s === 'error' ? json.d.message : 'Init failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpError('');
    setAttemptsLeft(null);

    if (!validateOtp(otp)) {
      setOtpError('OTP must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}${CONTACT_ENDPOINTS.VERIFY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });
      const json: ApiResponse<{ message: string; token: string }> = await res.json();
      if (res.ok && json.s === 'ok') {
        setSuccessMsg(json.d.message || 'Verified! Proceed to submit.');
        setStep(3);
      } else {
        const msg = json.s === 'error' ? json.d.message : 'Verification failed.';
        setError(msg);
        const remaining = res.headers.get('X-Remaining-Attempts');
        if (remaining) {
          setAttemptsLeft(parseInt(remaining, 10));
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}${CONTACT_ENDPOINTS.SUBMIT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, message, mobile: mobile || undefined }),
      });
      const json: ApiResponse<{ id: number; message: string }> = await res.json();
      if (res.ok && json.s === 'ok') {
        setSuccessMsg(json.d.message || 'Contact request submitted successfully!');
        setSubmittedId(json.d.id);
        setStep('done');
      } else {
        setError(json.s === 'error' ? json.d.message : 'Submission failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--hero-accent)] to-cyan-600 text-white text-2xl mb-3">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-1">Message Sent!</h3>
        <p className="text-sm text-[var(--color-muted)]">{successMsg}</p>
        {submittedId && <p className="text-xs text-[var(--color-muted)] mt-1">ID: {submittedId}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step indicator - compact dots */}
      <div className="flex justify-center items-center gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              step === s 
                ? 'bg-[var(--hero-accent)] scale-125' 
                : step > s 
                ? 'bg-[var(--hero-accent)] opacity-50' 
                : 'bg-[var(--card-border)]'
            }`}
          />
        ))}
      </div>

      {/* Compact feedback messages */}
      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
          {error}
          {attemptsLeft !== null && <span className="ml-2 font-semibold">({attemptsLeft} left)</span>}
        </div>
      )}
      {successMsg && !error && (
        <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs">
          {successMsg}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleInit} className="space-y-3.5" aria-label="Contact form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all"
              />
              {nameError && <p className="text-red-400 text-xs mt-0.5">{nameError}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all"
              />
              {emailError && <p className="text-red-400 text-xs mt-0.5">{emailError}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="mobile" className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">
              Mobile <span className="text-[var(--color-muted)] text-xs">(optional)</span>
            </label>
            <input
              id="mobile"
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all resize-none"
            />
            {messageError && <p className="text-red-400 text-xs mt-0.5">{messageError}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full px-5 py-2.5 text-sm font-semibold bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send OTP to email"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-3.5">
          <div className="text-center py-2">
            <p className="text-xs text-[var(--color-muted)]">
              Code sent to <span className="font-semibold text-[var(--color-heading)]">{email}</span>
            </p>
          </div>
          <div>
            <label htmlFor="otp" className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 text-center">
              Enter 6-digit OTP
            </label>
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-lg tracking-widest font-mono text-[var(--text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent transition-all"
              placeholder="000000"
            />
            {otpError && <p className="text-red-400 text-xs mt-0.5 text-center">{otpError}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full px-5 py-2.5 text-sm font-semibold bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Verify OTP"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="text-center py-1">
            <p className="text-xs text-[var(--color-muted)]">Review and confirm</p>
          </div>
          <div className="space-y-1.5 text-xs text-[var(--color-muted)] bg-[var(--card-bg)] border border-[var(--card-border)] p-3 rounded-lg backdrop-blur-sm">
            <div className="flex gap-2"><span className="font-semibold text-[var(--color-heading)] min-w-[60px]">Name:</span><span>{name}</span></div>
            <div className="flex gap-2"><span className="font-semibold text-[var(--color-heading)] min-w-[60px]">Email:</span><span className="break-all">{email}</span></div>
            {mobile && <div className="flex gap-2"><span className="font-semibold text-[var(--color-heading)] min-w-[60px]">Mobile:</span><span>{mobile}</span></div>}
            <div className="flex gap-2"><span className="font-semibold text-[var(--color-heading)] min-w-[60px]">Message:</span><span className="line-clamp-2">{message}</span></div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full px-5 py-2.5 text-sm font-semibold bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Submit contact request"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
