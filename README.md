# Student Success Compass

A ten-minute check-in that ALCHE students take at the start of each term.

- **Students** answer about 45 short questions and get a letter from Student Success with
  three or four next steps tied to real ALCHE services.
- **Student Success staff** get a Google Sheet row per student: an outreach tier
  (who to contact first), plain-language flags (why), the student's own requests and
  contact preference, and six 0 to 100 indices.
- **Compass Weekly** takes the Engagement index as its self-report input.

Version 2.0 (October 2026) replaced the original 2026 screener. The research behind every
question, and what was cut and why, is in `docs/Compass-v2-Design-Rationale-v1.0.pdf`
and, in short form for students, on the site at `/about`.

## Layout

```
src/
  app/                  pages: / (landing), /compass (the form), /about, /privacy, /admin
    api/submit          validates answers, scores them, writes the row, returns the letter
    api/status          public open/closed flag
    api/admin/*         sign in/out, open/close (signed HttpOnly session)
  components/           CompassFlow (the form), Letter
  lib/
    config.ts           term, intakes, programmes, helplines, contacts: edit this each term
    instrument.ts       the question bank (item ids are permanent)
    scoring.ts          indices, flags, outreach tier, next steps
    steps.ts            the offers a letter can recommend
    letter.ts           what the student reads
    row.ts              sheet columns and the codebook
    submission.ts       server-side validation
    sheets.ts           Google Sheets REST client (no googleapis dependency)
    store.ts            Sheets in production, .data/ in local development
    security.ts         admin session, origin checks, rate limiting
  proxy.ts              per-request CSP nonce
tests/                  vitest: scoring, validation, row and letter
docs/                   design rationale (docx + pdf) and its generator in docs/_build-src
```

## Run it

```bash
npm install
npm run dev
```

With no Google variables set, development stores responses in `.data/compass-dev.json`
and the Compass starts open. Put an `ADMIN_SECRET_KEY` in `.env.local` to use `/admin`.

```bash
npm test          # unit tests
npm run typecheck
npm run build
```

## Each term

1. In `src/lib/config.ts`, set `CURRENT_INTAKE` to the intake arriving this term, add it
   to `INTAKES`, and update `SITE.term`.
2. Commit and push to `main`. Vercel redeploys.
3. Open the Compass from `/admin`.

## Deploying

See `SETUP.md`. Push to `main` and Vercel deploys. Environment variables are the same as
version 1; no new ones are required.
