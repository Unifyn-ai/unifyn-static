'use client';

import { useState, useEffect } from 'react';
import { createBrokerAccount, Broker } from '../../lib/broker';
import { logger } from '../../utils/logger';

interface AddBrokerAccountModalProps {
  open: boolean;
  onClose: () => void;
  broker: Broker | null;
  onSuccess?: () => void;
}

export function AddBrokerAccountModal({
  open,
  onClose,
  broker,
  onSuccess,
}: AddBrokerAccountModalProps) {
  const [clientcode, setClientcode] = useState('');
  const [mpin, setMpin] = useState('');
  const [totpKey, setTotpKey] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setClientcode('');
      setMpin('');
      setTotpKey('');
      setApiKey('');
      setLoading(false);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!broker) {
      setErrorMsg('No broker selected');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      logger.log('[AddBrokerAccountModal] Creating broker account...', {
        brokerCode: broker.code,
      });

      await createBrokerAccount({
        brokerCode: broker.code,
        clientcode,
        mpin,
        totp_key: totpKey,
        api_key: apiKey,
      });

      setSuccessMsg('Broker account linked successfully!');
      logger.log('[AddBrokerAccountModal] Broker account created successfully');

      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error: any) {
      logger.error('[AddBrokerAccountModal] Error creating broker account:', error);
      setErrorMsg(error.message || 'Failed to link broker account');
    } finally {
      setLoading(false);
    }
  };

  if (!broker) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/70 sm:backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg border border-slate-200 dark:border-slate-700/50 sm:backdrop-blur-xl transition-all duration-300 sm:transform ${
            open ? 'sm:scale-100' : 'sm:scale-95'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-slate-800/50 hover:bg-black/10 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex items-center justify-center group"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative px-8 py-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <svg
                  className="w-6 h-6 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Link {broker.name} Account
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter your broker credentials to connect your account securely.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client Code */}
              <div>
                <label
                  htmlFor="clientcode"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Client Code
                </label>
                <input
                  type="text"
                  id="clientcode"
                  value={clientcode}
                  onChange={(e) => setClientcode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your client code"
                  required
                  disabled={loading}
                />
              </div>

              {/* MPIN */}
              <div>
                <label
                  htmlFor="mpin"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  MPIN
                </label>
                <input
                  type="password"
                  id="mpin"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your MPIN"
                  required
                  disabled={loading}
                />
              </div>

              {/* TOTP Key */}
              <div>
                <label
                  htmlFor="totpKey"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  TOTP Key
                </label>
                <input
                  type="text"
                  id="totpKey"
                  value={totpKey}
                  onChange={(e) => setTotpKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your TOTP secret key"
                  required
                  disabled={loading}
                />
              </div>

              {/* API Key */}
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your API key"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-4 py-3">
                  <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 px-4 py-3">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {successMsg}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                    <span>Linking Account...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span>Link Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg
                    className="w-5 h-5 text-cyan-500/60"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your credentials are encrypted and stored securely. We use industry-standard
                  security practices to protect your data. Read our{' '}
                  <a
                    href="/privacy"
                    className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

