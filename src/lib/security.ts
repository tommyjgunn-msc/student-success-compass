import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// ---- Admin session --------------------------------------------------------
// The admin password is ADMIN_SECRET_KEY. Signing in sets an HttpOnly,
// SameSite=Strict cookie holding an expiry signed with a key derived from
// that password, so rotating the password signs everyone out. The password
// never appears in a URL, a log line, or the browser's history.

export const SESSION_HOURS = 8;
export const SESSION_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-compass_admin' : 'compass_admin';

function adminSecret(): string | null {
  const k = process.env.ADMIN_SECRET_KEY;
  return k && k.length >= 12 ? k : null;
}

export function adminConfigured(): boolean {
  return adminSecret() !== null;
}

export function adminKeyIsWeak(): boolean {
  const k = adminSecret();
  return !!k && k.length < 24;
}

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest();

export function passwordMatches(input: string): boolean {
  const secret = adminSecret();
  if (!secret || typeof input !== 'string' || input.length > 512) return false;
  // Hash both sides first so the comparison is constant-time whatever the length.
  return timingSafeEqual(sha256(input), sha256(secret));
}

function signingKey(secret: string): Buffer {
  return createHmac('sha256', secret).update('compass-admin-session-v1').digest();
}

export function createSessionToken(now = Date.now()): string {
  const secret = adminSecret();
  if (!secret) throw new Error('Admin is not configured.');
  const payload = Buffer.from(JSON.stringify({ exp: now + SESSION_HOURS * 3_600_000 })).toString('base64url');
  const sig = createHmac('sha256', signingKey(secret)).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  const secret = adminSecret();
  if (!secret || !token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = createHmac('sha256', signingKey(secret)).update(payload).digest();
  const given = Buffer.from(sig, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp: number };
    return typeof exp === 'number' && exp > now;
  } catch {
    return false;
  }
}

// ---- Requests -------------------------------------------------------------

/** Cross-site POSTs are refused: the Origin must be this site. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

// ---- Rate limiting --------------------------------------------------------
// Per server instance, so it slows a scripted attack rather than stopping a
// distributed one. Limits are generous because a whole orientation room
// shares one campus IP address. For a hard limit, add a Vercel Firewall rule.

const buckets = new Map<string, number[]>();

export function rateLimited(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return false;
}

export async function readJsonBody(req: Request, maxBytes: number): Promise<unknown> {
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (declared > maxBytes) throw new Error('too-large');
  const text = await req.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) throw new Error('too-large');
  return JSON.parse(text);
}
