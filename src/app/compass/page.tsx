import type { Metadata } from 'next';
import Link from 'next/link';
import CompassFlow from '@/components/CompassFlow';
import { getStore } from '@/lib/store';

export const metadata: Metadata = { title: 'Your answers' };

export default async function CompassPage() {
  if (!(await getStore().isOpen())) {
    return (
      <div className="column">
        <p className="eyebrow">Student Success Compass</p>
        <h1 className="title">The Compass is closed right now.</h1>
        <p className="lede">If you already have a letter open in another tab, it is still there. Otherwise, please check back when Student Success opens it.</p>
        <Link href="/" className="button button--quiet">
          Back to the start
        </Link>
      </div>
    );
  }
  return <CompassFlow />;
}
