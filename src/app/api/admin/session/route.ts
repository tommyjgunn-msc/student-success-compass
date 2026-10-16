import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_HOURS,
  adminConfigured,
  clientIp,
  createSessionToken,
  passwordMatches,
  rateLimited,
  readJsonBody,
  sameOrigin,
} from '@/lib/security';

export const dynamic = 'force-dynamic';

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Sign in.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: 'Refused.' }, { status: 403 });
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: 'ADMIN_SECRET_KEY is missing or too short on the server.' }, { status: 503 });
  }
  if (rateLimited(`login:${clientIp(req)}`, 8, 15 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  let password = '';
  try {
    const body = (await readJsonBody(req, 2_000)) as { password?: unknown };
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ ok: false, error: 'That password is not right.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), { ...cookieBase, maxAge: SESSION_HOURS * 3600 });
  return res;
}

// Sign out.
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: 'Refused.' }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { ...cookieBase, maxAge: 0 });
  return res;
}
