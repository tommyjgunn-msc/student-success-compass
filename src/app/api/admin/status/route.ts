import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, readJsonBody, sameOrigin, verifySessionToken } from '@/lib/security';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Open or close the Compass. Writes "open" or "closed" to Config!A2, the same
// cell version 1 used, so either version reads the same switch.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: 'Refused.' }, { status: 403 });
  const jar = await cookies();
  if (!verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Please sign in again.' }, { status: 401 });
  }

  let open: boolean;
  try {
    const body = (await readJsonBody(req, 200)) as { open?: unknown };
    if (typeof body.open !== 'boolean') throw new Error();
    open = body.open;
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 });
  }

  try {
    await getStore().setOpen(open);
  } catch (e) {
    console.error('Compass status update failed:', (e as Error).message);
    return NextResponse.json({ ok: false, error: 'Could not reach the Google Sheet.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, open });
}
