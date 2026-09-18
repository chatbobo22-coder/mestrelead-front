const DEFAULT_OUTREACH_URL = 'https://tironi-outreach.vercel.app';

export function outreachBaseUrl() {
  return (process.env.OUTREACH_API_URL || DEFAULT_OUTREACH_URL).replace(
    /\/$/,
    '',
  );
}

export async function outreachRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (process.env.OUTREACH_API_KEY) {
    headers.set('X-API-Key', process.env.OUTREACH_API_KEY);
  }

  return fetch(`${outreachBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
}

export async function proxyJson(response: Response) {
  const body = await response.text();
  return new Response(body || '{}', {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
