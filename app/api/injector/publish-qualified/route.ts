import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export async function POST() {
  try {
    return proxyInjectorJson(
      await injectorRequest('/api/publish-qualified', { method: 'POST' }),
    );
  } catch (error) {
    console.error('[api/injector/publish-qualified] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível publicar os leads qualificados.' },
      { status: 502 },
    );
  }
}
