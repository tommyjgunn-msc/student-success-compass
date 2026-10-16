// Scoring runs on the server only. The browser sends raw answers; it never
// sends scores, so nobody can change what Student Success sees by editing a
// request. The same functions are unit-tested in tests/scoring.test.ts.

import { ITEM_BY_ID, type Answers } from './instrument';
import { CONVERSATIONS, type StepCode } from './steps';

export interface Indices {
  /** Planning, starting early, self-testing, spacing, focus. */
  studyHabits: number | null;
  /** Academic self-efficacy: hardest material, assessments, deadlines. */
  confidence: number | null;
  /** Goal clarity, relevance of courses, programme fit. */
  direction: number | null;
  /** Inverse of belonging uncertainty (Walton & Cohen, 2007). */
  belonging: number | null;
  /** Asking classmates or lecturers, first move when struggling, comfort asking. */
  helpSeeking: number | null;
  /** WHO-5 percentage score, 0 to 100. */
  wellbeing: number | null;
  /** Mean of the five engagement indices; the self-report input to Compass Weekly. */
  engagement: number | null;
}

export type FlagCode =
  | 'WELLBEING_URGENT'
  | 'WELLBEING_LOW'
  | 'MONEY'
  | 'ACCESS'
  | 'LOAD'
  | 'CONNECTION'
  | 'HELP_AVOIDANT'
  | 'LEARNING_SUPPORT'
  | 'TRANSITION'
  | 'UNAWARE'
  | 'STUDY_STRATEGIES'
  | 'TIME'
  | 'DIRECTION'
  | 'WRITING'
  | 'READING'
  | 'NUMBERS'
  | 'SPEAKING'
  | 'RESEARCH';

/** Plain descriptions for staff, written into the sheet and the codebook. */
export const FLAG_INFO: Record<FlagCode, string> = {
  WELLBEING_URGENT: 'WHO-5 score of 28 or below. Check in within two working days and offer a counselling referral.',
  WELLBEING_LOW: 'WHO-5 score below 50, the WHO cut-off for poor wellbeing. Offer a wellbeing conversation.',
  MONEY: 'Often or almost always worries about money for food, rent or transport.',
  ACCESS: 'No reliable laptop, internet, or both.',
  LOAD: 'More than 20 hours a week of paid work or caring.',
  CONNECTION: 'Low sense of belonging, or nobody at ALCHE to turn to.',
  HELP_AVOIDANT: 'Would wait or keep it to themselves when struggling, or finds asking for help very uncomfortable. Will not come to us; we go to them.',
  LEARNING_SUPPORT: 'Wants to talk about a disability or learning difference, or thinks they may have one and has never been assessed.',
  TRANSITION: 'New student used to lecture-and-exam schooling, or continuing student whose last term was harder than expected.',
  UNAWARE: 'Continuing student who did not know Student Success support existed.',
  STUDY_STRATEGIES: 'Study habits score below 50, or relies on rereading and rarely self-tests.',
  TIME: 'Rarely plans the week or starts early, or has little confidence in handling several deadlines.',
  DIRECTION: 'Direction score below 50, or unsure the programme is right for them.',
  WRITING: 'Little or no confidence writing an essay or report in English.',
  READING: 'Little or no confidence reading long academic texts in English.',
  NUMBERS: 'Little or no confidence with numbers, data and charts.',
  SPEAKING: 'Little or no confidence presenting to a group.',
  RESEARCH: 'Little or no confidence finding and judging sources.',
};

const WELFARE: FlagCode[] = ['WELLBEING_LOW', 'MONEY', 'ACCESS', 'LOAD', 'CONNECTION', 'HELP_AVOIDANT'];
const SKILLS: FlagCode[] = ['WRITING', 'READING', 'NUMBERS', 'SPEAKING', 'RESEARCH', 'STUDY_STRATEGIES', 'TIME'];

export type Tier = 1 | 2 | 3;

export const TIER_LABEL: Record<Tier, string> = {
  1: '1 Contact within 2 working days',
  2: '2 Contact within 2 weeks',
  3: '3 Welcome only',
};

export interface Assessment {
  isNew: boolean;
  indices: Indices;
  flags: FlagCode[];
  tier: Tier;
  steps: StepCode[];
  /** Topics folded into the 'checkin' step, when it is used. */
  talkAbout: StepCode[];
  quality: string[];
  requested: string[];
}

// ---- helpers -----------------------------------------------------------------

function single(answers: Answers, id: string): string | undefined {
  const v = answers[id];
  return typeof v === 'string' && v !== '' ? v : undefined;
}

function multi(answers: Answers, id: string): string[] {
  const v = answers[id];
  return Array.isArray(v) ? v : [];
}

/** The option score for an answered item, or null when skipped or unscored. */
export function itemScore(answers: Answers, id: string): number | null {
  const item = ITEM_BY_ID[id];
  const v = single(answers, id);
  if (!item || item.kind === 'text' || v === undefined) return null;
  const s = item.options.find((o) => o.value === v)?.score;
  return typeof s === 'number' ? s : null;
}

