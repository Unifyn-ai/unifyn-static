"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SHOW_BROKER_UI } from '../app/config';
import { LoginModal } from './modals/LoginModal';
import { SignupModal } from './modals/SignupModal';
import { ConnectBrokerModal } from './modals/ConnectBrokerModal';

type ModalName = 'login' | 'signup' | 'connect-broker' | null;

type ModalContextValue = {
  open: (name: Exclude<ModalName, null>) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState<ModalName>(null);

  const open = useCallback((name: Exclude<ModalName, null>) => setOpenName(name), []);
  const close = useCallback(() => setOpenName(null), []);

  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', !!openName);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openName, close]);

  // Also support data-open-modal / data-close-modal for convenience
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const openEl = target.closest('[data-open-modal]') as HTMLElement | null;
      const closeEl = target.closest('[data-close-modal]') as HTMLElement | null;
      if (openEl && openEl.getAttribute('data-open-modal')) {
        e.preventDefault();
        const name = openEl.getAttribute('data-open-modal') as 'login' | 'signup' | 'connect-broker' | null;
        if (name) open(name);
        return;
      }
      if (closeEl) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <LoginModal open={openName === 'login'} onClose={close} />

      <ConnectBrokerModal open={openName === 'connect-broker'} onClose={close} />

      <SignupModal open={openName === 'signup'} onClose={close} />
    </ModalContext.Provider>
  );
}


