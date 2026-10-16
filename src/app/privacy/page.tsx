import type { Metadata } from 'next';
import { HELP_NOW, LINKS, SITE } from '@/lib/config';

export const metadata: Metadata = { title: 'Privacy notice' };

export default function PrivacyPage() {
  const mail = `mailto:${SITE.dataContactEmail}`;
  return (
    <div className="column prose">
      <p className="eyebrow">Privacy notice, version {SITE.consentVersion}</p>
      <h1 className="title">How we use and protect your answers</h1>
      <p className="lede">
        The Compass is run by Student Success at the {SITE.institution} (ALCHE). ALCHE is responsible for your data under
        the Mauritius Data Protection Act 2017.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name, email address, intake and programme.</li>
        <li>
          Your answers. Some are sensitive: your wellbeing over the last two weeks, money worries, and, only if you choose
          to tell us, a disability, learning difference or health condition.
        </li>
        <li>A WhatsApp number, only if you choose WhatsApp as the way to reach you and type it in.</li>
        <li>How long you took, so we can spot answers sent in a rush.</li>
      </ul>
      <p>
        We do not use cookies, analytics or advertising trackers on the student pages. While you answer, your progress is
        kept in your own browser’s session storage so a reload does not lose it. It is cleared when you close the tab or
        press Finish.
      </p>

      <h2>Why we collect it</h2>
      <ul>
        <li>To write your letter of next steps.</li>
        <li>To decide which students to contact first, and what to offer them.</li>
        <li>To plan workshops and services around what students actually need.</li>
        <li>
          To notice early when a term is going wrong. Your engagement score, one number from 0 to 100, is combined with
          your Canvas activity in Student Success’s weekly review.
        </li>
      </ul>
      <p>
        We rely on your consent, which you give on the first screen. For the sensitive questions that consent is explicit,
        and every one of those questions can be skipped. Nothing in the Compass is graded or used in academic decisions
        about you.
      </p>

      <h2>Who can see it</h2>
      <p>
        Student Success staff. Answers are stored in a Google Sheet inside ALCHE’s Google Workspace that only those staff
        can open. We do not sell your data or share it outside ALCHE. If something you tell us suggests you or someone
        else is at serious risk, we may need to involve ALCHE’s welfare staff, and we will tell you if we do.
      </p>

      <h2>How long we keep it</h2>
      <p>{SITE.retention}</p>

      <h2>Your rights</h2>
      <p>
        You can ask to see your answers, correct them, or have them deleted, and you can withdraw your consent at any time.
        Write to <a href={mail}>{SITE.dataContactEmail}</a>. Withdrawing consent does not affect anything else about your
        studies. If you are unhappy with how we handle your data, you can complain to the{' '}
        <a href={LINKS.dataProtectionOffice}>Data Protection Office of Mauritius</a>.
      </p>

      <h2>How we protect it</h2>
      <ul>
        <li>The site is served only over HTTPS and refuses to be embedded in other sites.</li>
        <li>Your answers are checked and scored on our server; nothing you send can change how they are scored.</li>
        <li>The staff area is protected by a password and a signed, short-lived session.</li>
        <li>No third-party scripts or fonts load on any page.</li>
      </ul>

      <h2>The Compass is not an emergency service</h2>
      <p>
        Staff read answers during working days. If you need to talk to someone now, call {HELP_NOW.befrienders.name} on{' '}
        <a href={HELP_NOW.befrienders.phoneHref}>{HELP_NOW.befrienders.phone}</a> ({HELP_NOW.befrienders.hours}). In an
        emergency, call {HELP_NOW.emergency.map((e) => `${e.phone} ${e.name}`).join(' or ')}.
      </p>

      <h2>Credits</h2>
      <p>
        The wellbeing questions are the WHO-5 Well-Being Index, © World Health Organization 2024, used under the CC
        BY-NC-SA 3.0 IGO licence. WHO does not endorse this site. Three belonging questions are adapted from Walton and
        Cohen (2007).
      </p>
    </div>
  );
}
