import type { Handler, HandlerEvent } from '@netlify/functions';
import { Resend } from 'resend';

const apiKey = process.env['RESEND_API_KEY'];

if (!apiKey) {
  throw new Error('Missing RESEND_API_KEY');
}

const resend = new Resend(apiKey);

// --- Origens autorizadas ---------------------------------------------------
// Só o próprio site (produção, deploy previews/branch deploys do Netlify e o
// ambiente local de desenvolvimento) pode chamar esta function.
const ALLOWED_ORIGINS = [
  'https://viniciuspdionizio.netlify.app',
  'https://viniciuspdionizio.github.io',
  'http://localhost:4200',
];

const DEPLOY_PREVIEW_PATTERN = /^https:\/\/[a-z0-9-]+--viniciuspdionizio\.netlify\.app$/;

const isAllowedOrigin = (origin: string): boolean =>
  ALLOWED_ORIGINS.includes(origin) || DEPLOY_PREVIEW_PATTERN.test(origin);

const isAllowedReferer = (referer: string): boolean =>
  ALLOWED_ORIGINS.some((allowed) => referer.startsWith(`${allowed}/`) || referer === allowed) ||
  new RegExp(`^${DEPLOY_PREVIEW_PATTERN.source.replace(/\$$/, '')}\\/`).test(referer);

/**
 * Confirma que a requisição veio do nosso próprio site. Um cliente HTTP
 * arbitrário (curl, script) pode forjar esses headers, então isso não
 * substitui autenticação — é só uma barreira contra abuso casual/automatizado
 * a partir de outros sites/origens, combinada com o honeypot e o rate limit.
 */
const isFromAllowedSite = (event: HandlerEvent): boolean => {
  const origin = event.headers['origin'];
  if (origin) return isAllowedOrigin(origin);

  const referer = event.headers['referer'];
  if (referer) return isAllowedReferer(referer);

  return false;
};

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
// Em memória, por instância da function. Não é compartilhado entre instâncias
// nem sobrevive a cold starts, mas já barra bursts de flood vindos do mesmo IP
// enquanto a instância estiver "quente".
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
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

// --- Validação / sanitização -------------------------------------------------
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown; // honeypot: campo invisível para humanos, bots costumam preencher
}

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });

const validate = (payload: ContactPayload): string | null => {
  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const message = String(payload.message ?? '').trim();

  if (name.length < 3 || name.length > 120) return 'Nome inválido.';
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return 'E-mail inválido.';
  if (message.length < 10 || message.length > 5000) return 'Mensagem inválida.';
  if (typeof payload.phone !== 'undefined' && String(payload.phone).length > 40) return 'Telefone inválido.';

  return null;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(event), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(event), body: 'Method not allowed' };
  }

  if (!isFromAllowedSite(event)) {
    return {
      statusCode: 403,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'Origem não autorizada.' }),
    };
  }

  const clientIp = getClientIp(event);
  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' }),
    };
  }

  try {
    const payload: ContactPayload = JSON.parse(event.body ?? '{}');

    // Honeypot: campo invisível para humanos. Se veio preenchido, é bot —
    // respondemos como se tivesse dado certo, sem gastar cota do Resend nem
    // avisar o bot de que foi bloqueado.
    if (String(payload.website ?? '').trim().length > 0) {
      return {
        statusCode: 200,
        headers: corsHeaders(event),
        body: JSON.stringify({ success: true }),
      };
    }

    const validationError = validate(payload);
    if (validationError) {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: validationError }),
      };
    }

    const { name, email, message, phone } = payload;

    console.log('Received contact form submission from:', String(name).slice(0, 60));

    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const result = await resend.emails.send({
      from: 'Contato - Vinicius <dev.viniciuspd@resend.dev>',
      to: 'dev.viniciuspd@gmail.com',
      subject: `Contato de ${safeName}`,
      replyTo: String(email),
      html: `
        <h2>Novo contato pelo portfólio</h2>

        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Telefone:</strong> ${safePhone}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (result.error) {
      console.error('Resend API returned an error:', result.error);
      return {
        statusCode: 500,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: 'Não foi possível enviar o e-mail. Tente novamente mais tarde.' }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(event),
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Resend Error: ', error);

    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'Erro interno ao processar a solicitação.' }),
    };
  }
};
