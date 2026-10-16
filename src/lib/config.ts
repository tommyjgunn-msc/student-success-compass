// Everything a non-developer is likely to need to change each term lives here.
// Change it, commit, push: Vercel redeploys on its own.

export const SITE = {
  name: 'Student Success Compass',
  team: 'Student Success',
  institution: 'African Leadership College of Higher Education',
  institutionShort: 'ALCHE',
  // Who students write to about their data (access, correction, deletion).
  dataContactEmail: 'jipinmoye@alueducation.com',
  // Shown on the privacy page. Confirm against ALCHE's records policy.
  retention:
    'We keep your answers while you are a student at ALCHE. We delete them within twelve months of your leaving, or sooner if you ask.',
  instrumentVersion: '2.0',
  consentVersion: '2026-10',
  term: 'October 2026',
  questions: 'about 45',
  minutes: 10,
} as const;

// The intake that is arriving this term. Students in it see questions about
// starting university; everyone else sees questions about how last term went.
export const CURRENT_INTAKE = 'O26';

export const INTAKES = [
  { value: 'O26', label: 'October 2026', code: 'O26' },
  { value: 'F26', label: 'February 2026', code: 'F26' },
  { value: 'O25', label: 'October 2025', code: 'O25' },
  { value: 'F25', label: 'February 2025', code: 'F25' },
  { value: 'other', label: 'Another intake, or I am not sure', code: '' },
] as const;

// Values match version 1 so the two sheets join on programme.
export const PROGRAMMES = [
  { value: 'bsc-computing', label: 'BSc Computing' },
  { value: 'bsc-software-engineering', label: 'BSc Software Engineering' },
  { value: 'bsc-entrepreneurial-leadership', label: 'BSc Entrepreneurial Leadership' },
  { value: 'bsc-international-business', label: 'BSc International Business and Trade' },
  { value: 'foundation', label: 'Foundation Programme' },
  { value: 'other', label: 'Another programme' },
] as const;

// Checked 16 October 2026 against befrienders.org and findahelpline.com.
export const HELP_NOW = {
  befrienders: {
    name: 'Befrienders Mauritius',
    phone: '800 9393',
    phoneHref: 'tel:8009393',
    hours: 'free from a landline, 9am to 9pm every day',
    whatsapp: '+230 5483 7233',
  },
  emergency: [
    { name: 'for an ambulance', phone: '114', phoneHref: 'tel:114' },
    { name: 'for the police', phone: '999', phoneHref: 'tel:999' },
  ],
  abroad: { name: 'Find A Helpline', url: 'https://findahelpline.com' },
};

// Real offers from the October 2026 Student Success orientation. Links are
// optional: where there is none, the letter tells students how to ask.
export const LINKS = {
  libraryMentorship:
    'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3CMLgDECh21NpasAuQLdP4dmNNKtQESzJz8nfd7ILMXpFFRecBxhKb8Nej1DDTRC-DTcY9VWXk',
  library: 'https://library.alueducation.com/',
  naissance: 'https://naissance.alueducation.com/index.html',
  officeHours: '',
  dataProtectionOffice: 'https://dataprotection.govmu.org',
};
