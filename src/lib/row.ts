// The response sheet layout and its codebook. Triage columns come first so
// staff can sort and filter without scrolling; raw answers sit to the right.

import { INTAKES, PROGRAMMES, SITE } from './config';
import { ALL_ITEMS, SECTIONS, optionLabel } from './instrument';
import { FLAG_INFO, TIER_LABEL, type Assessment, type FlagCode } from './scoring';
import { STEPS } from './steps';
import type { Submission } from './submission';

type Cell = string | number;

interface Column {
  header: string;
  note: string;
  value: (s: Submission, a: Assessment, submittedAt: string) => Cell;
}

const label = (id: string, s: Submission) => {
  const v = s.answers[id];
  if (v === undefined) return '';
  return Array.isArray(v) ? v.map((x) => optionLabel(id, x)).join('; ') : optionLabel(id, v);
};

const n = (x: number | null) => (x === null ? '' : x);

export const COLUMNS: Column[] = [
  { header: 'Submitted At', note: 'UTC, ISO 8601.', value: (_s, _a, t) => t },
  { header: 'Outreach Tier', note: 'Who to contact first. 1 within 2 working days, 2 within 2 weeks, 3 welcome email only.', value: (_s, a) => TIER_LABEL[a.tier] },
  { header: 'Name', note: 'As typed by the student.', value: (s) => s.profile.name },
  { header: 'Email', note: 'As typed by the student; lower case.', value: (s) => s.profile.email },
  { header: 'Intake', note: 'O = October, F = February, then the year.', value: (s) => INTAKES.find((i) => i.value === s.profile.intake)?.code || 'Other' },
  { header: 'Programme', note: 'Same values as version 1.', value: (s) => PROGRAMMES.find((p) => p.value === s.profile.programme)?.label ?? s.profile.programme },
  { header: 'Student Type', note: 'New = the intake arriving this term.', value: (_s, a) => (a.isNew ? 'New' : 'Continuing') },
  { header: 'Flags', note: 'Reasons to reach out. See the Flags list below.', value: (_s, a) => a.flags.join('; ') },
  { header: 'Asked For Help With', note: 'Question N2, the student’s own choice.', value: (s) => label('N2', s) },
  { header: 'Contact By', note: 'Question N5.', value: (s) => label('N5', s) },
  { header: 'WhatsApp', note: 'Question N6, optional.', value: (s) => (typeof s.answers.N6 === 'string' ? s.answers.N6 : '') },
  { header: 'Prefers', note: 'Question N4.', value: (s) => label('N4', s) },
  { header: 'Letter Steps', note: 'The next steps shown in the student’s letter, in order.', value: (_s, a) => a.steps.map((c) => STEPS[c].title).join('; ') },
  { header: 'Engagement', note: '0 to 100. Mean of the five indices to the right, excluding Wellbeing. Use this in Compass Weekly as score_total_engagement.', value: (_s, a) => n(a.indices.engagement) },
  { header: 'Study Habits', note: '0 to 100. H1, H2, H3, H4, H7 (H7 reversed).', value: (_s, a) => n(a.indices.studyHabits) },
  { header: 'Confidence', note: '0 to 100. Academic self-efficacy, C1 to C3. Strongest single psychological predictor of grades (Richardson et al., 2012).', value: (_s, a) => n(a.indices.confidence) },
  { header: 'Direction', note: '0 to 100. P1 to P3.', value: (_s, a) => n(a.indices.direction) },
  { header: 'Belonging', note: '0 to 100. B1 to B3, belonging uncertainty reversed.', value: (_s, a) => n(a.indices.belonging) },
  { header: 'Help Seeking', note: '0 to 100. H6, B5, B6.', value: (_s, a) => n(a.indices.helpSeeking) },
  { header: 'Wellbeing (WHO-5)', note: '0 to 100. Below 50 = poor wellbeing (WHO). 28 or below = check in urgently. Not a diagnosis.', value: (_s, a) => n(a.indices.wellbeing) },
  { header: 'Quality', note: 'fast = under 150 seconds; straightline = identical answers through whole sections. Treat these rows with care.', value: (_s, a) => a.quality.join('; ') },
  { header: 'Minutes Taken', note: 'From the consent screen to sending.', value: (s, _a, t) => Math.round(((Date.parse(t) - s.startedAt) / 60_000) * 10) / 10 },
  ...ALL_ITEMS.map(
    (item): Column => ({
      header: item.id,
      note: [item.lead, item.prompt].filter(Boolean).join(' '),
      value: (s) => label(item.id, s),
    }),
  ),
  { header: 'Instrument Version', note: 'Question bank version.', value: () => SITE.instrumentVersion },
  { header: 'Consent Version', note: 'Privacy notice the student agreed to.', value: (s) => s.consentVersion },
  { header: 'Submission ID', note: 'Random id, one per attempt. Duplicates mean a retried send.', value: (s) => s.submissionId },
];

export const HEADERS = COLUMNS.map((c) => c.header);

/** Text a spreadsheet might read as a formula is defused with a leading space. */
export function defuse(cell: Cell): Cell {
  return typeof cell === 'string' && /^[=+\-@\t\r]/.test(cell) ? ` ${cell}` : cell;
}

export function buildRow(s: Submission, a: Assessment, submittedAt: string): Cell[] {
  return COLUMNS.map((c) => defuse(c.value(s, a, submittedAt)));
}

/** Rows for the codebook tab: every column, every question and its options, every flag. */
export function codebookRows(): Cell[][] {
  const rows: Cell[][] = [[`Student Success Compass ${SITE.instrumentVersion}: codebook`, '', ''], ['Column', 'Meaning', 'Options']];
  for (const c of COLUMNS) {
    const item = ALL_ITEMS.find((i) => i.id === c.header);
    const options = item && item.kind !== 'text' ? item.options.map((o) => o.label).join(' | ') : item ? 'Free text' : '';
    rows.push([c.header, c.note, options]);
  }
  rows.push(['', '', ''], ['Flag', 'Meaning', '']);
  for (const [code, meaning] of Object.entries(FLAG_INFO) as [FlagCode, string][]) rows.push([code, meaning, '']);
  rows.push(['', '', ''], ['Section', 'Introduction shown to students', 'Credit']);
  for (const s of SECTIONS) rows.push([`${s.number}. ${s.title}`, s.intro, s.credit ?? '']);
  return rows.map((r) => r.map(defuse));
}
