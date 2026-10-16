import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="column">
      <p className="eyebrow">Page not found</p>
      <h1 className="title">There is nothing at this address.</h1>
      <p className="lede">The link may be old or mistyped.</p>
      <Link href="/" className="button">
        Go to the Compass
      </Link>
    </div>
  );
}
