import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Execução inválida.' }, { status: 400 });
    }
    return proxyInjectorJson(await injectorRequest(`/api/workflow-runs/${id}`));
  } catch (error) {
    console.error('[api/injector/runs/id] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível atualizar o andamento do Injector.' },
      { status: 502 },
    );
  }
}

