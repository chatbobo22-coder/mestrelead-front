import { NextRequest, NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    return proxyInjectorJson(
      await injectorRequest(`/api/opportunities?${request.nextUrl.searchParams}`),
    );
  } catch (error) {
    console.error('[api/opportunities] failed', error);
    return NextResponse.json(
      { error: 'O motor de oportunidades não respondeu.' },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') ?? '1000';
    return proxyInjectorJson(
      await injectorRequest(`/api/opportunities/rebuild?limit=${encodeURIComponent(limit)}`, {
        method: 'POST',
      }),
    );
  } catch (error) {
    console.error('[api/opportunities] rebuild failed', error);
    return NextResponse.json({ error: 'Não foi possível recalcular os scores.' }, { status: 502 });
  }
}
