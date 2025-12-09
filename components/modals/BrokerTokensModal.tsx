'use client';

import { BrokerTokens } from '../../lib/broker';

interface BrokerTokensModalProps {
  open: boolean;
  onClose: () => void;
  tokens: BrokerTokens | null;
}

export function BrokerTokensModal({ open, onClose, tokens }: BrokerTokensModalProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    });
  };

  if (!tokens) return null;

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
          className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/10 w-full max-w-2xl border border-slate-200 dark:border-slate-700/50 sm:backdrop-blur-xl transition-all duration-300 sm:transform ${
            open ? 'sm:scale-100' : 'sm:scale-95'
          } max-h-[90vh] overflow-y-auto`}
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Broker Tokens Retrieved
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your broker tokens have been successfully retrieved and stored in cookies.
              </p>
            </div>

            <div className="space-y-4">
              {/* Account ID */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Account ID
                  </label>
                  <button
                    onClick={() => copyToClipboard(tokens.accountId, 'Account ID')}
                    className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                  {tokens.accountId}
                </p>
              </div>

              {/* Broker Code */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Broker
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {tokens.brokerCode.toUpperCase()}
                </p>
              </div>

              {/* Access Token */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Access Token
                  </label>
                  <button
                    onClick={() => copyToClipboard(tokens.accessToken, 'Access Token')}
                    className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                  {tokens.accessToken}
                </p>
              </div>

              {/* Refresh Token */}
              {tokens.refreshToken && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Refresh Token
                    </label>
                    <button
                      onClick={() => copyToClipboard(tokens.refreshToken!, 'Refresh Token')}
                      className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                    {tokens.refreshToken}
                  </p>
                </div>
              )}

              {/* Feed Token */}
              {tokens.feedToken && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Feed Token
                    </label>
                    <button
                      onClick={() => copyToClipboard(tokens.feedToken!, 'Feed Token')}
                      className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                    {tokens.feedToken}
                  </p>
                </div>
              )}

              {/* Expires At */}
              {tokens.expiresAt && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Expires At
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(tokens.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Info Banner */}
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
                  These tokens have been stored in secure HTTP-only cookies and will be used to
                  authenticate your trading requests. For security, tokens are temporary and will
                  expire after the specified time.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

