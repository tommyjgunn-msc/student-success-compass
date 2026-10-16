'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignIn() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || 'Sign-in failed.');
      setPassword('');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label className="field__label" htmlFor="password">
          Admin password
        </label>
        <input
          id="password"
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="field__hint">This is the ADMIN_SECRET_KEY set in Vercel. Signing in lasts eight hours on this browser.</p>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="button" disabled={busy || !password}>
        {busy ? 'Signing in' : 'Sign in'}
      </button>
    </form>
  );
}

export function AdminControls({ open }: { open: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function toggle() {
    const next = !open;
    if (!next && !window.confirm('Close the Compass? Students part-way through will not be able to send their answers.')) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ open: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not change the status.');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.refresh();
  }

  return (
    <>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="letter-actions">
        <button type="button" className="button" onClick={toggle} disabled={busy}>
          {busy ? 'Saving' : open ? 'Close the Compass' : 'Open the Compass'}
        </button>
        <button type="button" className="button button--quiet" onClick={signOut}>
          Sign out
        </button>
      </div>
    </>
  );
}
