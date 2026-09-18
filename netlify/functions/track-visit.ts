import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';

// --- Origens autorizadas ---------------------------------------------------
// Mesma lista usada por send-email.ts: só o próprio site pode registrar visitas.
const ALLOWED_ORIGINS = [
  'https://viniciuspdionizio.netlify.app',
  'https://viniciuspdionizio.github.io',
  'http://localhost:4200',
];

const DEPLOY_PREVIEW_PATTERN = /^https:\/\/[a-z0-9-]+--viniciuspdionizio\.netlify\.app$/;

const isAllowedOrigin = (origin: string): boolean =>
  ALLOWED_ORIGINS.includes(origin) || DEPLOY_PREVIEW_PATTERN.test(origin);

const corsHeaders = (event: HandlerEvent): Record<string, string> => {
  const origin = event.headers['origin'];
  return {
    'Access-Control-Allow-Origin': origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
};

// --- Rate limit (best-effort) -----------------------------------------------
// Em memória, por instância da function — mesmo padrão de send-email.ts.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestLog = new Map<string, number[]>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
};

const getClientIp = (event: HandlerEvent): string =>
  event.headers['x-nf-client-connection-ip'] ??
  event.headers['client-ip'] ??
  event.headers['x-forwarded-for']?.split(',')[0]?.trim() ??
  'unknown';

// O IP nunca é armazenado — só um hash, para permitir contar visitantes
// únicos sem guardar um dado pessoal reversível.
const hashIp = (ip: string): string => createHash('sha256').update(ip).digest('hex').slice(0, 16);

interface GeoLookup {
  country: string | null;
  region: string | null;
  city: string | null;
  org: string | null;
}

const EMPTY_GEO: GeoLookup = { country: null, region: null, city: null, org: null };

// Identifica localização/organização por trás do IP via ipinfo.io. Opcional
// (requer IPINFO_TOKEN) e best-effort: uma falha aqui nunca deve impedir o
// registro da visita.
const lookupGeo = async (ip: string): Promise<GeoLookup> => {
  const token = process.env['IPINFO_TOKEN'];
  if (!token || ip === 'unknown') return EMPTY_GEO;

  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${token}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return EMPTY_GEO;

    const data = (await response.json()) as {
      country?: string;
      region?: string;
      city?: string;
      org?: string;
    };

    return {
      country: data.country ?? null,
      region: data.region ?? null,
      city: data.city ?? null,
      org: data.org ?? null,
    };
  } catch {
    return EMPTY_GEO;
  }
};

interface VisitPayload {
  path?: unknown;
  referrer?: unknown;
  locale?: unknown;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(event), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(event), body: 'Method not allowed' };
  }

  const origin = event.headers['origin'];
  if (!origin || !isAllowedOrigin(origin)) {
    return {
      statusCode: 403,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'Unauthorized origin' }),
    };
  }

  const clientIp = getClientIp(event);
  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'Too many requests' }),
    };
  }

  try {
    const payload: VisitPayload = JSON.parse(event.body ?? '{}');

    const path = String(payload.path ?? '/').slice(0, 200);
    const referrer = String(payload.referrer ?? '').slice(0, 300);
    const locale = String(payload.locale ?? '').slice(0, 10);
    const userAgent = String(event.headers['user-agent'] ?? '').slice(0, 300);

    const geo = await lookupGeo(clientIp);

    const visit = {
      timestamp: new Date().toISOString(),
      path,
      referrer,
      locale,
      userAgent,
      ipHash: hashIp(clientIp),
      ...geo,
    };

    const store = getStore('visits');
    // Chave começa com o timestamp ISO, que ordena lexicograficamente igual
    // à ordem cronológica — dá pra listar as visitas mais recentes sem
    // precisar de um índice separado (ver list-visits.ts).
    const key = `v/${visit.timestamp}-${randomUUID().slice(0, 8)}`;
    await store.setJSON(key, visit);

    return { statusCode: 200, headers: corsHeaders(event), body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('track-visit error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
