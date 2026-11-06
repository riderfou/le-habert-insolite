// Outils partagés des scripts jetables de la story 1.1 (test du socle Beds24).
// Le vrai adaptateur viendra en story 1.4 dans src/adapters/booking/.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const API_BASE = "https://beds24.com/api/v2";

/** Marqueur posé sur les réservations de test, vérifié avant toute suppression. */
export const TEST_MARKER = "TEST-SPIKE-1.1";

/** `.dev.vars` à la racine du dépôt (ignoré par Git). */
export const DEV_VARS_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../.dev.vars",
);

// ---------- .dev.vars ----------

/** Lit un fichier au format KEY=value (lignes vides et # ignorées, guillemets retirés). */
export function parseDevVars(content: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

/** Remplace la valeur d'une clé (ou l'ajoute) sans toucher au reste du fichier. */
export function upsertDevVar(content: string, key: string, value: string): string {
  const line = `${key}="${value}"`;
  const lines = content.length ? content.split(/\r?\n/) : [];
  const idx = lines.findIndex((l) => l.trim().startsWith(`${key}=`));
  if (idx >= 0) {
    lines[idx] = line;
  } else {
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    lines.push(line);
  }
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines.join("\n") + "\n";
}

export function readDevVars(): Record<string, string> {
  return existsSync(DEV_VARS_PATH) ? parseDevVars(readFileSync(DEV_VARS_PATH, "utf8")) : {};
}

export function writeDevVar(key: string, value: string): void {
  const current = existsSync(DEV_VARS_PATH) ? readFileSync(DEV_VARS_PATH, "utf8") : "";
  writeFileSync(DEV_VARS_PATH, upsertDevVar(current, key, value), { mode: 0o600 });
}

export function requireVar(key: string): string {
  const value = process.env[key] ?? readDevVars()[key];
  if (!value) {
    throw new Error(`${key} absent de .dev.vars. Lancer d'abord le script indiqué dans LISEZMOI.md.`);
  }
  return value;
}

// ---------- Dates (YYYY-MM-DD, sans heure) ----------

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Date du jour à Paris, au format YYYY-MM-DD. */
export function todayInParis(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Ajoute des mois à une date YYYY-MM-DD ; le jour est ramené à la fin du mois si besoin. */
export function addMonths(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

/** Contrôles avant création : dates valides, départ après arrivée, au moins 6 mois d'avance. */
export function checkTestDates(arrival: string, departure: string, today: string): string[] {
  const problems: string[] = [];
  if (!isIsoDate(arrival)) problems.push(`arrivée invalide : ${arrival}`);
  if (!isIsoDate(departure)) problems.push(`départ invalide : ${departure}`);
  if (problems.length) return problems;
  if (departure <= arrival) problems.push("le départ doit être après l'arrivée");
  if (arrival < addMonths(today, 6)) problems.push(`arrivée à moins de 6 mois (avant le ${addMonths(today, 6)})`);
  return problems;
}

// ---------- Arguments ----------

/** Lit `--nom valeur` et `--drapeau` ; le reste est rendu dans `_`. */
export function parseArgs(argv: string[]): { _: string[]; [k: string]: string | boolean | string[] } {
  const out: { _: string[]; [k: string]: string | boolean | string[] } = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    } else {
      out._.push(arg);
    }
  }
  return out;
}

export function stringArg(args: ReturnType<typeof parseArgs>, key: string): string | undefined {
  const v = args[key];
  return typeof v === "string" ? v : undefined;
}

// ---------- API ----------

type Json = unknown;

let cachedToken: string | undefined;

/** Jeton d'accès (24 h max) obtenu à partir du jeton de rafraîchissement. */
export async function getAccessToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const refreshToken = requireVar("BEDS24_REFRESH_TOKEN");
  const res = await fetch(`${API_BASE}/authentication/token`, {
    headers: { refreshToken, accept: "application/json" },
  });
  const body = (await res.json()) as { token?: string; expiresIn?: number; error?: string };
  if (!res.ok || !body.token) {
    throw new Error(`Échec /authentication/token (${res.status}) : ${JSON.stringify(body)}`);
  }
  cachedToken = body.token;
  return body.token;
}

export interface ApiResult<T = Json> {
  status: number;
  body: T;
  credits: { remaining?: string; cost?: string; resetsIn?: string };
}

export async function api<T = Json>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  options: { query?: Record<string, string | number | boolean | (string | number)[] | undefined>; body?: Json } = {},
): Promise<ApiResult<T>> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(options.query ?? {})) {
    if (v === undefined) continue;
    for (const item of Array.isArray(v) ? v : [v]) url.searchParams.append(k, String(item));
  }
  const headers: Record<string, string> = { token: await getAccessToken(), accept: "application/json" };
  if (options.body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(url, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return {
    status: res.status,
    body: body as T,
    credits: {
      remaining: res.headers.get("x-fivemincreditlimit-remaining") ?? undefined,
      cost: res.headers.get("x-requestcost") ?? undefined,
      resetsIn: res.headers.get("x-fivemincreditlimit-resetsin") ?? undefined,
    },
  };
}

interface Paged<T> {
  success?: boolean;
  data?: T[];
  pages?: { nextPageExists?: boolean };
  error?: string;
}

/** Parcourt toutes les pages d'un GET paginé (≈ 100 éléments par page). */
export async function getAllPages<T>(
  path: string,
  query: Record<string, string | number | boolean | (string | number)[] | undefined> = {},
): Promise<T[]> {
  const all: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const res = await api<Paged<T>>("GET", path, { query: { ...query, page } });
    if (res.status !== 200 || res.body.success === false) {
      throw new Error(`Échec GET ${path} (${res.status}) : ${JSON.stringify(res.body)}`);
    }
    all.push(...(res.body.data ?? []));
    if (!res.body.pages?.nextPageExists) break;
  }
  return all;
}

export function printCredits(credits: ApiResult["credits"]): void {
  if (credits.remaining) {
    console.log(`(crédits API : coût ${credits.cost ?? "?"}, restants ${credits.remaining} sur 5 min)`);
  }
}

/** Arrête le script proprement avec un message lisible. */
export function run(main: () => Promise<void>): void {
  main().catch((err: unknown) => {
    console.error(`\n✗ ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  });
}
