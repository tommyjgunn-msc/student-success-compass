import { describe, expect, it } from 'vitest';
import { ALL_ITEMS, type Answers } from '../src/lib/instrument';
import { buildLetter } from '../src/lib/letter';
import { HEADERS, buildRow, codebookRows, defuse } from '../src/lib/row';
import { assess, chooseSteps, composeSteps, computeIndices, computeTier } from '../src/lib/scoring';
import { validateSubmission } from '../src/lib/submission';

// A settled continuing student: favourable answers everywhere.
const thriving: Answers = {
  S1: 'excited', S3: 'better', S4: 'yes', S5: 'english', S7: 'family', S8: 'both', S9: '0', S10: 'never', S11: 'often',
  H1: 'always', H2: 'often', H3: 'often', H4: 'often', H5: 'rarely', H6: 'often', H7: 'never',
  C1: '4', C2: '4', C3: '4', C4: '5', C5: '4', C6: '4', C7: '4', C8: '4',
  P1: '5', P2: '4', P3: '5',
  B1: '1', B2: '1', B3: '5', B4: 'several', B5: 'lecturer', B6: 'easy',
  W1: '4', W2: '4', W3: '4', W4: '3', W5: '4',
  N1: ['writing', 'teamwork'], N2: ['nothing'], N4: 'workshop', N5: 'email',
};

// A new student in difficulty who will not ask for help.
const struggling: Answers = {
  S1: 'nervous', S2: 'first', S4: 'no', S5: 'french', S6: 'lecture-exam', S7: 'away-first', S8: 'internet-only', S9: '11-20', S10: 'often',
  H1: 'rarely', H2: 'never', H3: 'never', H4: 'rarely', H5: 'always', H6: 'never', H7: 'always',
  C1: '2', C2: '2', C3: '1', C4: '2', C5: '1', C6: '3', C7: '1', C8: '2',
  P1: '2', P2: '3', P3: '2',
  B1: '5', B2: '4', B3: '2', B4: 'not-yet', B5: 'alone', B6: 'very-uncomfortable',
  W1: '1', W2: '1', W3: '1', W4: '0', W5: '2',
  N1: ['persistence'], N2: ['writing', 'money'], N3: 'maybe', N4: 'one-to-one', N5: 'whatsapp', N6: '+230 5123 4567',
};

