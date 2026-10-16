# Setup

Version 2 runs on the same Vercel project, Google Sheet and environment variables as
version 1. Nothing new has to be created to deploy it.

## Environment variables

| Name | Required | What it is |
|---|---|---|
| `GOOGLE_SHEET_ID` | yes | The long id in the response sheet's URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | yes | The service account with Editor access to that sheet |
| `GOOGLE_PRIVATE_KEY` | yes | Its private key, newlines written as `\n` |
| `ADMIN_SECRET_KEY` | yes | Password for `/admin`. Use `openssl rand -base64 32`. At least 12 characters or admin stays off |
| `GOOGLE_CONFIG_SHEET_NAME` | no | Tab holding the open/closed switch in `A2`. Default `Config` |
| `COMPASS_RESPONSES_SHEET` | no | Tab for version 2 responses. Default `Compass v2.0` |

`GOOGLE_SHEET_NAME` (the version 1 `Responses` tab) is no longer read. Version 1 rows stay
where they are.

If any Google variable is missing in production, the site shows the Compass as closed
rather than accepting answers it cannot save.

## What happens on the first submission

The service account creates two tabs in the existing sheet:

- **Compass v2.0**: one row per submission, triage columns first.
- **Compass v2.0 codebook**: every column, question, option and flag explained.

If the `Compass v2.0` tab already exists with different headings, submissions are refused
rather than written under the wrong columns. Change the instrument version (or
`COMPASS_RESPONSES_SHEET`) to start a fresh tab.

## Admin

Go to `/admin` and sign in with `ADMIN_SECRET_KEY`. Version 1 used `/admin?key=...`, which
left the key in browser history and server logs. **Rotate the key once version 2 is live.**
Changing it signs every admin out.

From the admin page you can open or close the Compass and see counts by tier and intake,
with a link to the sheet.

## A custom domain on alueducation.com

Ask ALU IT for a subdomain, for example `compass.alueducation.com`, and:

1. In Vercel: Project `student-success-compass-69bx` > Settings > Domains > Add
   `compass.alueducation.com`. Vercel shows the DNS record it needs.
2. ALU IT adds that record, normally a `CNAME` from `compass` to `cname.vercel-dns.com`.
3. Vercel issues the HTTPS certificate on its own once DNS resolves.
4. Update the QR code in the orientation deck and any links to the new address.

The site already sends HSTS, a strict per-request Content-Security-Policy, and refuses to
be framed, so no extra configuration is needed on the ALU side.

## Optional: a hard rate limit

The app limits requests per server instance. For a hard limit across all instances, add a
Vercel Firewall rate-limit rule on `/api/submit` and `/api/admin/session`. Keep the
submit limit generous: a whole orientation room shares one campus IP address.
