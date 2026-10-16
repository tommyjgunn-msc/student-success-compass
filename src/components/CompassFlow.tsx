'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CURRENT_INTAKE, INTAKES, PROGRAMMES, SITE } from '@/lib/config';
import { SECTIONS, isVisible, type Answers, type AnswerValue, type Item } from '@/lib/instrument';
import type { LetterData } from '@/lib/letter';
import Letter from './Letter';

// ---- State ----------------------------------------------------------------
// Everything lives in sessionStorage: a reload or an accidental back-swipe
// keeps the student's place, and closing the tab clears it, which matters on
// shared lab computers.

type Stage =
  | { kind: 'consent' }
  | { kind: 'about' }
  | { kind: 'opener'; section: number }
  | { kind: 'item'; id: string }
  | { kind: 'review' }
  | { kind: 'letter' };

interface ProfileDraft {
  name: string;
  email: string;
  intake: string;
  programme: string;
}

interface Draft {
  v: 2;
  stage: Stage;
  consent: boolean;
  profile: ProfileDraft;
  answers: Answers;
  startedAt: number | null;
  submissionId: string;
}

const DRAFT_KEY = 'compass-draft-v2';
const LETTER_KEY = 'compass-letter-v2';

function newDraft(): Draft {
  return {
    v: 2,
    stage: { kind: 'consent' },
    consent: false,
    profile: { name: '', email: '', intake: '', programme: '' },
    answers: {},
    startedAt: null,
    submissionId: crypto.randomUUID(),
  };
}

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing can refuse storage; the form still works, it just will not survive a reload.
  }
}