describe('indices', () => {
  it('scores the WHO-5 as raw total times four', () => {
    expect(computeIndices(thriving).wellbeing).toBe((4 + 4 + 4 + 3 + 4) * 4);
    expect(computeIndices(struggling).wellbeing).toBe((1 + 1 + 1 + 0 + 2) * 4);
  });

  it('reverses the two belonging-uncertainty items', () => {
    expect(computeIndices(thriving).belonging).toBe(100);
    expect(computeIndices(struggling).belonging).toBeLessThan(30);
  });

  it('returns null rather than guessing when most of a scale is skipped', () => {
    const sparse: Answers = { C1: '5' };
    expect(computeIndices(sparse).confidence).toBeNull();
    expect(computeIndices(sparse).engagement).toBeNull();
  });

  it('keeps every index within 0 to 100', () => {
    for (const a of [thriving, struggling]) {
      for (const v of Object.values(computeIndices(a))) {
        if (v !== null) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});

describe('triage', () => {
  it('puts a thriving student in tier 3 with two default steps', () => {
    const a = assess(thriving, false, 600);
    expect(a.tier).toBe(3);
    expect(a.flags).toEqual([]);
    expect(a.steps).toEqual(['studenting', 'peer-recap']);
  });

  it('puts a struggling, help-avoidant student in tier 1 with wellbeing first', () => {
    const a = assess(struggling, true, 600);
    expect(a.tier).toBe(1);
    expect(a.flags).toEqual(expect.arrayContaining(['WELLBEING_URGENT', 'MONEY', 'ACCESS', 'HELP_AVOIDANT', 'LEARNING_SUPPORT', 'TRANSITION']));
    expect(a.steps[0]).toBe('wellbeing');
    expect(a.steps.length).toBeLessThanOrEqual(4);
  });

  it('does not flag a brand-new student for having nobody "yet"', () => {
    const a = assess({ ...thriving, S2: 'first', B4: 'not-yet' }, true, 600);
    expect(a.flags).not.toContain('CONNECTION');
    const b = assess({ ...thriving, B4: 'not-yet' }, false, 600);
    expect(b.flags).toContain('CONNECTION');
  });

  it('never offers Studenting 101 twice', () => {
    expect(chooseSteps(['STUDY_STRATEGIES'], ['writing', 'speaking'])).toEqual(['writing', 'studenting']);
    expect(chooseSteps(['SPEAKING', 'STUDY_STRATEGIES'], [])).toEqual(['studenting', 'peer-recap']);
    expect(chooseSteps([], ['speaking'])).toEqual(['studenting', 'peer-recap']);
  });

  it('folds two or more "tell us" offers into one check-in step', () => {
    const r = composeSteps(['wellbeing', 'learning-support', 'money', 'access', 'office-hours', 'studenting']);
    expect(r.steps).toEqual(['wellbeing', 'checkin', 'office-hours', 'studenting']);
    expect(r.talkAbout).toEqual(['learning-support', 'money', 'access']);
    expect(composeSteps(['money', 'writing']).steps).toEqual(['money', 'writing']);
  });

  it('offers a named person to students who find asking for help hard', () => {
    expect(chooseSteps([], [], 30)).toContain('office-hours');
    expect(chooseSteps([], [], 80)).not.toContain('office-hours');
  });

  it('moves a student who asked for help to tier 2', () => {
    expect(computeTier([], ['writing'])).toBe(2);
  });

  it('flags rushed and straight-lined answers', () => {
    const flat: Answers = {};
    for (const id of ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7']) flat[id] = 'sometimes';
    for (const id of ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']) flat[id] = '3';
    expect(assess(flat, false, 90).quality).toEqual(['fast', 'straightline']);
  });
});

describe('validation', () => {
  const now = Date.now();
  const base = {
    submissionId: '3f1c2a7e-5b8d-4c9a-9e21-0d6f4b7a1c22',
    startedAt: now - 8 * 60_000,
    consentVersion: '2026-10',
    profile: { name: 'Amara  Okafor', email: 'A.Okafor@alustudent.com', intake: 'O26', programme: 'bsc-computing' },
    answers: struggling,
    website: '',
  };

  it('accepts a well-formed submission and normalises the profile', () => {
    const r = validateSubmission(base, now);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.profile.name).toBe('Amara Okafor');
      expect(r.value.profile.email).toBe('a.okafor@alustudent.com');
    }
  });

  it('rejects unknown questions, invalid options, and too many choices', () => {
    expect(validateSubmission({ ...base, answers: { ...struggling, Z9: 'x' } }, now).ok).toBe(false);
    expect(validateSubmission({ ...base, answers: { ...struggling, H1: 'sometimes-ish' } }, now).ok).toBe(false);
    expect(validateSubmission({ ...base, answers: { ...struggling, N1: ['writing', 'research', 'numbers', 'speaking'] } }, now).ok).toBe(false);
    expect(validateSubmission({ ...base, answers: { ...struggling, N2: ['nothing', 'money'] } }, now).ok).toBe(false);
  });

  it('drops answers to questions this student should not have seen', () => {
    const r = validateSubmission({ ...base, answers: { ...struggling, S3: 'harder', S11: 'unaware' } }, now);
    expect(r.ok && 'S3' in r.value.answers).toBe(false);
    const r2 = validateSubmission({ ...base, answers: { ...struggling, N5: 'email' } }, now);
    expect(r2.ok && 'N6' in r2.value.answers).toBe(false);
  });

  it('rejects the honeypot, missing consent and stale sessions', () => {
    expect(validateSubmission({ ...base, website: 'http://spam' }, now).ok).toBe(false);
    expect(validateSubmission({ ...base, consentVersion: undefined }, now).ok).toBe(false);
    expect(validateSubmission({ ...base, startedAt: now - 2 * 86_400_000 }, now).ok).toBe(false);
  });

  it('rejects names with markup and malformed emails', () => {
    expect(validateSubmission({ ...base, profile: { ...base.profile, name: '<script>' } }, now).ok).toBe(false);
    expect(validateSubmission({ ...base, profile: { ...base.profile, email: 'not-an-email' } }, now).ok).toBe(false);
  });
});

describe('sheet row and letter', () => {
  const now = new Date('2026-10-20T08:00:00Z');
  const r = validateSubmission(
    {
      submissionId: '3f1c2a7e-5b8d-4c9a-9e21-0d6f4b7a1c22',
      startedAt: now.getTime() - 9 * 60_000,
      consentVersion: '2026-10',
      profile: { name: 'Amara Okafor', email: 'a.okafor@alustudent.com', intake: 'O26', programme: 'bsc-computing' },
      answers: { ...struggling, N7: '=HYPERLINK("http://evil")' },
    },
    now.getTime(),
  );
  if (!r.ok) throw new Error(r.error);
  const a = assess(r.value.answers, true, 540);

  it('produces one cell per header, with formulas defused', () => {
    const row = buildRow(r.value, a, now.toISOString());
    expect(row).toHaveLength(HEADERS.length);
    expect(row[HEADERS.indexOf('N7')]).toBe(' =HYPERLINK("http://evil")');
    expect(row[HEADERS.indexOf('Outreach Tier')]).toMatch(/^1 /);
    expect(defuse('+230 5')).toBe(' +230 5');
  });

  it('includes every question in the codebook', () => {
    const ids = new Set(codebookRows().map((row) => row[0]));
    for (const item of ALL_ITEMS) expect(ids.has(item.id)).toBe(true);
  });

  it('writes a letter with no numbers in it and the helpline for low wellbeing', () => {
    const letter = buildLetter(r.value, a, now);
    expect(letter.firstName).toBe('Amara');
    expect(letter.wellbeing).toBe('urgent');
    const text = JSON.stringify([letter.profile, letter.profileNote]);
    expect(text).not.toMatch(/\d/);
    expect(letter.profile).toEqual([]);
    expect(letter.profileNote).toMatch(/asking a lot of you/);
    expect(letter.contact).toMatch(/two working days/);
    expect(letter.steps.map((s) => s.code)).toContain('checkin');
    expect(letter.steps.find((s) => s.code === 'checkin')?.body).toMatch(/learning support, money and your laptop or internet access/);
  });
});