/**
 * Mean of the answered items rescaled to 0..100, or null when fewer than half
 * were answered. `min` and `max` are the item scale's end points.
 */
function index(answers: Answers, ids: string[], min: number, max: number): number | null {
  const scores = ids.map((id) => itemScore(answers, id)).filter((s): s is number => s !== null);
  if (scores.length < Math.ceil(ids.length / 2)) return null;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(((mean - min) / (max - min)) * 100);
}

function meanOf(values: (number | null)[], minCount: number): number | null {
  const present = values.filter((v): v is number => v !== null);
  if (present.length < minCount) return null;
  return Math.round(present.reduce((a, b) => a + b, 0) / present.length);
}

// ---- scoring -----------------------------------------------------------------

export function computeIndices(answers: Answers): Indices {
  const studyHabits = index(answers, ['H1', 'H2', 'H3', 'H4', 'H7'], 1, 5);
  const confidence = index(answers, ['C1', 'C2', 'C3'], 1, 5);
  const direction = index(answers, ['P1', 'P2', 'P3'], 1, 5);
  const belonging = index(answers, ['B1', 'B2', 'B3'], 1, 5);

  // Three help-seeking signals on different scales, each rescaled to 0..1 first.
  const parts: (number | null)[] = [
    itemScore(answers, 'H6') === null ? null : ((itemScore(answers, 'H6') as number) - 1) / 4,
    itemScore(answers, 'B5'),
    itemScore(answers, 'B6') === null ? null : ((itemScore(answers, 'B6') as number) - 1) / 3,
  ];
  const presentParts = parts.filter((p): p is number => p !== null);
  const helpSeeking =
    presentParts.length >= 2 ? Math.round((presentParts.reduce((a, b) => a + b, 0) / presentParts.length) * 100) : null;

  // WHO-5: raw 0..25, times four. Prorated when exactly one item is skipped.
  const who = ['W1', 'W2', 'W3', 'W4', 'W5'].map((id) => itemScore(answers, id)).filter((s): s is number => s !== null);
  const wellbeing = who.length >= 4 ? Math.round((who.reduce((a, b) => a + b, 0) / who.length) * 5 * 4) : null;

  const engagement = meanOf([studyHabits, confidence, direction, belonging, helpSeeking], 3);

  return { studyHabits, confidence, direction, belonging, helpSeeking, wellbeing, engagement };
}

export function computeFlags(answers: Answers, indices: Indices, isNew: boolean): FlagCode[] {
  const flags = new Set<FlagCode>();
  const s = (id: string) => single(answers, id);
  const low = (id: string) => {
    const v = itemScore(answers, id);
    return v !== null && v <= 2;
  };

  if (indices.wellbeing !== null) {
    if (indices.wellbeing <= 28) flags.add('WELLBEING_URGENT');
    if (indices.wellbeing < 50) flags.add('WELLBEING_LOW');
  }
  if (['often', 'always'].includes(s('S10') ?? '')) flags.add('MONEY');
  if (['laptop-only', 'internet-only', 'neither'].includes(s('S8') ?? '')) flags.add('ACCESS');
  if (s('S9') === '20+') flags.add('LOAD');

  // A brand-new student with nobody "yet" is normal in week one; only "No" counts.
  const alone = s('B4') === 'no' || (!isNew && s('B4') === 'not-yet');
  if (alone || (indices.belonging !== null && indices.belonging < 40)) flags.add('CONNECTION');

  if (['wait', 'alone'].includes(s('B5') ?? '') || s('B6') === 'very-uncomfortable') flags.add('HELP_AVOIDANT');
  if (['yes-talk', 'maybe'].includes(s('N3') ?? '')) flags.add('LEARNING_SUPPORT');

  if ((isNew && s('S6') === 'lecture-exam') || (!isNew && ['harder', 'much-harder'].includes(s('S3') ?? ''))) {
    flags.add('TRANSITION');
  }
  if (!isNew && s('S11') === 'unaware') flags.add('UNAWARE');

  const rereads = (itemScore(answers, 'H5') ?? 0) >= 4;
  const selfTests = itemScore(answers, 'H3');
  if ((indices.studyHabits !== null && indices.studyHabits < 50) || (rereads && selfTests !== null && selfTests <= 2)) {
    flags.add('STUDY_STRATEGIES');
  }
  if (low('H1') || low('H2') || low('C3')) flags.add('TIME');
  if ((indices.direction !== null && indices.direction < 50) || low('P3')) flags.add('DIRECTION');

  if (low('C5')) flags.add('WRITING');
  if (low('C4')) flags.add('READING');
  if (low('C6')) flags.add('NUMBERS');
  if (low('C7')) flags.add('SPEAKING');
  if (low('C8')) flags.add('RESEARCH');

  return Array.from(flags);
}

