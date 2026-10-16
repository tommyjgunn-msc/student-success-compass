import { NextResponse } from 'next/server';
import { buildLetter } from '@/lib/letter';
import { buildRow } from '@/lib/row';
import { assess } from '@/lib/scoring';
import { clientIp, rateLimited, readJsonBody, sameOrigin } from '@/lib/security';
import { getStore } from '@/lib/store';
import { isNewIntake, validateSubmission } from '@/lib/submission';

export const dynamic = 'force-dynamic';

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, 'This form only accepts answers sent from the Compass itself.');
  if (rateLimited(`submit:${clientIp(req)}`, 60, 10 * 60_000)) {
    return fail(429, 'Lots of answers are arriving from your network. Please wait a minute and press send again.');
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, 32_000);
  } catch {
    return fail(400, 'We could not read your answers. Please press send again.');
  }

  const parsed = validateSubmission(body);
  if (!parsed.ok) return fail(400, parsed.error);
  const submission = parsed.value;

  const store = getStore();
  if (!(await store.isOpen())) return fail(403, 'The Compass has just closed, so we could not save your answers. Please speak to Student Success.');

  const now = new Date();
  const seconds = Math.max(0, (now.getTime() - submission.startedAt) / 1000);
  const assessment = assess(submission.answers, isNewIntake(submission.profile.intake), seconds);

  try {
    await store.append(buildRow(submission, assessment, now.toISOString()));
  } catch (e) {
    console.error('Compass submission failed to save:', (e as Error).message);
    return fail(502, 'We could not save your answers just now. Your answers are still here: please press send again in a minute.');
  }

  return NextResponse.json({ ok: true, letter: buildLetter(submission, assessment, now) });
}
