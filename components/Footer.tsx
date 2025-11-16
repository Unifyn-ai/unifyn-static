"use client";

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200/60 dark:border-slate-800/50 py-8 sm:py-10 md:py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section - Full Width on Mobile */}
        <div className="mb-4 sm:mb-4">
          <a href="/" className="inline-flex items-center mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 rounded-lg" aria-label="Unifyn home">
            <img
              src="/assets/img/logo-light.svg"
              alt="Unifyn - Unified Finance Superapp"
              className="h-7 sm:h-8 w-auto block dark:hidden"
            />
            <img
              src="/assets/img/logo-dark.svg"
              alt="Unifyn - Unified Finance Superapp"
              className="h-7 sm:h-8 w-auto hidden dark:block"
            />
          </a>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Global <strong>unified finance platform</strong> and <strong>broker‑agnostic trading platform</strong>.</p>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          <a href="/terms" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Terms of Service</a>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <a href="/privacy" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Privacy Policy</a>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <a href="/cookie-policy/" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Cookie Policy</a>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <a href="/refund-policy/" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Refund & Billing</a>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <a href="/data-deletion" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Data Deletion</a>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <a href="/eula" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Mobile App EULA</a>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <a href="/support" className=" text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-600 dark:focus:text-cyan-400">Support</a>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 sm:pt-6 border-t border-slate-200/60 dark:border-slate-800/50">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center md:text-left mb-3">© <span id="year">2025</span> Infigon Electric Pvt Ltd. All rights reserved.</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center md:text-left leading-relaxed" role="note">
            <strong className="text-slate-900 dark:text-slate-300">Disclaimer:</strong> Unifyn is not a stock broker and does not provide investment advice. Trading in financial markets involves risk. Please read all scheme-related documents carefully before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}


