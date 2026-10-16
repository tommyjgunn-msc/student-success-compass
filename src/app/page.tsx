import Link from 'next/link';
import { SITE } from '@/lib/config';
import { getStore } from '@/lib/store';

export default async function Home() {
  const open = await getStore().isOpen();

  if (!open) {
    return (
      <div className="column">
        <p className="eyebrow">Student Success Compass</p>
        <h1 className="title">The Compass is closed right now.</h1>
        <p className="lede">
          Student Success opens it at the start of each term. If your lecturer or the Student Success team has asked you to
          take it today, let them know it is closed.
        </p>
        <p>
          You can still read <Link href="/about">why we ask these questions</Link> and{' '}
          <Link href="/privacy">how we use your answers</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="column">
      <p className="eyebrow">Term check-in, {SITE.term}</p>
      <h1 className="title">How are you starting this term?</h1>
      <p className="lede">
        Answer {SITE.questions} short questions about how you study, how you feel, and what would help. At the end you
        get a letter from Student Success with next steps chosen for you.
      </p>

      <ol className="numbered" aria-label="Before you start">
        <li>
          <div>
            <strong>It takes about {SITE.minutes} minutes.</strong>
            You can go back, change an answer, or skip any question. If you close the page by accident, your answers are
            kept until you close the tab.
          </div>
        </li>
        <li>
          <div>
            <strong>There are no right answers.</strong>
            Nothing is graded, and nothing here is used in academic decisions about you.
          </div>
        </li>
        <li>
          <div>
            <strong>Student Success staff read your answers.</strong>
            They use them to decide who to contact first and what to offer. <Link href="/privacy">Read how we use and protect them</Link>.
          </div>
        </li>
      </ol>

      <Link className="button" href="/compass">
        Start the Compass
      </Link>
    </div>
  );
}
