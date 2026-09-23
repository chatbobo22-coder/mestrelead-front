import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    return proxyJson(
      await outreachRequest(`/api/crm/leads/${encodeURIComponent(id)}`),
    );
  } catch (error) {
    console.error('[api/crm/leads/:id] failed to load lead', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar os detalhes do lead.' },
      { status: 502 },
    );
  }
}
