// The offers a letter can recommend. Each is something Student Success (or a
// named ALCHE colleague) actually runs, taken from the October 2026
// orientation. Keep titles as actions the student can take this week.

import { LINKS } from './config';

export type StepCode =
  | 'checkin'
  | 'wellbeing'
  | 'learning-support'
  | 'money'
  | 'access'
  | 'office-hours'
  | 'peer-recap'
  | 'studenting'
  | 'time'
  | 'writing'
  | 'library'
  | 'speaking'
  | 'career';

export interface Step {
  code: StepCode;
  title: string;
  body: string;
  how: string;
  link?: { href: string; label: string };
}

const askUs = 'Reply when we contact you, or ask at the Student Success office.';

// The three "tell us about it" offers share one step when two or more apply,
// so a student in difficulty does not read the same instruction three times.
export const CONVERSATIONS: StepCode[] = ['learning-support', 'money', 'access'];

const TOPIC: Partial<Record<StepCode, string>> = {
  'learning-support': 'learning support',
  money: 'money',
  access: 'your laptop or internet access',
};

export function checkinStep(topics: StepCode[]): Step {
  const names = topics.map((t) => TOPIC[t] ?? t);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  return {
    code: 'checkin',
    title: 'Use your check-in to talk about what is getting in the way',
    body: `When someone from Student Success gets in touch, raise ${list}. We know who can help with most of it, and nothing is too small to mention.`,
    how: askUs,
  };
}

export const STEPS: Record<StepCode, Step> = {
  checkin: checkinStep(CONVERSATIONS),
  wellbeing: {
    code: 'wellbeing',
    title: 'Talk to someone about how you have been feeling',
    body:
      'Student Success runs sessions on stress and academic anxiety, and can connect you with counselling. You do not need a crisis to ask.',
    how: askUs,
  },
  'learning-support': {
    code: 'learning-support',
    title: 'Have a private conversation about learning support',
    body:
      'We can talk through what helps you learn, what adjustments might be possible, and how to get an assessment if you want one.',
    how: askUs,
  },
  money: {
    code: 'money',
    title: 'Tell us if money is getting in the way of studying',
    body:
      'We can point you to the right office and help you plan. Adulting 101 also runs a session on budgeting and managing money.',
    how: askUs,
  },
  access: {
    code: 'access',
    title: 'Let us know about your laptop or internet access',
    body: 'Most of your learning runs through Canvas and online tools. Tell us what you are missing so we can look at options with you.',
    how: askUs,
  },
  'office-hours': {
    code: 'office-hours',
    title: 'Book a one-to-one office hour',
    body:
      'Monique Coombes and Jesutomisin Ipinmoye in Student Success meet students one to one, about study habits, a difficult course, or anything else on your mind.',
    how: LINKS.officeHours ? 'Use the booking link.' : askUs,
    link: LINKS.officeHours ? { href: LINKS.officeHours, label: 'Book an office hour' } : undefined,
  },
  'peer-recap': {
    code: 'peer-recap',
    title: 'Join a peer recap session',
    body:
      'Every two weeks the Student Success interns run sessions where students review course material together. It is also one of the easiest ways to meet people.',
    how: 'Look out for the schedule in your ALU email and on Canvas.',
  },
  studenting: {
    code: 'studenting',
    title: 'Sign up for Studenting 101',
    body:
      'Four one-hour sessions open to every student: Mission Curation, Critical Thinking, Public Speaking, and Study-Life Balance. They cover how to study in a way that lasts.',
    how: 'Sign-up details come by ALU email. You can also ask at the Student Success office.',
  },
  time: {
    code: 'time',
    title: 'Go to Adulting 101: Time Management',
    body:
      'A one-hour session on putting the high-impact work first and planning your week so deadlines stop arriving all at once.',
    how: 'Sign-up details come by ALU email.',
  },
  writing: {
    code: 'writing',
    title: 'Bring a draft to Writing Support',
    body:
      'Any draft, at any stage, for any course. You get written or spoken feedback, and you can also submit your creative work to Naissance, ALU’s literary journal.',
    how: 'Visit Student Success or book an appointment.',
    link: { href: LINKS.naissance, label: 'See Naissance' },
  },
  library: {
    code: 'library',
    title: 'Book a research mentorship session with the Library',
    body:
      'The Library will show you how to find and judge sources in EBSCOhost, BUKU and Librarika, and help with a paper you are working on.',
    how: 'Book a slot online.',
    link: { href: LINKS.libraryMentorship, label: 'Book research mentorship' },
  },
  speaking: {
    code: 'speaking',
    title: 'Practise presenting in Studenting 101: Public Speaking',
    body: 'A one-hour session on finding your voice and speaking with clarity, in a room where everyone is practising too.',
    how: 'Sign-up details come by ALU email.',
  },
  career: {
    code: 'career',
    title: 'Talk about direction with Student Professional Development',
    body:
      'Student Professional Development helps you connect your programme to the work you want, through coaching, internships and career events. Student Success can introduce you.',
    how: askUs,
  },
};
