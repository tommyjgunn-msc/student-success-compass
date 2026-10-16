// Server-side validation of a submission. Anything the instrument does not
// define is rejected; answers to questions the student should not have seen
// are dropped. Free text is trimmed and stripped of control characters.

import { CURRENT_INTAKE, INTAKES, PROGRAMMES, SITE } from './config';
import { ALL_ITEMS, isVisible, type Answers } from './instrument';

export interface Profile {
  name: string;
  email: string;
  intake: string;
  programme: string;
}

export interface Submission {
  submissionId: string;
  startedAt: number;
  consentVersion: string;
  profile: Profile;
  answers: Answers;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NAME = /^[\p{L}\p{M}' .-]{2,80}$/u;
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

export function cleanText(s: string, max: number): string {
  return s
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

export function isNewIntake(intake: string): boolean {
  return intake === CURRENT_INTAKE;
}

export function validateProfile(p: unknown): Result<Profile> {
  if (!p || typeof p !== 'object') return { ok: false, error: 'Missing details about you.' };
  const r = p as Record<string, unknown>;
  const name = typeof r.name === 'string' ? cleanText(r.name, 80).replace(/\s+/g, ' ') : '';
  const email = typeof r.email === 'string' ? r.email.trim().toLowerCase() : '';
  const intake = typeof r.intake === 'string' ? r.intake : '';
  const programme = typeof r.programme === 'string' ? r.programme : '';

  if (!NAME.test(name)) return { ok: false, error: 'Please enter your full name using letters only.' };
  if (email.length > 120 || !EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (!INTAKES.some((i) => i.value === intake)) return { ok: false, error: 'Please choose your intake.' };
  if (!PROGRAMMES.some((p) => p.value === programme)) return { ok: false, error: 'Please choose your programme.' };
  return { ok: true, value: { name, email, intake, programme } };
}

export function validateAnswers(raw: unknown, isNew: boolean): Result<Answers> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'Answers are missing.' };
  const input = raw as Record<string, unknown>;
  const known = new Set(ALL_ITEMS.map((i) => i.id));
  for (const key of Object.keys(input)) {
    if (!known.has(key)) return { ok: false, error: `Unknown question ${key.slice(0, 12)}.` };
  }

  const out: Answers = {};
  // Items are walked in order so that showIf can see earlier answers.
  for (const item of ALL_ITEMS) {
    const v = input[item.id];
    if (v === undefined || v === null || v === '') continue;

    if (item.kind === 'single') {
      if (typeof v !== 'string' || !item.options.some((o) => o.value === v)) {
        return { ok: false, error: `Invalid answer for ${item.id}.` };
      }
      out[item.id] = v;
    } else if (item.kind === 'multi') {
      if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) return { ok: false, error: `Invalid answer for ${item.id}.` };
      const values = Array.from(new Set(v as string[]));
      if (values.length > item.max) return { ok: false, error: `Too many choices for ${item.id}.` };
      if (values.some((x) => !item.options.some((o) => o.value === x))) return { ok: false, error: `Invalid answer for ${item.id}.` };
      if (item.exclusive && values.includes(item.exclusive) && values.length > 1) {
        return { ok: false, error: `Invalid combination for ${item.id}.` };
      }
      if (values.length) out[item.id] = values;
    } else {
      if (typeof v !== 'string') return { ok: false, error: `Invalid answer for ${item.id}.` };
      const text = cleanText(v, item.maxLength);
      if (!text) continue;
      if (item.pattern && !new RegExp(item.pattern).test(text)) {
        return { ok: false, error: `Please check your answer to ${item.id}.` };
      }
      out[item.id] = text;
    }
  }

  // Drop answers to questions this student should not have been shown.
  for (const item of ALL_ITEMS) {
    if (item.id in out && !isVisible(item, isNew, out)) delete out[item.id];
  }
  return { ok: true, value: out };
}

export function validateSubmission(input: unknown, now = Date.now()): Result<Submission> {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Empty submission.' };
  const r = input as Record<string, unknown>;

  // Honeypot: a field people never see. Bots fill it in.
  if (typeof r.website === 'string' && r.website.length > 0) return { ok: false, error: 'Submission rejected.' };

  if (typeof r.submissionId !== 'string' || !UUID.test(r.submissionId)) return { ok: false, error: 'Missing submission id.' };
  if (r.consentVersion !== SITE.consentVersion) return { ok: false, error: 'Please agree to the privacy notice first.' };

  const startedAt = typeof r.startedAt === 'number' ? r.startedAt : NaN;
  if (!Number.isFinite(startedAt) || startedAt > now + 5 * 60_000 || startedAt < now - 24 * 3_600_000) {
    return { ok: false, error: 'This session has expired. Please start again.' };
  }

  const profile = validateProfile(r.profile);
  if (!profile.ok) return profile;
  const answers = validateAnswers(r.answers, isNewIntake(profile.value.intake));
  if (!answers.ok) return answers;

  return {
    ok: true,
    value: {
      submissionId: r.submissionId.toLowerCase(),
      startedAt,
      consentVersion: r.consentVersion,
      profile: profile.value,
      answers: answers.value,
    },
  };
}
