const DEFAULT_INJECTOR_URL = 'https://prospect-etl-inejctor.vercel.app';

export async function injectorRequest(path: string, init: RequestInit = {}) {
  const baseUrl = (
    process.env.INJECTOR_API_URL || DEFAULT_INJECTOR_URL
  ).replace(/\/$/, '');
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (process.env.INJECTOR_API_KEY) {
    headers.set('X-API-Key', process.env.INJECTOR_API_KEY);
  }
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
  });
}

export async function proxyInjectorJson(response: Response) {
  const body = await response.text();
  return new Response(body || '{}', {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