export function computeTier(flags: FlagCode[], requested: string[]): Tier {
  const has = (f: FlagCode) => flags.includes(f);
  const welfare = WELFARE.filter(has).length;
  const skills = SKILLS.filter(has).length;

  if (has('WELLBEING_URGENT')) return 1;
  if (has('HELP_AVOIDANT') && (has('WELLBEING_LOW') || has('MONEY') || has('CONNECTION'))) return 1;
  if (welfare >= 3) return 1;

  if (welfare >= 1 || has('LEARNING_SUPPORT') || requested.length > 0 || skills >= 2) return 2;
  if (has('TRANSITION') && has('STUDY_STRATEGIES')) return 2;
  return 3;
}

// Which offer answers which request or flag. Order inside each list matters.
const REQUEST_TO_STEP: Record<string, StepCode> = {
  writing: 'writing',
  research: 'library',
  numbers: 'peer-recap',
  speaking: 'speaking',
  time: 'time',
  study: 'studenting',
  wellbeing: 'wellbeing',
  money: 'money',
  settling: 'peer-recap',
  career: 'career',
};

const FLAG_TO_STEP: [FlagCode, StepCode][] = [
  ['HELP_AVOIDANT', 'office-hours'],
  ['STUDY_STRATEGIES', 'studenting'],
  ['TIME', 'time'],
  ['WRITING', 'writing'],
  ['READING', 'library'],
  ['RESEARCH', 'library'],
  ['NUMBERS', 'peer-recap'],
  ['CONNECTION', 'peer-recap'],
  ['SPEAKING', 'speaking'],
  ['DIRECTION', 'career'],
  ['TRANSITION', 'studenting'],
  ['UNAWARE', 'office-hours'],
];

export const MAX_STEPS = 4;

// Studenting 101 includes the Public Speaking session, so it stands in for it.
const COVERED_BY: Partial<Record<StepCode, StepCode>> = { speaking: 'studenting' };

export function chooseSteps(flags: FlagCode[], requested: string[], helpSeeking: number | null = null): StepCode[] {
  const out: StepCode[] = [];
  const add = (c: StepCode) => {
    const cover = COVERED_BY[c];
    if (cover && out.includes(cover)) return;
    const covered = (Object.keys(COVERED_BY) as StepCode[]).find((k) => COVERED_BY[k] === c && out.includes(k));
    if (covered) {
      out[out.indexOf(covered)] = c;
      return;
    }
    if (!out.includes(c)) out.push(c);
  };
  const has = (f: FlagCode) => flags.includes(f);

  // Safety and access first: these unblock everything else.
  if (has('WELLBEING_LOW')) add('wellbeing');
  if (has('LEARNING_SUPPORT')) add('learning-support');
  if (has('MONEY')) add('money');
  if (has('ACCESS')) add('access');

  // Then what the student asked for, in the order they chose it.
  for (const r of requested) {
    const step = REQUEST_TO_STEP[r];
    if (step) add(step);
  }

  // Then what their answers suggest. Students who find asking hard get a
  // named person early, because they are the least likely to come to us.
  if (helpSeeking !== null && helpSeeking < 45) add('office-hours');
  for (const [flag, step] of FLAG_TO_STEP) if (has(flag)) add(step);

  // Everyone leaves with at least two concrete things to do.
  if (out.length < 2) add('studenting');
  if (out.length < 2) add('peer-recap');

  return out;
}

/**
 * Folds two or more "tell us about it" offers into one check-in step, then
 * caps the list. Returns the steps and the topics folded into the check-in.
 */
export function composeSteps(candidates: StepCode[]): { steps: StepCode[]; talkAbout: StepCode[] } {
  const talkAbout = candidates.filter((c) => CONVERSATIONS.includes(c));
  if (talkAbout.length < 2) return { steps: candidates.slice(0, MAX_STEPS), talkAbout: [] };
  const first = candidates.findIndex((c) => CONVERSATIONS.includes(c));
  const steps = candidates.filter((c, i) => i === first || !CONVERSATIONS.includes(c));
  steps[first] = 'checkin';
  return { steps: steps.slice(0, MAX_STEPS), talkAbout };
}

export function qualityChecks(answers: Answers, seconds: number): string[] {
  const out: string[] = [];
  if (seconds < 150) out.push('fast');
  const same = (ids: string[]) => {
    const vals = ids.map((id) => single(answers, id)).filter(Boolean);
    return vals.length === ids.length && new Set(vals).size === 1;
  };
  // H7 is reverse-worded, so identical answers across H1 to H7 are contradictory.
  if (same(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7']) && same(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'])) {
    out.push('straightline');
  }
  return out;
}

export function assess(answers: Answers, isNew: boolean, seconds: number): Assessment {
  const indices = computeIndices(answers);
  const flags = computeFlags(answers, indices, isNew);
  const requested = multi(answers, 'N2').filter((v) => v !== 'nothing');
  const tier = computeTier(flags, requested);
  const { steps, talkAbout } = composeSteps(chooseSteps(flags, requested, indices.helpSeeking));
  return { isNew, indices, flags, tier, steps, talkAbout, quality: qualityChecks(answers, seconds), requested };
}
