import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    return proxyJson(
      await outreachRequest(`/api/campaigns/${encodeURIComponent(id)}/resume`, {
        method: 'POST',
      }),
    );
  } catch (error) {
    console.error('[api/campaigns/:id/resume] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível retomar a campanha.' },
      { status: 502 },
    );
  }
}
