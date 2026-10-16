// The Compass question bank, version 2.0.
//
// Every item earns its place in one of three ways: it predicts how students
// get on (the research in /about), it decides which offer Student Success
// makes, or it feeds the engagement score used by Compass Weekly. Items that
// did none of these were cut. Item ids are stable: the sheet columns, the
// codebook and the scoring all key on them, so never reuse a retired id.

export type Audience = 'all' | 'new' | 'continuing';

export interface Option {
  value: string;
  label: string;
  /** Numeric score where the item is scored. Higher is always more favourable. */
  score?: number;
}

interface BaseItem {
  id: string;
  prompt: string;
  /** A short line above the prompt, e.g. the WHO-5 time frame. */
  lead?: string;
  help?: string;
  audience?: Audience;
  /** Only shown when another item has one of these values. */
  showIf?: { item: string; in: string[] };
}

export interface SingleItem extends BaseItem {
  kind: 'single';
  options: Option[];
}

export interface MultiItem extends BaseItem {
  kind: 'multi';
  options: Option[];
  max: number;
  /** Choosing this value clears the others, e.g. "Nothing right now". */
  exclusive?: string;
}

export interface TextItem extends BaseItem {
  kind: 'text';
  maxLength: number;
  rows: number;
  inputMode?: 'text' | 'tel';
  pattern?: string;
}

export type Item = SingleItem | MultiItem | TextItem;

export interface Section {
  id: string;
  number: number;
  title: string;
  intro: string;
  items: Item[];
  credit?: string;
}

// ---- Shared response scales ------------------------------------------------
// Item-specific wording rather than agree/disagree wherever the construct
// allows: it gives better data and is easier to answer (Saris et al., 2010).

const frequency: Option[] = [
  { value: 'never', label: 'Never', score: 1 },
  { value: 'rarely', label: 'Rarely', score: 2 },
  { value: 'sometimes', label: 'Sometimes', score: 3 },
  { value: 'often', label: 'Often', score: 4 },
  { value: 'always', label: 'Always', score: 5 },
];

const frequencyReversed: Option[] = frequency.map((o) => ({ ...o, score: 6 - (o.score as number) }));

const confidence: Option[] = [
  { value: '1', label: 'Not at all confident', score: 1 },
  { value: '2', label: 'A little confident', score: 2 },
  { value: '3', label: 'Fairly confident', score: 3 },
  { value: '4', label: 'Very confident', score: 4 },
  { value: '5', label: 'Completely confident', score: 5 },
];

const agreement: Option[] = [
  { value: '1', label: 'Strongly disagree', score: 1 },
  { value: '2', label: 'Disagree', score: 2 },
  { value: '3', label: 'Neither agree nor disagree', score: 3 },
  { value: '4', label: 'Agree', score: 4 },
  { value: '5', label: 'Strongly agree', score: 5 },
];

// For the two belonging-uncertainty items, agreeing is the unfavourable answer.
const agreementReversed: Option[] = agreement.map((o) => ({ ...o, score: 6 - (o.score as number) }));

// WHO-5 response options and values, verbatim (WHO, 2024).
const who5: Option[] = [
  { value: '5', label: 'All of the time', score: 5 },
  { value: '4', label: 'Most of the time', score: 4 },
  { value: '3', label: 'More than half of the time', score: 3 },
  { value: '2', label: 'Less than half of the time', score: 2 },
  { value: '1', label: 'Some of the time', score: 1 },
  { value: '0', label: 'At no time', score: 0 },
];

const WHO5_LEAD = 'Over the last two weeks';

// ---- Sections --------------------------------------------------------------

