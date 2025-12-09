'use client';

import { useState } from 'react';
import { BrokerAccount, getBrokerTokens, BrokerTokens } from '../lib/broker';
import { logger } from '../utils/logger';

interface BrokerAccountCardProps {
  account: BrokerAccount;
  onTokensFetched?: (tokens: BrokerTokens) => void;
}

export function BrokerAccountCard({ account, onTokensFetched }: BrokerAccountCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTokens = async () => {
    setLoading(true);
    setError(null);

    try {
      logger.log('[BrokerAccountCard] Fetching tokens for account:', account.id);
      const tokens = await getBrokerTokens(account.id);
      logger.log('[BrokerAccountCard] Tokens fetched successfully');
      onTokensFetched?.(tokens);
    } catch (err: any) {
      logger.error('[BrokerAccountCard] Error fetching tokens:', err);
      setError(err.message || 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  };

  const brokerName = account.brokerCode.charAt(0).toUpperCase() + account.brokerCode.slice(1);
  const clientCode = account.brokerDetails?.clientcode || 'N/A';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {brokerName}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Client: {clientCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
            Active
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Account ID</span>
          <span className="text-slate-900 dark:text-white font-mono text-xs">
            {account.id.substring(0, 12)}...
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Linked</span>
          <span className="text-slate-900 dark:text-white">
            {new Date(account.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Last Updated</span>
          <span className="text-slate-900 dark:text-white">
            {new Date(account.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-3 py-2">
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleGetTokens}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-md"
      >
        {loading ? (
          <>
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-slate-700 dark:border-slate-300 border-r-transparent"></div>
            <span>Getting Tokens...</span>
          </>
        ) : (
          <>
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span>Get Tokens</span>
          </>
        )}
      </button>
    </div>
  );
}

