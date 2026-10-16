// What the student sees at the end: a letter, not a dashboard. No scores,
// no traffic lights, no ranking. Feedback that points at the self rather
// than at the next task tends to lower performance (Kluger & DeNisi, 1996),
// so every observation here comes paired with something to do.

import { optionLabel } from './instrument';
import type { Assessment } from './scoring';
import { STEPS, checkinStep, type Step } from './steps';
import type { Submission } from './submission';

export type Band = 'strength' | 'steady' | 'work';

export interface ProfileLine {
  area: string;
  band: Band;
  text: string;
}

export interface LetterData {
  firstName: string;
  date: string;
  isNew: boolean;
  strengths: string[];
  profile: ProfileLine[];
  /** Replaces the profile table when most areas are low. */
  profileNote: string;
  steps: Step[];
  wellbeing: 'urgent' | 'low' | 'ok' | 'unknown';
  contact: string;
  settling: string;
}

export const BAND_LABEL: Record<Band, string> = {
  strength: 'A strength right now',
  steady: 'Steady',
  work: 'Worth working on',
};

const TEXT: Record<string, Record<Band, string>> = {
  'Study habits': {
    strength: 'You already use habits that research links to lasting learning, like planning ahead and testing yourself.',
    steady: 'Some of your habits are working. Small swaps, like testing yourself instead of rereading, make the biggest difference.',
    work: 'Your studying could be working harder for you. This is one of the most fixable things there is.',
  },
  Confidence: {
    strength: 'You trust yourself with hard material. Keep putting that trust to work on difficult tasks.',
    steady: 'You feel fairly sure of yourself, with some doubts. Confidence grows fastest from small, early wins.',
    work: 'You are not yet sure you can do well here. Confidence usually follows practice and support, so start with one small step.',
  },
  Direction: {
    strength: 'You know what you want from your degree. Hold on to that when the term gets busy.',
    steady: 'You have a rough sense of direction. Talking it through with someone can sharpen it.',
    work: 'You are still working out where your degree is taking you. Plenty of students are, and it helps to talk it through.',
  },
  Belonging: {
    strength: 'You feel at home at ALCHE.',
    steady: 'You feel you belong some of the time. That is common, especially early on.',
    work: 'You are not sure yet whether you belong here. Many students feel this, and it usually eases as you find your people.',
  },
  'Asking for help': {
    strength: 'You are comfortable asking for help, one of the most useful habits a student can have.',
    steady: 'You will ask for help, though it is not always easy.',
    work: 'Asking for help does not come easily to you. Students who ask early tend to do better, so we would rather hear from you too soon than too late.',
  },
};

function band(score: number): Band {
  if (score >= 70) return 'strength';
  if (score >= 45) return 'steady';
  return 'work';
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? full;
}

function contactLine(a: Assessment, pref: string | undefined): string {
  const how =
    pref === 'whatsapp' ? 'on WhatsApp' : pref === 'in-person' ? 'in person on campus' : pref === 'email' ? 'by email' : 'by email';
  if (a.tier === 1) {
    return `Because of some of your answers, someone from Student Success will check in with you ${how} within two working days.`;
  }
  if (a.tier === 2) {
    if (pref === 'self') {
      return 'You told us you would rather reach out yourself, so we will leave that to you. Our door is open whenever you want it.';
    }
    return `Someone from Student Success will be in touch ${how} within the next two weeks.`;
  }
  return 'You do not need to do anything else. We will send every student details of workshops and peer sessions during the term.';
}

export function buildLetter(s: Submission, a: Assessment, now = new Date()): LetterData {
  const { indices } = a;
  const areas: [string, number | null][] = [
    ['Study habits', indices.studyHabits],
    ['Confidence', indices.confidence],
    ['Direction', indices.direction],
    ['Belonging', indices.belonging],
    ['Asking for help', indices.helpSeeking],
  ];
  const profile: ProfileLine[] = areas
    .filter((x): x is [string, number] => x[1] !== null)
    .map(([area, score]) => ({ area, band: band(score), text: TEXT[area][band(score)] }));

  const chosen = s.answers.N1;
  const strengths = Array.isArray(chosen) ? chosen.map((v) => optionLabel('N1', v)) : [];

  // Five "worth working on" rows in a row reads as a verdict. When most areas
  // are low, say it once, kindly, and let the next steps do the work.
  const lowAreas = profile.filter((p) => p.band === 'work').length;
  const profileNote =
    lowAreas >= 3
      ? 'Your answers describe a term that is asking a lot of you right now. Student Success exists for exactly this. The steps above are the place to start, and we will help you with each of them.'
      : '';

  const wellbeing =
    indices.wellbeing === null ? 'unknown' : indices.wellbeing <= 28 ? 'urgent' : indices.wellbeing < 50 ? 'low' : 'ok';

  const settling = a.isNew
    ? 'Almost every new student wonders at some point whether they really fit in. It is a normal part of starting somewhere new, and for most people it eases as they get to know others and find their feet. If it lasts, or gets heavier, tell us.'
    : 'Most students have at least one term that feels harder than the rest. A hard term says more about the term than about you, and it is easier to turn around with someone in your corner.';

  return {
    firstName: firstName(s.profile.name),
    date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Indian/Mauritius' }),
    isNew: a.isNew,
    strengths,
    profile: profileNote ? [] : profile,
    profileNote,
    steps: a.steps.map((c) => (c === 'checkin' ? checkinStep(a.talkAbout) : STEPS[c])),
    wellbeing,
    contact: contactLine(a, typeof s.answers.N5 === 'string' ? s.answers.N5 : undefined),
    settling,
  };
}
