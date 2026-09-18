import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const MAX_RESULTS = 200;

// Gate simples por token fixo (env var), suficiente para um painel de uso
// pessoal — não há necessidade de um sistema de autenticação completo aqui.
// Falha fechado: sem ADMIN_TOKEN configurado, ninguém entra.
const isAuthorized = (event: HandlerEvent): boolean => {
  const adminToken = process.env['ADMIN_TOKEN'];
  if (!adminToken) return false;

  const auth = event.headers['authorization'] ?? '';
  const [scheme, token] = auth.split(' ');
  return scheme === 'Bearer' && token === adminToken;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!isAuthorized(event)) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    const store = getStore('visits');
    const { blobs } = await store.list({ prefix: 'v/' });

    // Chaves começam com o timestamp ISO (ver track-visit.ts), então ordenar
    // por chave já ordena por data — sem precisar ler todos os registros antes.
    const recentKeys = blobs
      .map((blob) => blob.key)
      .sort()
      .reverse()
      .slice(0, MAX_RESULTS);

    const visits = await Promise.all(recentKeys.map((key) => store.get(key, { type: 'json' })));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visits: visits.filter(Boolean) }),
    };
  } catch (error) {
    console.error('list-visits error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
