import type { Metadata, Viewport } from 'next';
import { Bitter, Montserrat, Source_Sans_3 } from 'next/font/google';
import Link from 'next/link';
import { connection } from 'next/server';
import { SITE } from '@/lib/config';
import './globals.css';

// Fonts are downloaded at build time and served from this site, so students'
// browsers never contact Google Fonts.
const bitter = Bitter({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], variable: '--font-bitter', display: 'swap' });
const source = Source_Sans_3({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-source', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['600'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: 'A ten-minute check-in from ALCHE Student Success. Answer honestly and get a letter with next steps chosen for you.',
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#10151d' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Every page renders per request so that it carries the CSP nonce from proxy.ts.
  await connection();

  return (
    <html lang="en-GB" className={`${bitter.variable} ${source.variable} ${montserrat.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="masthead">
          <div className="masthead__inner">
            <Link href="/" className="masthead__logo-link" aria-label={`${SITE.name}, home`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image adds inline styles the CSP blocks */}
              <img className="masthead__logo" src="/brand/alche-logo.png" alt="ALCHE" width={80} height={30} />
              <span className="masthead__team">
                Student Success
                <br />
                Compass
              </span>
            </Link>
          </div>
          <div className="split-rule" aria-hidden="true" />
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="footer__inner">
            <span>
              {SITE.team}, {SITE.institution}
            </span>
            <nav aria-label="About this site">
              <Link href="/privacy">Privacy notice</Link>
              <Link href="/about">Why these questions</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
