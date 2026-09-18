import { env } from 'cloudflare:workers';

export type D1Result<T> = { results: T[] };

export function outreachDb(): D1Database {
  return env.DB as D1Database;
}

export function nowIso(): string {
  return new Date().toISOString();
}