export const SECTIONS: Section[] = [
  {
    id: 'start',
    number: 1,
    title: 'Your starting point',
    intro: 'A few questions about you and your situation this term. They help us offer the right kind of support.',
    items: [
      {
        id: 'S1',
        kind: 'single',
        prompt: 'How are you feeling about this term?',
        options: [
          { value: 'excited', label: 'Mostly excited' },
          { value: 'excited-nervous', label: 'Excited, with some nerves' },
          { value: 'nervous-excited', label: 'Nervous, with some excitement' },
          { value: 'nervous', label: 'Mostly nervous' },
          { value: 'unsure', label: 'Not sure yet' },
        ],
      },
      {
        id: 'S2',
        kind: 'single',
        audience: 'new',
        prompt: 'Is this your first time studying at university?',
        options: [
          { value: 'first', label: 'Yes, this is my first time' },
          { value: 'studied-before', label: 'No, I have studied at university before' },
          { value: 'transfer', label: 'I transferred from another university' },
        ],
      },
      {
        id: 'S3',
        kind: 'single',
        audience: 'continuing',
        prompt: 'How did your last term go?',
        options: [
          { value: 'better', label: 'Better than I expected' },
          { value: 'expected', label: 'About as I expected' },
          { value: 'harder', label: 'Harder than I expected' },
          { value: 'much-harder', label: 'Much harder than I expected' },
          { value: 'break', label: 'I am returning after a break' },
        ],
      },
      {
        id: 'S4',
        kind: 'single',
        prompt: 'Did either of your parents or guardians complete a university degree?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'I am not sure' },
        ],
      },
      {
        id: 'S5',
        kind: 'single',
        prompt: 'Which language were you mostly taught in at secondary school?',
        options: [
          { value: 'english', label: 'English' },
          { value: 'french', label: 'French' },
          { value: 'portuguese', label: 'Portuguese' },
          { value: 'arabic', label: 'Arabic' },
          { value: 'other', label: 'Another language' },
        ],
      },
      {
        id: 'S6',
        kind: 'single',
        audience: 'new',
        prompt: 'At your last school, how was most learning organised?',
        help: 'ALCHE expects you to prepare before class and learn a lot from your classmates. Knowing what you are used to helps us help you adjust.',
        options: [
          { value: 'lecture-exam', label: 'Mostly lectures, then exams' },
          { value: 'mixed', label: 'A mix of lectures and projects' },
          { value: 'project', label: 'Mostly discussion and projects' },
          { value: 'self-study', label: 'Mostly self-study or online' },
        ],
      },
      {
        id: 'S7',
        kind: 'single',
        prompt: 'Where are you living this term?',
        options: [
          { value: 'family', label: 'With my family' },
          { value: 'away-first', label: 'Away from my family, for the first time' },
          { value: 'away-before', label: 'Away from my family, and I have done this before' },
        ],
      },
      {
        id: 'S8',
        kind: 'single',
        prompt: 'Do you have reliable access to a laptop and the internet for your studies?',
        options: [
          { value: 'both', label: 'Yes, both' },
          { value: 'laptop-only', label: 'A laptop, but my internet is unreliable' },
          { value: 'internet-only', label: 'Internet, but no laptop of my own' },
          { value: 'neither', label: 'Neither, reliably' },
        ],
      },
      {
        id: 'S9',
        kind: 'single',
        prompt: 'In a typical week this term, how many hours will you spend on paid work or caring for family?',
        options: [
          { value: '0', label: 'None' },
          { value: '1-10', label: '1 to 10 hours' },
          { value: '11-20', label: '11 to 20 hours' },
          { value: '20+', label: 'More than 20 hours' },
        ],
      },
      {
        id: 'S10',
        kind: 'single',
        prompt: 'How often do you worry about having enough money for basics like food, rent or transport?',
        options: [
          { value: 'never', label: 'Never' },
          { value: 'rarely', label: 'Rarely' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Often' },
          { value: 'always', label: 'Almost always' },
        ],
      },
      {
        id: 'S11',
        kind: 'single',
        audience: 'continuing',
        prompt: 'Have you used any Student Success support before?',
        help: 'For example office hours, workshops, writing support or peer recap sessions.',
        options: [
          { value: 'often', label: 'Yes, often' },
          { value: 'once', label: 'Yes, once or twice' },
          { value: 'knew', label: 'No, but I knew it was there' },
          { value: 'unaware', label: 'No, I did not know about it' },
        ],
      },
    ],
  },
  {
    id: 'habits',
    number: 2,
    title: 'How you study',
    intro: 'Think about how you actually study, not how you feel you should. Nobody studies perfectly.',
    items: [
      { id: 'H1', kind: 'single', prompt: 'I plan my week, including when I will study.', options: frequency },
      { id: 'H2', kind: 'single', prompt: 'I start assignments well before they are due.', options: frequency },
      {
        id: 'H3',
        kind: 'single',
        prompt: 'I test myself on what I have learned.',
        help: 'For example with practice questions, flashcards, or by explaining it without looking at my notes.',
        options: frequency,
      },
      {
        id: 'H4',
        kind: 'single',
        prompt: 'I spread my studying over several days instead of cramming the night before.',
        options: frequency,
      },
      {
        id: 'H5',
        kind: 'single',
        prompt: 'Most of my studying is rereading my notes or highlighting.',
        options: frequency,
      },
      {
        id: 'H6',
        kind: 'single',
        prompt: 'When I do not understand something, I ask a classmate or a lecturer.',
        options: frequency,
      },
      {
        id: 'H7',
        kind: 'single',
        prompt: 'I find it hard to stay focused when I study.',
        options: frequencyReversed,
      },
    ],
  },
  {
    id: 'confidence',
    number: 3,
    title: 'Your confidence',
    intro: 'How sure are you that you can do each of these things this term? Answer for now, not for where you hope to be.',
    items: [
      { id: 'C1', kind: 'single', lead: 'How confident are you that you can', prompt: 'understand the hardest material in your courses?', options: confidence },
      { id: 'C2', kind: 'single', lead: 'How confident are you that you can', prompt: 'do well in your assessments this term?', options: confidence },
      { id: 'C3', kind: 'single', lead: 'How confident are you that you can', prompt: 'keep up when several deadlines arrive at once?', options: confidence },
      { id: 'C4', kind: 'single', lead: 'How confident are you that you can', prompt: 'read long academic texts in English and understand them?', options: confidence },
      { id: 'C5', kind: 'single', lead: 'How confident are you that you can', prompt: 'write a clear essay or report in English?', options: confidence },
      { id: 'C6', kind: 'single', lead: 'How confident are you that you can', prompt: 'work with numbers, data and charts?', options: confidence },
      { id: 'C7', kind: 'single', lead: 'How confident are you that you can', prompt: 'present your ideas to a group?', options: confidence },
      { id: 'C8', kind: 'single', lead: 'How confident are you that you can', prompt: 'find good sources for research and judge whether they are reliable?', options: confidence },
    ],
  },
  {
    id: 'direction',
    number: 4,
    title: 'Direction',
    intro: 'Three questions about where your degree is taking you.',
    items: [
      {
        id: 'P1',
        kind: 'single',
        prompt: 'How clear are you about what you want to get out of your degree?',
        options: [
          { value: '1', label: 'Not at all clear', score: 1 },
          { value: '2', label: 'A little clear', score: 2 },
          { value: '3', label: 'Fairly clear', score: 3 },
          { value: '4', label: 'Very clear', score: 4 },
          { value: '5', label: 'Completely clear', score: 5 },
        ],
      },
      {
        id: 'P2',
        kind: 'single',
        prompt: 'How connected do your courses feel to the future you want?',
        options: [
          { value: '1', label: 'Not at all connected', score: 1 },
          { value: '2', label: 'A little connected', score: 2 },
          { value: '3', label: 'Fairly connected', score: 3 },
          { value: '4', label: 'Very connected', score: 4 },
          { value: '5', label: 'Completely connected', score: 5 },
        ],
      },
      {
        id: 'P3',
        kind: 'single',
        prompt: 'How sure are you that your programme is the right one for you?',
        options: [
          { value: '1', label: 'Not at all sure', score: 1 },
          { value: '2', label: 'A little sure', score: 2 },
          { value: '3', label: 'Fairly sure', score: 3 },
          { value: '4', label: 'Very sure', score: 4 },
          { value: '5', label: 'Completely sure', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'belonging',
    number: 5,
    title: 'Belonging and support',
    intro: 'Answer with how you feel right now, even if you have only just arrived.',
    credit: 'The first three statements are adapted from the belonging uncertainty scale of Walton and Cohen (2007).',
    items: [
      { id: 'B1', kind: 'single', prompt: 'Sometimes I feel that I belong at ALCHE, and sometimes I feel that I don’t.', options: agreementReversed },
      { id: 'B2', kind: 'single', prompt: 'When something bad happens, I feel that maybe I don’t belong at ALCHE.', options: agreementReversed },
      { id: 'B3', kind: 'single', prompt: 'When something good happens, I feel that I really belong at ALCHE.', options: agreement },
      {
        id: 'B4',
        kind: 'single',
        prompt: 'Is there someone at ALCHE you could turn to if you were struggling?',
        options: [
          { value: 'several', label: 'Yes, several people' },
          { value: 'one', label: 'Yes, one person' },
          { value: 'not-yet', label: 'Not yet' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'B5',
        kind: 'single',
        prompt: 'If you were struggling in a course, what would you most likely do first?',
        options: [
          { value: 'lecturer', label: 'Talk to my lecturer', score: 1 },
          { value: 'classmate', label: 'Ask a classmate', score: 1 },
          { value: 'student-success', label: 'Book time with Student Success', score: 1 },
          { value: 'online', label: 'Look it up online or ask an AI tool', score: 0.5 },
          { value: 'wait', label: 'Wait and see if it gets better', score: 0 },
          { value: 'alone', label: 'Keep it to myself and push through', score: 0 },
        ],
      },
      {
        id: 'B6',
        kind: 'single',
        prompt: 'How would asking for help with your studies feel?',
        options: [
          { value: 'easy', label: 'Easy', score: 4 },
          { value: 'fairly-easy', label: 'Fairly easy', score: 3 },
          { value: 'uncomfortable', label: 'A bit uncomfortable', score: 2 },
          { value: 'very-uncomfortable', label: 'Very uncomfortable', score: 1 },
        ],
      },
    ],
  },
  {
    id: 'wellbeing',
    number: 6,
    title: 'Wellbeing',
    intro: 'Five questions from the World Health Organization about the last two weeks. Choose the answer closest to how you have been feeling.',
    credit: 'WHO-5 Well-Being Index © World Health Organization 2024, licensed under CC BY-NC-SA 3.0 IGO.',
    items: [
      { id: 'W1', kind: 'single', lead: WHO5_LEAD, prompt: 'I have felt cheerful and in good spirits', options: who5 },
      { id: 'W2', kind: 'single', lead: WHO5_LEAD, prompt: 'I have felt calm and relaxed', options: who5 },
      { id: 'W3', kind: 'single', lead: WHO5_LEAD, prompt: 'I have felt active and vigorous', options: who5 },
      { id: 'W4', kind: 'single', lead: WHO5_LEAD, prompt: 'I woke up feeling fresh and rested', options: who5 },
      { id: 'W5', kind: 'single', lead: WHO5_LEAD, prompt: 'My daily life has been filled with things that interest me', options: who5 },
    ],
  },
  {
    id: 'help',
    number: 7,
    title: 'What would help',
    intro: 'Last section. Tell us what you bring, what you would like help with, and how to reach you.',
    items: [
      {
        id: 'N1',
        kind: 'multi',
        max: 3,
        prompt: 'What do you bring as a student?',
        help: 'Choose up to three.',
        options: [
          { value: 'organising', label: 'Organising my time' },
          { value: 'difficult-ideas', label: 'Understanding difficult ideas' },
          { value: 'writing', label: 'Writing' },
          { value: 'numbers', label: 'Working with numbers and data' },
          { value: 'creativity', label: 'Creative thinking' },
          { value: 'persistence', label: 'Keeping going when things are hard' },
          { value: 'teamwork', label: 'Working with others' },
          { value: 'speaking', label: 'Speaking and presenting' },
          { value: 'research', label: 'Research' },
          { value: 'questions', label: 'Asking good questions' },
          { value: 'leading', label: 'Leading others' },
        ],
      },
      {
        id: 'N2',
        kind: 'multi',
        max: 3,
        exclusive: 'nothing',
        prompt: 'Where would you like support this term?',
        help: 'Choose up to three.',
        options: [
          { value: 'writing', label: 'Academic writing' },
          { value: 'research', label: 'Reading and research' },
          { value: 'numbers', label: 'Numbers and data' },
          { value: 'speaking', label: 'Presenting and public speaking' },
          { value: 'time', label: 'Managing my time' },
          { value: 'study', label: 'Better ways to study' },
          { value: 'wellbeing', label: 'Stress and wellbeing' },
          { value: 'money', label: 'Money and budgeting' },
          { value: 'settling', label: 'Settling in and making friends' },
          { value: 'career', label: 'Career direction' },
          { value: 'nothing', label: 'Nothing right now' },
        ],
      },
      {
        id: 'N3',
        kind: 'single',
        prompt: 'Do you have a disability, learning difference or health condition that affects your studies?',
        help: 'Telling us is optional. It only helps us arrange support, and you can skip this question.',
        options: [
          { value: 'no', label: 'No' },
          { value: 'yes-talk', label: 'Yes, and I would like to talk about support' },
          { value: 'yes-fine', label: 'Yes, but I do not need anything right now' },
          { value: 'maybe', label: 'I think I might, but I have never been assessed' },
          { value: 'rather-not', label: 'I would rather not say' },
        ],
      },
      {
        id: 'N4',
        kind: 'single',
        prompt: 'When you want support, what works best for you?',
        options: [
          { value: 'one-to-one', label: 'One-to-one time with a staff member' },
          { value: 'small-group', label: 'A small group with other students' },
          { value: 'workshop', label: 'A workshop' },
          { value: 'online', label: 'Online resources I can use on my own' },
          { value: 'unsure', label: 'I am not sure yet' },
        ],
      },
      {
        id: 'N5',
        kind: 'single',
        prompt: 'If Student Success wants to check in with you, how should we reach you?',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'in-person', label: 'In person on campus' },
          { value: 'self', label: 'I would rather reach out myself' },
        ],
      },
      {
        id: 'N6',
        kind: 'text',
        showIf: { item: 'N5', in: ['whatsapp'] },
        prompt: 'What is your WhatsApp number?',
        help: 'Include the country code, for example +230 5 123 4567. You can skip this and we will use the number ALCHE has on file.',
        maxLength: 20,
        rows: 1,
        inputMode: 'tel',
        pattern: '^[+0-9 ()-]{6,20}$',
      },
      {
        id: 'N7',
        kind: 'text',
        prompt: 'Is there anything about your situation you would like Student Success to know?',
        help: 'Optional. Only Student Success staff will read this.',
        maxLength: 600,
        rows: 5,
      },
      {
        id: 'N8',
        kind: 'text',
        prompt: 'What would make this term a success for you?',
        help: 'Optional. One or two sentences is plenty.',
        maxLength: 300,
        rows: 3,
      },
    ],
  },
];

export const ALL_ITEMS: Item[] = SECTIONS.flatMap((s) => s.items);

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ALL_ITEMS.map((i) => [i.id, i]));

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

/** Whether an item applies to this student, given their intake and earlier answers. */
export function isVisible(item: Item, isNew: boolean, answers: Answers): boolean {
  if (item.audience === 'new' && !isNew) return false;
  if (item.audience === 'continuing' && isNew) return false;
  if (item.showIf) {
    const v = answers[item.showIf.item];
    if (typeof v !== 'string' || !item.showIf.in.includes(v)) return false;
  }
  return true;
}

export function visibleItems(section: Section, isNew: boolean, answers: Answers): Item[] {
  return section.items.filter((i) => isVisible(i, isNew, answers));
}

export function optionLabel(itemId: string, value: string): string {
  const item = ITEM_BY_ID[itemId];
  if (!item || item.kind === 'text') return value;
  return item.options.find((o) => o.value === value)?.label ?? value;
}
