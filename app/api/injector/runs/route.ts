import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return proxyInjectorJson(await injectorRequest('/api/workflow-runs'));
  } catch (error) {
    console.error('[api/injector/runs] failed', error);
    return NextResponse.json(
      { error: 'O Injector não respondeu.' },
      { status: 502 },
    );
  }
}
