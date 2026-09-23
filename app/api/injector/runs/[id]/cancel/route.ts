import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Execução inválida.' }, { status: 400 });
    }
    return proxyInjectorJson(
      await injectorRequest(`/api/workflow-runs/${id}/cancel`, {
        method: 'POST',
      }),
    );
  } catch (error) {
    console.error('[api/injector/runs/id/cancel] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível abortar a carga.' },
      { status: 502 },
    );
  }
}

