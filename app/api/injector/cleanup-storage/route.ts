import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export async function POST() {
  try {
    return proxyInjectorJson(
      await injectorRequest('/api/cleanup-storage', { method: 'POST' }),
    );
  } catch (error) {
    console.error('[api/injector/cleanup-storage] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível iniciar a limpeza.' },
      { status: 502 },
    );
  }
}
