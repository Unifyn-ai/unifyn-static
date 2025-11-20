import './globals.css';
import './themes/light.css';
import './themes/dark.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ModalProvider } from '../components/ModalProvider';
import { ThemeProvider } from '../components/ThemeProvider';

// Optimize font loading with Next.js
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://unifyn.ai'),
  title: {
    default: "Unifyn — Global Unified Finance Platform | Broker Agnostic Trading",
    template: '%s | Unifyn - Unified Finance Superapp'
  },
  description: 'Unifyn is a global unified finance platform — a broker agnostic trading app designed to connect your existing broker accounts. Experience unified finance with one seamless trading interface, analytics, and ledger.',
  keywords: [
    'unified finance superapp',
    'broker agnostic trading app',
    'unified finance',
    'unified finance platform',
    'broker agnostic platform',
    'multi broker trading app',
    'global unified trading platform',
    'connect your existing brokers',
    'trading analytics platform',
    'unified trading interface',
    'broker independent trading',
    'multi-broker portfolio management',
    'consolidated trading platform',
    'fintech superapp'
  ],
  authors: [{ name: 'Infigon Electric Pvt Ltd' }],
  creator: 'Infigon Electric Pvt Ltd',
  publisher: 'Infigon Electric Pvt Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://unifyn.ai',
  },
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://unifyn.ai',
    siteName: 'Unifyn - Unified Finance Superapp',
    title: "Global Unified Finance Platform | Broker Agnostic Trading Platform",
    description: 'Experience unified finance with Unifyn — a global, broker agnostic trading app. Connect your existing broker accounts in one seamless interface.',
    images: [
      {
        url: '/assets/img/logo-dark.svg',
        width: 1200,
        height: 630,
        alt: 'Unifyn - Unified Finance Superapp Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@unifyn',
    creator: '@unifyn',
    title: "Global Unified Finance Platform | Broker Agnostic Trading",
    description: 'Unified finance made simple. Connect your existing brokers and trade smarter with our broker agnostic trading app.',
    images: ['/assets/img/logo-dark.svg'],
  },
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon.ico', sizes: '48x48' },
    { rel: 'apple-touch-icon', url: '/favicon.svg' },
  ],
  manifest: '/site.webmanifest',
  category: 'finance',
  applicationName: 'Unifyn',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Unifyn',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://unifyn.ai/#organization',
        name: 'Infigon Electric Pvt Ltd',
        url: 'https://unifyn.ai',
        logo: {
          '@type': 'ImageObject',
          url: 'https://unifyn.ai/assets/img/logo-dark.svg',
          width: 200,
          height: 60,
        },
        description: "Global unified finance platform and broker agnostic trading platform",
        sameAs: [
          'https://twitter.com/unifyn',
          'https://linkedin.com/company/unifyn',
          'https://github.com/unifyn',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@unifyn.ai',
          contactType: 'Customer Support',
          areaServed: 'Worldwide',
          availableLanguage: ['English', 'Hindi'],
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://unifyn.ai/#website',
        url: 'https://unifyn.ai',
        name: 'Unifyn - Unified Finance Superapp',
        description: 'Broker agnostic trading platform connecting multiple brokers in one unified interface',
        publisher: {
          '@id': 'https://unifyn.ai/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://unifyn.ai/?s={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://unifyn.ai/#software',
        name: 'Unifyn',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Trading Platform',
        operatingSystem: 'Web, iOS, Android',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: 'Unified finance superapp — broker agnostic trading platform. Connect your existing broker accounts in one interface.',
        featureList: [
          'Unified Login across Multiple Brokers',
          'Smart Trading with Keyboard Shortcuts',
          'Deep Analytics and P&L Reports',
          'Ledger and Tax Management',
          'Price Alerts and Notifications',
          'Customizable Trading Interface',
        ],
        screenshot: 'https://unifyn.ai/assets/img/logo-dark.svg',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '127',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://unifyn.ai/#webpage',
        url: 'https://unifyn.ai',
        name: "Global Unified Finance Platform | Broker Agnostic Trading Platform",
        description: 'Unified finance made simple with Unifyn - broker agnostic trading app. Connect multiple brokers, trade smarter.',
        isPartOf: {
          '@id': 'https://unifyn.ai/#website',
        },
        about: {
          '@id': 'https://unifyn.ai/#organization',
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://unifyn.ai/assets/img/logo-dark.svg',
        },
        inLanguage: 'en',
        potentialAction: {
          '@type': 'ReadAction',
          target: ['https://unifyn.ai'],
        },
      },
    ],
  };

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="description" content="Unifyn is a global unified finance platform — a broker agnostic trading app designed to connect your existing broker accounts. Experience unified finance with one seamless trading interface, analytics, and ledger." />
        <script
          dangerouslySetInnerHTML={{
            __html: `
;(() => {
  try {
    var d = document.documentElement;
    var search = new URLSearchParams(location.search);
    var p = (search.get('theme') || '').toLowerCase();
    var c = (document.cookie.match(/(?:^|; )theme=([^;]+)/) || [])[1];
    var s = null;
    try { s = localStorage.getItem('theme'); } catch {}
    var v = (p || c || s || 'system');
    if (v !== 'light' && v !== 'dark' && v !== 'system') v = 'system';
    var isDark = v === 'dark' || (v === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    d.classList.toggle('dark', !!isDark);
    d.setAttribute('data-theme-mode', v);
  } catch (e) {}
})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased relative`}>
        <ThemeProvider>
          <ModalProvider>{children}</ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


