import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export async function POST(request: Request) {
  try {
    return proxyInjectorJson(
      await injectorRequest('/api/start', {
        method: 'POST',
        body: JSON.stringify(await request.json()),
      }),
    );
  } catch (error) {
    console.error('[api/injector/start] failed', error);
    return NextResponse.json(
      { error: 'O Injector não respondeu.' },
      { status: 502 },
    );
  }
}
