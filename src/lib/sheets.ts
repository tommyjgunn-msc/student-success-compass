import 'server-only';
import { createSign } from 'node:crypto';

// A small Google Sheets client: a signed service-account JWT, swapped for an
// access token, then plain REST calls. It replaces the googleapis package,
// which pulled in over a hundred megabytes of code to make four requests.

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface SheetsCredentials {
  sheetId: string;
  email: string;
  privateKey: string;
}

export function credentialsFromEnv(): SheetsCredentials | null {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!sheetId || !email || !rawKey) return null;
  // Vercel stores the key with literal \n; some setups also keep the quotes.
  const privateKey = rawKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
  return { sheetId, email, privateKey };
}

const b64url = (input: Buffer | string) => Buffer.from(input).toString('base64url');

let cachedToken: { token: string; expires: number; email: string } | null = null;

async function accessToken(c: SheetsCredentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.email === c.email && cachedToken.expires - 60 > now) return cachedToken.token;

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss: c.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(c.privateKey);
  const assertion = `${header}.${claims}.${b64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Google auth failed (${res.status})`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expires: now + data.expires_in, email: c.email };
  return data.access_token;
}

async function call<T>(c: SheetsCredentials, path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken(c);
  const res = await fetch(`${API}/${encodeURIComponent(c.sheetId)}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    // Google's error body can echo the request; log the status only.
    throw new Error(`Google Sheets ${init.method ?? 'GET'} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

/** A1 range with the tab name quoted, URL-encoded for the path. */
const range = (tab: string, cells: string) => encodeURIComponent(`'${tab.replace(/'/g, "''")}'!${cells}`);

type Cell = string | number;

export async function getValues(c: SheetsCredentials, tab: string, cells: string): Promise<string[][]> {
  const data = await call<{ values?: string[][] }>(c, `/values/${range(tab, cells)}`);
  return data.values ?? [];
}

export async function updateValues(c: SheetsCredentials, tab: string, cells: string, values: Cell[][]): Promise<void> {
  await call(c, `/values/${range(tab, cells)}?valueInputOption=RAW`, {
    method: 'PUT',
    body: JSON.stringify({ values }),
  });
}

export async function appendValues(c: SheetsCredentials, tab: string, values: Cell[][]): Promise<void> {
  await call(c, `/values/${range(tab, 'A1')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values }),
  });
}

export async function listTabs(c: SheetsCredentials): Promise<string[]> {
  const data = await call<{ sheets?: { properties: { title: string } }[] }>(c, '?fields=sheets.properties.title');
  return (data.sheets ?? []).map((s) => s.properties.title);
}

export async function addTab(c: SheetsCredentials, title: string, frozenRows = 1): Promise<void> {
  await call(c, ':batchUpdate', {
    method: 'POST',
    body: JSON.stringify({
      requests: [{ addSheet: { properties: { title, gridProperties: { frozenRowCount: frozenRows } } } }],
    }),
  });
}
