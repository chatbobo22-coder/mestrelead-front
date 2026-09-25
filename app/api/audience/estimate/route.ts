import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    return proxyJson(
      await outreachRequest('/api/audience/estimate', {
        method: 'POST',
        body: await request.text(),
      }),
    );
  } catch (error) {
    console.error('[api/audience/estimate] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível calcular o público.' },
      { status: 502 },
    );
  }
}
