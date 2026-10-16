import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE } from './config';
import { HEADERS, codebookRows } from './row';
import { addTab, appendValues, credentialsFromEnv, getValues, listTabs, updateValues, type SheetsCredentials } from './sheets';

// Two stores with one shape. Production always uses Google Sheets and fails
// closed (Compass shown as closed) when the credentials are missing. Local
// development without credentials writes to .data/ so the whole flow,
// including /admin, can be exercised offline.

type Cell = string | number;

export interface Summary {
  total: number;
  latest: string | null;
  byTier: Record<string, number>;
  byIntake: Record<string, number>;
  tab: string;
  sheetUrl: string | null;
}

export interface Store {
  kind: 'sheets' | 'local';
  isOpen(): Promise<boolean>;
  setOpen(open: boolean): Promise<void>;
  append(row: Cell[]): Promise<void>;
  summary(): Promise<Summary>;
}

const RESPONSES_TAB = process.env.COMPASS_RESPONSES_SHEET?.trim() || `Compass v${SITE.instrumentVersion}`;
const CODEBOOK_TAB = `${RESPONSES_TAB} codebook`;
const CONFIG_TAB = process.env.GOOGLE_CONFIG_SHEET_NAME?.trim() || 'Config';

function summarise(rows: string[][], tab: string, sheetUrl: string | null): Summary {
  const tierCol = HEADERS.indexOf('Outreach Tier');
  const intakeCol = HEADERS.indexOf('Intake');
  const byTier: Record<string, number> = {};
  const byIntake: Record<string, number> = {};
  let latest: string | null = null;
  for (const r of rows) {
    const tier = (r[tierCol] ?? '').slice(0, 1) || '?';
    byTier[tier] = (byTier[tier] ?? 0) + 1;
    const intake = r[intakeCol] || 'Other';
    byIntake[intake] = (byIntake[intake] ?? 0) + 1;
    if (!latest || (r[0] ?? '') > latest) latest = r[0] ?? null;
  }
  return { total: rows.length, latest, byTier, byIntake, tab, sheetUrl };
}

// ---- Google Sheets --------------------------------------------------------

// The open/closed switch is read on every landing-page visit. A short cache
// keeps a full orientation room inside the Sheets quota.
let statusCache: { open: boolean; at: number } | null = null;
const STATUS_TTL = 20_000;
let responsesReady = false;

function sheetsStore(c: SheetsCredentials): Store {
  async function ensureResponsesTab() {
    if (responsesReady) return;
    const tabs = await listTabs(c);
    if (!tabs.includes(RESPONSES_TAB)) {
      try {
        await addTab(c, RESPONSES_TAB);
      } catch (e) {
        // Two first submissions can race to create the tab; the loser carries on.
        if (!(await listTabs(c)).includes(RESPONSES_TAB)) throw e;
      }
    }
    const header = (await getValues(c, RESPONSES_TAB, '1:1'))[0] ?? [];
    if (header.length === 0) {
      await updateValues(c, RESPONSES_TAB, 'A1', [HEADERS]);
    } else if (header.join('\u0001') !== HEADERS.join('\u0001')) {
      // Never write a row under the wrong headings. A new instrument version
      // gets a new tab instead (see COMPASS_RESPONSES_SHEET).
      throw new Error(`Header row in "${RESPONSES_TAB}" does not match instrument ${SITE.instrumentVersion}`);
    }
    if (!tabs.includes(CODEBOOK_TAB)) {
      try {
        await addTab(c, CODEBOOK_TAB, 2);
        await updateValues(c, CODEBOOK_TAB, 'A1', codebookRows());
      } catch {
        // The codebook is documentation; a failure here must not lose a response.
      }
    }
    responsesReady = true;
  }

  return {
    kind: 'sheets',
    async isOpen() {
      if (statusCache && Date.now() - statusCache.at < STATUS_TTL) return statusCache.open;
      try {
        const v = (await getValues(c, CONFIG_TAB, 'A2'))[0]?.[0] ?? '';
        const open = v.trim().toLowerCase() === 'open';
        statusCache = { open, at: Date.now() };
        return open;
      } catch (e) {
        console.error('Compass status check failed:', (e as Error).message);
        return false;
      }
    },
    async setOpen(open) {
      await updateValues(c, CONFIG_TAB, 'A1:A2', [['Test Status'], [open ? 'open' : 'closed']]);
      statusCache = { open, at: Date.now() };
    },
    async append(row) {
      await ensureResponsesTab();
      await appendValues(c, RESPONSES_TAB, [row]);
    },
    async summary() {
      const tabs = await listTabs(c);
      const rows = tabs.includes(RESPONSES_TAB) ? (await getValues(c, RESPONSES_TAB, 'A2:G')).filter((r) => r.length) : [];
      return summarise(rows, RESPONSES_TAB, `https://docs.google.com/spreadsheets/d/${c.sheetId}/edit`);
    },
  };
}

// ---- Local development ----------------------------------------------------

function localStore(): Store {
  const dir = path.join(process.cwd(), '.data');
  const file = path.join(dir, 'compass-dev.json');
  type Db = { open: boolean; rows: Cell[][] };

  async function load(): Promise<Db> {
    try {
      return JSON.parse(await readFile(file, 'utf8')) as Db;
    } catch {
      return { open: true, rows: [] };
    }
  }
  async function save(db: Db) {
    await mkdir(dir, { recursive: true });
    await writeFile(file, JSON.stringify(db, null, 2));
  }

  return {
    kind: 'local',
    async isOpen() {
      return (await load()).open;
    },
    async setOpen(open) {
      const db = await load();
      db.open = open;
      await save(db);
    },
    async append(row) {
      const db = await load();
      db.rows.push(row);
      await save(db);
    },
    async summary() {
      const db = await load();
      return summarise(db.rows.map((r) => r.map(String)), `${file} (local)`, null);
    },
  };
}

// ---- Selection ------------------------------------------------------------

const closedStore: Store = {
  kind: 'sheets',
  isOpen: async () => false,
  setOpen: async () => {
    throw new Error('Google Sheets is not configured.');
  },
  append: async () => {
    throw new Error('Google Sheets is not configured.');
  },
  summary: async () => ({ total: 0, latest: null, byTier: {}, byIntake: {}, tab: RESPONSES_TAB, sheetUrl: null }),
};

export function getStore(): Store {
  const creds = credentialsFromEnv();
  if (creds) return sheetsStore(creds);
  if (process.env.NODE_ENV !== 'production') return localStore();
  console.error('Compass: Google Sheets credentials are missing; the Compass will stay closed.');
  return closedStore;
}
