"use client";
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';

export function Header() {
  const { mode, setMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseNavLinkClass =
    "px-4 py-1.5 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 focus-visible:bg-black/5 dark:focus-visible:bg-white/10 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950";

  // Close menu on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Note: Anchor offset handled via static CSS in globals.css

  return (
    <header className="fixed top-0 left-0 right-0 z-50 md:bg-transparent md:backdrop-blur-none backdrop-blur-lg md:border-b-0 border-b border-slate-200/60 dark:border-slate-800/50" role="banner">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 md:py-6 grid items-center grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr]" aria-label="Main navigation">
        {/* Logo - LEFT SIDE */}
        <Link href="/" className="flex items-center justify-self-start focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 rounded-lg shrink-0">
          <img
            src="/assets/img/logo-light.svg"
            alt="Unifyn - Unified Finance Superapp Logo"
            className="h-6 sm:h-8 w-auto block dark:hidden"
          />
          <img
            src="/assets/img/logo-dark.svg"
            alt="Unifyn - Unified Finance Superapp Logo"
            className="h-6 sm:h-8 w-auto hidden dark:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 justify-self-center rounded-full px-2 py-1.5 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/30 shadow-lg" role="navigation" aria-label="Primary">
          <Link href="/" className={baseNavLinkClass} aria-label="Go to home page">Home</Link>
          <Link href="/#features" className={baseNavLinkClass} aria-label="View platform features">Features</Link>
          <Link href="/#security" className={baseNavLinkClass} aria-label="Learn about security">Security</Link>
          <Link href="/#contact" className={baseNavLinkClass} aria-label="Contact us">Contact</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 justify-self-end" role="navigation" aria-label="User actions">
          <button 
            data-open-modal="login" 
            className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 rounded px-2 py-1"
            aria-label="Login to Unifyn"
          >
            Login
          </button>
          <button 
            data-open-modal="signup" 
            className="rounded-full px-5 py-2 text-sm font-semibold bg-cyan-700 text-white hover:bg-cyan-800 transition-colors shadow-lg shadow-cyan-700/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
            aria-label="Sign up for Unifyn"
          >
            Signup
          </button>
          <div className="relative">
            <select
              aria-label="Select theme preference"
              className="bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/30 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Button - RIGHT SIDE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden col-start-3 row-start-1 md:col-start-auto md:row-start-auto justify-self-end p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg -mr-1"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu - RIGHT SIDE Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar - RIGHT SIDE */}
          <div className="md:hidden fixed top-0 right-0 h-[100dvh] w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-[70] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links - Scrollable */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-1.5"
              >
                Home
              </Link>
              <Link 
                href="/#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-1.5"
              >
                Features
              </Link>
              <Link 
                href="/#security" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-1.5"
              >
                Security
              </Link>
              <Link 
                href="/#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-1.5"
              >
                Contact
              </Link>
              <Link 
                href="/privacy" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-1.5"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-1.5"
              >
                Terms
              </Link>
              <Link 
                href="/support" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Support
              </Link>
            </nav>

            {/* Bottom Actions - Fixed */}
            <div className="p-4 border-t border-slate-700 shrink-0 space-y-3">
              <div className="flex gap-2">
                <button 
                  data-open-modal="login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center border border-slate-200 dark:border-slate-700"
                >
                  Login
                </button>
                <button 
                  data-open-modal="signup" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
                >
                  Signup
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Theme</label>
                <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'light'}
                    onClick={() => setMode('light' as any)}
                    className={`px-3 py-2.5 rounded-lg text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      mode === 'light'
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-transparent text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'dark'}
                    onClick={() => setMode('dark' as any)}
                    className={`px-3 py-2.5 rounded-lg text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      mode === 'dark'
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-transparent text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'system'}
                    onClick={() => setMode('system' as any)}
                    className={`px-3 py-2.5 rounded-lg text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      mode === 'system'
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-transparent text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}


