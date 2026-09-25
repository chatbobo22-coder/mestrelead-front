import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const maxDuration = 120;

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    return proxyJson(
      await outreachRequest(
        `/api/campaigns/${encodeURIComponent(id)}/send-batch?limit=50`,
        { method: 'POST', timeoutMs: 120000 },
      ),
    );
  } catch (error) {
    console.error('[api/campaigns/:id/send-batch] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível processar o lote de envios.' },
      { status: 502 },
    );
  }
}
