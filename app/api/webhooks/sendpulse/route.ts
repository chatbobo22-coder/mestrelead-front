import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret');
  try {
    return proxyJson(
      await outreachRequest(
        `/api/webhooks/sendpulse${secret ? `?secret=${encodeURIComponent(secret)}` : ''}`,
        { method: 'POST', body: await request.text() },
      ),
    );
  } catch (error) {
    console.error('[api/webhooks/sendpulse] failed to forward webhook', error);
    return NextResponse.json(
      { error: 'Não foi possível encaminhar o webhook.' },
      { status: 502 },
    );
  }
}
