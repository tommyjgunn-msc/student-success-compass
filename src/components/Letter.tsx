import { HELP_NOW, SITE } from '@/lib/config';
import { BAND_LABEL, type LetterData } from '@/lib/letter';

function joinList(items: string[]): string {
  const lower = items.map((s) => s.charAt(0).toLowerCase() + s.slice(1));
  if (lower.length <= 1) return lower.join('');
  return `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
}

function HelpNow({ urgent }: { urgent: boolean }) {
  const b = HELP_NOW.befrienders;
  return (
    <div className="helpline">
      {urgent ? (
        <p>
          <strong>If you need to talk to someone today,</strong> call {b.name} on{' '}
          <a href={b.phoneHref}>{b.phone}</a> ({b.hours}) or message them on WhatsApp at {b.whatsapp}. It is free and
          confidential.
        </p>
      ) : (
        <p>
          If things get hard, {b.name} listens on <a href={b.phoneHref}>{b.phone}</a> ({b.hours}).
        </p>
      )}
      <p>
        In an emergency, call{' '}
        {HELP_NOW.emergency.map((e, i) => (
          <span key={e.phone}>
            {i > 0 ? ' or ' : ''}
            <a href={e.phoneHref}>{e.phone}</a> {e.name}
          </span>
        ))}
        . Outside Mauritius, <a href={HELP_NOW.abroad.url}>{HELP_NOW.abroad.name}</a> lists free helplines in your country.
      </p>
    </div>
  );
}

export default function Letter({ data }: { data: LetterData }) {
  const low = data.wellbeing === 'urgent' || data.wellbeing === 'low';

  return (
    <article className="sheet letter" aria-labelledby="letter-title">
      <div className="letterhead">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/alche-logo.png" alt="ALCHE" width={95} height={36} />
        <div className="letterhead__meta">
          {SITE.team}
          <br />
          {data.date}
        </div>
      </div>

      <h1 id="letter-title" tabIndex={-1}>
        Dear {data.firstName},
      </h1>
      <p>
        Thank you for taking the Compass. This letter is yours to keep. It sets out what you told us and where we suggest
        you start.
      </p>

      {data.strengths.length > 0 && (
        <p>
          You told us your strengths include {joinList(data.strengths)}. Lean on {data.strengths.length > 1 ? 'them' : 'it'}{' '}
          this term, especially when work gets difficult.
        </p>
      )}

      {low && (
        <>
          <h2>About the last two weeks</h2>
          <p>
            Your answers suggest the last two weeks have been hard. You do not have to manage that on your own, and you
            do not need to wait for things to get worse before talking to someone.
          </p>
          <HelpNow urgent />
        </>
      )}

      <h2>Your next steps</h2>
      <ol className="steps">
        {data.steps.map((s, i) => (
          <li key={s.code}>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {/* Consecutive steps often share the same "how"; say it once. */}
              {(i === 0 || data.steps[i - 1].how !== s.how || s.link) && (
                <p className="how">
                  {s.how}
                  {s.link && (
                    <>
                      {' '}
                      <a href={s.link.href} target="_blank" rel="noopener noreferrer">
                        {s.link.label}
                      </a>
                      .
                    </>
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {data.profileNote && (
        <>
          <h2>Where you are starting</h2>
          <p>{data.profileNote}</p>
        </>
      )}

      {data.profile.length > 0 && (
        <>
          <h2>Where you are starting</h2>
          <p>
            This sums up your own answers as they stand today. All of it can change, and most of it changes fastest with
            practice and support.
          </p>
          <table className="profile">
            <tbody>
              {data.profile.map((p) => (
                <tr key={p.area}>
                  <th scope="row">
                    {p.area}
                    <span className="band">{BAND_LABEL[p.band]}</span>
                  </th>
                  <td>{p.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>{data.isNew ? 'On settling in' : 'On the term ahead'}</h2>
      <p>{data.settling}</p>

      <h2>What happens next</h2>
      <p>{data.contact}</p>
      <p>
        Only Student Success staff read your answers. Nothing here is graded or used in academic decisions about you. You
        can ask us to see, correct or delete your answers at any time by writing to{' '}
        <a href={`mailto:${SITE.dataContactEmail}`}>{SITE.dataContactEmail}</a>.
      </p>

      {!low && <HelpNow urgent={false} />}

      <div className="signoff">
        <p>With every good wish for the term,</p>
        <strong>Student Success</strong>
        <span>{SITE.institution}</span>
      </div>
    </article>
  );
}
