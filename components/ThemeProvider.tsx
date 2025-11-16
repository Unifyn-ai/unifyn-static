"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const STORAGE_KEY = 'theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeThemeCookies(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(mode);
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  const common = `; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
  // Primary cookie scoped to .unifyn.ai (will be ignored if not on that parent domain)
  document.cookie = `theme=${value}${common}; Domain=.unifyn.ai`;
  // Fallback host-only cookie for local dev or other domains
  document.cookie = `theme=${value}${common}`;
}

function normalizeTheme(value: any): ThemeMode | null {
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return null;
}

function getInitialMode(): ThemeMode {
  try {
    // URL param has highest priority
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const themeParam = params?.get('theme')?.toLowerCase();
    const fromParam = normalizeTheme(themeParam);
    if (fromParam) return fromParam;
    // Cookie next
    const fromCookie = normalizeTheme(readCookie('theme'));
    if (fromCookie) return fromCookie;
    // LocalStorage fallback
    const fromStorage = normalizeTheme(typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null);
    if (fromStorage) return fromStorage;
  } catch {}
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode());
  const [isDark, setIsDark] = useState<boolean>(() => {
    const initial = getInitialMode();
    return initial === 'dark' ? true : initial === 'light' ? false : getSystemPrefersDark();
  });

  // Initialize from storage
  useEffect(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const themeParamRaw = params?.get('theme')?.toLowerCase();
      if (themeParamRaw === 'light' || themeParamRaw === 'dark' || themeParamRaw === 'system') {
        setMode(themeParamRaw as ThemeMode);
        try { localStorage.setItem(STORAGE_KEY, themeParamRaw); } catch {}
        writeThemeCookies(themeParamRaw as ThemeMode);
        return;
      }
      // Prefer cookie over localStorage if present
      const fromCookie = readCookie('theme');
      if (fromCookie && normalizeTheme(fromCookie)) {
        setMode(fromCookie as ThemeMode);
        try { localStorage.setItem(STORAGE_KEY, fromCookie); } catch {}
        writeThemeCookies(fromCookie as ThemeMode);
        return;
      }
      const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';
      setMode(saved as ThemeMode);
    } catch {
      setMode('system');
    }
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    const dark = mode === 'dark' ? true : mode === 'light' ? false : getSystemPrefersDark();
    setIsDark(dark);
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme-mode', mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch {}
    writeThemeCookies(mode);
  }, [mode]);

  // React to system changes when mode is system
  useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setIsDark(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else (mql as any).addListener?.(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else (mql as any).removeListener?.(handler);
    };
  }, [mode]);

  const setModeSafe = useCallback((nextMode: ThemeMode) => {
    setMode(nextMode);
  }, []);

  const value = useMemo(() => ({ mode, setMode: setModeSafe, isDark }), [mode, setModeSafe, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


