import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    return proxyJson(
      await outreachRequest(`/api/crm/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(await request.json()),
      }),
    );
  } catch (error) {
    console.error('[api/crm/:id] failed to update case', error);
    return NextResponse.json(
      { error: 'Não foi possível atualizar o atendimento.' },
      { status: 502 },
    );
  }
}
