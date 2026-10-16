import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SITE } from '@/lib/config';
import { SESSION_COOKIE, adminConfigured, adminKeyIsWeak, verifySessionToken } from '@/lib/security';
import { getStore, type Summary } from '@/lib/store';
import { AdminControls, SignIn } from './AdminClient';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

const TIER_NAMES: Record<string, string> = {
  '1': 'Tier 1: contact within 2 working days',
  '2': 'Tier 2: contact within 2 weeks',
  '3': 'Tier 3: welcome only',
};

function when(iso: string | null): string {
  if (!iso) return 'No responses yet';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Indian/Mauritius' }) + ' (Mauritius)';
}

export default async function AdminPage() {
  const jar = await cookies();
  const signedIn = verifySessionToken(jar.get(SESSION_COOKIE)?.value);

  if (!signedIn) {
    return (
      <div className="column">
        <p className="eyebrow">Student Success staff</p>
        <h1 className="title">Sign in to manage the Compass</h1>
        {adminConfigured() ? (
          <SignIn />
        ) : (
          <div className="notice">
            <p>
              Admin is switched off because <code>ADMIN_SECRET_KEY</code> is missing or shorter than 12 characters. Set it in
              the Vercel project settings and redeploy.
            </p>
          </div>
        )}
      </div>
    );
  }

  const store = getStore();
  const open = await store.isOpen();
  let summary: Summary | null = null;
  let summaryError = '';
  try {
    summary = await store.summary();
  } catch (e) {
    summaryError = (e as Error).message;
  }

  return (
    <div className="column prose">
      <p className="eyebrow">Student Success staff</p>
      <h1 className="title">Compass admin</h1>

      {adminKeyIsWeak() && (
        <div className="notice">
          <p>
            The admin password is shorter than 24 characters. Replace <code>ADMIN_SECRET_KEY</code> in Vercel with the output
            of <code>openssl rand -base64 32</code>.
          </p>
        </div>
      )}

      <h2>Status</h2>
      <div className="status-line">
        <span className="status-word">{open ? 'Open' : 'Closed'}</span>
        <span>{open ? 'Students can take the Compass now.' : 'Students see a closed notice.'}</span>
      </div>
      <AdminControls open={open} />

      <h2>Responses to version {SITE.instrumentVersion}</h2>
      {summaryError && (
        <div className="notice">
          <p>Could not read the response sheet: {summaryError}</p>
        </div>
      )}
      {summary && (
        <>
          <table className="stats">
            <tbody>
              <tr>
                <th scope="row">Total responses</th>
                <td>{summary.total}</td>
              </tr>
              <tr>
                <th scope="row">Most recent</th>
                <td>{when(summary.latest)}</td>
              </tr>
              {['1', '2', '3'].map((t) => (
                <tr key={t}>
                  <th scope="row">{TIER_NAMES[t]}</th>
                  <td>{summary!.byTier[t] ?? 0}</td>
                </tr>
              ))}
              {Object.entries(summary.byIntake)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([intake, count]) => (
                  <tr key={intake}>
                    <th scope="row">Intake {intake}</th>
                    <td>{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p>
            Responses are written to the <strong>{summary.tab}</strong> tab
            {summary.sheetUrl ? (
              <>
                {' '}
                of the{' '}
                <a href={summary.sheetUrl} target="_blank" rel="noopener noreferrer">
                  Compass response sheet
                </a>
              </>
            ) : null}
            . Version 1 responses stay untouched in the <strong>Responses</strong> tab. The codebook tab explains every
            column and flag.
          </p>
        </>
      )}
    </div>
  );
}
