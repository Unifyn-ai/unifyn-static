'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BrokerAccountCard } from '../../components/BrokerAccountCard';
import { AddBrokerAccountModal } from '../../components/modals/AddBrokerAccountModal';
import { BrokerTokensModal } from '../../components/modals/BrokerTokensModal';
import {
  getBrokers,
  getBrokerAccounts,
  Broker,
  BrokerAccount,
  BrokerTokens,
} from '../../lib/broker';
import { logger } from '../../utils/logger';

export default function TradePage() {
  const { user, isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  // State management
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [accounts, setAccounts] = useState<BrokerAccount[]>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddBrokerModal, setShowAddBrokerModal] = useState(false);
  const [showTokensModal, setShowTokensModal] = useState(false);
  const [showBrokerSelection, setShowBrokerSelection] = useState(false);
  const [showOpenAccountMenu, setShowOpenAccountMenu] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [currentTokens, setCurrentTokens] = useState<BrokerTokens | null>(null);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load brokers on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadBrokers();
      loadAccounts();
    }
  }, [isAuthenticated]);

  const loadBrokers = async () => {
    try {
      setLoadingBrokers(true);
      setError(null);
      logger.log('[TradePage] Loading brokers...');
      const brokersList = await getBrokers();
      logger.log('[TradePage] Brokers loaded:', brokersList);
      
      // Deduplicate brokers based on broker code
      const uniqueBrokers = brokersList.filter(
        (broker, index, self) =>
          index === self.findIndex((b) => b.code === broker.code)
      );
      
      setBrokers(uniqueBrokers);
    } catch (err: any) {
      logger.error('[TradePage] Error loading brokers:', err);
      setError(err.message || 'Failed to load brokers');
    } finally {
      setLoadingBrokers(false);
    }
  };

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      setError(null);
      logger.log('[TradePage] Loading broker accounts...');
      const accountsList = await getBrokerAccounts();
      logger.log('[TradePage] Accounts loaded:', accountsList);
      setAccounts(accountsList);
    } catch (err: any) {
      logger.error('[TradePage] Error loading accounts:', err);
      // Don't set error here as it's expected to fail if no accounts exist
      setAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleLinkAccountClick = () => {
    setShowBrokerSelection(true);
  };

  const handleBrokerClick = (broker: Broker) => {
    setSelectedBroker(broker);
    setShowBrokerSelection(false);
    setShowAddBrokerModal(true);
  };

  const handleAddAccountSuccess = () => {
    // Reload accounts after successfully adding one
    loadAccounts();
  };

  const handleTokensFetched = (tokens: BrokerTokens) => {
    setCurrentTokens(tokens);
    setShowTokensModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const userName = user?.name || user?.id || 'User';
  const hasAccounts = accounts.length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to Trading, {userName}!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage your broker accounts and start trading with Unifyn's unified platform
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-6 py-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Error Loading Data
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {loadingAccounts || loadingBrokers ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
              </div>
            </div>
          ) : hasAccounts ? (
            <>
              {/* Linked Accounts Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Your Linked Accounts
                  </h2>
                  <button
                    onClick={loadAccounts}
                    disabled={loadingAccounts}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all disabled:opacity-50"
                  >
                    <svg
                      className={`w-4 h-4 ${loadingAccounts ? 'animate-spin' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((account) => (
                    <BrokerAccountCard
                      key={account.id}
                      account={account}
                      onTokensFetched={handleTokensFetched}
                    />
                  ))}
                </div>
              </div>

              {/* Add Another Account Button */}
              <div className="text-center">
                <button
                  onClick={handleLinkAccountClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Link Another Broker Account
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Welcome Message - No Accounts */}
              <div className="max-w-2xl mx-auto text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                  <svg
                    className="w-8 h-8 text-cyan-500"
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
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Get Started with Unified Trading
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  No broker accounts linked yet. Choose an option below to start trading with our unified platform.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleLinkAccountClick}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Link Existing Account
                  </button>

                  {brokers.length > 0 && (
                    <div className="relative w-full">
                      <button
                        onClick={() => setShowOpenAccountMenu(!showOpenAccountMenu)}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Open New Demat Account
                        <svg className={`w-4 h-4 transition-transform ${showOpenAccountMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showOpenAccountMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowOpenAccountMenu(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 max-h-64 overflow-y-auto">
                            {brokers.filter(b => b.accountOpenUrl).length > 0 ? (
                              brokers.filter(b => b.accountOpenUrl).map((broker) => (
                                <a
                                  key={broker.code}
                                  href={broker.accountOpenUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                  onClick={() => setShowOpenAccountMenu(false)}
                                >
                                  <div className="font-medium">{broker.name}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Open account on broker website</div>
                                </a>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                Account opening links will be available soon. Please check back later.
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Info Banner */}
          <div className="mt-8 bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-4 py-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5"
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
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Secure Integration:</strong> Your credentials are encrypted and stored securely. We use industry-standard security practices to protect your data.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Broker Selection Modal */}
      {showBrokerSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowBrokerSelection(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Select Your Broker
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Choose the broker you want to link your account with
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {brokers.map((broker) => (
                  <button
                    key={broker.code}
                    onClick={() => handleBrokerClick(broker)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {broker.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {broker.code}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddBrokerAccountModal
        open={showAddBrokerModal}
        onClose={() => setShowAddBrokerModal(false)}
        broker={selectedBroker}
        onSuccess={handleAddAccountSuccess}
      />
      <BrokerTokensModal
        open={showTokensModal}
        onClose={() => setShowTokensModal(false)}
        tokens={currentTokens}
      />
    </>
  );
}