const NAME = /^[\p{L}\p{M}' .-]{2,80}$/u;
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

// ---- Component ------------------------------------------------------------

export default function CompassFlow() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [letter, setLetter] = useState<LetterData | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);
  const pointerAt = useRef(0);

  // Restore on first render in the browser.
  useEffect(() => {
    const saved = readSession<LetterData>(LETTER_KEY);
    if (saved) {
      setLetter(saved);
      return;
    }
    const d = readSession<Draft>(DRAFT_KEY);
    setDraft(d && d.v === 2 ? d : newDraft());
  }, []);

  useEffect(() => {
    if (draft) writeSession(DRAFT_KEY, draft);
  }, [draft]);

  const isNew = draft?.profile.intake === CURRENT_INTAKE;

  // The questions this student will see, in order, given intake and answers so far.
  const sequence = useMemo(() => {
    if (!draft) return [] as { item: Item; section: number }[];
    return SECTIONS.flatMap((s, si) =>
      s.items.filter((i) => isVisible(i, isNew, draft.answers)).map((item) => ({ item, section: si })),
    );
  }, [draft, isNew]);

  const stage = draft?.stage;
  const stageKey = stage ? JSON.stringify(stage) : letter ? 'letter' : 'loading';

  // Move focus to the new heading on every screen change, for screen readers
  // and keyboard users, and start each screen at the top.
  useEffect(() => {
    window.clearTimeout(advanceTimer.current);
    if (stageKey === 'loading') return;
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [stageKey]);

  const go = useCallback((next: Stage) => {
    setError('');
    setDraft((d) => (d ? { ...d, stage: next } : d));
  }, []);

  const position = stage?.kind === 'item' ? sequence.findIndex((s) => s.item.id === stage.id) : -1;

  const next = useCallback(() => {
    if (!draft) return;
    const s = draft.stage;
    if (s.kind === 'opener') {
      const first = sequence.find((x) => x.section === s.section);
      go(first ? { kind: 'item', id: first.item.id } : { kind: 'review' });
      return;
    }
    if (s.kind === 'item') {
      const i = sequence.findIndex((x) => x.item.id === s.id);
      const here = sequence[i];
      const after = sequence[i + 1];
      if (!after) go({ kind: 'review' });
      else if (after.section !== here.section) go({ kind: 'opener', section: after.section });
      else go({ kind: 'item', id: after.item.id });
    }
  }, [draft, sequence, go]);

  const back = useCallback(() => {
    if (!draft) return;
    const s = draft.stage;
    if (s.kind === 'about') return go({ kind: 'consent' });
    if (s.kind === 'opener') {
      const prev = [...sequence].reverse().find((x) => x.section < s.section);
      return go(prev ? { kind: 'item', id: prev.item.id } : { kind: 'about' });
    }
    if (s.kind === 'item') {
      const i = sequence.findIndex((x) => x.item.id === s.id);
      const here = sequence[i];
      const before = sequence[i - 1];
      if (!before || before.section !== here.section) return go({ kind: 'opener', section: here.section });
      return go({ kind: 'item', id: before.item.id });
    }
    if (s.kind === 'review') {
      const last = sequence[sequence.length - 1];
      return go(last ? { kind: 'item', id: last.item.id } : { kind: 'about' });
    }
  }, [draft, sequence, go]);

  const setAnswer = useCallback((id: string, value: AnswerValue | undefined) => {
    setDraft((d) => {
      if (!d) return d;
      const answers = { ...d.answers };
      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) delete answers[id];
      else answers[id] = value;
      return { ...d, answers };
    });
  }, []);

  const advanceSoon = useCallback(() => {
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(next, 220);
  }, [next]);

  // Number keys choose an option on single-choice questions.
  useEffect(() => {
    if (stage?.kind !== 'item') return;
    const item = sequence[position]?.item;
    if (!item || item.kind !== 'single') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && (t as HTMLInputElement).type !== 'radio')) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= item.options.length) {
        e.preventDefault();
        setAnswer(item.id, item.options[n - 1].value);
        advanceSoon();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, sequence, position, setAnswer, advanceSoon]);

  async function send() {
    if (!draft || sending) return;
    setSending(true);
    setError('');
    const visibleIds = new Set(sequence.map((s) => s.item.id));
    const answers = Object.fromEntries(Object.entries(draft.answers).filter(([k]) => visibleIds.has(k)));
    const website = (document.getElementById('website') as HTMLInputElement | null)?.value ?? '';
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: draft.submissionId,
          startedAt: draft.startedAt,
          consentVersion: SITE.consentVersion,
          profile: draft.profile,
          answers,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; letter?: LetterData; error?: string };
      if (!res.ok || !data.ok || !data.letter) throw new Error(data.error || 'Something went wrong. Please press send again.');
      writeSession(LETTER_KEY, data.letter);
      writeSession(DRAFT_KEY, null);
      setLetter(data.letter);
      setDraft(null);
    } catch (e) {
      setError(
        e instanceof TypeError
          ? 'Your connection dropped before your answers arrived. They are still here: press send again.'
          : (e as Error).message,
      );
    } finally {
      setSending(false);
    }
  }

  // ---- Screens --------------------------------------------------------------

  if (letter) {
    return (
      <div className="column column--wide">
        <Letter data={letter} />
        <div className="letter-actions no-print">
          <button type="button" className="button" onClick={() => window.print()}>
            Save or print this letter
          </button>
          <Link
            href="/"
            className="button button--quiet"
            onClick={() => {
              writeSession(LETTER_KEY, null);
            }}
          >
            Finish
          </Link>
        </div>
        <p className="credit no-print">
          To keep a copy, choose Save as PDF in the print window. When you press Finish this letter is cleared from this
          browser.
        </p>
      </div>
    );
  }

  if (!draft || !stage) {
    return (
      <div className="column" aria-busy="true">
        <div className="skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="visually-hidden">Loading the Compass</p>
      </div>
    );
  }

  const total = sequence.length;
  const sectionIndex =
    stage.kind === 'item' ? sequence[position]?.section ?? 0 : stage.kind === 'opener' ? stage.section : stage.kind === 'review' ? SECTIONS.length - 1 : 0;
  const done = stage.kind === 'item' ? position : stage.kind === 'opener' ? sequence.findIndex((s) => s.section === stage.section) : stage.kind === 'review' ? total : 0;

  const progress = (stage.kind === 'item' || stage.kind === 'opener' || stage.kind === 'review') && (
    <div className="progress">
      <div className="progress__meta">
        <span>
          Part {SECTIONS[sectionIndex].number} of {SECTIONS.length}
          <span className="visually-hidden">: {SECTIONS[sectionIndex].title}</span>
        </span>
        <span>{stage.kind === 'review' ? 'All done' : stage.kind === 'item' ? `Question ${position + 1} of ${total}` : ''}</span>
      </div>
      <progress className="progress__bar" max={total} value={Math.max(done, 0)} aria-label="Progress through the Compass" />
    </div>
  );

  // Consent
  if (stage.kind === 'consent') {
    return (
      <div className="column">
        <p className="eyebrow">Before you begin</p>
        <h1 className="title" ref={headingRef} tabIndex={-1}>
          How we will use your answers
        </h1>
        <ul className="facts">
          <li>
            Your answers go to the <strong>Student Success staff</strong> at ALCHE. They use them to decide who to contact
            first and what support to offer.
          </li>
          <li>
            Some questions ask about <strong>wellbeing, money and health</strong>. You can skip any question you do not want
            to answer.
          </li>
          <li>
            Nothing here is graded or used in academic decisions about you.
          </li>
          <li>
            Your overall engagement score is combined with your Canvas activity in the Student Success team’s weekly
            review, so we notice early if a term starts to go wrong.
          </li>
          <li>
            You can ask to see, correct or delete your answers at any time. The full <Link href="/privacy">privacy notice</Link>{' '}
            explains how.
          </li>
        </ul>
        <label className="consent">
          <input
            type="checkbox"
            checked={draft.consent}
            onChange={(e) => setDraft({ ...draft, consent: e.target.checked })}
          />
          <span>I have read this and I agree to share my answers with ALCHE Student Success.</span>
        </label>
        <div className="actions">
          <Link href="/" className="textlink textlink--muted">
            Not now
          </Link>
          <button
            type="button"
            className="button"
            disabled={!draft.consent}
            onClick={() => setDraft({ ...draft, startedAt: draft.startedAt ?? Date.now(), stage: { kind: 'about' } })}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // About you
  if (stage.kind === 'about') {
    const p = draft.profile;
    const setP = (patch: Partial<ProfileDraft>) => setDraft({ ...draft, profile: { ...p, ...patch } });
    const submitAbout = (e: React.FormEvent) => {
      e.preventDefault();
      const name = p.name.trim().replace(/\s+/g, ' ');
      if (!NAME.test(name)) return setError('Please enter your full name, using letters only.');
      if (!EMAIL.test(p.email.trim())) return setError('Please enter a valid email address.');
      if (!p.intake) return setError('Please choose when you started at ALCHE.');
      if (!p.programme) return setError('Please choose your programme.');
      setDraft({ ...draft, profile: { ...p, name, email: p.email.trim() }, stage: { kind: 'opener', section: 0 } });
      setError('');
    };
    const emailHint = p.email && !/@(alustudent|alueducation)\.com$/i.test(p.email.trim());

    return (
      <form className="column" onSubmit={submitAbout} noValidate>
        <button type="button" className="textlink textlink--muted back" onClick={back}>
          Back
        </button>
        <p className="eyebrow">About you</p>
        <h1 className="title" ref={headingRef} tabIndex={-1}>
          So we know whose answers these are
        </h1>

        <div className="field">
          <label className="field__label" htmlFor="name">
            Full name
          </label>
          <input id="name" className="input" autoComplete="name" value={p.name} maxLength={80} onChange={(e) => setP({ name: e.target.value })} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="email">
            ALU email address
          </label>
          <input
            id="email"
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            value={p.email}
            maxLength={120}
            aria-describedby="email-hint"
            onChange={(e) => setP({ email: e.target.value })}
          />
          <p className="field__hint" id="email-hint">
            {emailHint ? 'That is not an ALU address. Use your ALU email if you have one, so we can match your answers to your records.' : 'For example a.student@alustudent.com'}
          </p>
        </div>

        <fieldset className="field">
          <legend className="field__label">When did you start at ALCHE?</legend>
          <div className="options">
            {INTAKES.map((o) => (
              <label className={o.code ? 'option' : 'option option--plain'} key={o.value}>
                <input type="radio" name="intake" value={o.value} checked={p.intake === o.value} onChange={() => setP({ intake: o.value })} />
                {o.code && (
                  <span className="option__key" aria-hidden="true">
                    {o.code}
                  </span>
                )}
                <span>
                  {o.label}
                  {o.value === CURRENT_INTAKE ? ' (I am new this term)' : ''}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field__label">Which programme are you in?</legend>
          <div className="options">
            {PROGRAMMES.map((o) => (
              <label className="option option--plain" key={o.value}>
                <input type="radio" name="programme" value={o.value} checked={p.programme === o.value} onChange={() => setP({ programme: o.value })} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="actions">
          <span />
          <button type="submit" className="button">
            Continue
          </button>
        </div>
      </form>
    );
  }

  // Section opener
  if (stage.kind === 'opener') {
    const section = SECTIONS[stage.section];
    return (
      <div className="column">
        {progress}
        <button type="button" className="textlink textlink--muted back" onClick={back}>
          Back
        </button>
        <p className="opener__numeral" aria-hidden="true">
          {section.number}
        </p>
        <h1 className="opener__title" ref={headingRef} tabIndex={-1}>
          <span className="visually-hidden">Part {section.number}: </span>
          {section.title}
        </h1>
        <p className="lede">{section.intro}</p>
        {section.credit && <p className="credit">{section.credit}</p>}
        <div className="actions">
          <span />
          <button type="button" className="button" onClick={next}>
            Begin part {section.number}
          </button>
        </div>
      </div>
    );
  }

  // Review and send
  if (stage.kind === 'review') {
    const answered = sequence.filter((s) => s.item.id in draft.answers).length;
    return (
      <div className="column">
        {progress}
        <button type="button" className="textlink textlink--muted back" onClick={back}>
          Back
        </button>
        <p className="eyebrow">Ready to send</p>
        <h1 className="title" ref={headingRef} tabIndex={-1}>
          Thank you, {draft.profile.name.split(' ')[0]}.
        </h1>
        <p className="lede">
          You answered {answered} of {total} questions. When you send them, your letter appears straight away.
        </p>
        <p>You can go back and change anything before you send. After that, write to us if you want something changed.</p>
        {/* Honeypot for bots: hidden from people and from assistive technology. */}
        <div className="visually-hidden" aria-hidden="true">
          <label htmlFor="website">Leave this empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        {error && (
          <div className="notice" role="alert">
            <p>{error}</p>
          </div>
        )}
        <div className="actions">
          <span />
          <button type="button" className="button" onClick={send} disabled={sending}>
            {sending ? 'Sending your answers' : 'Send my answers'}
          </button>
        </div>
      </div>
    );
  }

  // A question
  const current = sequence[position];
  if (!current) {
    // The question this draft pointed at no longer applies (for example the intake changed).
    return (
      <div className="column">
        <h1 className="title" ref={headingRef} tabIndex={-1}>
          Let’s pick up where you were
        </h1>
        <button type="button" className="button" onClick={() => go({ kind: 'opener', section: 0 })}>
          Continue
        </button>
      </div>
    );
  }
  const item = current.item;
  const value = draft.answers[item.id];
  const answered = value !== undefined && !(Array.isArray(value) && value.length === 0);
  const promptId = `q-${item.id}`;
  const helpId = item.help ? `h-${item.id}` : undefined;

  return (
    <form
      className="column"
      onSubmit={(e) => {
        e.preventDefault();
        if (item.kind === 'text' && typeof value === 'string' && item.pattern && !new RegExp(item.pattern).test(value)) {
          setError('Please check that number: digits, spaces and a leading + only.');
          return;
        }
        next();
      }}
    >
      {progress}
      <button type="button" className="textlink textlink--muted back" onClick={back}>
        Back
      </button>
      {item.lead && <p className="question__lead">{item.lead}</p>}
      <h1 className="question__prompt" id={promptId} ref={headingRef} tabIndex={-1}>
        {item.prompt}
      </h1>
      {item.help && (
        <p className="question__help" id={helpId}>
          {item.help}
        </p>
      )}

      {item.kind === 'single' && (
        <fieldset aria-labelledby={promptId} aria-describedby={helpId}>
          <div className="options">
            {item.options.map((o, i) => (
              <label
                className="option"
                key={o.value}
                onPointerDown={() => {
                  pointerAt.current = Date.now();
                }}
                onClick={(e) => {
                  // Tapping the answer that is already chosen moves on too.
                  if (e.detail > 0 && value === o.value) advanceSoon();
                }}
              >
                <input
                  type="radio"
                  name={item.id}
                  value={o.value}
                  checked={value === o.value}
                  onChange={() => {
                    setAnswer(item.id, o.value);
                    if (Date.now() - pointerAt.current < 1000) advanceSoon();
                  }}
                />
                <span className="option__key" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {position === 0 && <p className="kbd-tip">On a keyboard, press 1 to {item.options.length} to answer.</p>}
        </fieldset>
      )}

      {item.kind === 'multi' && (
        <fieldset aria-labelledby={promptId} aria-describedby={helpId}>
          <div className="options">
            {item.options.map((o) => {
              const chosen = Array.isArray(value) ? value : [];
              const checked = chosen.includes(o.value);
              const full = chosen.filter((v) => v !== item.exclusive).length >= item.max;
              return (
                <label className="option option--multi" key={o.value}>
                  <input
                    type="checkbox"
                    value={o.value}
                    checked={checked}
                    disabled={!checked && full && o.value !== item.exclusive}
                    onChange={(e) => {
                      let nextVals: string[];
                      if (e.target.checked) {
                        nextVals = o.value === item.exclusive ? [o.value] : [...chosen.filter((v) => v !== item.exclusive), o.value];
                      } else {
                        nextVals = chosen.filter((v) => v !== o.value);
                      }
                      setAnswer(item.id, nextVals.slice(0, item.max));
                    }}
                  />
                  <span className="option__key" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 8.5l3.2 3L13 4.5" />
                    </svg>
                  </span>
                  <span>{o.label}</span>
                </label>
              );
            })}
          </div>
          <p className="counter" aria-live="polite">
            {Array.isArray(value) ? value.filter((v) => v !== item.exclusive).length : 0} of {item.max} chosen
          </p>
        </fieldset>
      )}

      {item.kind === 'text' && (
        <div className="field">
          <label className="visually-hidden" htmlFor={`t-${item.id}`}>
            {item.prompt}
          </label>
          {item.rows > 1 ? (
            <textarea
              id={`t-${item.id}`}
              className="textarea"
              rows={item.rows}
              maxLength={item.maxLength}
              aria-describedby={helpId}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => setAnswer(item.id, e.target.value)}
            />
          ) : (
            <input
              id={`t-${item.id}`}
              className="input"
              type={item.inputMode === 'tel' ? 'tel' : 'text'}
              inputMode={item.inputMode}
              autoComplete={item.inputMode === 'tel' ? 'tel' : 'off'}
              maxLength={item.maxLength}
              aria-describedby={helpId}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => setAnswer(item.id, e.target.value)}
            />
          )}
          {item.rows > 1 && (
            <p className="counter">
              {typeof value === 'string' ? value.length : 0} / {item.maxLength}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="actions">
        <button
          type="button"
          className="textlink textlink--muted"
          onClick={() => {
            setAnswer(item.id, undefined);
            next();
          }}
        >
          Skip this question
        </button>
        <button type="submit" className="button" disabled={!answered}>
          Continue
        </button>
      </div>

      {position === sequence.findIndex((s) => s.section === current.section) && SECTIONS[current.section].credit && (
        <p className="credit">{SECTIONS[current.section].credit}</p>
      )}
    </form>
  );
}
