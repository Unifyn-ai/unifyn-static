"use client";
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

function shouldHideChromeFromLocation(): boolean {
  try {
    let params = new URLSearchParams(window.location.search);
    let sourceParam = params.get('source')?.toLowerCase();
    // If not found, check hash for query parameters (e.g., #...?...&source=mobile)
    if (!sourceParam && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      params = new URLSearchParams(hashQuery);
      sourceParam = params.get('source')?.toLowerCase();
    }
    return sourceParam === 'mobile';
  } catch {
    return false;
  }
}

export function HeaderIfVisible() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    setHide(shouldHideChromeFromLocation());
  }, []);
  if (hide) return null;
  return <Header />;
}

export function FooterIfVisible() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    setHide(shouldHideChromeFromLocation());
  }, []);
  if (hide) return null;
  return <Footer />;
}


